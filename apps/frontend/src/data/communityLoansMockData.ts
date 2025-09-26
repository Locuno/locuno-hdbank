import { CommunityLoan } from '@/types/loans';

// Community Loans Mock Data - Realistic Vietnamese community projects
export const mockCommunityLoans: CommunityLoan[] = [
  {
    // Basic loan info
    id: 'CL001',
    borrowerId: 'community_001',
    borrowerName: 'UBND Phường Tân Định',
    borrowerPhone: '0283822xxxx',
    borrowerAddress: 'Phường Tân Định, Quận 1, TP.HCM',
    borrowerJob: 'Cơ quan nhà nước',
    borrowerIncome: 0, // Community project
    
    type: 'infrastructure',
    purpose: 'xay_cau',
    amount: 500000000, // 500M xây cầu
    interestRate: 0.8, // 0.8%/tháng (ưu đãi cộng đồng)
    termMonths: 36,
    monthlyPayment: 15277778, // ~15.3M/tháng
    
    status: 'active',
    applicationDate: '2024-03-01',
    approvalDate: '2024-03-15',
    disbursementDate: '2024-04-01',
    dueDate: '2027-04-01',
    
    totalPaid: 122222224, // Đã trả 8 tháng
    remainingBalance: 377777776,
    paymentsCount: 8,
    missedPayments: 0,
    nextPaymentDate: '2025-01-01',
    nextPaymentAmount: 15277778,
    
    collateral: 'Ngân sách phường + cam kết UBND',
    creditScore: 95,
    riskLevel: 'low',
    
    // Community specific
    communityId: 'comm_001',
    communityName: 'Cộng đồng Phường Tân Định',
    votesFor: 847,
    votesAgainst: 23,
    totalVotes: 870,
    requiredVotes: 580, // 2/3 số hộ dân
    
    // Project details
    projectTitle: 'Xây Dựng Cầu Bộ Hành Qua Kênh Tân Hóa',
    projectDescription: 'Xây dựng cầu bộ hành dài 45m, rộng 3m qua kênh Tân Hóa để kết nối 2 khu dân cư, giúp người dân đi lại thuận tiện và an toàn hơn.',
    beneficiaries: 2500, // 2500 hộ dân
    projectDuration: 18, // 18 tháng
    projectManager: 'Kỹ sư Nguyễn Văn Tài',
    projectManagerPhone: '0909123456',
    
    budgetBreakdown: [
      { category: 'Vật liệu xây dựng', amount: 300000000, percentage: 60 },
      { category: 'Nhân công', amount: 120000000, percentage: 24 },
      { category: 'Máy móc thiết bị', amount: 50000000, percentage: 10 },
      { category: 'Giám sát và quản lý', amount: 20000000, percentage: 4 },
      { category: 'Dự phòng', amount: 10000000, percentage: 2 }
    ],
    
    progressPercentage: 65,
    milestonesCompleted: 4,
    totalMilestones: 6,
    
    impactMetrics: [
      { metric: 'Số hộ dân được hưởng lợi', target: 2500, current: 2500, unit: 'hộ' },
      { metric: 'Thời gian di chuyển giảm', target: 15, current: 12, unit: 'phút' },
      { metric: 'Tai nạn giao thông giảm', target: 80, current: 70, unit: '%' }
    ],
    
    notes: 'Dự án được cộng đồng ủng hộ mạnh mẽ, tiến độ đúng kế hoạch'
  },

  {
    id: 'CL002',
    borrowerId: 'community_002',
    borrowerName: 'Ban Quản Lý Chung Cư Vinhomes',
    borrowerPhone: '0287654321',
    borrowerAddress: 'Chung cư Vinhomes Central Park, Quận Bình Thạnh, TP.HCM',
    borrowerJob: 'Ban quản lý',
    borrowerIncome: 0,
    
    type: 'infrastructure',
    purpose: 'he_thong_nuoc',
    amount: 200000000, // 200M nâng cấp hệ thống nước
    interestRate: 1.0, // 1%/tháng
    termMonths: 24,
    monthlyPayment: 9166667, // ~9.17M/tháng
    
    status: 'active',
    applicationDate: '2024-07-01',
    approvalDate: '2024-07-10',
    disbursementDate: '2024-07-15',
    dueDate: '2026-07-15',
    
    totalPaid: 45833335, // Đã trả 5 tháng
    remainingBalance: 154166665,
    paymentsCount: 5,
    missedPayments: 0,
    nextPaymentDate: '2025-01-15',
    nextPaymentAmount: 9166667,
    
    collateral: 'Quỹ bảo trì chung cư',
    creditScore: 88,
    riskLevel: 'low',
    
    communityId: 'comm_002',
    communityName: 'Cư dân Vinhomes Central Park',
    votesFor: 1250,
    votesAgainst: 180,
    totalVotes: 1430,
    requiredVotes: 953, // 2/3 số căn hộ
    
    projectTitle: 'Nâng Cấp Hệ Thống Cấp Nước Sạch Toà Nhà',
    projectDescription: 'Thay thế toàn bộ đường ống cấp nước cũ, lắp đặt hệ thống lọc nước hiện đại và bồn chứa nước inox cho 3 toà nhà A, B, C.',
    beneficiaries: 1430, // 1430 căn hộ
    projectDuration: 12, // 12 tháng
    projectManager: 'Kỹ sư Trần Minh Đức',
    projectManagerPhone: '0912345678',
    
    budgetBreakdown: [
      { category: 'Ống nước và phụ kiện', amount: 80000000, percentage: 40 },
      { category: 'Hệ thống lọc nước', amount: 60000000, percentage: 30 },
      { category: 'Bồn chứa inox', amount: 30000000, percentage: 15 },
      { category: 'Thi công lắp đặt', amount: 25000000, percentage: 12.5 },
      { category: 'Kiểm tra chất lượng', amount: 5000000, percentage: 2.5 }
    ],
    
    progressPercentage: 40,
    milestonesCompleted: 2,
    totalMilestones: 5,
    
    impactMetrics: [
      { metric: 'Chất lượng nước cải thiện', target: 95, current: 85, unit: '%' },
      { metric: 'Áp lực nước ổn định', target: 100, current: 90, unit: '%' },
      { metric: 'Tiết kiệm chi phí hàng năm', target: 50000000, current: 30000000, unit: 'VND' }
    ],
    
    notes: 'Dự án cần thiết do hệ thống cũ đã xuống cấp sau 10 năm sử dụng'
  },

  {
    id: 'CL003',
    borrowerId: 'community_003',
    borrowerName: 'Hội Phụ Nữ Xã Tân Phú',
    borrowerPhone: '0276543210',
    borrowerAddress: 'Xã Tân Phú, Huyện Châu Thành, Tây Ninh',
    borrowerJob: 'Tổ chức xã hội',
    borrowerIncome: 0,
    
    type: 'social_welfare',
    purpose: 'truong_hoc',
    amount: 150000000, // 150M xây trường mầm non
    interestRate: 0.5, // 0.5%/tháng (ưu đãi giáo dục)
    termMonths: 30,
    monthlyPayment: 5416667, // ~5.42M/tháng
    
    status: 'approved',
    applicationDate: '2024-11-01',
    approvalDate: '2024-11-20',
    disbursementDate: '2024-12-01',
    dueDate: '2027-06-01',
    
    totalPaid: 5416667, // Đã trả 1 tháng
    remainingBalance: 144583333,
    paymentsCount: 1,
    missedPayments: 0,
    nextPaymentDate: '2025-01-01',
    nextPaymentAmount: 5416667,
    
    guarantor: 'UBND Xã Tân Phú',
    guarantorPhone: '0276111222',
    creditScore: 92,
    riskLevel: 'low',
    
    communityId: 'comm_003',
    communityName: 'Cộng đồng Xã Tân Phú',
    votesFor: 320,
    votesAgainst: 5,
    totalVotes: 325,
    requiredVotes: 217, // 2/3 số hộ dân
    
    projectTitle: 'Xây Dựng Trường Mầm Non Tân Phú',
    projectDescription: 'Xây dựng trường mầm non 6 phòng học, sân chơi và khu vệ sinh để phục vụ 180 trẻ em trong xã, giải quyết tình trạng thiếu trường lớp.',
    beneficiaries: 180, // 180 trẻ em
    projectDuration: 15, // 15 tháng
    projectManager: 'Cô Nguyễn Thị Hạnh',
    projectManagerPhone: '0987654321',
    
    budgetBreakdown: [
      { category: 'Xây dựng cơ bản', amount: 90000000, percentage: 60 },
      { category: 'Đồ dùng học tập', amount: 30000000, percentage: 20 },
      { category: 'Sân chơi và cây xanh', amount: 15000000, percentage: 10 },
      { category: 'Hệ thống điện nước', amount: 10000000, percentage: 6.7 },
      { category: 'Giấy phép và thủ tục', amount: 5000000, percentage: 3.3 }
    ],
    
    progressPercentage: 5,
    milestonesCompleted: 0,
    totalMilestones: 8,
    
    impactMetrics: [
      { metric: 'Trẻ em được đi học', target: 180, current: 0, unit: 'trẻ' },
      { metric: 'Giáo viên có việc làm', target: 12, current: 0, unit: 'người' },
      { metric: 'Phụ huynh yên tâm làm việc', target: 150, current: 0, unit: 'gia đình' }
    ],
    
    notes: 'Dự án được toàn xã ủng hộ, đang chờ khởi công'
  },

  {
    id: 'CL004',
    borrowerId: 'community_004',
    borrowerName: 'CLB Thể Thao Phường 12',
    borrowerPhone: '0283456789',
    borrowerAddress: 'Phường 12, Quận Gò Vấp, TP.HCM',
    borrowerJob: 'Câu lạc bộ',
    borrowerIncome: 0,
    
    type: 'community_project',
    purpose: 'san_the_thao',
    amount: 80000000, // 80M xây sân bóng đá mini
    interestRate: 1.2, // 1.2%/tháng
    termMonths: 18,
    monthlyPayment: 4888889, // ~4.89M/tháng
    
    status: 'overdue',
    applicationDate: '2024-01-15',
    approvalDate: '2024-02-01',
    disbursementDate: '2024-02-15',
    dueDate: '2025-08-15',
    
    totalPaid: 43999999, // Đã trả 9 tháng, thiếu 2 tháng
    remainingBalance: 36000001,
    paymentsCount: 9,
    missedPayments: 2,
    nextPaymentDate: '2024-11-15', // Quá hạn
    nextPaymentAmount: 9777778, // Gồm phí trễ hạn
    
    creditScore: 68,
    riskLevel: 'medium',
    
    communityId: 'comm_004',
    communityName: 'Cộng đồng Phường 12',
    votesFor: 450,
    votesAgainst: 120,
    totalVotes: 570,
    requiredVotes: 380, // 2/3 số thành viên CLB
    
    projectTitle: 'Xây Dựng Sân Bóng Đá Mini Cộng Đồng',
    projectDescription: 'Xây dựng sân bóng đá mini 5 người với cỏ nhân tạo, hệ thống đèn chiếu sáng và khán đài nhỏ để phục vụ hoạt động thể thao của cộng đồng.',
    beneficiaries: 800, // 800 người tham gia thể thao
    projectDuration: 8, // 8 tháng
    projectManager: 'Anh Lê Văn Thể',
    projectManagerPhone: '0901234567',
    
    budgetBreakdown: [
      { category: 'Cỏ nhân tạo và nền sân', amount: 40000000, percentage: 50 },
      { category: 'Hệ thống đèn chiếu sáng', amount: 20000000, percentage: 25 },
      { category: 'Khán đài và hàng rào', amount: 12000000, percentage: 15 },
      { category: 'Phòng thay đồ', amount: 6000000, percentage: 7.5 },
      { category: 'Chi phí khác', amount: 2000000, percentage: 2.5 }
    ],
    
    progressPercentage: 85,
    milestonesCompleted: 6,
    totalMilestones: 7,
    
    impactMetrics: [
      { metric: 'Người tham gia thể thao', target: 800, current: 650, unit: 'người' },
      { metric: 'Giải đấu tổ chức', target: 12, current: 8, unit: 'giải/năm' },
      { metric: 'Doanh thu từ cho thuê sân', target: 15000000, current: 12000000, unit: 'VND/tháng' }
    ],
    
    notes: 'Gặp khó khăn tài chính do COVID, đang đàm phán tái cơ cấu'
  },

  {
    id: 'CL005',
    borrowerId: 'community_005',
    borrowerName: 'Hợp Tác Xã Nông Nghiệp Đồng Tâm',
    borrowerPhone: '0292345678',
    borrowerAddress: 'Xã Đồng Tâm, Huyện Mỹ Tho, Tiền Giang',
    borrowerJob: 'Hợp tác xã',
    borrowerIncome: 0,
    
    type: 'business',
    purpose: 'kinh_doanh_nho',
    amount: 300000000, // 300M mua máy móc nông nghiệp
    interestRate: 1.5, // 1.5%/tháng
    termMonths: 24,
    monthlyPayment: 13750000, // ~13.75M/tháng
    
    status: 'active',
    applicationDate: '2024-06-01',
    approvalDate: '2024-06-15',
    disbursementDate: '2024-07-01',
    dueDate: '2026-07-01',
    
    totalPaid: 82500000, // Đã trả 6 tháng
    remainingBalance: 217500000,
    paymentsCount: 6,
    missedPayments: 0,
    nextPaymentDate: '2025-01-01',
    nextPaymentAmount: 13750000,
    
    collateral: 'Máy móc nông nghiệp + đất sản xuất',
    creditScore: 80,
    riskLevel: 'low',
    
    communityId: 'comm_005',
    communityName: 'HTX Nông Nghiệp Đồng Tâm',
    votesFor: 85,
    votesAgainst: 5,
    totalVotes: 90,
    requiredVotes: 60, // 2/3 số thành viên HTX
    
    projectTitle: 'Mua Sắm Máy Móc Nông Nghiệp Hiện Đại',
    projectDescription: 'Mua máy cày, máy gặt, máy sấy lúa và hệ thống tưới tiêu tự động để nâng cao năng suất và chất lượng sản phẩm nông nghiệp.',
    beneficiaries: 90, // 90 nông dân thành viên
    projectDuration: 12, // 12 tháng
    projectManager: 'Ông Nguyễn Văn Nông',
    projectManagerPhone: '0923456789',
    
    budgetBreakdown: [
      { category: 'Máy cày và máy gặt', amount: 150000000, percentage: 50 },
      { category: 'Máy sấy lúa', amount: 80000000, percentage: 26.7 },
      { category: 'Hệ thống tưới tiêu', amount: 50000000, percentage: 16.7 },
      { category: 'Vận chuyển và lắp đặt', amount: 15000000, percentage: 5 },
      { category: 'Đào tạo sử dụng', amount: 5000000, percentage: 1.6 }
    ],
    
    progressPercentage: 70,
    milestonesCompleted: 4,
    totalMilestones: 6,
    
    impactMetrics: [
      { metric: 'Năng suất tăng', target: 30, current: 25, unit: '%' },
      { metric: 'Chi phí giảm', target: 20, current: 15, unit: '%' },
      { metric: 'Thu nhập tăng', target: 5000000, current: 3500000, unit: 'VND/tháng/hộ' }
    ],
    
    notes: 'Dự án đang triển khai tốt, nông dân rất hài lòng với máy móc mới'
  },

  {
    id: 'CL006',
    borrowerId: 'community_006',
    borrowerName: 'Ban Quản Lý Chợ Bến Thành',
    borrowerPhone: '0281234567',
    borrowerAddress: 'Chợ Bến Thành, Quận 1, TP.HCM',
    borrowerJob: 'Ban quản lý chợ',
    borrowerIncome: 0,
    
    type: 'infrastructure',
    purpose: 'cho_dan_sinh',
    amount: 400000000, // 400M cải tạo chợ
    interestRate: 1.0, // 1%/tháng
    termMonths: 30,
    monthlyPayment: 14444444, // ~14.44M/tháng
    
    status: 'completed',
    applicationDate: '2023-01-01',
    approvalDate: '2023-01-15',
    disbursementDate: '2023-02-01',
    dueDate: '2025-08-01',
    completionDate: '2024-11-15',
    
    totalPaid: 420000000, // Đã trả hết + lãi
    remainingBalance: 0,
    paymentsCount: 22,
    missedPayments: 0,
    
    creditScore: 95,
    riskLevel: 'low',
    
    communityId: 'comm_006',
    communityName: 'Tiểu thương Chợ Bến Thành',
    votesFor: 280,
    votesAgainst: 15,
    totalVotes: 295,
    requiredVotes: 197, // 2/3 số tiểu thương
    
    projectTitle: 'Cải Tạo và Hiện Đại Hóa Chợ Bến Thành',
    projectDescription: 'Cải tạo hệ thống điện, nước, thông gió, lắp đặt camera an ninh và nâng cấp các gian hàng để tạo môi trường mua bán tốt hơn.',
    beneficiaries: 295, // 295 tiểu thương
    projectDuration: 18, // 18 tháng
    projectManager: 'Ông Trần Văn Quản',
    projectManagerPhone: '0912345678',
    
    budgetBreakdown: [
      { category: 'Hệ thống điện và chiếu sáng', amount: 120000000, percentage: 30 },
      { category: 'Hệ thống nước và thoát nước', amount: 100000000, percentage: 25 },
      { category: 'Hệ thống thông gió', amount: 80000000, percentage: 20 },
      { category: 'Camera an ninh', amount: 60000000, percentage: 15 },
      { category: 'Sửa chữa gian hàng', amount: 40000000, percentage: 10 }
    ],
    
    progressPercentage: 100,
    milestonesCompleted: 8,
    totalMilestones: 8,
    
    impactMetrics: [
      { metric: 'Doanh thu tăng', target: 25, current: 30, unit: '%' },
      { metric: 'Khách hàng hài lòng', target: 85, current: 92, unit: '%' },
      { metric: 'An ninh cải thiện', target: 90, current: 95, unit: '%' }
    ],
    
    notes: 'Dự án hoàn thành xuất sắc, vượt kỳ vọng của tiểu thương'
  }
];

// Community loan statistics
export const mockCommunityLoanStats = {
  totalLoans: mockCommunityLoans.length,
  totalAmount: mockCommunityLoans.reduce((sum, loan) => sum + loan.amount, 0),
  activeLoans: mockCommunityLoans.filter(loan => loan.status === 'active').length,
  completedLoans: mockCommunityLoans.filter(loan => loan.status === 'completed').length,
  overdueLoans: mockCommunityLoans.filter(loan => loan.status === 'overdue').length,
  averageAmount: mockCommunityLoans.reduce((sum, loan) => sum + loan.amount, 0) / mockCommunityLoans.length,
  averageInterestRate: mockCommunityLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / mockCommunityLoans.length,
  averageTermMonths: mockCommunityLoans.reduce((sum, loan) => sum + loan.termMonths, 0) / mockCommunityLoans.length,
  totalBeneficiaries: mockCommunityLoans.reduce((sum, loan) => sum + loan.beneficiaries, 0),
  averageProgressPercentage: mockCommunityLoans.reduce((sum, loan) => sum + loan.progressPercentage, 0) / mockCommunityLoans.length,
  defaultRate: (mockCommunityLoans.filter(loan => ['overdue', 'restructured'].includes(loan.status)).length / mockCommunityLoans.length) * 100,
  collectionRate: (mockCommunityLoans.reduce((sum, loan) => sum + loan.totalPaid, 0) / mockCommunityLoans.reduce((sum, loan) => sum + loan.amount, 0)) * 100
};
