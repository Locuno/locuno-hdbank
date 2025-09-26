import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import {
  TrendingUp,
  Minus,
  RefreshCw,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface CreditScore {
  value: number;
  reasons: string[];
  updatedAt: string;
}

interface CreditScoreCardProps {
  communityId: string;
  onScoreUpdate?: (score: CreditScore) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

const getScoreStatus = (score: number) => {
  if (score >= 80) return 'Xuất sắc';
  if (score >= 60) return 'Tốt';
  if (score >= 40) return 'Trung bình';
  return 'Cần cải thiện';
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (score >= 60) return <TrendingUp className="w-5 h-5 text-yellow-600" />;
  if (score >= 40) return <Minus className="w-5 h-5 text-orange-600" />;
  return <AlertTriangle className="w-5 h-5 text-red-600" />;
};

export function CreditScoreCard({ communityId, onScoreUpdate }: CreditScoreCardProps) {
  const [score, setScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScore = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/communities/${communityId}/credit/score`);
      
      if (response.data.success && response.data.data) {
        setScore(response.data.data);
        onScoreUpdate?.(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải điểm tín dụng');
      }
    } catch (err: any) {
      console.error('Error fetching credit score:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const computeScore = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/api/communities/${communityId}/credit/score`);
      
      if (response.data.success && response.data.data) {
        setScore(response.data.data);
        onScoreUpdate?.(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tính toán điểm tín dụng');
      }
    } catch (err: any) {
      console.error('Error computing credit score:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchScore();
    }
  }, [communityId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>Điểm Tín Dụng Cộng Đồng</span>
              {score && getScoreIcon(score.value)}
            </CardTitle>
            <CardDescription>
              Đánh giá khả năng tín dụng dựa trên hoạt động cộng đồng
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={computeScore}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Cập nhật
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchScore} variant="outline" size="sm">
              Thử lại
            </Button>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tính toán điểm tín dụng...</p>
          </div>
        ) : score ? (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(score.value)} mb-4`}>
                <span className={`text-3xl font-bold ${getScoreColor(score.value)}`}>
                  {score.value}
                </span>
              </div>
              <div className="space-y-1">
                <Badge variant="secondary" className={getScoreColor(score.value)}>
                  {getScoreStatus(score.value)}
                </Badge>
                <p className="text-sm text-gray-600">
                  Cập nhật lần cuối: {formatDate(score.updatedAt)}
                </p>
              </div>
            </div>

            {/* Score Factors */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-500" />
                <h4 className="font-medium text-sm">Các yếu tố ảnh hưởng:</h4>
              </div>
              <div className="space-y-2">
                {score.reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-sm text-blue-800 mb-2">Cách cải thiện điểm số:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Duy trì tần suất nạp tiền đều đặn</li>
                <li>• Tăng số lượng thành viên tham gia</li>
                <li>• Giữ số dư ổn định và tăng trưởng</li>
                <li>• Tích cực tham gia bỏ phiếu đề xuất</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Chưa có dữ liệu điểm tín dụng</p>
            <Button onClick={computeScore} size="sm">
              Tính toán điểm số
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}