import { 
  CreditScoreBreakdown, 
  CreditScoreFactor, 
  CreditScoreHistory, 
  CreditScoreBenefits,
  CreditBenefit,
  CREDIT_TIERS 
} from '@/types/creditScore';

// Mock Credit Score Factors
export const mockCreditScoreFactors: CreditScoreFactor[] = [
  {
    id: 'transaction_history',
    name: 'Lịch Sử Giao Dịch',
    description: 'Tần suất và giá trị giao dịch trong cộng đồng',
    weight: 25,
    currentValue: 85,
    maxValue: 100,
    status: 'good',
    icon: 'TrendingUp',
    color: 'text-blue-600',
    requirements: [
      {
        id: 'monthly_transactions',
        description: 'Giao dịch hàng tháng',
        completed: true,
        value: 12,
        target: 10,
        unit: 'giao dịch'
      },
      {
        id: 'transaction_volume',
        description: 'Tổng giá trị giao dịch',
        completed: true,
        value: 25000000,
        target: 20000000,
        unit: 'VND'
      },
      {
        id: 'transaction_consistency',
        description: 'Tính nhất quán trong giao dịch',
        completed: false,
        value: 75,
        target: 80,
        unit: '%'
      }
    ],
    tips: [
      'Thực hiện giao dịch đều đặn mỗi tháng',
      'Tăng giá trị giao dịch trung bình',
      'Duy trì tính nhất quán trong hoạt động'
    ]
  },
  {
    id: 'voting_participation',
    name: 'Tham Gia Bỏ Phiếu',
    description: 'Mức độ tham gia vào các quyết định cộng đồng',
    weight: 20,
    currentValue: 92,
    maxValue: 100,
    status: 'excellent',
    icon: 'Vote',
    color: 'text-green-600',
    requirements: [
      {
        id: 'voting_rate',
        description: 'Tỷ lệ tham gia bỏ phiếu',
        completed: true,
        value: 92,
        target: 80,
        unit: '%'
      },
      {
        id: 'proposal_creation',
        description: 'Đề xuất đã tạo',
        completed: true,
        value: 3,
        target: 2,
        unit: 'đề xuất'
      },
      {
        id: 'community_discussions',
        description: 'Tham gia thảo luận',
        completed: true,
        value: 15,
        target: 10,
        unit: 'bình luận'
      }
    ],
    tips: [
      'Tham gia bỏ phiếu cho tất cả đề xuất',
      'Tạo đề xuất có ích cho cộng đồng',
      'Tích cực thảo luận và đóng góp ý kiến'
    ]
  },
  {
    id: 'ekyc_status',
    name: 'Trạng Thái eKYC',
    description: 'Mức độ xác thực danh tính điện tử',
    weight: 15,
    currentValue: 100,
    maxValue: 100,
    status: 'excellent',
    icon: 'ShieldCheck',
    color: 'text-green-600',
    requirements: [
      {
        id: 'identity_verified',
        description: 'Xác thực CMND/CCCD',
        completed: true
      },
      {
        id: 'phone_verified',
        description: 'Xác thực số điện thoại',
        completed: true
      },
      {
        id: 'email_verified',
        description: 'Xác thực email',
        completed: true
      },
      {
        id: 'bank_account_linked',
        description: 'Liên kết tài khoản ngân hàng',
        completed: true
      }
    ],
    tips: [
      'Hoàn thành tất cả bước xác thực',
      'Cập nhật thông tin khi có thay đổi',
      'Bảo mật thông tin cá nhân'
    ]
  },
  {
    id: 'account_age',
    name: 'Tuổi Tài Khoản',
    description: 'Thời gian tham gia cộng đồng',
    weight: 10,
    currentValue: 78,
    maxValue: 100,
    status: 'good',
    icon: 'Calendar',
    color: 'text-blue-600',
    requirements: [
      {
        id: 'account_duration',
        description: 'Thời gian tham gia',
        completed: true,
        value: 14,
        target: 12,
        unit: 'tháng'
      },
      {
        id: 'profile_completeness',
        description: 'Độ hoàn thiện hồ sơ',
        completed: true,
        value: 95,
        target: 90,
        unit: '%'
      }
    ],
    tips: [
      'Duy trì hoạt động lâu dài',
      'Hoàn thiện thông tin hồ sơ',
      'Cập nhật thông tin định kỳ'
    ]
  },
  {
    id: 'community_engagement',
    name: 'Tương Tác Cộng Đồng',
    description: 'Mức độ tham gia và đóng góp cho cộng đồng',
    weight: 15,
    currentValue: 88,
    maxValue: 100,
    status: 'good',
    icon: 'Users',
    color: 'text-blue-600',
    requirements: [
      {
        id: 'event_participation',
        description: 'Tham gia sự kiện',
        completed: true,
        value: 8,
        target: 5,
        unit: 'sự kiện'
      },
      {
        id: 'member_referrals',
        description: 'Giới thiệu thành viên mới',
        completed: true,
        value: 4,
        target: 3,
        unit: 'người'
      },
      {
        id: 'community_contributions',
        description: 'Đóng góp cho cộng đồng',
        completed: false,
        value: 2,
        target: 3,
        unit: 'đóng góp'
      }
    ],
    tips: [
      'Tham gia các sự kiện cộng đồng',
      'Giới thiệu bạn bè tham gia',
      'Đóng góp ý tưởng và nguồn lực'
    ]
  },
  {
    id: 'payment_reliability',
    name: 'Độ Tin Cậy Thanh Toán',
    description: 'Lịch sử thanh toán và trả nợ đúng hạn',
    weight: 15,
    currentValue: 95,
    maxValue: 100,
    status: 'excellent',
    icon: 'CreditCard',
    color: 'text-green-600',
    requirements: [
      {
        id: 'on_time_payments',
        description: 'Thanh toán đúng hạn',
        completed: true,
        value: 100,
        target: 95,
        unit: '%'
      },
      {
        id: 'debt_to_income',
        description: 'Tỷ lệ nợ/thu nhập',
        completed: true,
        value: 15,
        target: 30,
        unit: '%'
      },
      {
        id: 'payment_history',
        description: 'Lịch sử thanh toán',
        completed: true,
        value: 24,
        target: 12,
        unit: 'tháng'
      }
    ],
    tips: [
      'Luôn thanh toán đúng hạn',
      'Duy trì tỷ lệ nợ thấp',
      'Xây dựng lịch sử tín dụng tốt'
    ]
  }
];

// Calculate total score
const calculateTotalScore = (factors: CreditScoreFactor[]): number => {
  return Math.round(
    factors.reduce((total, factor) => {
      return total + (factor.currentValue * factor.weight / 100);
    }, 0)
  );
};

// Mock Credit Score Breakdown
export const mockCreditScoreBreakdown: CreditScoreBreakdown = {
  totalScore: calculateTotalScore(mockCreditScoreFactors),
  grade: 'A',
  status: 'good',
  factors: mockCreditScoreFactors,
  lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  nextUpdate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  trend: 'up',
  trendValue: 5
};

// Mock Credit Score History (last 12 months)
export const mockCreditScoreHistory: CreditScoreHistory[] = [
  { date: '2024-01-01', score: 72, factors: { transaction_history: 70, voting_participation: 75, ekyc_status: 100, account_age: 60, community_engagement: 65, payment_reliability: 80 } },
  { date: '2024-02-01', score: 74, factors: { transaction_history: 72, voting_participation: 78, ekyc_status: 100, account_age: 62, community_engagement: 68, payment_reliability: 82 } },
  { date: '2024-03-01', score: 76, factors: { transaction_history: 75, voting_participation: 80, ekyc_status: 100, account_age: 64, community_engagement: 70, payment_reliability: 85 } },
  { date: '2024-04-01', score: 78, factors: { transaction_history: 77, voting_participation: 82, ekyc_status: 100, account_age: 66, community_engagement: 72, payment_reliability: 87 } },
  { date: '2024-05-01', score: 80, factors: { transaction_history: 80, voting_participation: 85, ekyc_status: 100, account_age: 68, community_engagement: 75, payment_reliability: 90 } },
  { date: '2024-06-01', score: 82, factors: { transaction_history: 82, voting_participation: 87, ekyc_status: 100, account_age: 70, community_engagement: 78, payment_reliability: 92 } },
  { date: '2024-07-01', score: 84, factors: { transaction_history: 84, voting_participation: 89, ekyc_status: 100, account_age: 72, community_engagement: 80, payment_reliability: 93 } },
  { date: '2024-08-01', score: 85, factors: { transaction_history: 85, voting_participation: 90, ekyc_status: 100, account_age: 74, community_engagement: 82, payment_reliability: 94 } },
  { date: '2024-09-01', score: 87, factors: { transaction_history: 85, voting_participation: 91, ekyc_status: 100, account_age: 76, community_engagement: 85, payment_reliability: 95 } },
  { date: '2024-10-01', score: 88, factors: { transaction_history: 85, voting_participation: 92, ekyc_status: 100, account_age: 78, community_engagement: 87, payment_reliability: 95 } },
  { date: '2024-11-01', score: 89, factors: { transaction_history: 85, voting_participation: 92, ekyc_status: 100, account_age: 78, community_engagement: 88, payment_reliability: 95 } },
  { date: '2024-12-01', score: 90, factors: { transaction_history: 85, voting_participation: 92, ekyc_status: 100, account_age: 78, community_engagement: 88, payment_reliability: 95 } }
];

// Mock Credit Benefits
export const mockCreditBenefits: CreditBenefit[] = [
  {
    id: 'low_interest_loans',
    title: 'Lãi Suất Ưu Đãi',
    description: 'Lãi suất vay chỉ từ 0.8%/tháng cho thành viên Gold+',
    icon: 'Percent',
    available: true,
    tier: 'gold'
  },
  {
    id: 'high_loan_limit',
    title: 'Hạn Mức Vay Cao',
    description: 'Hạn mức vay lên đến 30M VND không cần thế chấp',
    icon: 'Banknote',
    available: true,
    tier: 'gold'
  },
  {
    id: 'priority_support',
    title: 'Hỗ Trợ Ưu Tiên',
    description: 'Được ưu tiên hỗ trợ 24/7 từ đội ngũ chăm sóc khách hàng',
    icon: 'Headphones',
    available: true,
    tier: 'silver'
  },
  {
    id: 'exclusive_events',
    title: 'Sự Kiện Độc Quyền',
    description: 'Tham gia các sự kiện, workshop dành riêng cho thành viên VIP',
    icon: 'Calendar',
    available: false,
    tier: 'platinum'
  },
  {
    id: 'investment_opportunities',
    title: 'Cơ Hội Đầu Tư',
    description: 'Truy cập sớm vào các cơ hội đầu tư và dự án mới',
    icon: 'TrendingUp',
    available: false,
    tier: 'platinum'
  }
];

// Get current tier based on score
const getCurrentTier = (score: number) => {
  return CREDIT_TIERS.find(tier => score >= tier.minScore && score <= tier.maxScore) || CREDIT_TIERS[CREDIT_TIERS.length - 1];
};

// Get next tier
const getNextTier = (currentTier: any) => {
  const currentIndex = CREDIT_TIERS.findIndex(tier => tier.id === currentTier.id);
  return currentIndex > 0 ? CREDIT_TIERS[currentIndex - 1] : undefined;
};

// Mock Credit Score Benefits
export const mockCreditScoreBenefits: CreditScoreBenefits = (() => {
  const currentTier = getCurrentTier(mockCreditScoreBreakdown.totalScore);
  const nextTier = getNextTier(currentTier);
  
  return {
    currentTier,
    nextTier,
    pointsToNextTier: nextTier ? nextTier.minScore - mockCreditScoreBreakdown.totalScore : undefined,
    benefits: mockCreditBenefits
  };
})();
