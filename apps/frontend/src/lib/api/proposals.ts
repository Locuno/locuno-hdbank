import { api } from './index';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  proposer: string;
  votes: {
    approve: number;
    reject: number;
    total: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  deadline: string;
  category: string;
  communityId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  amount: number;
  category: string;
  communityId: string;
}

export interface VoteRequest {
  proposalId: string;
  voteType: 'approve' | 'reject';
  userId?: string;
}

export interface ProposalResponse {
  success: boolean;
  data: Proposal;
  message?: string;
}

export interface VoteResponse {
  success: boolean;
  data: {
    proposal: Proposal;
    userVote: {
      voteType: 'approve' | 'reject';
      timestamp: string;
    };
  };
  message?: string;
}

export const proposalsApi = {
  // Get all proposals for a community
  getProposals: async (communityId: string): Promise<Proposal[]> => {
    try {
      const response = await api.get(`/api/proposals/community/${communityId}`);
      // Backend returns {success: true, data: [...]} structure
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  },

  // Get a specific proposal by ID
  getProposal: async (proposalId: string): Promise<Proposal> => {
    try {
      const response = await api.get(`/api/proposals/${proposalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      throw error;
    }
  },

  // Create a new proposal
  createProposal: async (proposalData: CreateProposalRequest): Promise<ProposalResponse> => {
    try {
      const response = await api.post('/api/proposals', proposalData);
      return response.data;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  },

  // Vote on a proposal
  voteOnProposal: async (voteData: VoteRequest): Promise<VoteResponse> => {
    try {
      const response = await api.post('/api/proposals/vote', voteData);
      return response.data;
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw error;
    }
  },

  // Get user's vote on a specific proposal
  getUserVote: async (proposalId: string, userId?: string): Promise<{ voteType: 'approve' | 'reject' | null; timestamp?: string }> => {
    try {
      const response = await api.get(`/api/proposals/${proposalId}/vote${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user vote:', error);
      return { voteType: null };
    }
  },

  // Update proposal status (admin only)
  updateProposalStatus: async (proposalId: string, status: Proposal['status']): Promise<ProposalResponse> => {
    try {
      const response = await api.patch(`/api/proposals/${proposalId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating proposal status:', error);
      throw error;
    }
  },

  // Delete a proposal (admin only)
  deleteProposal: async (proposalId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.delete(`/api/proposals/${proposalId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  }
};