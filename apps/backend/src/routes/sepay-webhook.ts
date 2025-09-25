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

    let result;
    
    try {
      if (walletInfo.type === 'family') {
        // Update family wallet balance
        result = await FamilyService.updateWalletBalance(c.env, {
          familyId: walletInfo.id,
          amount: webhookData.transferAmount,
          transactionId: webhookData.id.toString(),
          description: `SePay deposit: ${webhookData.content}`,
          reference: webhookData.referenceCode
        });
      } else if (walletInfo.type === 'community') {
        // Update community wallet balance
        result = await CommunityWalletService.updateWalletBalance(c.env, {
          walletId: walletInfo.id,
          amount: webhookData.transferAmount,
          transactionId: webhookData.id.toString(),
          description: `SePay deposit: ${webhookData.content}`,
          reference: webhookData.referenceCode
        });
      }

      if (result && result.success) {
        // Log successful transaction
        logTransaction(webhookData, walletInfo.type, walletInfo.id, 'processed');
        
        console.log(`SePay webhook: Successfully updated ${walletInfo.type} wallet ${walletInfo.id} with amount ${webhookData.transferAmount}`);
        
        return c.json({ 
          success: true, 
          message: `${walletInfo.type} wallet updated successfully`,
          walletId: walletInfo.id,
          amount: webhookData.transferAmount
        }, 201);
      } else {
        // Log failed transaction
        const errorMsg = result?.error || 'Unknown error';
        logTransaction(webhookData, walletInfo.type, walletInfo.id, 'failed', errorMsg);
        
        console.error(`SePay webhook: Failed to update ${walletInfo.type} wallet:`, errorMsg);
        
        return c.json({ 
          success: false, 
          error: `Failed to update ${walletInfo.type} wallet: ${errorMsg}` 
        }, 500);
      }
    } catch (error) {
      // Log failed transaction
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      logTransaction(webhookData, walletInfo.type, walletInfo.id, 'failed', errorMsg);
      
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