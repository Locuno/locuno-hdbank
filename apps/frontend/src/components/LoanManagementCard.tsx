import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { mockIndividualLoans, mockIndividualLoanStats } from '@/data/individualLoansMockData';
import { mockCommunityLoans, mockCommunityLoanStats } from '@/data/communityLoansMockData';

interface LoanManagementCardProps {
  communityId: string;
  creditScore?: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function LoanManagementCard(_props: LoanManagementCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'individual' | 'community'>('overview');

  // Get combined stats
  const allLoans = [...mockIndividualLoans, ...mockCommunityLoans];
  const totalStats = {
    totalLoans: allLoans.length,
    totalAmount: allLoans.reduce((sum, loan) => sum + loan.amount, 0),
    totalPaid: allLoans.reduce((sum, loan) => sum + loan.totalPaid, 0),
    activeLoans: allLoans.filter(loan => loan.status === 'active').length,
    overdueLoans: allLoans.filter(loan => loan.status === 'overdue').length,
    completedLoans: allLoans.filter(loan => loan.status === 'completed').length,
  };

  const recentLoans = allLoans
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 3);

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Quản Lý Khoản Vay</span>
            </CardTitle>
            <CardDescription>
              Theo dõi và quản lý tất cả khoản vay trong cộng đồng
            </CardDescription>
          </div>
          <Button
            onClick={() => navigate('/community/loans')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem tất cả
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-900">{totalStats.totalLoans}</div>
            <div className="text-xs text-blue-600">Tổng khoản vay</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-green-900">
              {formatCurrency(totalStats.totalAmount)}
            </div>
            <div className="text-xs text-green-600">Tổng giá trị</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <CheckCircle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-900">{totalStats.activeLoans}</div>
            <div className="text-xs text-orange-600">Đang hoạt động</div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-red-900">{totalStats.overdueLoans}</div>
            <div className="text-xs text-red-600">Quá hạn</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'individual'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('individual')}
          >
            Cá nhân ({mockIndividualLoans.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'community'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('community')}
          >
            Cộng đồng ({mockCommunityLoans.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Khoản vay gần đây</h4>
            <div className="space-y-3">
              {recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="font-medium text-sm">
                        {'projectTitle' in loan ? (loan as any).projectTitle : loan.borrowerName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(loan.amount)} • {loan.termMonths} tháng
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {loan.status === 'active' ? 'Đang vay' :
                     loan.status === 'completed' ? 'Hoàn thành' :
                     loan.status === 'overdue' ? 'Quá hạn' : 'Chờ duyệt'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Trung bình mỗi khoản</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatCurrency(mockIndividualLoanStats.averageAmount)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Tỷ lệ thu hồi</div>
                <div className="text-lg font-bold text-green-900">
                  {mockIndividualLoanStats.collectionRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Lãi suất trung bình: {mockIndividualLoanStats.averageInterestRate.toFixed(1)}%/tháng
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600">Người thụ hưởng</div>
                <div className="text-lg font-bold text-purple-900">
                  {mockCommunityLoanStats.totalBeneficiaries.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-600">Tiến độ trung bình</div>
                <div className="text-lg font-bold text-indigo-900">
                  {mockCommunityLoanStats.averageProgressPercentage.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Lãi suất ưu đãi: {mockCommunityLoanStats.averageInterestRate.toFixed(1)}%/tháng
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Lịch thanh toán
          </Button>
          <Button variant="outline" className="flex-1">
            <Clock className="w-4 h-4 mr-2" />
            Báo cáo tháng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
