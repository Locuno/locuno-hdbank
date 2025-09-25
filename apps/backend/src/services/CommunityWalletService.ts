export class CommunityWalletService {
  static async createWallet(env: any, data: {
    name: string;
    description?: string;
    createdBy: string;
    settings?: any;
  }) {
    try {
      const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId,
          name: data.name,
          description: data.description,
          createdBy: data.createdBy,
          settings: data.settings,
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.createWallet error:', error);
      return { success: false, error: 'Failed to create wallet' };
    }
  }

  static async getWalletDetails(env: any, walletId: string) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-wallet', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getWalletDetails error:', error);
      return { success: false, error: 'Failed to get wallet details' };
    }
  }

  static async getUserWallets(env: any, userId: string) {
    try {
      const userWalletId = `user_wallets_${userId}`;
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(userWalletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch(`http://localhost/user-wallets?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getUserWallets error:', error);
      return { success: false, error: 'Failed to get user wallets' };
    }
  }

  static async getAllWallets(env: any) {
    try {
      // Use a consistent DO instance for global operations
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName('global_wallets');
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/all-wallets', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getAllWallets error:', error);
      return { success: false, error: 'Failed to get all wallets' };
    }
  }

  static async inviteMember(env: any, data: {
    walletId: string;
    invitedEmail: string;
    invitedBy: string;
    role: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.inviteMember error:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }

  static async acceptInvitation(env: any, data: {
    token: string;
    userId: string;
  }) {
    try {
      const invitationId = `wallet_invitation_${data.token}`;
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(invitationId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/accept-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.acceptInvitation error:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  }

  static async getWalletMembers(env: any, walletId: string) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/wallet-members');
      url.searchParams.set('walletId', walletId);
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getWalletMembers error:', error);
      return { success: false, error: 'Failed to get wallet members' };
    }
  }

  static async proposeTransaction(env: any, data: {
    walletId: string;
    proposedBy: string;
    amount: number;
    recipient: string;
    description: string;
    category?: string;
    reference?: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/propose-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.proposeTransaction error:', error);
      return { success: false, error: 'Failed to propose transaction' };
    }
  }

  static async getProposals(env: any, walletId: string, status?: string) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/wallet-proposals');
      url.searchParams.set('walletId', walletId);
      if (status) {
        url.searchParams.set('status', status);
      }
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getProposals error:', error);
      return { success: false, error: 'Failed to get proposals' };
    }
  }

  static async voteOnProposal(env: any, data: {
    walletId: string;
    proposalId: string;
    voterId: string;
    vote: string;
    reason?: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/vote-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.voteOnProposal error:', error);
      return { success: false, error: 'Failed to vote on proposal' };
    }
  }

  static async executeTransaction(env: any, data: {
    walletId: string;
    proposalId: string;
    executedBy: string;
    notes?: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/execute-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.executeTransaction error:', error);
      return { success: false, error: 'Failed to execute transaction' };
    }
  }

  static async getTransactionHistory(env: any, data: {
    walletId: string;
    limit: number;
    offset: number;
    category?: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/get-transactions');
      url.searchParams.set('limit', data.limit.toString());
      url.searchParams.set('offset', data.offset.toString());
      if (data.category) {
        url.searchParams.set('category', data.category);
      }
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getTransactionHistory error:', error);
      return { success: false, error: 'Failed to get transaction history' };
    }
  }

  static async getWalletBalance(env: any, walletId: string) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-balance', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.getWalletBalance error:', error);
      return { success: false, error: 'Failed to get wallet balance' };
    }
  }

  static async updateWalletBalance(env: any, data: {
    walletId: string;
    amount: number;
    transactionId: string;
    description: string;
    reference: string;
  }) {
    try {
      const durableObjectId = env.COMMUNITY_WALLET_DO.idFromName(data.walletId);
      const durableObject = env.COMMUNITY_WALLET_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/update-wallet-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.amount,
          transactionId: data.transactionId,
          description: data.description,
          reference: data.reference,
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('CommunityWalletService.updateWalletBalance error:', error);
      return { success: false, error: 'Failed to update wallet balance' };
    }
  }
}