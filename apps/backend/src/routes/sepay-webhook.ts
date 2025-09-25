import { Hono } from 'hono';
import { FamilyService } from '../services/FamilyService.js';
import { CommunityWalletService } from '../services/CommunityWalletService.js';

const sepayWebhook = new Hono();

// SePay webhook data interface
interface SepayWebhookData {
  id: number;                    // ID giao dịch trên SePay
  gateway: string;               // Brand name của ngân hàng
  transactionDate: string;       // Thời gian xảy ra giao dịch phía ngân hàng
  accountNumber: string;         // Số tài khoản ngân hàng
  code: string | null;           // Mã code thanh toán
  content: string;               // Nội dung chuyển khoản
  transferType: 'in' | 'out';    // Loại giao dịch. in là tiền vào, out là tiền ra
  transferAmount: number;        // Số tiền giao dịch
  accumulated: number;           // Số dư tài khoản (lũy kế)
  subAccount: string | null;     // Tài khoản ngân hàng phụ
  referenceCode: string;         // Mã tham chiếu của tin nhắn sms
  description: string;           // Toàn bộ nội dung tin nhắn sms
}

// Interface for transaction log
interface TransactionLog {
  sepayTransactionId: number;
  referenceCode: string;
  transferType: string;
  transferAmount: number;
  processedAt: string;
  walletType: 'family' | 'community';
  walletId: string;
  status: 'processed' | 'failed';
  errorMessage?: string | undefined;
}

// In-memory store for processed transactions (in production, use database)
const processedTransactions = new Map<string, TransactionLog>();

// Helper function to extract wallet ID from transfer content
function extractWalletInfo(content: string): { type: 'family' | 'community' | null, id: string | null } {
  // Pattern for family wallet: FAMILY_[ID], FAM_[ID], or family[ID]
  const familyMatch = content.match(/(?:FAMILY_|FAM_|family)([A-Za-z0-9-]+)/i);
  if (familyMatch) {
    return { type: 'family', id: familyMatch[1] || null };
  }

  // Pattern for community wallet: COMMUNITY_[ID], COM_[ID], WALLET_[ID], or community[ID]
  const communityMatch = content.match(/(?:COMMUNITY_|COM_|WALLET_|community)([A-Za-z0-9-]+)/i);
  if (communityMatch) {
    return { type: 'community', id: communityMatch[1] || null };
  }

  // Pattern for new short community ID: locuno[5digits]
  const shortCommunityMatch = content.match(/locuno(\d{5})/i);
  if (shortCommunityMatch) {
    return { type: 'community', id: shortCommunityMatch[0] || null }; // Return full locuno12345 format
  }

  return { type: null, id: null };
}

// Helper function to check for duplicate transactions
function isDuplicateTransaction(data: SepayWebhookData): boolean {
  const uniqueKey = `${data.id}_${data.referenceCode}_${data.transferAmount}_${data.transferType}`;
  return processedTransactions.has(uniqueKey);
}

// Helper function to log transaction
function logTransaction(data: SepayWebhookData, walletType: 'family' | 'community', walletId: string, status: 'processed' | 'failed', errorMessage?: string) {
  const uniqueKey = `${data.id}_${data.referenceCode}_${data.transferAmount}_${data.transferType}`;
  const log: TransactionLog = {
    sepayTransactionId: data.id,
    referenceCode: data.referenceCode,
    transferType: data.transferType,
    transferAmount: data.transferAmount,
    processedAt: new Date().toISOString(),
    walletType,
    walletId,
    status,
    ...(errorMessage !== undefined && { errorMessage })
  };
  processedTransactions.set(uniqueKey, log);
}

// SePay webhook endpoint
sepayWebhook.post('/notify', async (c) => {
  try {
    // Verify API Key authentication if provided
    const authHeader = c.req.header('Authorization');
    const expectedApiKey = c.env?.SEPAY_API_KEY as string | null;
    
    if (expectedApiKey && authHeader) {
      const providedApiKey = authHeader.replace('Apikey ', '');
      if (providedApiKey !== expectedApiKey) {
        console.error('SePay webhook: Invalid API key');
        return c.json({ success: false, error: 'Unauthorized' }, 401);
      }
    }

    // Parse webhook data
    const webhookData: SepayWebhookData = await c.req.json();
    
    console.log('SePay webhook received:', {
      id: webhookData.id,
      transferType: webhookData.transferType,
      transferAmount: webhookData.transferAmount,
      content: webhookData.content
    });

    // Only process incoming transfers (money in)
    if (webhookData.transferType !== 'in') {
      console.log('SePay webhook: Ignoring outgoing transfer');
      return c.json({ success: true, message: 'Outgoing transfer ignored' }, 200);
    }

    // Validate transfer amount for incoming transfers
    if (webhookData.transferAmount <= 0) {
      console.log(`SePay webhook: Invalid transfer amount: ${webhookData.transferAmount}`);
      return c.json({ success: false, error: 'Transfer amount must be positive for incoming transfers' }, 400);
    }

    // Validate amount is a valid number
    if (!Number.isFinite(webhookData.transferAmount)) {
      console.log(`SePay webhook: Invalid transfer amount (not a finite number): ${webhookData.transferAmount}`);
      return c.json({ success: false, error: 'Transfer amount must be a valid number' }, 400);
    }

    // Set reasonable maximum limit (100 billion VND)
    const MAX_TRANSFER_AMOUNT = 100_000_000_000;
    if (webhookData.transferAmount > MAX_TRANSFER_AMOUNT) {
      console.log(`SePay webhook: Transfer amount exceeds maximum limit: ${webhookData.transferAmount}`);
      return c.json({ success: false, error: `Transfer amount exceeds maximum limit of ${MAX_TRANSFER_AMOUNT.toLocaleString()} VND` }, 400);
    }

    // Check for duplicate transactions
    if (isDuplicateTransaction(webhookData)) {
      console.log('SePay webhook: Duplicate transaction detected');
      return c.json({ success: true, message: 'Duplicate transaction ignored' }, 200);
    }

    // Extract wallet information from transfer content
    const walletInfo = extractWalletInfo(webhookData.content);
    
    if (!walletInfo.type || !walletInfo.id) {
      console.log('SePay webhook: No wallet ID found in transfer content');
      return c.json({ success: true, message: 'No wallet ID found' }, 200);
    }

    let actualWalletId: string = walletInfo.id;
    
    // If it's a community wallet with short ID format (locuno12345), find the actual wallet ID
    if (walletInfo.type === 'community' && walletInfo.id.startsWith('locuno')) {
      console.log(`SePay webhook: Looking up wallet for short ID: ${walletInfo.id}`);
      const foundWalletId = await CommunityWalletService.findWalletByShortId(c.env, walletInfo.id);
      
      if (!foundWalletId) {
        console.log(`SePay webhook: No wallet found for short ID: ${walletInfo.id}`);
        return c.json({ success: true, message: 'No wallet found for short ID' }, 200);
      }
      
      actualWalletId = foundWalletId;
      console.log(`SePay webhook: Found wallet ${actualWalletId} for short ID ${walletInfo.id}`);
    }

    let result;
    
    try {
      if (walletInfo.type === 'family') {
        // Update family wallet balance
        result = await FamilyService.updateWalletBalance(c.env, {
          familyId: actualWalletId,
          amount: webhookData.transferAmount,
          transactionId: webhookData.id.toString(),
          description: `SePay deposit: ${webhookData.content}`,
          reference: webhookData.referenceCode
        });
      } else if (walletInfo.type === 'community') {
        // Update community wallet balance
        result = await CommunityWalletService.updateWalletBalance(c.env, {
          walletId: actualWalletId,
          amount: webhookData.transferAmount,
          transactionId: webhookData.id.toString(),
          description: `SePay deposit: ${webhookData.content}`,
          reference: webhookData.referenceCode
        });
      }

      if (result && result.success) {
        // Log successful transaction
        logTransaction(webhookData, walletInfo.type, actualWalletId, 'processed');
        
        console.log(`SePay webhook: Successfully updated ${walletInfo.type} wallet ${actualWalletId} with amount ${webhookData.transferAmount}`);
        
        return c.json({ 
          success: true, 
          message: `${walletInfo.type} wallet updated successfully`,
          walletId: actualWalletId,
          amount: webhookData.transferAmount
        }, 201);
      } else {
        // Log failed transaction
        const errorMsg = result?.error || 'Unknown error';
        logTransaction(webhookData, walletInfo.type, actualWalletId, 'failed', errorMsg);
        
        console.error(`SePay webhook: Failed to update ${walletInfo.type} wallet:`, errorMsg);
        
        return c.json({ 
          success: false, 
          error: `Failed to update ${walletInfo.type} wallet: ${errorMsg}` 
        }, 500);
      }
    } catch (error) {
      // Log failed transaction
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      logTransaction(webhookData, walletInfo.type, actualWalletId, 'failed', errorMsg);
      
      console.error(`SePay webhook: Error processing ${walletInfo.type} wallet update:`, error);
      
      return c.json({ 
        success: false, 
        error: `Error processing ${walletInfo.type} wallet update: ${errorMsg}` 
      }, 500);
    }
  } catch (error) {
    console.error('SePay webhook: Error parsing request:', error);
    return c.json({ success: false, error: 'Invalid request format' }, 400);
  }
});

// Endpoint to get transaction logs (for debugging)
sepayWebhook.get('/logs', async (c) => {
  const logs = Array.from(processedTransactions.values())
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
    .slice(0, 100); // Return last 100 transactions
  
  return c.json({ success: true, logs });
});

// Health check endpoint
sepayWebhook.get('/health', async (c) => {
  return c.json({ 
    success: true, 
    message: 'SePay webhook service is running',
    timestamp: new Date().toISOString()
  });
});

export { sepayWebhook };