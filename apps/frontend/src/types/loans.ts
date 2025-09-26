// Loan Types and Interfaces for Vietnamese Context

export type LoanStatus = 
  | 'pending'           // Đang chờ duyệt
  | 'approved'          // Đã duyệt
  | 'active'            // Đang vay
  | 'overdue'           // Quá hạn
  | 'completed'         // Đã hoàn thành
  | 'rejected'          // Bị từ chối
  | 'cancelled'         // Đã hủy
  | 'restructured';     // Tái cơ cấu

export type LoanType = 
  | 'personal'          // Vay cá nhân
  | 'business'          // Vay kinh doanh
  | 'education'         // Vay học tập
  | 'medical'           // Vay y tế
  | 'housing'           // Vay nhà ở
  | 'emergency'         // Vay khẩn cấp
  | 'community_project' // Dự án cộng đồng
  | 'infrastructure'    // Cơ sở hạ tầng
  | 'social_welfare';   // Phúc lợi xã hội

export type LoanPurpose = 
  | 'mua_xe_may'        // Mua xe máy
  | 'sua_nha'           // Sửa nhà
  | 'kinh_doanh_nho'    // Kinh doanh nhỏ
  | 'hoc_phi'           // Học phí
  | 'benh_vien'         // Viện phí
  | 'cuoi_hoi'          // Cưới hỏi
  | 'tang_le'          // Tang lễ
  | 'mua_dien_thoai'    // Mua điện thoại
  | 'du_lich'           // Du lịch
  | 'dau_tu_vang'       // Đầu tư vàng
  | 'tra_no'            // Trả nợ
  | 'xay_cau'           // Xây cầu
  | 'sua_duong'         // Sửa đường
  | 'he_thong_nuoc'     // Hệ thống nước
  | 'truong_hoc'        // Trường học
  | 'trung_tam_y_te'    // Trung tâm y tế
  | 'san_the_thao'      // Sân thể thao
  | 'cho_dan_sinh'      // Chợ dân sinh
  | 'nha_van_hoa';      // Nhà văn hóa

export interface LoanApplication {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerPhone: string;
  borrowerAddress: string;
  borrowerJob: string;
  borrowerIncome: number; // VND per month
  
  // Loan Details
  type: LoanType;
  purpose: LoanPurpose;
  amount: number; // VND
  interestRate: number; // % per month
  termMonths: number;
  monthlyPayment: number; // VND
  
  // Status & Dates
  status: LoanStatus;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  completionDate?: string;
  
  // Payment Info
  totalPaid: number; // VND
  remainingBalance: number; // VND
  paymentsCount: number;
  missedPayments: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  
  // Additional Info
  collateral?: string;
  guarantor?: string;
  guarantorPhone?: string;
  creditScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  
  // Community specific
  communityId?: string;
  communityName?: string;
  votesFor?: number;
  votesAgainst?: number;
  totalVotes?: number;
  requiredVotes?: number;
}

export interface CommunityLoan extends LoanApplication {
  // Community Project Details
  projectTitle: string;
  projectDescription: string;
  beneficiaries: number; // Số người thưởng lợi
  projectDuration: number; // months
  projectManager: string;
  projectManagerPhone: string;
  
  // Budget Breakdown
  budgetBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  
  // Progress Tracking
  progressPercentage: number;
  milestonesCompleted: number;
  totalMilestones: number;
  
  // Community Impact
  impactMetrics: {
    metric: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number; // VND
  paymentDate: string;
  dueDate: string;
  status: 'paid' | 'overdue' | 'pending';
  paymentMethod: 'bank_transfer' | 'cash' | 'mobile_money' | 'crypto';
  transactionId?: string;
  lateFee?: number;
  notes?: string;
}

export interface LoanStats {
  totalLoans: number;
  totalAmount: number; // VND
  activeLoans: number;
  completedLoans: number;
  overdueLoans: number;
  averageAmount: number; // VND
  averageInterestRate: number; // %
  averageTermMonths: number;
  defaultRate: number; // %
  collectionRate: number; // %
}

// Vietnamese specific loan configurations
export const VIETNAMESE_LOAN_CONFIG = {
  // Common loan amounts in Vietnam (VND)
  COMMON_AMOUNTS: [
    1000000,    // 1M - Mua điện thoại, chi phí nhỏ
    2000000,    // 2M - Sửa xe máy, mua đồ gia dụng
    5000000,    // 5M - Kinh doanh nhỏ, học phí
    10000000,   // 10M - Sửa nhà, mua xe máy mới
    20000000,   // 20M - Cưới hỏi, kinh doanh vừa
    50000000,   // 50M - Xây nhà, kinh doanh lớn
    100000000,  // 100M - Mua nhà, dự án lớn
  ],
  
  // Interest rates by loan type (% per month)
  INTEREST_RATES: {
    personal: { min: 1.5, max: 3.0 },
    business: { min: 1.2, max: 2.5 },
    education: { min: 0.8, max: 1.5 },
    medical: { min: 1.0, max: 2.0 },
    housing: { min: 0.7, max: 1.2 },
    emergency: { min: 2.0, max: 4.0 },
    community_project: { min: 0.5, max: 1.0 },
  },
  
  // Common job titles in Vietnam
  COMMON_JOBS: [
    'Công nhân',
    'Nhân viên văn phòng',
    'Giáo viên',
    'Bác sĩ',
    'Kỹ sư',
    'Kinh doanh tự do',
    'Tài xế',
    'Nông dân',
    'Thợ xây',
    'Nhân viên bán hàng',
    'Kế toán',
    'Bảo vệ',
    'Nấu ăn',
    'Thợ may',
    'Thợ điện',
    'Massage',
    'Shipper',
    'Grab driver',
  ],
  
  // Vietnamese provinces for addresses
  PROVINCES: [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Bình Dương',
    'Đồng Nai',
    'Khánh Hòa',
    'Lâm Đồng',
    'Quảng Nam',
    'Bà Rịa - Vũng Tàu',
    'Thừa Thiên Huế',
    'Kiên Giang',
    'Bắc Ninh',
    'Quảng Ninh',
    'Thanh Hóa',
    'Nghệ An',
    'Gia Lai',
    'Bình Thuận',
    'Tây Ninh',
  ]
} as const;

// Status configurations for UI
export const LOAN_STATUS_CONFIG = {
  pending: { 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100', 
    borderColor: 'border-yellow-200',
    label: 'Đang chờ duyệt',
    icon: 'Clock'
  },
  approved: { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100', 
    borderColor: 'border-blue-200',
    label: 'Đã duyệt',
    icon: 'CheckCircle'
  },
  active: { 
    color: 'text-green-600', 
    bgColor: 'bg-green-100', 
    borderColor: 'border-green-200',
    label: 'Đang vay',
    icon: 'TrendingUp'
  },
  overdue: { 
    color: 'text-red-600', 
    bgColor: 'bg-red-100', 
    borderColor: 'border-red-200',
    label: 'Quá hạn',
    icon: 'AlertTriangle'
  },
  completed: { 
    color: 'text-green-700', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-300',
    label: 'Hoàn thành',
    icon: 'CheckCircle2'
  },
  rejected: { 
    color: 'text-red-700', 
    bgColor: 'bg-red-50', 
    borderColor: 'border-red-300',
    label: 'Bị từ chối',
    icon: 'XCircle'
  },
  cancelled: { 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100', 
    borderColor: 'border-gray-200',
    label: 'Đã hủy',
    icon: 'X'
  },
  restructured: { 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100', 
    borderColor: 'border-purple-200',
    label: 'Tái cơ cấu',
    icon: 'RefreshCw'
  }
} as const;
