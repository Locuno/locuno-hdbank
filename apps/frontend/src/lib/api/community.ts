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
      // Use the dedicated communities API endpoint
      const response = await api.post<ApiResponse<{ community: CommunityGroup }>>(
        '/api/communities',
        {
          name: data.name,
          type: data.type,
          description: data.description
        }
      );
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Community created successfully',
          data: { community: response.data.data?.community || {} as CommunityGroup }
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to create community',
        errors: response.data.errors || ['Unknown error'],
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
      // Use the dedicated communities API endpoint
      const response = await api.get<ApiResponse<{ communities: CommunityGroup[] }>>(
        '/api/communities'
      );
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Communities retrieved successfully',
          data: { communities: response.data.data?.communities || [] }
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to get communities',
        errors: response.data.errors || ['Unknown error'],
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
      // Use the dedicated communities API endpoint
      const response = await api.get<ApiResponse<{ community: CommunityGroup }>>(
        `/api/communities/${communityId}`
      );
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Community details retrieved successfully',
          data: { community: response.data.data?.community || {} as CommunityGroup }
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Failed to get community details',
        errors: response.data.errors || ['Unknown error'],
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