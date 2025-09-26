import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  ChevronRight,
  Award,
  Target,
  Calendar,
  RefreshCw,
  Star,
  Shield,
  Users,
  CreditCard,
  Vote,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditScoreBreakdown, 
  CreditScoreBenefits,
  SCORE_STATUS_CONFIG 
} from '@/types/creditScore';

interface CommunityCreditScoreProps {
  creditScore: CreditScoreBreakdown;
  benefits: CreditScoreBenefits;
  onViewDetails?: () => void;
  className?: string;
}

export function CommunityCreditScore({ 
  creditScore, 
  benefits, 
  onViewDetails,
  className = '' 
}: CommunityCreditScoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusConfig = SCORE_STATUS_CONFIG[creditScore.status];
  
  const getTrendIcon = () => {
    switch (creditScore.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendText = () => {
    const sign = creditScore.trend === 'up' ? '+' : creditScore.trend === 'down' ? '-' : '';
    return `${sign}${Math.abs(creditScore.trendValue)} điểm`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFactorIcon = (factorId: string) => {
    switch (factorId) {
      case 'transaction_history':
        return <TrendingUp className="w-4 h-4" />;
      case 'voting_participation':
        return <Vote className="w-4 h-4" />;
      case 'ekyc_status':
        return <Shield className="w-4 h-4" />;
      case 'account_age':
        return <Calendar className="w-4 h-4" />;
      case 'community_engagement':
        return <Users className="w-4 h-4" />;
      case 'payment_reliability':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`${className} ${statusConfig.borderColor} border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50`}>
      <CardHeader className={`${statusConfig.bgColor} rounded-t-lg relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white/10"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${benefits.currentTier.color} text-white shadow-lg`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                Điểm Tín Dụng Cộng Đồng
                <Star className="w-5 h-5 ml-2 text-yellow-500" />
              </CardTitle>
              <div className="flex items-center space-x-3 mt-1">
                <Badge variant="outline" className={`${statusConfig.color} border-current font-semibold`}>
                  {benefits.currentTier.name}
                </Badge>
                <span className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(creditScore.lastUpdated)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-900 hover:bg-white/20"
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(creditScore.totalScore)} mb-1`}>
                {creditScore.totalScore}
              </div>
              <div className="text-sm text-gray-500 font-medium">/ 100 điểm</div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Điểm tổng thể</span>
                <Badge variant="secondary" className={`${statusConfig.color} font-bold`}>
                  {creditScore.grade}
                </Badge>
              </div>
              <div className="relative">
                <Progress 
                  value={creditScore.totalScore} 
                  className="h-4 bg-gray-200"
                />
                <div 
                  className={`absolute top-0 left-0 h-4 rounded-full ${getProgressColor(creditScore.totalScore)} transition-all duration-500`}
                  style={{ width: `${creditScore.totalScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              {getTrendIcon()}
              <span className={`text-sm font-semibold ${
                creditScore.trend === 'up' ? 'text-green-600' : 
                creditScore.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {getTrendText()}
              </span>
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              30 ngày qua
            </div>
          </div>
        </div>

        {/* Next Tier Progress */}
        {benefits.nextTier && benefits.pointsToNextTier && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Tiến độ lên hạng {benefits.nextTier.name}
                </span>
              </div>
              <span className="text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                Còn {benefits.pointsToNextTier} điểm
              </span>
            </div>
            <Progress 
              value={(creditScore.totalScore / benefits.nextTier.minScore) * 100} 
              className="h-3 bg-blue-100"
            />
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>{creditScore.totalScore}</span>
              <span>{benefits.nextTier.minScore}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">
              {creditScore.factors.filter(f => f.status === 'excellent').length}
            </div>
            <div className="text-xs text-green-600">Xuất sắc</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">
              {creditScore.factors.filter(f => f.status === 'good').length}
            </div>
            <div className="text-xs text-blue-600">Tốt</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Target className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-700">
              {creditScore.factors.filter(f => ['fair', 'poor', 'critical'].includes(f.status)).length}
            </div>
            <div className="text-xs text-yellow-600">Cần cải thiện</div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Factor Breakdown */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Chi tiết các yếu tố
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditScore.factors.map((factor) => (
                  <div key={factor.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`${factor.color}`}>
                          {getFactorIcon(factor.id)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {factor.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {factor.weight}%
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(factor.currentValue)}`}>
                          {factor.currentValue}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={factor.currentValue} 
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Update */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="text-sm font-semibold text-purple-900">Cập nhật tiếp theo</span>
                  <p className="text-xs text-purple-700">Điểm sẽ được tính toán lại tự động</p>
                </div>
              </div>
              <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                {formatDate(creditScore.nextUpdate)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Info className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Cải thiện điểm
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
