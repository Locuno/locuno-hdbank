import { SpendingProposal, ProposalStats } from '@/types/proposals';

export const mockProposals: SpendingProposal[] = [
  {
    id: 'prop-001',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Sửa chữa sân chơi trẻ em khu A',
    description: 'Thay thế các thiết bị chơi cũ, sơn lại hàng rào, lắp đặt thêm đèn chiếu sáng để đảm bảo an toàn cho trẻ em.',
    category: 'maintenance',
    amount: 15000000, // 15M VND
    proposedBy: 'Mai Phạm Thị',
    proposedAt: '2024-12-20T09:00:00Z',
    votingDeadline: '2024-12-27T23:59:59Z',
    status: 'voting',
    totalVotes: 8,
    approveVotes: 6,
    rejectVotes: 1,
    abstainVotes: 1,
    requiredVotes: 8, // 2/3 of 12 members
    totalMembers: 12,
    urgency: 'medium',
    estimatedCompletion: '2025-01-15',
    contractor: 'Công ty TNHH Xây dựng Minh Phát',
    votes: [
      { id: 'v1', proposalId: 'prop-001', userId: 'user-1', voterName: 'Minh Nguyễn Văn', voteType: 'approve', votedAt: '2024-12-21T10:30:00Z', comment: 'Cần thiết cho an toàn trẻ em' },
      { id: 'v2', proposalId: 'prop-001', userId: 'user-2', voterName: 'Lan Trần Thị', voteType: 'approve', votedAt: '2024-12-21T14:15:00Z' },
      { id: 'v3', proposalId: 'prop-001', userId: 'user-3', voterName: 'Hùng Lê Văn', voteType: 'approve', votedAt: '2024-12-22T08:45:00Z' },
      { id: 'v4', proposalId: 'prop-001', userId: 'user-5', voterName: 'Tuấn Hoàng Văn', voteType: 'reject', votedAt: '2024-12-22T16:20:00Z', comment: 'Chi phí quá cao, nên tìm nhà thầu khác' },
      { id: 'v5', proposalId: 'prop-001', userId: 'user-6', voterName: 'Linh Vũ Thị', voteType: 'approve', votedAt: '2024-12-23T11:10:00Z' },
      { id: 'v6', proposalId: 'prop-001', userId: 'user-7', voterName: 'Đức Bùi Văn', voteType: 'approve', votedAt: '2024-12-23T19:30:00Z' },
      { id: 'v7', proposalId: 'prop-001', userId: 'user-8', voterName: 'Hoa Đặng Thị', voteType: 'abstain', votedAt: '2024-12-24T12:00:00Z', comment: 'Cần thêm thông tin chi tiết' },
      { id: 'v8', proposalId: 'prop-001', userId: 'user-9', voterName: 'Nam Võ Văn', voteType: 'approve', votedAt: '2024-12-24T15:45:00Z' }
    ]
  },
  {
    id: 'prop-002',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Lắp đặt camera an ninh tại cổng chính',
    description: 'Lắp đặt hệ thống 4 camera IP, màn hình giám sát và lưu trữ dữ liệu 30 ngày để tăng cường an ninh khu vực.',
    category: 'infrastructure',
    amount: 25000000, // 25M VND
    proposedBy: 'Hùng Lê Văn',
    proposedAt: '2024-12-18T14:30:00Z',
    votingDeadline: '2024-12-25T23:59:59Z',
    status: 'approved',
    totalVotes: 10,
    approveVotes: 9,
    rejectVotes: 1,
    abstainVotes: 0,
    requiredVotes: 8,
    totalMembers: 12,
    urgency: 'high',
    estimatedCompletion: '2025-01-10',
    contractor: 'Công ty CP An ninh Thông minh',
    votes: []
  },
  {
    id: 'prop-003',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Tổ chức Tết Trung thu cho trẻ em',
    description: 'Mua bánh kẹo, đèn lồng, tổ chức múa lân và các hoạt động vui chơi cho 50 trẻ em trong khu vực.',
    category: 'social',
    amount: 8000000, // 8M VND
    proposedBy: 'Linh Vũ Thị',
    proposedAt: '2024-12-15T16:00:00Z',
    votingDeadline: '2024-12-22T23:59:59Z',
    status: 'rejected',
    totalVotes: 9,
    approveVotes: 4,
    rejectVotes: 5,
    abstainVotes: 0,
    requiredVotes: 8,
    totalMembers: 12,
    urgency: 'low',
    votes: []
  },
  {
    id: 'prop-004',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Sửa chữa đường nội bộ bị hư hỏng',
    description: 'Vá các ổ gà, làm lại mặt đường đoạn từ cổng chính đến khu B, dài khoảng 200m.',
    category: 'infrastructure',
    amount: 35000000, // 35M VND
    proposedBy: 'Đức Bùi Văn',
    proposedAt: '2024-12-10T10:15:00Z',
    votingDeadline: '2024-12-17T23:59:59Z',
    status: 'completed',
    totalVotes: 11,
    approveVotes: 10,
    rejectVotes: 1,
    abstainVotes: 0,
    requiredVotes: 8,
    totalMembers: 12,
    urgency: 'high',
    estimatedCompletion: '2024-12-30',
    contractor: 'HTX Xây dựng Đại Thành',
    votes: []
  },
  {
    id: 'prop-005',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Mua máy bơm nước dự phòng',
    description: 'Mua máy bơm công suất 5HP để dự phòng khi máy bơm chính gặp sự cố, đảm bảo cung cấp nước liên tục.',
    category: 'equipment',
    amount: 12000000, // 12M VND
    proposedBy: 'Nam Võ Văn',
    proposedAt: '2024-12-22T11:20:00Z',
    votingDeadline: '2024-12-29T23:59:59Z',
    status: 'pending',
    totalVotes: 0,
    approveVotes: 0,
    rejectVotes: 0,
    abstainVotes: 0,
    requiredVotes: 8,
    totalMembers: 12,
    urgency: 'medium',
    estimatedCompletion: '2025-01-20',
    votes: []
  },
  {
    id: 'prop-006',
    communityId: '4fe21024-b6cc-4d66-b624-c40c5beaa16a',
    title: 'Khắc phục sự cố điện khu C',
    description: 'Thay thế cáp điện bị cháy, sửa chữa tủ điện và kiểm tra toàn bộ hệ thống điện khu C sau sự cố.',
    category: 'emergency',
    amount: 18000000, // 18M VND
    proposedBy: 'Minh Nguyễn Văn',
    proposedAt: '2024-12-23T07:30:00Z',
    votingDeadline: '2024-12-26T12:00:00Z',
    status: 'voting',
    totalVotes: 5,
    approveVotes: 5,
    rejectVotes: 0,
    abstainVotes: 0,
    requiredVotes: 8,
    totalMembers: 12,
    urgency: 'high',
    estimatedCompletion: '2024-12-28',
    contractor: 'Công ty Điện lực Miền Nam',
    votes: [
      { id: 'v9', proposalId: 'prop-006', userId: 'user-2', voterName: 'Lan Trần Thị', voteType: 'approve', votedAt: '2024-12-23T08:15:00Z', comment: 'Khẩn cấp, cần xử lý ngay' },
      { id: 'v10', proposalId: 'prop-006', userId: 'user-3', voterName: 'Hùng Lê Văn', voteType: 'approve', votedAt: '2024-12-23T09:00:00Z' },
      { id: 'v11', proposalId: 'prop-006', userId: 'user-4', voterName: 'Mai Phạm Thị', voteType: 'approve', votedAt: '2024-12-23T10:30:00Z' },
      { id: 'v12', proposalId: 'prop-006', userId: 'user-7', voterName: 'Đức Bùi Văn', voteType: 'approve', votedAt: '2024-12-23T14:20:00Z' },
      { id: 'v13', proposalId: 'prop-006', userId: 'user-11', voterName: 'Khang Phan Văn', voteType: 'approve', votedAt: '2024-12-23T16:45:00Z' }
    ]
  }
];

export const mockProposalStats: ProposalStats = {
  totalProposals: 6,
  pendingProposals: 1,
  approvedProposals: 2,
  rejectedProposals: 1,
  totalAmountProposed: 113000000, // 113M VND
  totalAmountApproved: 60000000, // 60M VND
  averageApprovalRate: 66.7
};
