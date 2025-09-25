import { CreditCard, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);

  const accounts = [
    {
      id: '1',
      name: 'Primary Checking',
      number: '1234567890',
      balance: 8450.00,
      type: 'checking',
      status: 'active',
      openDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'High-Yield Savings',
      number: '0987654321',
      balance: 4000.00,
      type: 'savings',
      status: 'active',
      openDate: '2023-02-20',
    },
    {
      id: '3',
      name: 'Business Account',
      number: '5555666677',
      balance: 12750.50,
      type: 'business',
      status: 'active',
      openDate: '2023-06-10',
    },
  ];

  const formatAccountNumber = (number: string) => {
    return `****${number.slice(-4)}`;
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'business':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your bank accounts and view balances</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="btn-outline px-4 py-2 text-sm"
          >
            {showBalances ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Balances
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Balances
              </>
            )}
          </button>
          <button className="btn-primary px-4 py-2 text-sm">
            Open New Account
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map((account) => (
          <div key={account.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">{formatAccountNumber(account.number)}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalances 
                  ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : '••••••'
                }
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccountTypeColor(account.type)}`}>
                {account.type}
              </span>
              <span className="text-xs text-gray-500">
                Opened {new Date(account.openDate).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="btn-primary flex-1 py-2 text-sm">
                  Transfer
                </button>
                <button className="btn-outline flex-1 py-2 text-sm">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Summary Table */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <CreditCard className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{formatAccountNumber(account.number)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccountTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {showBalances 
                      ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : '••••••'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-primary-600 hover:text-primary-900">
                        Transfer
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
