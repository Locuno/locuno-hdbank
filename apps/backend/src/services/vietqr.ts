// VietQR Service for generating QR codes following VietQR standards
// Based on VietQR.io API documentation

export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface VietQRRequest {
  bankId: string; // Bank BIN code (6 digits)
  accountNo: string; // Account number (6-19 characters)
  accountName?: string; // Account holder name (5-50 characters, Vietnamese without accents, uppercase)
  amount?: number; // Transfer amount (max 13 digits)
  addInfo?: string; // Transfer description/note (max 25 characters, Vietnamese without accents)
  template?: string; // QR template (default: 'compact')
}

export interface VietQRResponse {
  success: boolean;
  qrCodeUrl?: string;
  qrDataUrl?: string;
  error?: string;
}

// Common Vietnamese banks with their BIN codes
export const VIETNAMESE_BANKS: Bank[] = [
  {
    id: 1,
    name: "Ngân hàng TMCP Á Châu",
    code: "ACB",
    bin: "970416",
    shortName: "ACB",
    logo: "https://api.vietqr.io/img/ACB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 2,
    name: "Ngân hàng TMCP An Bình",
    code: "ABB",
    bin: "970425",
    shortName: "ABBANK",
    logo: "https://api.vietqr.io/img/ABB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 3,
    name: "Ngân hàng TMCP Công thương Việt Nam",
    code: "VCB",
    bin: "970436",
    shortName: "Vietcombank",
    logo: "https://api.vietqr.io/img/VCB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 4,
    name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
    code: "BIDV",
    bin: "970418",
    shortName: "BIDV",
    logo: "https://api.vietqr.io/img/BIDV.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 5,
    name: "Ngân hàng TMCP Ngoại thương Việt Nam",
    code: "VTB",
    bin: "970415",
    shortName: "Vietinbank",
    logo: "https://api.vietqr.io/img/VTB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 6,
    name: "Ngân hàng TMCP Kỹ thương Việt Nam",
    code: "TCB",
    bin: "970407",
    shortName: "Techcombank",
    logo: "https://api.vietqr.io/img/TCB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 7,
    name: "Ngân hàng TMCP Quân đội",
    code: "MBB",
    bin: "970422",
    shortName: "MBBank",
    logo: "https://api.vietqr.io/img/MBB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 8,
    name: "Ngân hàng TMCP Sài Gòn Thương Tín",
    code: "STB",
    bin: "970403",
    shortName: "Sacombank",
    logo: "https://api.vietqr.io/img/STB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 9,
    name: "Ngân hàng TMCP Tiên Phong",
    code: "TPB",
    bin: "970423",
    shortName: "TPBank",
    logo: "https://api.vietqr.io/img/TPB.png",
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 10,
    name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
    code: "VPB",
    bin: "970432",
    shortName: "VPBank",
    logo: "https://api.vietqr.io/img/VPB.png",
    transferSupported: 1,
    lookupSupported: 1
  }
];

// Default bank account configuration
export const DEFAULT_BANK_ACCOUNT = {
  bankCode: 'VPB',
  accountNo: '0898698288',
  accountName: 'HDBANK SYSTEM',
  bankInfo: {
    id: 10,
    name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
    code: "VPB",
    bin: "970432",
    shortName: "VPBank",
    logo: "https://api.vietqr.io/img/VPB.png",
    transferSupported: 1,
    lookupSupported: 1
  }
};

export class VietQRService {
  /**
   * Find bank by BIN code or bank code
   */
  static findBank(identifier: string): Bank | null {
    return VIETNAMESE_BANKS.find(bank => 
      bank.bin === identifier || 
      bank.code.toLowerCase() === identifier.toLowerCase()
    ) || null;
  }

  /**
   * Validate account number format
   */
  static validateAccountNumber(accountNo: string): boolean {
    // Account number should be 6-19 digits only
    const accountRegex = /^\d{6,19}$/;
    return accountRegex.test(accountNo);
  }

  /**
   * Validate and format account name for VietQR
   */
  static formatAccountName(name: string): string {
    if (!name) return '';
    
    // Remove Vietnamese accents and convert to uppercase
    const withoutAccents = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim();
    
    // Limit to 50 characters
    return withoutAccents.substring(0, 50);
  }

  /**
   * Validate and format transfer description
   */
  static formatAddInfo(addInfo: string): string {
    if (!addInfo) return '';
    
    // Remove Vietnamese accents and special characters
    const formatted = addInfo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^A-Za-z0-9\s]/g, '')
      .trim();
    
    // Limit to 25 characters
    return formatted.substring(0, 25);
  }

  /**
   * Generate VietQR code URL using Quick Link format
   * Format: https://img.vietqr.io/image/{BANK_CODE}-{ACCOUNT_NO}-{TEMPLATE}.png
   * With parameters: ?amount={AMOUNT}&addInfo={DESCRIPTION}&accountName={ACCOUNT_NAME}
   */
  static generateQRCode(request: VietQRRequest): VietQRResponse {
    try {
      // Validate bank
      const bank = this.findBank(request.bankId);
      if (!bank) {
        return {
          success: false,
          error: `Bank not found for identifier: ${request.bankId}`
        };
      }

      // Validate account number
      if (!this.validateAccountNumber(request.accountNo)) {
        return {
          success: false,
          error: 'Invalid account number format. Must be 6-19 digits only.'
        };
      }

      // Validate amount if provided
      if (request.amount !== undefined) {
        if (request.amount <= 0 || request.amount.toString().length > 13) {
          return {
            success: false,
            error: 'Invalid amount. Must be positive and max 13 digits.'
          };
        }
      }

      const template = request.template || 'compact';
      const baseUrl = `https://img.vietqr.io/image/${bank.code.toLowerCase()}-${request.accountNo}-${template}.png`;
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (request.amount) {
        params.append('amount', request.amount.toString());
      }
      
      if (request.addInfo) {
        const formattedAddInfo = this.formatAddInfo(request.addInfo);
        if (formattedAddInfo) {
          params.append('addInfo', formattedAddInfo);
        }
      }
      
      if (request.accountName) {
        const formattedAccountName = this.formatAccountName(request.accountName);
        if (formattedAccountName) {
          params.append('accountName', formattedAccountName);
        }
      }

      const queryString = params.toString();
      const qrCodeUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      return {
        success: true,
        qrCodeUrl,
        qrDataUrl: qrCodeUrl // For compatibility, both URLs are the same in Quick Link format
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get all supported banks
   */
  static getSupportedBanks(): Bank[] {
    return VIETNAMESE_BANKS;
  }

  /**
   * Get default bank account configuration
   */
  static getDefaultBankAccount() {
    return DEFAULT_BANK_ACCOUNT;
  }

  /**
   * Generate QR code using default bank account
   * Convenience method for quick QR generation
   */
  static generateDefaultQR({
    walletId,
    amount,
    template = 'compact'
  }: {
    walletId: string;
    amount?: number;
    template?: string;
  }): VietQRResponse {
    const params: {
      walletId: string;
      template: string;
      amount?: number;
    } = {
      walletId,
      template
    };
    
    if (amount !== undefined) {
      params.amount = amount;
    }
    
    return this.generateQRForWallet(params);
  }

  /**
   * Generate QR code for a specific wallet ID with transfer note
   * This is a convenience method for the HDBank application
   */
  static generateQRForWallet({
    walletId,
    bankCode = DEFAULT_BANK_ACCOUNT.bankCode, // Default to VPBank
    accountNo = DEFAULT_BANK_ACCOUNT.accountNo, // Default account
    accountName = DEFAULT_BANK_ACCOUNT.accountName,
    amount,
    template = 'compact'
  }: {
    walletId: string;
    bankCode?: string;
    accountNo?: string;
    accountName?: string;
    amount?: number;
    template?: string;
  }): VietQRResponse {
    const request: VietQRRequest = {
      bankId: bankCode,
      accountNo,
      addInfo: walletId, // Use wallet ID as transfer note
      template
    };
    
    if (accountName !== undefined) {
      request.accountName = accountName;
    }
    
    if (amount !== undefined) {
      request.amount = amount;
    }
    
    return this.generateQRCode(request);
  }
}