import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Heart,
  Users,
  Gift,
  User,
  Menu,
  X,
  LogOut,
  Gavel
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show navigation on auth pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Gia đình', href: '/family', icon: Heart },
    { name: 'Cộng đồng', href: '/community', icon: Users },
    { name: 'Deals & Đấu Giá', href: '/rewards', icon: Gift },
    { name: 'Đấu giá của tôi', href: '/my-auctions', icon: Gavel },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // For auth pages, render without navigation
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100 relative">
      {/* Background decorative elements with electric blue theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-900/25 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-900/20 to-cyan-400/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-sky-400/15 to-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg shadow-black/5">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo with glassmorphism effect */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  {/* Electric blue glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-900 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
                  {/* Logo container with electric blue gradient */}
                  <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-900 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-bold text-lg drop-shadow-lg">L</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                    Locuno
                  </span>
                  <span className="text-xs text-blue-700/80 font-medium -mt-1">Galaxy Innovation</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation with glassmorphism - Only show if authenticated */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'text-white shadow-lg shadow-cyan-500/30'
                          : 'text-gray-700 hover:text-blue-900'
                      }`}
                    >
                      {/* Active background with electric blue gradient */}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-2xl shadow-lg shadow-cyan-500/25"></div>
                      )}

                      {/* Hover background with electric blue glassmorphism */}
                      {!active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-cyan-300/20"></div>
                      )}

                      {/* Content */}
                      <div className="relative flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-600 group-hover:text-blue-900'} transition-colors duration-300`} />
                        <span className="font-medium">{item.name}</span>
                      </div>

                      {/* Active indicator dot with electric blue */}
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-sm shadow-cyan-300/50"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* User Menu with glassmorphism */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Profile Link with electric blue theme */}
                  <Link
                    to="/profile"
                    className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-2xl backdrop-blur-sm bg-white/10 border border-cyan-200/30 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <div className="relative">
                      <User className="w-4 h-4 text-blue-700 group-hover:text-blue-900 transition-colors duration-300" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-blue-700 group-hover:text-blue-900 transition-colors duration-300">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </Link>

                  {/* Logout Button with red accent */}
                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center space-x-2 px-4 py-2.5 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-red-500/10 hover:border-red-300/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/10"
                  >
                    <LogOut className="w-4 h-4 text-blue-700 group-hover:text-red-600 transition-colors duration-300" />
                    <span className="hidden sm:inline text-sm font-medium text-blue-700 group-hover:text-red-600 transition-colors duration-300">Đăng xuất</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Login Button with electric blue theme */}
                  <Link
                    to="/login"
                    className="group relative flex items-center px-4 py-2.5 rounded-2xl backdrop-blur-sm bg-white/10 border border-cyan-200/30 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900 transition-colors duration-300">
                      Đăng nhập
                    </span>
                  </Link>

                  {/* Register Button with electric blue gradient */}
                  <Link
                    to="/register"
                    className="group relative flex items-center px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-900 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 border border-cyan-300/20"
                  >
                    <span className="relative z-10 text-sm">Đăng ký</span>
                    {/* Electric blue glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-800 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  </Link>
                </div>
              )}

              {/* Mobile menu button with electric blue glassmorphism */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative p-3 rounded-2xl backdrop-blur-sm bg-white/10 border border-cyan-200/30 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-blue-700" />
                ) : (
                  <Menu className="w-5 h-5 text-blue-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation with glassmorphism */}
        {isMobileMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-white/10 border-t border-white/20">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      active
                        ? 'text-white shadow-lg shadow-cyan-500/30'
                        : 'text-blue-700 hover:text-blue-900'
                    }`}
                  >
                    {/* Active background with electric blue */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-2xl shadow-lg shadow-cyan-500/25"></div>
                    )}

                    {/* Hover background with electric blue glassmorphism */}
                    {!active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-cyan-300/20"></div>
                    )}

                    {/* Content */}
                    <div className="relative flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-600 group-hover:text-blue-900'} transition-colors duration-300`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content with proper spacing for fixed header */}
      <main className="relative pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Footer with glassmorphism */}
      <footer className="relative backdrop-blur-xl bg-white/10 border-t border-white/20">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-800 font-medium">© 2025 Locuno</span>
                <span className="text-xs text-blue-600">Galaxy Innovation Hackathon</span>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-blue-600 hover:text-blue-900 transition-colors duration-300">Chính sách bảo mật</Link>
              <Link to="/terms" className="text-blue-600 hover:text-blue-900 transition-colors duration-300">Điều khoản sử dụng</Link>
              <Link to="/support" className="text-blue-600 hover:text-blue-900 transition-colors duration-300">Hỗ trợ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
