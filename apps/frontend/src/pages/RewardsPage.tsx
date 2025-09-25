import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Gift,
  Star,
  Trophy,
  Plane,
  MapPin,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Users,
  CreditCard,
  Car,
  ShoppingBag,
  Coffee,
  Utensils,
  Building,
  Sparkles,
  Flame,
  Timer,
  Percent
} from 'lucide-react';

interface UserPoints {
  total: number;
  thisMonth: number;
  familyPoints: number;
  communityPoints: number;
  wellnessPoints: number;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  pointsRequired: number;
  category: 'flight' | 'hotel' | 'restaurant' | 'retail' | 'banking' | 'transport' | 'entertainment' | 'healthcare';
  brand: string;
  validUntil: string;
  available: number;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  discount?: number;
  brandLogo?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

const mockUserPoints: UserPoints = {
  total: 12450,
  thisMonth: 2340,
  familyPoints: 5200,
  communityPoints: 4800,
  wellnessPoints: 2450
};

const mockDeals: Deal[] = [
  // VietJet Air - Flight Deals
  {
    id: '1',
    title: 'Vé máy bay Hà Nội - TP.HCM',
    description: 'VietJet Air - Khuyến mãi đặc biệt cho thành viên Locuno, bao gồm 20kg hành lý ký gửi',
    originalPrice: 2500000,
    discountPrice: 1800000,
    pointsRequired: 8000,
    category: 'flight',
    brand: 'VietJet Air',
    validUntil: '2024-02-15',
    available: 15,
    image: '✈️',
    isHot: true,
    discount: 28,
    brandLogo: '🟠'
  },
  {
    id: '2',
    title: 'Vé máy bay TP.HCM - Đà Nẵng',
    description: 'VietJet Air - Chuyến bay sáng sớm, tiết kiệm thời gian',
    originalPrice: 1800000,
    discountPrice: 1200000,
    pointsRequired: 5500,
    category: 'flight',
    brand: 'VietJet Air',
    validUntil: '2024-02-28',
    available: 8,
    image: '✈️',
    discount: 33,
    brandLogo: '🟠'
  },
  {
    id: '3',
    title: 'Vé máy bay quốc tế Bangkok',
    description: 'VietJet Air - Khám phá Thái Lan với giá ưu đãi',
    originalPrice: 4200000,
    discountPrice: 3100000,
    pointsRequired: 12000,
    category: 'flight',
    brand: 'VietJet Air',
    validUntil: '2024-03-15',
    available: 6,
    image: '✈️',
    isNew: true,
    discount: 26,
    brandLogo: '🟠'
  },

  // HD Bank - Banking & Financial Services
  {
    id: '4',
    title: 'Thẻ tín dụng HD Bank miễn phí',
    description: 'Miễn phí thường niên năm đầu + Cashback 2% cho giao dịch online',
    originalPrice: 500000,
    discountPrice: 0,
    pointsRequired: 2000,
    category: 'banking',
    brand: 'HD Bank',
    validUntil: '2024-12-31',
    available: 50,
    image: '💳',
    isHot: true,
    discount: 100,
    brandLogo: '🔵'
  },
  {
    id: '5',
    title: 'Gói bảo hiểm sức khỏe HD Bank',
    description: 'Bảo hiểm y tế toàn diện với mức phí ưu đãi đặc biệt',
    originalPrice: 3600000,
    discountPrice: 2500000,
    pointsRequired: 9000,
    category: 'healthcare',
    brand: 'HD Bank',
    validUntil: '2024-06-30',
    available: 20,
    image: '🏥',
    discount: 31,
    brandLogo: '🔵'
  },
  {
    id: '6',
    title: 'Vay mua nhà lãi suất ưu đãi',
    description: 'HD Bank - Lãi suất từ 6.5%/năm, hỗ trợ vay đến 85% giá trị nhà',
    originalPrice: 50000000,
    discountPrice: 48000000,
    pointsRequired: 25000,
    category: 'banking',
    brand: 'HD Bank',
    validUntil: '2024-04-30',
    available: 5,
    image: '🏠',
    isLimited: true,
    discount: 4,
    brandLogo: '🔵'
  },

  // Vinpearl - Hotels & Resorts
  {
    id: '7',
    title: 'Vinpearl Resort Phú Quốc - 3N2Đ',
    description: 'Gói nghỉ dưỡng cao cấp bao gồm ăn sáng, spa và vé Vinpearl Safari',
    originalPrice: 8000000,
    discountPrice: 5500000,
    pointsRequired: 15000,
    category: 'hotel',
    brand: 'Vinpearl',
    validUntil: '2024-03-01',
    available: 12,
    image: '🏖️',
    discount: 31,
    brandLogo: '🟢'
  },
  {
    id: '8',
    title: 'Vinpearl Resort Nha Trang - 2N1Đ',
    description: 'Nghỉ dưỡng bên bờ biển với buffet sáng và miễn phí bãi biển riêng',
    originalPrice: 4500000,
    discountPrice: 3200000,
    pointsRequired: 11000,
    category: 'hotel',
    brand: 'Vinpearl',
    validUntil: '2024-02-20',
    available: 8,
    image: '🏖️',
    isHot: true,
    discount: 29,
    brandLogo: '🟢'
  },

  // VinFast - Transportation
  {
    id: '9',
    title: 'VinFast VF5 - Test Drive',
    description: 'Trải nghiệm lái thử xe điện VinFast + Voucher giảm giá 50 triệu',
    originalPrice: 50000000,
    discountPrice: 0,
    pointsRequired: 1000,
    category: 'transport',
    brand: 'VinFast',
    validUntil: '2024-03-31',
    available: 30,
    image: '🚗',
    isNew: true,
    discount: 100,
    brandLogo: '🔴'
  },
  {
    id: '10',
    title: 'VinFast - Gói bảo dưỡng 1 năm',
    description: 'Miễn phí bảo dưỡng định kỳ và sạc pin tại trạm VinFast',
    originalPrice: 15000000,
    discountPrice: 8000000,
    pointsRequired: 18000,
    category: 'transport',
    brand: 'VinFast',
    validUntil: '2024-05-15',
    available: 15,
    image: '🔋',
    discount: 47,
    brandLogo: '🔴'
  },

  // VinMart & VinMart+ - Retail
  {
    id: '11',
    title: 'VinMart - Voucher mua sắm 500K',
    description: 'Áp dụng cho tất cả sản phẩm tại VinMart và VinMart+ toàn quốc',
    originalPrice: 500000,
    discountPrice: 400000,
    pointsRequired: 3000,
    category: 'retail',
    brand: 'VinMart',
    validUntil: '2024-02-29',
    available: 100,
    image: '🛒',
    discount: 20,
    brandLogo: '🟢'
  },
  {
    id: '12',
    title: 'VinMart+ - Combo thực phẩm gia đình',
    description: 'Gói thực phẩm thiết yếu cho gia đình 4 người trong 1 tuần',
    originalPrice: 2000000,
    discountPrice: 1500000,
    pointsRequired: 6000,
    category: 'retail',
    brand: 'VinMart+',
    validUntil: '2024-01-31',
    available: 25,
    image: '🥬',
    isLimited: true,
    discount: 25,
    brandLogo: '🟢'
  },

  // Restaurant & Entertainment
  {
    id: '13',
    title: 'Buffet Lotte Hotel Saigon',
    description: 'Buffet tối cao cấp tại nhà hàng Summit Lounge với view toàn cảnh thành phố',
    originalPrice: 1200000,
    discountPrice: 800000,
    pointsRequired: 3500,
    category: 'restaurant',
    brand: 'Lotte Hotel',
    validUntil: '2024-01-31',
    available: 20,
    image: '🍽️',
    discount: 33,
    brandLogo: '🟡'
  },
  {
    id: '14',
    title: 'Vinpearl Land - Vé vào cổng',
    description: 'Trải nghiệm công viên giải trí hàng đầu Việt Nam với hơn 100 trò chơi',
    originalPrice: 800000,
    discountPrice: 600000,
    pointsRequired: 4000,
    category: 'entertainment',
    brand: 'Vinpearl Land',
    validUntil: '2024-04-15',
    available: 40,
    image: '🎢',
    isHot: true,
    discount: 25,
    brandLogo: '🟢'
  },
  {
    id: '15',
    title: 'Highlands Coffee - Combo đồ uống',
    description: 'Combo 2 đồ uống + 1 bánh ngọt tại Highlands Coffee toàn quốc',
    originalPrice: 200000,
    discountPrice: 150000,
    pointsRequired: 1200,
    category: 'restaurant',
    brand: 'Highlands Coffee',
    validUntil: '2024-02-10',
    available: 200,
    image: '☕',
    discount: 25,
    brandLogo: '🟤'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Người bảo vệ gia đình',
    description: 'Sử dụng tính năng theo dõi gia đình 30 ngày liên tiếp',
    points: 500,
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    completed: true
  },
  {
    id: '2',
    title: 'Công dân tích cực',
    description: 'Tham gia bỏ phiếu 10 đề xuất cộng đồng',
    points: 300,
    icon: <Users className="w-6 h-6 text-blue-500" />,
    completed: false,
    progress: 7,
    maxProgress: 10
  },
  {
    id: '3',
    title: 'Sống khỏe mạnh',
    description: 'Đạt mục tiêu 10,000 bước chân trong 7 ngày',
    points: 200,
    icon: <Target className="w-6 h-6 text-green-500" />,
    completed: false,
    progress: 5,
    maxProgress: 7
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'flight': return <Plane className="w-5 h-5" />;
    case 'hotel': return <MapPin className="w-5 h-5" />;
    case 'restaurant': return <Utensils className="w-5 h-5" />;
    case 'retail': return <ShoppingBag className="w-5 h-5" />;
    case 'banking': return <CreditCard className="w-5 h-5" />;
    case 'transport': return <Car className="w-5 h-5" />;
    case 'entertainment': return <Star className="w-5 h-5" />;
    case 'healthcare': return <Building className="w-5 h-5" />;
    default: return <Gift className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'flight': return 'text-blue-600 bg-blue-100';
    case 'hotel': return 'text-green-600 bg-green-100';
    case 'restaurant': return 'text-orange-600 bg-orange-100';
    case 'retail': return 'text-purple-600 bg-purple-100';
    case 'banking': return 'text-indigo-600 bg-indigo-100';
    case 'transport': return 'text-red-600 bg-red-100';
    case 'entertainment': return 'text-pink-600 bg-pink-100';
    case 'healthcare': return 'text-teal-600 bg-teal-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export function RewardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDeals = selectedCategory === 'all' 
    ? mockDeals 
    : mockDeals.filter(deal => deal.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Safe Deals 1K</h1>
          <p className="text-gray-600">Chuyển đổi hành động tích cực thành giá trị thực</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-600">{mockUserPoints.total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Điểm tích lũy</div>
        </div>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Tổng điểm</p>
                <p className="text-2xl font-bold">{mockUserPoints.total.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trophy className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm gia đình</p>
                <p className="text-lg font-semibold">{mockUserPoints.familyPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm cộng đồng</p>
                <p className="text-lg font-semibold">{mockUserPoints.communityPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm sức khỏe</p>
                <p className="text-lg font-semibold">{mockUserPoints.wellnessPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Thành tích gần đây</CardTitle>
          <CardDescription>Hoàn thành thử thách để nhận điểm thưởng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                      {achievement.completed ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Hoàn thành</span>
                          <span className="text-xs font-semibold text-green-600">+{achievement.points} điểm</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                            <span>{Math.round((achievement.progress! / achievement.maxProgress!) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exclusive Deals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ưu đãi độc quyền</CardTitle>
              <CardDescription>Chỉ dành cho thành viên Locuno từ hệ sinh thái Sovico</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={selectedCategory === 'flight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('flight')}
              >
                Bay
              </Button>
              <Button
                variant={selectedCategory === 'hotel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('hotel')}
              >
                Nghỉ dưỡng
              </Button>
              <Button
                variant={selectedCategory === 'restaurant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('restaurant')}
              >
                Ẩm thực
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                {/* Special Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                  {deal.isHot && (
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
                      <Flame className="w-3 h-3" />
                      <span>HOT</span>
                    </div>
                  )}
                  {deal.isNew && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>MỚI</span>
                    </div>
                  )}
                  {deal.isLimited && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Timer className="w-3 h-3" />
                      <span>GIỚI HẠN</span>
                    </div>
                  )}
                </div>

                {/* Discount Badge */}
                {deal.discount && deal.discount > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                      <Percent className="w-3 h-3" />
                      <span>-{deal.discount}%</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{deal.image}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCategoryColor(deal.category)} shadow-sm`}>
                        {getCategoryIcon(deal.category)}
                        <span>{deal.brand}</span>
                        <span className="text-lg">{deal.brandLogo}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{deal.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                        <span className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                          {formatCurrency(deal.discountPrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-blue-600 font-medium">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{deal.pointsRequired.toLocaleString()} điểm</span>
                        </div>
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 rounded-full">
                          <span className="text-sm text-orange-700 font-bold">
                            Tiết kiệm {Math.round((1 - deal.discountPrice / deal.originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Hết hạn: {deal.validUntil}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${deal.available > 10 ? 'bg-green-500' : deal.available > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span>Còn {deal.available} suất</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Button
                      className={`w-full font-bold transition-all duration-300 ${
                        mockUserPoints.total >= deal.pointsRequired
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      disabled={mockUserPoints.total < deal.pointsRequired}
                    >
                      {mockUserPoints.total >= deal.pointsRequired ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Đổi ngay</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Cần thêm {(deal.pointsRequired - mockUserPoints.total).toLocaleString()} điểm</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Cách tích điểm</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-700">
                <div>
                  <h4 className="font-medium mb-1">Locuno Family</h4>
                  <ul className="space-y-1">
                    <li>• Check-in sức khỏe hàng ngày: 10 điểm</li>
                    <li>• Đạt mục tiêu bước chân: 20 điểm</li>
                    <li>• Giấc ngủ chất lượng: 15 điểm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Locuno Community</h4>
                  <ul className="space-y-1">
                    <li>• Tham gia bỏ phiếu: 25 điểm</li>
                    <li>• Đề xuất được phê duyệt: 100 điểm</li>
                    <li>• Đóng góp quỹ: 50 điểm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Hoạt động đặc biệt</h4>
                  <ul className="space-y-1">
                    <li>• Mời bạn bè tham gia: 200 điểm</li>
                    <li>• Hoàn thành thử thách: 500 điểm</li>
                    <li>• Đánh giá ứng dụng: 50 điểm</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
