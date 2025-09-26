import { LoanApplication, LoanPayment } from '@/types/loans';

// Individual Loans Mock Data - Very realistic Vietnamese scenarios
export const mockIndividualLoans: LoanApplication[] = [
  {
    id: 'IL001',
    borrowerId: 'user_001',
    borrowerName: 'Nguyễn Văn Minh',
    borrowerPhone: '0987654321',
    borrowerAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    borrowerJob: 'Tài xế Grab',
    borrowerIncome: 12000000, // 12M/tháng
    
    type: 'personal',
    purpose: 'mua_xe_may',
    amount: 25000000, // 25M mua xe máy mới
    interestRate: 2.2, // 2.2%/tháng
    termMonths: 12,
    monthlyPayment: 2291667, // ~2.3M/tháng
    
    status: 'active',
    applicationDate: '2024-08-15',
    approvalDate: '2024-08-18',
    disbursementDate: '2024-08-20',
    dueDate: '2025-08-20',
    
    totalPaid: 9166668, // Đã trả 4 tháng
    remainingBalance: 15833332,
    paymentsCount: 4,
    missedPayments: 0,
    nextPaymentDate: '2025-01-20',
    nextPaymentAmount: 2291667,
    
    collateral: 'Xe máy Honda Winner X 2024',
    guarantor: 'Trần Thị Lan (vợ)',
    guarantorPhone: '0912345678',
    creditScore: 78,
    riskLevel: 'low',
    notes: 'Khách hàng có thu nhập ổn định, thường xuyên chạy Grab'
  },

  {
    id: 'IL002',
    borrowerId: 'user_002',
    borrowerName: 'Lê Thị Hương',
    borrowerPhone: '0901234567',
    borrowerAddress: '456 Phố Hàng Bài, Hoàn Kiếm, Hà Nội',
    borrowerJob: 'Nhân viên bán hàng',
    borrowerIncome: 8500000, // 8.5M/tháng
    
    type: 'education',
    purpose: 'hoc_phi',
    amount: 15000000, // 15M học phí con
    interestRate: 1.2, // 1.2%/tháng (ưu đãi giáo dục)
    termMonths: 18,
    monthlyPayment: 916667, // ~917K/tháng
    
    status: 'active',
    applicationDate: '2024-06-01',
    approvalDate: '2024-06-03',
    disbursementDate: '2024-06-05',
    dueDate: '2025-12-05',
    
    totalPaid: 6416669, // Đã trả 7 tháng
    remainingBalance: 8583331,
    paymentsCount: 7,
    missedPayments: 0,
    nextPaymentDate: '2025-01-05',
    nextPaymentAmount: 916667,
    
    guarantor: 'Nguyễn Văn Tùng (chồng)',
    guarantorPhone: '0987123456',
    creditScore: 82,
    riskLevel: 'low',
    notes: 'Vay học phí cho con học đại học, gia đình có thu nhập ổn định'
  },

  {
    id: 'IL003',
    borrowerId: 'user_003',
    borrowerName: 'Phạm Minh Tuấn',
    borrowerPhone: '0976543210',
    borrowerAddress: '789 Đường Nguyễn Huệ, Quận Hải Châu, Đà Nẵng',
    borrowerJob: 'Thợ xây',
    borrowerIncome: 9000000, // 9M/tháng
    
    type: 'medical',
    purpose: 'benh_vien',
    amount: 8000000, // 8M viện phí
    interestRate: 1.8, // 1.8%/tháng
    termMonths: 10,
    monthlyPayment: 872000, // ~872K/tháng
    
    status: 'overdue',
    applicationDate: '2024-03-10',
    approvalDate: '2024-03-12',
    disbursementDate: '2024-03-15',
    dueDate: '2025-01-15',
    
    totalPaid: 5232000, // Đã trả 6 tháng, thiếu 2 tháng
    remainingBalance: 2768000,
    paymentsCount: 6,
    missedPayments: 2,
    nextPaymentDate: '2024-11-15', // Quá hạn
    nextPaymentAmount: 1744000, // Gồm phí trễ hạn
    
    collateral: 'Sổ đỏ nhà cấp 4',
    guarantor: 'Lê Văn Hải (anh trai)',
    guarantorPhone: '0965432109',
    creditScore: 65,
    riskLevel: 'medium',
    notes: 'Khách hàng gặp khó khăn do mùa mưa ít việc làm, đang tái cơ cấu'
  },

  {
    id: 'IL004',
    borrowerId: 'user_004',
    borrowerName: 'Trần Thị Mai',
    borrowerPhone: '0934567890',
    borrowerAddress: '321 Đường Trần Phú, TP. Nha Trang, Khánh Hòa',
    borrowerJob: 'Kinh doanh tự do',
    borrowerIncome: 15000000, // 15M/tháng (bán quần áo)
    
    type: 'business',
    purpose: 'kinh_doanh_nho',
    amount: 30000000, // 30M mở rộng shop
    interestRate: 2.0, // 2%/tháng
    termMonths: 15,
    monthlyPayment: 2266667, // ~2.27M/tháng
    
    status: 'active',
    applicationDate: '2024-09-01',
    approvalDate: '2024-09-05',
    disbursementDate: '2024-09-10',
    dueDate: '2025-12-10',
    
    totalPaid: 6800001, // Đã trả 3 tháng
    remainingBalance: 23199999,
    paymentsCount: 3,
    missedPayments: 0,
    nextPaymentDate: '2025-01-10',
    nextPaymentAmount: 2266667,
    
    collateral: 'Hàng hóa trong shop + máy móc',
    creditScore: 85,
    riskLevel: 'low',
    notes: 'Shop quần áo online phát triển tốt, doanh thu ổn định'
  },

  {
    id: 'IL005',
    borrowerId: 'user_005',
    borrowerName: 'Hoàng Văn Đức',
    borrowerPhone: '0923456789',
    borrowerAddress: '654 Đường Lý Thường Kiệt, Quận 10, TP.HCM',
    borrowerJob: 'Nhân viên văn phòng',
    borrowerIncome: 11000000, // 11M/tháng
    
    type: 'personal',
    purpose: 'cuoi_hoi',
    amount: 40000000, // 40M cưới hỏi
    interestRate: 2.5, // 2.5%/tháng
    termMonths: 24,
    monthlyPayment: 2083333, // ~2.08M/tháng
    
    status: 'active',
    applicationDate: '2024-05-20',
    approvalDate: '2024-05-25',
    disbursementDate: '2024-06-01',
    dueDate: '2026-06-01',
    
    totalPaid: 14583331, // Đã trả 7 tháng
    remainingBalance: 25416669,
    paymentsCount: 7,
    missedPayments: 0,
    nextPaymentDate: '2025-01-01',
    nextPaymentAmount: 2083333,
    
    guarantor: 'Nguyễn Thị Hoa (vợ sắp cưới)',
    guarantorPhone: '0912987654',
    creditScore: 75,
    riskLevel: 'low',
    notes: 'Cưới hỏi tháng 6/2024, cả hai đều có việc làm ổn định'
  },

  {
    id: 'IL006',
    borrowerId: 'user_006',
    borrowerName: 'Vũ Thị Lan',
    borrowerPhone: '0945678901',
    borrowerAddress: '987 Đường Hai Bà Trưng, Quận 3, TP.HCM',
    borrowerJob: 'Giáo viên',
    borrowerIncome: 7500000, // 7.5M/tháng
    
    type: 'personal',
    purpose: 'mua_dien_thoai',
    amount: 3000000, // 3M mua iPhone
    interestRate: 2.8, // 2.8%/tháng
    termMonths: 6,
    monthlyPayment: 550000, // 550K/tháng
    
    status: 'completed',
    applicationDate: '2024-07-01',
    approvalDate: '2024-07-02',
    disbursementDate: '2024-07-05',
    dueDate: '2025-01-05',
    completionDate: '2024-12-20',
    
    totalPaid: 3300000, // Đã trả hết + lãi
    remainingBalance: 0,
    paymentsCount: 6,
    missedPayments: 0,
    
    creditScore: 88,
    riskLevel: 'low',
    notes: 'Hoàn thành sớm hơn dự kiến, khách hàng uy tín'
  },

  {
    id: 'IL007',
    borrowerId: 'user_007',
    borrowerName: 'Đặng Minh Hải',
    borrowerPhone: '0956789012',
    borrowerAddress: '159 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    borrowerJob: 'Shipper',
    borrowerIncome: 10000000, // 10M/tháng
    
    type: 'emergency',
    purpose: 'tang_le',
    amount: 12000000, // 12M tang lễ cha
    interestRate: 3.5, // 3.5%/tháng (khẩn cấp)
    termMonths: 8,
    monthlyPayment: 1750000, // 1.75M/tháng
    
    status: 'active',
    applicationDate: '2024-10-15',
    approvalDate: '2024-10-15', // Duyệt nhanh do khẩn cấp
    disbursementDate: '2024-10-16',
    dueDate: '2025-06-16',
    
    totalPaid: 5250000, // Đã trả 3 tháng
    remainingBalance: 6750000,
    paymentsCount: 3,
    missedPayments: 0,
    nextPaymentDate: '2025-01-16',
    nextPaymentAmount: 1750000,
    
    guarantor: 'Đặng Thị Hồng (chị gái)',
    guarantorPhone: '0967890123',
    creditScore: 70,
    riskLevel: 'medium',
    notes: 'Vay khẩn cấp cho tang lễ, gia đình có hoàn cảnh khó khăn'
  },

  {
    id: 'IL008',
    borrowerId: 'user_008',
    borrowerName: 'Bùi Văn Thành',
    borrowerPhone: '0967890123',
    borrowerAddress: '753 Đường Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM',
    borrowerJob: 'Thợ điện',
    borrowerIncome: 8000000, // 8M/tháng
    
    type: 'housing',
    purpose: 'sua_nha',
    amount: 20000000, // 20M sửa nhà
    interestRate: 1.5, // 1.5%/tháng
    termMonths: 20,
    monthlyPayment: 1150000, // 1.15M/tháng
    
    status: 'active',
    applicationDate: '2024-04-10',
    approvalDate: '2024-04-15',
    disbursementDate: '2024-04-20',
    dueDate: '2025-12-20',
    
    totalPaid: 9200000, // Đã trả 8 tháng
    remainingBalance: 10800000,
    paymentsCount: 8,
    missedPayments: 0,
    nextPaymentDate: '2025-01-20',
    nextPaymentAmount: 1150000,
    
    collateral: 'Sổ đỏ nhà cấp 4',
    guarantor: 'Nguyễn Văn Long (bạn thân)',
    guarantorPhone: '0978901234',
    creditScore: 72,
    riskLevel: 'low',
    notes: 'Sửa chữa nhà cũ để cho thuê, có kế hoạch trả nợ rõ ràng'
  },

  {
    id: 'IL009',
    borrowerId: 'user_009',
    borrowerName: 'Ngô Thị Hạnh',
    borrowerPhone: '0978901234',
    borrowerAddress: '852 Đường Võ Văn Tần, Quận 3, TP.HCM',
    borrowerJob: 'Massage',
    borrowerIncome: 6500000, // 6.5M/tháng
    
    type: 'personal',
    purpose: 'tra_no',
    amount: 5000000, // 5M trả nợ ngân hàng
    interestRate: 3.0, // 3%/tháng
    termMonths: 10,
    monthlyPayment: 580000, // 580K/tháng
    
    status: 'restructured',
    applicationDate: '2024-02-01',
    approvalDate: '2024-02-05',
    disbursementDate: '2024-02-10',
    dueDate: '2024-12-10',
    
    totalPaid: 4060000, // Đã trả 7 tháng, tái cơ cấu
    remainingBalance: 940000,
    paymentsCount: 7,
    missedPayments: 3,
    nextPaymentDate: '2025-01-10',
    nextPaymentAmount: 470000, // Giảm 50% do tái cơ cấu
    
    creditScore: 58,
    riskLevel: 'high',
    notes: 'Đã tái cơ cấu do khó khăn COVID, hiện đã ổn định trở lại'
  },

  {
    id: 'IL010',
    borrowerId: 'user_010',
    borrowerName: 'Lý Minh Quang',
    borrowerPhone: '0989012345',
    borrowerAddress: '741 Đường Nguyễn Thái Học, Quận 1, TP.HCM',
    borrowerJob: 'Kỹ sư',
    borrowerIncome: 18000000, // 18M/tháng
    
    type: 'personal',
    purpose: 'du_lich',
    amount: 10000000, // 10M du lịch Nhật Bản
    interestRate: 2.3, // 2.3%/tháng
    termMonths: 12,
    monthlyPayment: 916667, // ~917K/tháng
    
    status: 'rejected',
    applicationDate: '2024-11-01',
    approvalDate: undefined,
    
    totalPaid: 0,
    remainingBalance: 10000000,
    paymentsCount: 0,
    missedPayments: 0,
    
    creditScore: 45, // Điểm thấp do có nợ xấu
    riskLevel: 'high',
    notes: 'Từ chối do có lịch sử nợ xấu tại ngân hàng khác'
  }
];

// Mock payment history for some loans
export const mockLoanPayments: LoanPayment[] = [
  // Payments for IL001 (Nguyễn Văn Minh)
  {
    id: 'PAY001',
    loanId: 'IL001',
    amount: 2291667,
    paymentDate: '2024-09-20',
    dueDate: '2024-09-20',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN001'
  },
  {
    id: 'PAY002',
    loanId: 'IL001',
    amount: 2291667,
    paymentDate: '2024-10-20',
    dueDate: '2024-10-20',
    status: 'paid',
    paymentMethod: 'mobile_money',
    transactionId: 'TXN002'
  },
  {
    id: 'PAY003',
    loanId: 'IL001',
    amount: 2291667,
    paymentDate: '2024-11-20',
    dueDate: '2024-11-20',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN003'
  },
  {
    id: 'PAY004',
    loanId: 'IL001',
    amount: 2291667,
    paymentDate: '2024-12-20',
    dueDate: '2024-12-20',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN004'
  },
  
  // Payments for IL003 (Phạm Minh Tuấn - overdue)
  {
    id: 'PAY005',
    loanId: 'IL003',
    amount: 872000,
    paymentDate: '2024-09-18',
    dueDate: '2024-09-15',
    status: 'paid',
    paymentMethod: 'cash',
    lateFee: 26160, // 3% phí trễ hạn
    notes: 'Trả muộn 3 ngày'
  },
  {
    id: 'PAY006',
    loanId: 'IL003',
    amount: 0,
    paymentDate: '',
    dueDate: '2024-10-15',
    status: 'overdue',
    paymentMethod: 'bank_transfer',
    notes: 'Chưa thanh toán, quá hạn 2 tháng'
  }
];

// Loan statistics
export const mockIndividualLoanStats = {
  totalLoans: mockIndividualLoans.length,
  totalAmount: mockIndividualLoans.reduce((sum, loan) => sum + loan.amount, 0),
  activeLoans: mockIndividualLoans.filter(loan => loan.status === 'active').length,
  completedLoans: mockIndividualLoans.filter(loan => loan.status === 'completed').length,
  overdueLoans: mockIndividualLoans.filter(loan => loan.status === 'overdue').length,
  averageAmount: mockIndividualLoans.reduce((sum, loan) => sum + loan.amount, 0) / mockIndividualLoans.length,
  averageInterestRate: mockIndividualLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / mockIndividualLoans.length,
  averageTermMonths: mockIndividualLoans.reduce((sum, loan) => sum + loan.termMonths, 0) / mockIndividualLoans.length,
  defaultRate: (mockIndividualLoans.filter(loan => ['overdue', 'restructured'].includes(loan.status)).length / mockIndividualLoans.length) * 100,
  collectionRate: (mockIndividualLoans.reduce((sum, loan) => sum + loan.totalPaid, 0) / mockIndividualLoans.reduce((sum, loan) => sum + loan.amount, 0)) * 100
};
