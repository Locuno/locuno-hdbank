import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import {
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Calculator,
  Banknote
} from 'lucide-react';

interface LoanStatus {
  principal: number;
  outstanding: number;
  interestRate: number;
  nextDueDate: string;
  schedule: Array<{
    dueDate: string;
    amount: number;
    paid: boolean;
  }>;
  status: 'none' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted';
}

interface LoanManagementCardProps {
  communityId: string;
  creditScore?: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getLoanStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'disbursed':
    case 'active': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'defaulted': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getLoanStatusText = (status: string) => {
  switch (status) {
    case 'none': return 'Chưa có khoản vay';
    case 'approved': return 'Đã phê duyệt';
    case 'disbursed': return 'Đã giải ngân';
    case 'active': return 'Đang hoạt động';
    case 'completed': return 'Đã hoàn thành';
    case 'defaulted': return 'Quá hạn';
    default: return status;
  }
};

export function LoanManagementCard({ communityId, creditScore, balance }: LoanManagementCardProps) {
  const [loanStatus, setLoanStatus] = useState<LoanStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    amount: '',
    term: '12'
  });
  const [repaymentAmount, setRepaymentAmount] = useState('');

  const fetchLoanStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/communities/${communityId}/loan/status`);
      
      if (response.data.success && response.data.data) {
        setLoanStatus(response.data.data);
      } else {
        setError(response.data.message || 'Không thể tải thông tin khoản vay');
      }
    } catch (err: any) {
      console.error('Error fetching loan status:', err);
      if (err.response?.status === 404) {
        // No loan exists yet
        setLoanStatus({
          principal: 0,
          outstanding: 0,
          interestRate: 0.01,
          nextDueDate: '',
          schedule: [],
          status: 'none'
        });
      } else {
        setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyForLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/api/communities/${communityId}/loan/apply`, {
        amount: parseFloat(applicationData.amount),
        term: parseInt(applicationData.term),
      });
      
      if (response.data.success) {
        await fetchLoanStatus();
        setShowApplication(false);
        setApplicationData({ amount: '', term: '12' });
      } else {
        setError(response.data.message || 'Không thể xử lý đơn vay');
      }
    } catch (err: any) {
      console.error('Error applying for loan:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const disburseLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/api/communities/${communityId}/loan/disburse`);
      
      if (response.data.success) {
        await fetchLoanStatus();
      } else {
        setError(response.data.message || 'Không thể giải ngân khoản vay');
      }
    } catch (err: any) {
      console.error('Error disbursing loan:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const repayLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/api/communities/${communityId}/loan/repay`, {
        amount: parseFloat(repaymentAmount),
      });
      
      if (response.data.success) {
        await fetchLoanStatus();
        setRepaymentAmount('');
      } else {
        setError(response.data.message || 'Không thể xử lý thanh toán');
      }
    } catch (err: any) {
      console.error('Error repaying loan:', err);
      setError(err.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchLoanStatus();
    }
  }, [communityId]);

  const canApplyForLoan = creditScore && creditScore >= 60;
  const maxLoanAmount = Math.floor(balance * 0.3); // 30% of current balance

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Quản Lý Khoản Vay</span>
            </CardTitle>
            <CardDescription>
              Khoản vay cộng đồng được hỗ trợ bởi ngân hàng
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLoanStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Cập nhật
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tải thông tin khoản vay...</p>
          </div>
        ) : loanStatus ? (
          <div className="space-y-6">
            {/* Current Loan Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Banknote className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái khoản vay</p>
                  <Badge className={getLoanStatusColor(loanStatus.status)}>
                    {getLoanStatusText(loanStatus.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            {loanStatus.status !== 'none' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Số tiền gốc</p>
                  <p className="text-lg font-semibold">{formatCurrency(loanStatus.principal)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Còn lại</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {formatCurrency(loanStatus.outstanding)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Lãi suất</p>
                  <p className="text-lg font-semibold">{(loanStatus.interestRate * 100).toFixed(1)}%/tháng</p>
                </div>
                {loanStatus.nextDueDate && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Kỳ hạn tiếp theo</p>
                    <p className="text-lg font-semibold">
                      {new Date(loanStatus.nextDueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {loanStatus.status === 'none' && (
                <div className="space-y-3">
                  {!canApplyForLoan ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <p className="text-yellow-800 text-sm">
                          Cần điểm tín dụng ≥ 60 để đăng ký khoản vay
                        </p>
                      </div>
                      <p className="text-yellow-700 text-sm mt-2">
                        Điểm hiện tại: {creditScore || 'Chưa có'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {!showApplication ? (
                        <Button onClick={() => setShowApplication(true)} className="w-full">
                          <Calculator className="w-4 h-4 mr-2" />
                          Đăng ký khoản vay
                        </Button>
                      ) : (
                        <div className="space-y-4 border rounded-lg p-4">
                          <h4 className="font-medium">Đăng ký khoản vay cộng đồng</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Số tiền (VND)</label>
                              <Input
                                type="number"
                                placeholder="Nhập số tiền"
                                value={applicationData.amount}
                                onChange={(e) => setApplicationData({
                                  ...applicationData,
                                  amount: e.target.value
                                })}
                                max={maxLoanAmount}
                              />
                              <p className="text-xs text-gray-500">
                                Tối đa: {formatCurrency(maxLoanAmount)}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Kỳ hạn (tháng)</label>
                              <select
                                className="w-full p-2 border rounded-md"
                                value={applicationData.term}
                                onChange={(e) => setApplicationData({
                                  ...applicationData,
                                  term: e.target.value
                                })}
                              >
                                <option value="6">6 tháng</option>
                                <option value="12">12 tháng</option>
                                <option value="18">18 tháng</option>
                                <option value="24">24 tháng</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={applyForLoan}
                              disabled={!applicationData.amount || loading}
                              className="flex-1"
                            >
                              Gửi đơn
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowApplication(false)}
                              className="flex-1"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {loanStatus.status === 'approved' && (
                <Button onClick={disburseLoan} disabled={loading} className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Giải ngân khoản vay
                </Button>
              )}

              {(loanStatus.status === 'active' || loanStatus.status === 'disbursed') && loanStatus.outstanding > 0 && (
                <div className="space-y-3 border rounded-lg p-4">
                  <h4 className="font-medium">Thanh toán khoản vay</h4>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Số tiền thanh toán"
                      value={repaymentAmount}
                      onChange={(e) => setRepaymentAmount(e.target.value)}
                      max={loanStatus.outstanding}
                    />
                    <Button
                      onClick={repayLoan}
                      disabled={!repaymentAmount || loading}
                    >
                      Thanh toán
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tối đa: {formatCurrency(loanStatus.outstanding)}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Schedule */}
            {loanStatus.schedule && loanStatus.schedule.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Lịch thanh toán</span>
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {loanStatus.schedule.map((payment, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 rounded border ${
                        payment.paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {payment.paid ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm">
                          {new Date(payment.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        payment.paid ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không có thông tin khoản vay</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}