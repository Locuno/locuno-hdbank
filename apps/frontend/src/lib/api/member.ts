import { api } from './index';
import { ApiResponse } from './auth';

// Member Types
export interface Member {
  id: string;
  userId: string;
  communityId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  invitedBy?: string;
}

export interface InviteMemberRequest {
  email: string;
  phoneNumber?: string;
  role?: 'admin' | 'member' | 'viewer';
}

export interface MemberListResponse {
  members: Member[];
  total: number;
}

export class MemberService {
  // Get all members of a community
  async getMembers(communityId: string): Promise<ApiResponse<MemberListResponse>> {
    try {
      const response = await api.get(`/wallet/${communityId}/members`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting members:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách thành viên'
      };
    }
  }

  // Invite a new member to the community
  async inviteMember(
    communityId: string, 
    memberData: InviteMemberRequest
  ): Promise<ApiResponse<{ invitationId: string }>> {
    try {
      const response = await api.post(`/wallet/${communityId}/invite`, {
        email: memberData.email,
        phoneNumber: memberData.phoneNumber,
        role: memberData.role || 'member'
      });
      return response.data;
    } catch (error: any) {
      console.error('Error inviting member:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể mời thành viên'
      };
    }
  }

  // Remove a member from the community
  async removeMember(communityId: string, memberId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/wallet/${communityId}/members/${memberId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error removing member:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa thành viên',
        data: null
      };
    }
  }

  // Update member role
  async updateMemberRole(
    communityId: string, 
    memberId: string, 
    role: 'admin' | 'member' | 'viewer'
  ): Promise<ApiResponse<null>> {
    try {
      const response = await api.patch(`/wallet/${communityId}/members/${memberId}`, {
        role
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating member role:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật quyền thành viên',
        data: null
      };
    }
  }

  // Get member details
  async getMemberDetails(communityId: string, memberId: string): Promise<ApiResponse<Member>> {
    try {
      const response = await api.get(`/wallet/${communityId}/members/${memberId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting member details:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin thành viên'
      };
    }
  }

  // Accept invitation (for invited users)
  async acceptInvitation(token: string): Promise<ApiResponse<{ communityId: string }>> {
    try {
      const response = await api.post('/wallet/accept-invitation', {
        token
      });
      return response.data;
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể chấp nhận lời mời'
      };
    }
  }

  // Resend invitation
  async resendInvitation(communityId: string, memberId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post(`/wallet/${communityId}/members/${memberId}/resend-invitation`);
      return response.data;
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể gửi lại lời mời',
        data: null
      };
    }
  }
}

// Export singleton instance
export const memberService = new MemberService();
