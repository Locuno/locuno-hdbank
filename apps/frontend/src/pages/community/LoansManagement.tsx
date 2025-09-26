import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Filter,
  Search,
  Plus,
  TrendingUp,

  DollarSign,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Building,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoanCard } from '@/components/LoanCard';
import { mockIndividualLoans } from '@/data/individualLoansMockData';
import { mockCommunityLoans } from '@/data/communityLoansMockData';
import { LoanApplication, CommunityLoan, LoanStatus } from '@/types/loans';

export function LoansManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'individual' | 'community'>('all');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all loans
  const allLoans: (LoanApplication | CommunityLoan)[] = [
    ...mockIndividualLoans,
    ...mockCommunityLoans
  ];

  // Filter loans
  const filteredLoans = allLoans.filter(loan => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'individual' && !('projectTitle' in loan)) ||
      (activeTab === 'community' && 'projectTitle' in loan);
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    const matchesSearch = searchTerm === '' || 
      loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ('projectTitle' in loan && loan.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTab && matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusCount = (status: LoanStatus) => {
    return allLoans.filter(loan => loan.status === status).length;
  };

  const getTotalStats = () => {
    const totalAmount = allLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalPaid = allLoans.reduce((sum, loan) => sum + loan.totalPaid, 0);
    const activeLoans = allLoans.filter(loan => loan.status === 'active').length;
    const overdueLoans = allLoans.filter(loan => loan.status === 'overdue').length;
    
    return {
      totalLoans: allLoans.length,
      totalAmount,
      totalPaid,
      activeLoans,
      overdueLoans,
      collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/community')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khoản Vay</h1>
              <p className="text-gray-600">Theo dõi và quản lý tất cả khoản vay cá nhân và cộng đồng</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Tạo khoản vay mới
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Tổng khoản vay</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalLoans}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Tổng giá trị</p>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.activeLoans}</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Quá hạn</p>
                  <p className="text-2xl font-bold text-red-900">{stats.overdueLoans}</p>
                </div>
                <div className="p-3 bg-red-200 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc và tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Tab Filter */}
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                >
                  Tất cả ({allLoans.length})
                </Button>
                <Button
                  variant={activeTab === 'individual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('individual')}
                  className="flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Cá nhân ({mockIndividualLoans.length})</span>
                </Button>
                <Button
                  variant={activeTab === 'community' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('community')}
                  className="flex items-center space-x-1"
                >
                  <Building className="w-4 h-4" />
                  <span>Cộng đồng ({mockCommunityLoans.length})</span>
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter('all')}
                >
                  Tất cả
                </Badge>
                <Badge
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  className="cursor-pointer text-green-600"
                  onClick={() => setStatusFilter('active')}
                >
                  Đang vay ({getStatusCount('active')})
                </Badge>
                <Badge
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  className="cursor-pointer text-yellow-600"
                  onClick={() => setStatusFilter('pending')}
                >
                  Chờ duyệt ({getStatusCount('pending')})
                </Badge>
                <Badge
                  variant={statusFilter === 'overdue' ? 'default' : 'outline'}
                  className="cursor-pointer text-red-600"
                  onClick={() => setStatusFilter('overdue')}
                >
                  Quá hạn ({getStatusCount('overdue')})
                </Badge>
                <Badge
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  className="cursor-pointer text-blue-600"
                  onClick={() => setStatusFilter('completed')}
                >
                  Hoàn thành ({getStatusCount('completed')})
                </Badge>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên người vay hoặc dự án..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách khoản vay ({filteredLoans.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Tỷ lệ thu hồi: {stats.collectionRate.toFixed(1)}%</span>
            </div>
          </div>

          {filteredLoans.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy khoản vay nào
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onViewDetails={() => {
                    // Navigate to loan details page
                    console.log('View loan details:', loan.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
