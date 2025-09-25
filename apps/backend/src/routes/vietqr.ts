// VietQR API Routes for generating QR codes
import { Hono } from 'hono';
import { VietQRService, type VietQRRequest, type Bank, DEFAULT_BANK_ACCOUNT } from '../services/vietqr';

const vietqr = new Hono();

/**
 * GET /api/vietqr/banks
 * Get list of supported banks
 */
vietqr.get('/banks', async (c) => {
  try {
    const banks = VietQRService.getSupportedBanks();
    return c.json({
      success: true,
      data: banks,
      total: banks.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch banks list'
    }, 500);
  }
});

/**
 * GET /api/vietqr/banks/:identifier
 * Get specific bank by BIN code or bank code
 */
vietqr.get('/banks/:identifier', async (c) => {
  try {
    const identifier = c.req.param('identifier');
    const bank = VietQRService.findBank(identifier);
    
    if (!bank) {
      return c.json({
        success: false,
        error: `Bank not found for identifier: ${identifier}`
      }, 404);
    }

    return c.json({
      success: true,
      data: bank
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch bank information'
    }, 500);
  }
});

/**
 * POST /api/vietqr/generate
 * Generate VietQR code
 * 
 * Body:
 * {
 *   "bankId": "970436" | "VCB",  // Bank BIN or code
 *   "accountNo": "1234567890",    // Account number
 *   "accountName": "NGUYEN VAN A", // Optional: Account holder name
 *   "amount": 100000,             // Optional: Amount in VND
 *   "addInfo": "family123",       // Optional: Transfer note/description
 *   "template": "compact"         // Optional: QR template
 * }
 */
vietqr.post('/generate', async (c) => {
  try {
    const body = await c.req.json() as VietQRRequest;
    
    // Validate required fields
    if (!body.bankId) {
      return c.json({
        success: false,
        error: 'Bank ID is required'
      }, 400);
    }

    if (!body.accountNo) {
      return c.json({
        success: false,
        error: 'Account number is required'
      }, 400);
    }

    // Generate QR code
    const result = VietQRService.generateQRCode(body);
    
    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json({
      success: true,
      data: {
        qrCodeUrl: result.qrCodeUrl,
        qrDataUrl: result.qrDataUrl,
        bankInfo: VietQRService.findBank(body.bankId),
        requestInfo: {
          accountNo: body.accountNo,
          accountName: body.accountName,
          amount: body.amount,
          addInfo: body.addInfo,
          template: body.template || 'compact'
        }
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body or failed to generate QR code'
    }, 400);
  }
});

/**
 * POST /api/vietqr/wallet
 * Generate VietQR code for wallet transfer
 * Convenience endpoint for HDBank wallet system
 * 
 * Body:
 * {
 *   "walletId": "family123",      // Wallet ID (used as transfer note)
 *   "bankCode": "VCB",           // Optional: Bank code (default: VCB)
 *   "accountNo": "1234567890",    // Account number
 *   "accountName": "NGUYEN VAN A", // Optional: Account holder name
 *   "amount": 100000,             // Optional: Amount in VND
 *   "template": "compact"         // Optional: QR template
 * }
 */
vietqr.post('/wallet', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.walletId) {
      return c.json({
        success: false,
        error: 'Wallet ID is required'
      }, 400);
    }

    if (!body.accountNo) {
      return c.json({
        success: false,
        error: 'Account number is required'
      }, 400);
    }

    // Generate QR code for wallet
    const result = VietQRService.generateQRForWallet({
      walletId: body.walletId,
      bankCode: body.bankCode || 'VCB',
      accountNo: body.accountNo,
      accountName: body.accountName,
      amount: body.amount,
      template: body.template || 'compact'
    });
    
    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json({
      success: true,
      data: {
        qrCodeUrl: result.qrCodeUrl,
        qrDataUrl: result.qrDataUrl,
        walletId: body.walletId,
        bankInfo: VietQRService.findBank(body.bankCode || 'VCB'),
        requestInfo: {
          accountNo: body.accountNo,
          accountName: body.accountName,
          amount: body.amount,
          transferNote: body.walletId,
          template: body.template || 'compact'
        }
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body or failed to generate QR code'
    }, 400);
  }
});

/**
 * GET /api/vietqr/default
 * Get default bank account configuration
 */
vietqr.get('/default', async (c) => {
  try {
    const defaultAccount = VietQRService.getDefaultBankAccount();
    return c.json({
      success: true,
      data: defaultAccount
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch default bank account'
    }, 500);
  }
});

/**
 * POST /api/vietqr/default
 * Generate QR code using default bank account
 * 
 * Body:
 * {
 *   "walletId": "family123",       // Wallet ID (used as transfer note)
 *   "amount": 100000,             // Optional: Amount in VND
 *   "template": "compact"         // Optional: QR template
 * }
 */
vietqr.post('/default', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.walletId) {
      return c.json({
        success: false,
        error: 'Wallet ID is required'
      }, 400);
    }

    // Generate QR code using default account
    const result = VietQRService.generateDefaultQR({
      walletId: body.walletId,
      amount: body.amount,
      template: body.template || 'compact'
    });
    
    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json({
      success: true,
      data: {
        qrCodeUrl: result.qrCodeUrl,
        qrDataUrl: result.qrDataUrl,
        walletId: body.walletId,
        defaultAccount: DEFAULT_BANK_ACCOUNT,
        requestInfo: {
          accountNo: DEFAULT_BANK_ACCOUNT.accountNo,
          accountName: DEFAULT_BANK_ACCOUNT.accountName,
          bankCode: DEFAULT_BANK_ACCOUNT.bankCode,
          amount: body.amount,
          transferNote: body.walletId,
          template: body.template || 'compact'
        }
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body or failed to generate QR code'
    }, 400);
  }
});

/**
 * GET /api/vietqr/health
 * Health check endpoint
 */
vietqr.get('/health', async (c) => {
  return c.json({
    success: true,
    message: 'VietQR service is running',
    timestamp: new Date().toISOString(),
    supportedBanks: VietQRService.getSupportedBanks().length,
    defaultAccount: {
      bank: DEFAULT_BANK_ACCOUNT.bankInfo.shortName,
      accountNo: DEFAULT_BANK_ACCOUNT.accountNo
    }
  });
});

export default vietqr;