import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ArrowRightCircle, 
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 

  Transaction, 
  TransactionSummary,
  formatTransactionAmount,
  getTransactionTypeText,
  getTransactionStatusText,
  getTransactionStatusColor
} from '@/lib/api/transactions';
import { mockGetTransactions } from '@/data/transactionMockData'; // Import the mock function

interface TransactionHistoryProps {
  communityId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionHistory({ communityId, isOpen, onClose }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<Transaction['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Transaction['status'] | 'all'>('all');

  const fetchTransactions = async (pageNum: number = 1) => {
    if (!communityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const options: any = {
        page: pageNum,
        limit: 10
      };
      
      if (filterType !== 'all') options.type = filterType;
      if (filterStatus !== 'all') options.status = filterStatus;
      
      // Use the mock function instead of the real API
      const response = await mockGetTransactions(options);
      
      if (response.success && response.data) {
        setTransactions(response.data.transactions);
        setSummary(response.data.summary);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to load transactions');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && communityId) {
      fetchTransactions(1);
    }
  }, [isOpen, communityId, filterType, filterStatus]);

  const handleRefresh = () => {
    fetchTransactions(page);
  };

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
      case 'transfer': return <ArrowRightCircle className="w-5 h-5 text-blue-600" />;
      case 'proposal_payment': return <FileText className="w-5 h-5 text-purple-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lịch sử giao dịch</h2>
              <p className="text-cyan-100">Theo dõi tất cả giao dịch của cộng đồng</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng nạp</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatTransactionAmount(summary.totalDeposits, summary.currency)}
                      </p>
                    </div>
                    <ArrowDownCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng rút</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatTransactionAmount(summary.totalWithdrawals, summary.currency)}
                      </p>
                    </div>
                    <ArrowUpCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Số dư hiện tại</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatTransactionAmount(summary.balance, summary.currency)}
                      </p>
                    </div>
                    <ArrowRightCircle className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng giao dịch</p>
                      <p className="text-lg font-bold text-purple-600">
                        {summary.transactionCount}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="p-6 border-b bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="deposit">Nạp tiền</option>
                  <option value="withdrawal">Rút tiền</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="proposal_payment">Thanh toán đề xuất</option>
                </select>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="failed">Thất bại</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có giao dịch nào</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {getTransactionTypeText(transaction.type)}
                              </h4>
                              <Badge className={`text-xs ${getTransactionStatusColor(transaction.status)}`}>
                                {getStatusIcon(transaction.status)}
                                <span className="ml-1">{getTransactionStatusText(transaction.status)}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{transaction.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(transaction.timestamp).toLocaleString('vi-VN')}
                              </span>
                              <span>ID: {transaction.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.type === 'deposit' ? 'text-green-600' : 
                            transaction.type === 'withdrawal' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                            {formatTransactionAmount(transaction.amount, transaction.currency)}
                          </p>
                          {transaction.metadata?.transactionRef && (
                            <p className="text-xs text-gray-500">
                              Ref: {transaction.metadata.transactionRef}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Trang {page} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || loading}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
