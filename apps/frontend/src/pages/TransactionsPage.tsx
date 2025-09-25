import { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Download,
  Search,
  Calendar
} from 'lucide-react';

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const transactions = [
    {
      id: '1',
      description: 'Salary Deposit - ABC Corp',
      amount: 2500.00,
      type: 'credit',
      date: '2025-01-15T10:30:00Z',
      category: 'Income',
      account: 'Checking ****1234',
      status: 'completed',
    },
    {
      id: '2',
      description: 'Grocery Store - Fresh Market',
      amount: -85.50,
      type: 'debit',
      date: '2025-01-14T16:45:00Z',
      category: 'Food & Dining',
      account: 'Checking ****1234',
      status: 'completed',
    },
    {
      id: '3',
      description: 'Transfer to Savings Account',
      amount: -500.00,
      type: 'transfer',
      date: '2025-01-13T09:15:00Z',
      category: 'Transfer',
      account: 'Checking ****1234',
      status: 'completed',
    },
    {
      id: '4',
      description: 'Online Purchase - Amazon',
      amount: -129.99,
      type: 'debit',
      date: '2025-01-12T14:20:00Z',
      category: 'Shopping',
      account: 'Checking ****1234',
      status: 'completed',
    },
    {
      id: '5',
      description: 'ATM Withdrawal',
      amount: -100.00,
      type: 'debit',
      date: '2025-01-11T18:30:00Z',
      category: 'Cash',
      account: 'Checking ****1234',
      status: 'completed',
    },
    {
      id: '6',
      description: 'Interest Payment',
      amount: 15.75,
      type: 'credit',
      date: '2025-01-10T00:00:00Z',
      category: 'Interest',
      account: 'Savings ****5678',
      status: 'completed',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && transaction.type === selectedFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      default:
        return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'bg-green-100';
      case 'transfer':
        return 'bg-blue-100';
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">View and manage your transaction history</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-outline px-4 py-2 text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn-primary px-4 py-2 text-sm">
            New Transfer
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input text-sm"
              >
                <option value="all">All Types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>
            
            <button className="btn-outline px-3 py-2 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card p-6">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)} at {formatTime(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No transactions match "${searchTerm}"`
                : 'No transactions match the selected filters'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex space-x-2">
              <button className="btn-outline px-3 py-2 text-sm" disabled>
                Previous
              </button>
              <button className="btn-outline px-3 py-2 text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
