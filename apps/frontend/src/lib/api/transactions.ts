import { api } from './index';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'proposal_payment';
  amount: number;
  currency: string;
  description: string;
  fromAccount?: string;
  toAccount?: string;
  communityId?: string;
  proposalId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  createdBy: string;
  metadata?: {
    bankCode?: string;
    transactionRef?: string;
    qrCode?: string;
    approvedBy?: string[];
    rejectedBy?: string[];
  };
}

export interface TransactionSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  balance: number;
  currency: string;
  transactionCount: number;
}

export interface GetTransactionsResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    summary: TransactionSummary;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface CreateDepositRequest {
  communityId: string;
  amount: number;
  currency: string;
  description?: string;
  bankCode?: string;
  transactionRef?: string;
}

export interface CreateDepositResponse {
  success: boolean;
  data?: {
    transaction: Transaction;
    qrCode?: string;
  };
  message?: string;
}

export const transactionsApi = {
  // Get transactions for a community
  getTransactions: async (
    communityId: string,
    options?: {
      page?: number;
      limit?: number;
      type?: Transaction['type'];
      status?: Transaction['status'];
      startDate?: string;
      endDate?: string;
    }
  ): Promise<GetTransactionsResponse> => {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.type) params.append('type', options.type);
      if (options?.status) params.append('status', options.status);
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);

      const queryString = params.toString();
      const url = `/communities/${communityId}/transactions${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<GetTransactionsResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        success: false,
        message: 'Failed to fetch transactions'
      };
    }
  },

  // Create a deposit transaction
  createDeposit: async (request: CreateDepositRequest): Promise<CreateDepositResponse> => {
    try {
      const response = await api.post<CreateDepositResponse>(
        `/communities/${request.communityId}/transactions/deposit`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error creating deposit:', error);
      return {
        success: false,
        message: 'Failed to create deposit'
      };
    }
  },

  // Get transaction by ID
  getTransaction: async (communityId: string, transactionId: string): Promise<{
    success: boolean;
    data?: Transaction;
    message?: string;
  }> => {
    try {
      const response = await api.get<{
        success: boolean;
        data?: Transaction;
        message?: string;
      }>(`/communities/${communityId}/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return {
        success: false,
        message: 'Failed to fetch transaction'
      };
    }
  },

  // Update transaction status (for admin/system use)
  updateTransactionStatus: async (
    communityId: string,
    transactionId: string,
    status: Transaction['status'],
    metadata?: any
  ): Promise<{
    success: boolean;
    data?: Transaction;
    message?: string;
  }> => {
    try {
      const response = await api.patch<{
        success: boolean;
        data?: Transaction;
        message?: string;
      }>(`/communities/${communityId}/transactions/${transactionId}/status`, {
        status,
        metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return {
        success: false,
        message: 'Failed to update transaction status'
      };
    }
  }
};

// Utility functions
export const formatTransactionAmount = (amount: number, currency: string): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
  return `${amount.toLocaleString()} ${currency}`;
};

export const getTransactionTypeText = (type: Transaction['type']): string => {
  switch (type) {
    case 'deposit': return 'Nạp tiền';
    case 'withdrawal': return 'Rút tiền';
    case 'transfer': return 'Chuyển khoản';
    case 'proposal_payment': return 'Thanh toán đề xuất';
    default: return 'Không rõ';
  }
};

export const getTransactionStatusText = (status: Transaction['status']): string => {
  switch (status) {
    case 'pending': return 'Đang xử lý';
    case 'completed': return 'Hoàn thành';
    case 'failed': return 'Thất bại';
    case 'cancelled': return 'Đã hủy';
    default: return 'Không rõ';
  }
};

export const getTransactionStatusColor = (status: Transaction['status']): string => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'completed': return 'text-green-600 bg-green-100';
    case 'failed': return 'text-red-600 bg-red-100';
    case 'cancelled': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
