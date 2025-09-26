import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Award,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  Shield,
  Users,
  CreditCard,
  Vote,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  mockCreditScoreBreakdown,
  mockCreditScoreBenefits
} from '@/data/creditScoreMockData';
import { SCORE_STATUS_CONFIG } from '@/types/creditScore';

export function CreditScoreDetails() {
  const navigate = useNavigate();

  const creditScore = mockCreditScoreBreakdown;
  const benefits = mockCreditScoreBenefits;
  
  const statusConfig = SCORE_STATUS_CONFIG[creditScore.status];
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getFactorIcon = (factorId: string) => {
    switch (factorId) {
      case 'transaction_history':
        return <TrendingUp className="w-5 h-5" />;
      case 'voting_participation':
        return <Vote className="w-5 h-5" />;
      case 'ekyc_status':
        return <Shield className="w-5 h-5" />;
      case 'account_age':
        return <Calendar className="w-5 h-5" />;
      case 'community_engagement':
        return <Users className="w-5 h-5" />;
      case 'payment_reliability':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/community`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Điểm Tín Dụng</h1>
              <p className="text-gray-600">Phân tích chi tiết điểm tín dụng cộng đồng của bạn</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${statusConfig.color} border-current font-semibold`}>
              {benefits.currentTier.name}
            </Badge>
            <div className={`p-3 rounded-full ${benefits.currentTier.color} text-white`}>
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-gray-700">Điểm Tín Dụng Hiện Tại</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(creditScore.totalScore)} mb-4`}>
                {creditScore.totalScore}
              </div>
              <div className="text-lg text-gray-500 mb-4">/ 100 điểm</div>
              <Badge variant="secondary" className={`${statusConfig.color} text-lg px-4 py-2`}>
                {creditScore.grade}
              </Badge>
              <div className="mt-4 flex items-center justify-center space-x-2">
                {creditScore.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : creditScore.trend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
                <span className={`text-sm font-medium ${
                  creditScore.trend === 'up' ? 'text-green-600' : 
                  creditScore.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {creditScore.trend === 'up' ? '+' : creditScore.trend === 'down' ? '-' : ''}
                  {Math.abs(creditScore.trendValue)} điểm (30 ngày)
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Next Tier Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Tiến Độ Lên Hạng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {benefits.nextTier && benefits.pointsToNextTier ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${benefits.currentTier.color} text-white`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{benefits.currentTier.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">Còn {benefits.pointsToNextTier} điểm</span>
                      <div className={`p-2 rounded-full ${benefits.nextTier.color} text-white`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{benefits.nextTier.name}</span>
                    </div>
                  </div>
                  <Progress 
                    value={(creditScore.totalScore / benefits.nextTier.minScore) * 100} 
                    className="h-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{creditScore.totalScore} điểm</span>
                    <span>{benefits.nextTier.minScore} điểm</span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Lợi ích khi lên hạng {benefits.nextTier.name}:</strong> {benefits.nextTier.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chúc mừng!</h3>
                  <p className="text-gray-600">Bạn đã đạt hạng cao nhất trong hệ thống</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Factor Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Phân Tích Chi Tiết Các Yếu Tố
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creditScore.factors.map((factor) => (
                <div key={factor.id} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${factor.color} p-2 bg-gray-50 rounded-lg`}>
                        {getFactorIcon(factor.id)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{factor.name}</h3>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(factor.currentValue)}`}>
                        {factor.currentValue}
                      </div>
                      <div className="text-xs text-gray-500">Trọng số: {factor.weight}%</div>
                    </div>
                  </div>
                  
                  <Progress value={factor.currentValue} className="h-3 mb-4" />
                  
                  {/* Requirements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Yêu cầu:
                    </h4>
                    {factor.requirements.map((req) => (
                      <div key={req.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {req.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className={req.completed ? 'text-green-700' : 'text-yellow-700'}>
                            {req.description}
                          </span>
                        </div>
                        {req.value !== undefined && req.target !== undefined && (
                          <span className={`text-xs font-medium ${req.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                            {req.value}/{req.target} {req.unit}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Tips */}
                  {factor.tips.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 flex items-center mb-2">
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Gợi ý cải thiện:
                      </h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        {factor.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Quyền Lợi & Ưu Đãi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.benefits.map((benefit) => (
                <div 
                  key={benefit.id} 
                  className={`p-4 rounded-lg border-2 ${
                    benefit.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-full ${
                      benefit.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {benefit.available ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        benefit.available ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        {benefit.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          benefit.available ? 'border-green-300 text-green-700' : 'border-gray-300 text-gray-500'
                        }`}
                      >
                        {benefit.available ? 'Đã mở khóa' : `Cần hạng ${benefit.tier}`}
                      </Badge>
                    </div>
                  </div>
                  <p className={`text-sm ${
                    benefit.available ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Update Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Cập nhật lần cuối: {formatDate(creditScore.lastUpdated)}
                  </span>
                  <p className="text-xs text-gray-600">
                    Cập nhật tiếp theo: {formatDate(creditScore.nextUpdate)}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Lịch sử điểm số
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
