import { api } from './index';
import { ApiResponse } from './auth';

// Community Types
export interface CommunityGroup {
  id: string;
  name: string;
  type: 'apartment' | 'school' | 'neighborhood';
  members: number;
  balance: number;
  currency: string;
  description?: string;
  joinLink?: string;
  walletId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommunityRequest {
  name: string;
  type: 'apartment' | 'school' | 'neighborhood';
  description?: string;
}

export interface CommunityMember {
  userId: string;
  communityId: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  invitedBy?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Community API Service
export const communityService = {
  // Community Management
  async createCommunity(data: CreateCommunityRequest): Promise<ApiResponse<{ community: CommunityGroup }>> {
    try {
      // Use wallet API endpoint since communities are implemented as wallets in the backend
      const response = await api.post<ApiResponse<{ walletId: string }>>(
        '/api/wallet/create',
        {
          name: data.name,
          description: data.description,
          settings: {
            type: data.type,
            communityType: data.type
          }
        }
      );
      
      if (response.data.success) {
        // Transform wallet response to community format
        const community: CommunityGroup = {
          id: response.data.data?.walletId || '',
          name: data.name,
          type: data.type,
          description: data.description,
          members: 1,
          balance: 0,
          currency: 'VND',
          walletId: response.data.data?.walletId || '',
          createdAt: new Date().toISOString()
        };
        
        return {
          success: true,
          message: 'Community created successfully',
          data: { community }
        };
      }
      
      return {
        success: false,
        message: 'Failed to create community',
        errors: ['Unknown error'],
        data: { community: {} as CommunityGroup }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create community',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getUserCommunities(): Promise<ApiResponse<{ communities: CommunityGroup[] }>> {
    try {
      // Use wallet API endpoint to get user's wallets (communities)
      const response = await api.get<ApiResponse<{ wallets: any[] }>>(
        '/api/wallet/my-wallets'
      );
      
      if (response.data.success) {
        // Transform wallets to communities format
        const communities: CommunityGroup[] = (response.data.data?.wallets || []).map((wallet: any) => ({
          id: wallet.id,
          name: wallet.name,
          type: wallet.settings?.communityType || 'apartment',
          description: wallet.description,
          members: wallet.memberCount || 1,
          balance: wallet.balance || 0,
          currency: wallet.currency || 'VND',
          walletId: wallet.id,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt
        }));
        
        return {
          success: true,
          message: 'Communities retrieved successfully',
          data: { communities }
        };
      }
      
      return {
        success: false,
        message: 'Failed to get communities',
        errors: ['Unknown error'],
        data: { communities: [] }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get communities',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getCommunityDetails(communityId: string): Promise<ApiResponse<{ community: CommunityGroup }>> {
    try {
      // Use wallet API endpoint to get wallet details
      const response = await api.get<ApiResponse<{ wallet: any }>>(
        `/api/wallet/${communityId}`
      );
      
      if (response.data.success) {
        const wallet = response.data.data?.wallet;
        const community: CommunityGroup = {
          id: wallet.id,
          name: wallet.name,
          type: wallet.settings?.communityType || 'apartment',
          description: wallet.description,
          members: wallet.memberCount || 1,
          balance: wallet.balance || 0,
          currency: wallet.currency || 'VND',
          walletId: wallet.id,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt
        };
        
        return {
          success: true,
          message: 'Community details retrieved successfully',
          data: { community }
        };
      }
      
      return {
        success: false,
        message: 'Failed to get community details',
        errors: ['Unknown error'],
        data: { community: {} as CommunityGroup }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get community details',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async updateCommunity(
    communityId: string,
    updates: Partial<CommunityGroup>
  ): Promise<ApiResponse<{ community: CommunityGroup }>> {
    try {
      const response = await api.put<ApiResponse<{ community: CommunityGroup }>>(
        `/api/communities/${communityId}`,
        updates
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update community',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async deleteCommunity(communityId: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/api/communities/${communityId}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete community',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Member Management
  async getCommunityMembers(communityId: string): Promise<ApiResponse<{ members: CommunityMember[] }>> {
    try {
      const response = await api.get<ApiResponse<{ members: CommunityMember[] }>>(
        `/api/communities/${communityId}/members`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get community members',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async inviteMember(
    communityId: string,
    data: { email: string; role?: 'admin' | 'member' }
  ): Promise<ApiResponse<{ invitationId: string }>> {
    try {
      const response = await api.post<ApiResponse<{ invitationId: string }>>(
        `/api/communities/${communityId}/invite`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to invite member',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async joinCommunity(joinToken: string): Promise<ApiResponse<{ community: CommunityGroup }>> {
    try {
      const response = await api.post<ApiResponse<{ community: CommunityGroup }>>(
        '/api/communities/join',
        { token: joinToken }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to join community',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async removeMember(
    communityId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/api/communities/${communityId}/members/${userId}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove member',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Wallet Management
  async getCommunityBalance(communityId: string): Promise<ApiResponse<{ balance: number; currency: string }>> {
    try {
      const response = await api.get<ApiResponse<{ balance: number; currency: string }>>(
        `/api/communities/${communityId}/balance`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get community balance',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getTransactionHistory(
    communityId: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<{ transactions: any[] }>> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await api.get<ApiResponse<{ transactions: any[] }>>(
        `/api/communities/${communityId}/transactions?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get transaction history',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },
};

export default communityService;