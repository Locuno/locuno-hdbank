import { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  X, 
  RefreshCw,
  User,
  Building,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoanApplication, CommunityLoan, LOAN_STATUS_CONFIG } from '@/types/loans';

interface LoanCardProps {
  loan: LoanApplication | CommunityLoan;
  onViewDetails?: () => void;
  className?: string;
}

export function LoanCard({ loan, onViewDetails, className = '' }: LoanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = LOAN_STATUS_CONFIG[loan.status];
  const isCommunityLoan = 'projectTitle' in loan;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusIcon = () => {
    switch (loan.status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'restructured':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = () => {
    if (loan.status === 'completed') return 100;
    if (loan.status === 'rejected' || loan.status === 'cancelled') return 0;
    return Math.round((loan.totalPaid / loan.amount) * 100);
  };

  const getPurposeLabel = (purpose: string) => {
    const purposeLabels: { [key: string]: string } = {
      'mua_xe_may': 'Mua xe máy',
      'sua_nha': 'Sửa nhà',
      'kinh_doanh_nho': 'Kinh doanh nhỏ',
      'hoc_phi': 'Học phí',
      'benh_vien': 'Viện phí',
      'cuoi_hoi': 'Cưới hỏi',
      'tang_le': 'Tang lễ',
      'mua_dien_thoai': 'Mua điện thoại',
      'du_lich': 'Du lịch',
      'dau_tu_vang': 'Đầu tư vàng',
      'tra_no': 'Trả nợ',
      'xay_cau': 'Xây cầu',
      'sua_duong': 'Sửa đường',
      'he_thong_nuoc': 'Hệ thống nước',
      'truong_hoc': 'Trường học',
      'trung_tam_y_te': 'Trung tâm y tế',
      'san_the_thao': 'Sân thể thao',
      'cho_dan_sinh': 'Chợ dân sinh',
      'nha_van_hoa': 'Nhà văn hóa'
    };
    return purposeLabels[purpose] || purpose;
  };

  return (
    <Card className={`${className} ${statusConfig.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
      <CardHeader className={`${statusConfig.bgColor} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${statusConfig.color} bg-white/20`}>
              {isCommunityLoan ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {isCommunityLoan ? (loan as CommunityLoan).projectTitle : loan.borrowerName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={`${statusConfig.color} border-current text-xs`}>
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-gray-600">
                  {getPurposeLabel(loan.purpose)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`${statusConfig.color}`}>
              {getStatusIcon()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Main Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-blue-900">Số tiền vay</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(loan.amount)}
            </div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-green-900">Lãi suất</div>
            <div className="text-lg font-bold text-green-700">
              {loan.interestRate}%/tháng
            </div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-purple-900">Thời hạn</div>
            <div className="text-lg font-bold text-purple-700">
              {loan.termMonths} tháng
            </div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-orange-900">Tiến độ</div>
            <div className="text-lg font-bold text-orange-700">
              {getProgressPercentage()}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tiến độ thanh toán</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(loan.totalPaid)} / {formatCurrency(loan.amount)}
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-3" />
        </div>

        {/* Community Loan Specific Info */}
        {isCommunityLoan && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Dự án cộng đồng
                </span>
              </div>
              <span className="text-sm text-blue-700">
                {(loan as CommunityLoan).beneficiaries} người thụ hưởng
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600">Tiến độ dự án</span>
              <span className="text-xs font-medium text-blue-700">
                {(loan as CommunityLoan).progressPercentage}%
              </span>
            </div>
            <Progress 
              value={(loan as CommunityLoan).progressPercentage} 
              className="h-2 mt-1"
            />
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Borrower Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Thông tin {isCommunityLoan ? 'dự án' : 'người vay'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">SĐT:</span>
                  <span className="font-medium">{loan.borrowerPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Nghề nghiệp:</span>
                  <span className="font-medium">{loan.borrowerJob}</span>
                </div>
                <div className="flex items-start space-x-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium">{loan.borrowerAddress}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Thông tin thanh toán
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Trả hàng tháng:</span>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(loan.monthlyPayment)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <div className="font-semibold text-blue-600">
                    {loan.paymentsCount}/{loan.termMonths} kỳ
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Còn lại:</span>
                  <div className="font-semibold text-orange-600">
                    {formatCurrency(loan.remainingBalance)}
                  </div>
                </div>
              </div>
            </div>

            {/* Community Loan Project Details */}
            {isCommunityLoan && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Chi tiết dự án
                </h4>
                <div className="text-sm space-y-2">
                  <p className="text-gray-700">
                    {(loan as CommunityLoan).projectDescription}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600">Quản lý dự án:</span>
                      <div className="font-medium">{(loan as CommunityLoan).projectManager}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Thời gian thực hiện:</span>
                      <div className="font-medium">{(loan as CommunityLoan).projectDuration} tháng</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Thời gian
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Ngày đăng ký:</span>
                  <div className="font-medium">{formatDate(loan.applicationDate)}</div>
                </div>
                {loan.approvalDate && (
                  <div>
                    <span className="text-gray-600">Ngày duyệt:</span>
                    <div className="font-medium">{formatDate(loan.approvalDate)}</div>
                  </div>
                )}
                {loan.dueDate && (
                  <div>
                    <span className="text-gray-600">Ngày đến hạn:</span>
                    <div className="font-medium">{formatDate(loan.dueDate)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {loan.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Ghi chú:</span>
                <p className="text-sm text-gray-600 mt-1">{loan.notes}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button
                onClick={onViewDetails}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Xem chi tiết đầy đủ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
