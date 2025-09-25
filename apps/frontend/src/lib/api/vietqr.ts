import { api } from './index';

export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: boolean;
  lookupSupported: boolean;
}

export interface VietQRRequest {
  bankId: string;
  accountNo: string;
  accountName?: string;
  amount?: number;
  addInfo?: string;
  template?: 'compact' | 'qr_only' | 'print';
}

export interface VietQRResponse {
  success: boolean;
  qrCodeUrl: string;
  qrDataUrl: string;
  bankInfo: Bank;
  request: VietQRRequest;
}

export interface DefaultBankAccount {
  bankCode: string;
  accountNo: string;
  accountName: string;
  bankInfo: Bank;
}

export interface DepositHistoryEntry {
  id: string;
  amount: number;
  timestamp: string;
  walletId: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
}

// VietQR API functions
export const vietqrApi = {
  // Get list of supported banks
  async getBanks(): Promise<Bank[]> {
    const response = await api.get<Bank[]>('/api/vietqr/banks');
    return response.data;
  },

  // Get specific bank by identifier
  async getBank(identifier: string): Promise<Bank> {
    const response = await api.get<Bank>(`/api/vietqr/banks/${identifier}`);
    return response.data;
  },

  // Generate QR code
  async generateQR(request: VietQRRequest): Promise<VietQRResponse> {
    const response = await api.post<VietQRResponse>('/api/vietqr/generate', request);
    return response.data;
  },

  // Generate QR code for wallet
  async generateWalletQR(params: {
    walletId: string;
    bankCode?: string;
    accountNo?: string;
    accountName?: string;
    amount?: number;
    template?: 'compact' | 'qr_only' | 'print';
  }): Promise<VietQRResponse> {
    const response = await api.post<VietQRResponse>('/api/vietqr/wallet', params);
    return response.data;
  },

  // Get default bank account
  async getDefaultAccount(): Promise<DefaultBankAccount> {
    const response = await api.get<DefaultBankAccount>('/api/vietqr/default');
    return response.data;
  },

  // Generate QR with default account
  async generateDefaultQR(params: {
    walletId: string;
    amount?: number;
    template?: 'compact' | 'qr_only' | 'print';
  }): Promise<VietQRResponse> {
    const response = await api.post<VietQRResponse>('/api/vietqr/default', params);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
    supportedBanks: number;
    defaultAccount?: {
      bank: string;
      accountNo: string;
    };
  }> {
    const response = await api.get('/api/vietqr/health');
    return response.data;
  }
};