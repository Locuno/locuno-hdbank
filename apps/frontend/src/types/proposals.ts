export type ProposalStatus = 'pending' | 'voting' | 'approved' | 'rejected' | 'completed';
export type ProposalCategory = 'infrastructure' | 'maintenance' | 'equipment' | 'social' | 'emergency';
export type VoteType = 'approve' | 'reject' | 'abstain';

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  voterName: string;
  voteType: VoteType;
  votedAt: string;
  comment?: string;
}

export interface SpendingProposal {
  id: string;
  communityId: string;
  title: string;
  description: string;
  category: ProposalCategory;
  amount: number;
  proposedBy: string;
  proposedAt: string;
  votingDeadline: string;
  status: ProposalStatus;
  
  // Voting details
  totalVotes: number;
  approveVotes: number;
  rejectVotes: number;
  abstainVotes: number;
  requiredVotes: number; // 2/3 majority
  totalMembers: number;
  
  // Additional details
  urgency: 'low' | 'medium' | 'high';
  estimatedCompletion?: string;
  contractor?: string;
  attachments?: string[];
  votes: Vote[];
}

export interface ProposalStats {
  totalProposals: number;
  pendingProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
  totalAmountProposed: number;
  totalAmountApproved: number;
  averageApprovalRate: number;
}

export const PROPOSAL_STATUS_CONFIG = {
  pending: {
    label: 'Chờ bỏ phiếu',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  voting: {
    label: 'Đang bỏ phiếu',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  approved: {
    label: 'Đã phê duyệt',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  rejected: {
    label: 'Bị từ chối',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  completed: {
    label: 'Hoàn thành',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
};

export const PROPOSAL_CATEGORY_CONFIG = {
  infrastructure: {
    label: 'Cơ sở hạ tầng',
    icon: '🏗️',
    color: 'text-blue-600'
  },
  maintenance: {
    label: 'Bảo trì',
    icon: '🔧',
    color: 'text-orange-600'
  },
  equipment: {
    label: 'Thiết bị',
    icon: '⚙️',
    color: 'text-purple-600'
  },
  social: {
    label: 'Hoạt động xã hội',
    icon: '🎉',
    color: 'text-pink-600'
  },
  emergency: {
    label: 'Khẩn cấp',
    icon: '🚨',
    color: 'text-red-600'
  }
};
