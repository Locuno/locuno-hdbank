import { Link } from 'react-router-dom';
import { 
  Shield, 
  Smartphone, 
  Clock, 
  CreditCard,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your money and data are protected with enterprise-level security measures.',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Access your accounts anywhere, anytime with our responsive design.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer service.',
    },
    {
      icon: CreditCard,
      title: 'Easy Transfers',
      description: 'Send money instantly to friends, family, or businesses with just a few taps.',
    },
  ];

  const benefits = [
    'No monthly maintenance fees',
    'Free ATM withdrawals worldwide',
    'Real-time transaction notifications',
    'Advanced budgeting tools',
    'Instant account setup',
    'Multi-currency support',
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Banking Made
              <span className="block text-primary-200">Simple & Secure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Experience the future of digital banking with HD Bank. 
              Manage your finances with confidence, anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HD Bank?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional banking values 
              to deliver an exceptional experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything you need in one place
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                From everyday banking to advanced financial tools, 
                HD Bank provides everything you need to manage your money effectively.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link
                  to="/login"
                  className="btn-primary px-6 py-3 rounded-lg font-semibold"
                >
                  Open Account Today
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-primary-200">Total Balance</span>
                    <span className="text-2xl font-bold">$12,450.00</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Checking Account</span>
                      <span>$8,450.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Savings Account</span>
                      <span>$4,000.00</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary-400">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recent Transaction</span>
                      <span className="text-sm text-green-300">+$250.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust HD Bank 
            with their financial future.
          </p>
          <Link
            to="/login"
            className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
          >
            Open Your Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
