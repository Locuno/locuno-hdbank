import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Heart,
  Users,
  Gift,
  ArrowRight,
  CheckCircle,
  Vote,
  Zap,
  Plane,
  Eye
} from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: Heart,
      title: 'Locuno Family',
      description: 'Kết nối gia đình, theo dõi sức khỏe và hệ thống SOS khẩn cấp với mạng lưới hàng xóm đã xác thực.',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: Users,
      title: 'Locuno Community Wallets',
      description: 'Quản lý quỹ cộng đồng minh bạch với hệ thống bỏ phiếu dân chủ 2/3 đa số.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Gift,
      title: 'Safe Deals 1K',
      description: 'Chuyển đổi hành động tích cực thành ưu đãi độc quyền từ hệ sinh thái Sovico.',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Shield,
      title: 'eKYC & Bảo mật',
      description: 'Xác thực danh tính Việt Nam và mã hóa end-to-end cho tất cả dữ liệu nhạy cảm.',
      color: 'text-green-600 bg-green-100'
    },
  ];

  const benefits = [
    'Theo dõi vị trí và sức khỏe gia đình',
    'Hệ thống SOS khẩn cấp với mạng lưới hàng xóm',
    'Quản lý quỹ cộng đồng minh bạch',
    'Bỏ phiếu dân chủ cho mọi chi tiêu',
    'Tích điểm từ hoạt động tích cực',
    'Ưu đãi độc quyền Vietjet, Vinpearl, Lotte',
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Chào mừng đến với <span className="text-blue-600">Locuno</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng tin cậy kỹ thuật số cho gia đình và cộng đồng Việt Nam.
            Kết nối yêu thương, minh bạch tài chính, và chuyển đổi hành động tích cực thành giá trị thực.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
            <Link to="/onboarding">
              Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link to="/login">
              Đăng nhập
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hệ sinh thái tin cậy toàn diện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Locuno kết nối ba trụ cột: Gia đình an toàn, Cộng đồng minh bạch, và Phần thưởng giá trị thực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tất cả trong một nền tảng
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Từ chăm sóc gia đình đến quản lý cộng đồng,
                Locuno cung cấp mọi thứ bạn cần để xây dựng niềm tin và tạo ra giá trị.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/onboarding">
                    Tham gia Locuno ngay
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-500 to-orange-500 text-white border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏆</div>
                      <h3 className="text-xl font-bold mb-2">Safe Deals 1K</h3>
                      <p className="text-blue-100">Điểm tích lũy của bạn</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">12,450 điểm</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">Gia đình</span>
                        </div>
                        <span className="text-sm">+250 điểm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Cộng đồng</span>
                        </div>
                        <span className="text-sm">+180 điểm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm">Sức khỏe</span>
                        </div>
                        <span className="text-sm">+120 điểm</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ưu đãi có sẵn</span>
                        <div className="flex items-center space-x-1">
                          <Plane className="w-4 h-4" />
                          <span className="text-sm">Vietjet 30% off</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Xây dựng niềm tin qua minh bạch
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Locuno cam kết minh bạch tuyệt đối trong mọi hoạt động.
              Mọi giao dịch, bỏ phiếu, và dữ liệu đều có thể kiểm tra được.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Minh bạch 100%</h3>
              <p className="text-blue-100">Mọi giao dịch đều công khai và có thể kiểm tra</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dân chủ thực sự</h3>
              <p className="text-blue-100">Hệ thống bỏ phiếu 2/3 đa số cho mọi quyết định</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bảo mật tuyệt đối</h3>
              <p className="text-blue-100">eKYC Việt Nam và mã hóa end-to-end</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              <Link to="/onboarding">
                Tham gia cộng đồng tin cậy
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sovico Ecosystem */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Được hỗ trợ bởi hệ sinh thái Sovico
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tận hưởng ưu đãi độc quyền từ Vietjet, Vinpearl, Lotte và các thương hiệu hàng đầu
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-4xl">✈️</div>
            <div className="text-4xl">🏖️</div>
            <div className="text-4xl">🍽️</div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
      </section>
    </div>
  );
}
