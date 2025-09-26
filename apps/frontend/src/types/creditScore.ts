// Credit Score Types and Interfaces

export interface CreditScoreFactor {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage weight in total score
  currentValue: number; // Current score for this factor (0-100)
  maxValue: number; // Maximum possible score
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  requirements: CreditRequirement[];
  tips: string[];
}

export interface CreditRequirement {
  id: string;
  description: string;
  completed: boolean;
  value?: number;
  target?: number;
  unit?: string;
}

export interface CreditScoreBreakdown {
  totalScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  factors: CreditScoreFactor[];
  lastUpdated: string;
  nextUpdate: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number; // Change from last period
}

export interface CreditScoreHistory {
  date: string;
  score: number;
  factors: {
    [factorId: string]: number;
  };
}

export interface CreditScoreBenefits {
  currentTier: CreditTier;
  nextTier?: CreditTier;
  pointsToNextTier?: number;
  benefits: CreditBenefit[];
}

export interface CreditTier {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
  icon: string;
  description: string;
}

export interface CreditBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
  tier: string;
}

// Credit Score Calculation Constants
export const CREDIT_SCORE_WEIGHTS = {
  TRANSACTION_HISTORY: 25, // 25%
  VOTING_PARTICIPATION: 20, // 20%
  EKYC_STATUS: 15, // 15%
  ACCOUNT_AGE: 10, // 10%
  COMMUNITY_ENGAGEMENT: 15, // 15%
  PAYMENT_RELIABILITY: 15, // 15%
} as const;

export const CREDIT_TIERS: CreditTier[] = [
  {
    id: 'platinum',
    name: 'Platinum',
    minScore: 90,
    maxScore: 100,
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    icon: 'Crown',
    description: 'Ưu đãi cao nhất, hạn mức vay lên đến 50M VND'
  },
  {
    id: 'gold',
    name: 'Gold',
    minScore: 80,
    maxScore: 89,
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    icon: 'Award',
    description: 'Ưu đãi tốt, hạn mức vay lên đến 30M VND'
  },
  {
    id: 'silver',
    name: 'Silver',
    minScore: 70,
    maxScore: 79,
    color: 'bg-gradient-to-r from-gray-300 to-gray-500',
    icon: 'Medal',
    description: 'Ưu đãi cơ bản, hạn mức vay lên đến 15M VND'
  },
  {
    id: 'bronze',
    name: 'Bronze',
    minScore: 60,
    maxScore: 69,
    color: 'bg-gradient-to-r from-orange-400 to-orange-600',
    icon: 'Shield',
    description: 'Hạn mức vay lên đến 5M VND'
  },
  {
    id: 'starter',
    name: 'Starter',
    minScore: 0,
    maxScore: 59,
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
    icon: 'User',
    description: 'Thành viên mới, cần cải thiện điểm tín dụng'
  }
];

export const SCORE_STATUS_CONFIG = {
  excellent: { color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
  good: { color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  fair: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
  poor: { color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
  critical: { color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' }
} as const;
