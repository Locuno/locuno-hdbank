import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  Plus,
  Send,
  Download
} from 'lucide-react';

export function DashboardPage() {
  const accounts = [
    {
      id: '1',
      name: 'Checking Account',
      number: '****1234',
      balance: 8450.00,
      type: 'checking',
    },
    {
      id: '2',
      name: 'Savings Account',
      number: '****5678',
      balance: 4000.00,
      type: 'savings',
    },
  ];

  const recentTransactions = [
    {
      id: '1',
      description: 'Salary Deposit',
      amount: 2500.00,
      type: 'credit',
      date: '2024-01-15',
      category: 'Income',
    },
    {
      id: '2',
      description: 'Grocery Store',
      amount: -85.50,
      type: 'debit',
      date: '2024-01-14',
      category: 'Food',
    },
    {
      id: '3',
      description: 'Transfer to Savings',
      amount: -500.00,
      type: 'transfer',
      date: '2024-01-13',
      category: 'Transfer',
    },
    {
      id: '4',
      description: 'Online Purchase',
      amount: -129.99,
      type: 'debit',
      date: '2024-01-12',
      category: 'Shopping',
    },
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+2.5%</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
              <p className="text-3xl font-bold text-gray-900">$1,245.50</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">+12.3%</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900">$3,500.00</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Accounts */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Accounts</h2>
              <button className="btn-outline px-4 py-2 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </button>
            </div>
            
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-600">{account.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{account.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full py-3 text-left">
                <Send className="w-4 h-4 mr-3" />
                Send Money
              </button>
              <button className="btn-outline w-full py-3 text-left">
                <Download className="w-4 h-4 mr-3" />
                Download Statement
              </button>
              <button className="btn-outline w-full py-3 text-left">
                <Plus className="w-4 h-4 mr-3" />
                Add Beneficiary
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {recentTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100' 
                        : transaction.type === 'transfer'
                        ? 'bg-blue-100'
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className={`w-4 h-4 text-green-600`} />
                      ) : transaction.type === 'transfer' ? (
                        <ArrowUpRight className={`w-4 h-4 text-blue-600`} />
                      ) : (
                        <ArrowDownLeft className={`w-4 h-4 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-outline w-full mt-4 py-2 text-sm">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
