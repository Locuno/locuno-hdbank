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
  category: 'flight' | 'hotel' | 'restaurant' | 'retail';
  brand: string;
  validUntil: string;
  available: number;
  image: string;
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
  {
    id: '1',
    title: 'Vé máy bay Hà Nội - TP.HCM',
    description: 'Vietjet Air - Khuyến mãi đặc biệt cho thành viên Locuno',
    originalPrice: 2500000,
    discountPrice: 1800000,
    pointsRequired: 8000,
    category: 'flight',
    brand: 'Vietjet',
    validUntil: '2024-02-15',
    available: 5,
    image: '✈️'
  },
  {
    id: '2',
    title: 'Vinpearl Resort Phú Quốc - 3N2Đ',
    description: 'Gói nghỉ dưỡng cao cấp bao gồm ăn sáng và spa',
    originalPrice: 8000000,
    discountPrice: 5500000,
    pointsRequired: 15000,
    category: 'hotel',
    brand: 'Vinpearl',
    validUntil: '2024-03-01',
    available: 2,
    image: '🏖️'
  },
  {
    id: '3',
    title: 'Buffet Lotte Hotel Saigon',
    description: 'Buffet tối cao cấp tại nhà hàng Summit Lounge',
    originalPrice: 1200000,
    discountPrice: 800000,
    pointsRequired: 3500,
    category: 'restaurant',
    brand: 'Lotte',
    validUntil: '2024-01-31',
    available: 10,
    image: '🍽️'
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
    case 'restaurant': return <Gift className="w-5 h-5" />;
    default: return <Gift className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'flight': return 'text-blue-600 bg-blue-100';
    case 'hotel': return 'text-green-600 bg-green-100';
    case 'restaurant': return 'text-orange-600 bg-orange-100';
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
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-4xl">{deal.image}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCategoryColor(deal.category)}`}>
                        {getCategoryIcon(deal.category)}
                        <span>{deal.brand}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{deal.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(deal.discountPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cần {deal.pointsRequired.toLocaleString()} điểm</span>
                        <span className="text-sm text-orange-600 font-medium">
                          Tiết kiệm {Math.round((1 - deal.discountPrice / deal.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Hết hạn: {deal.validUntil}</span>
                      </div>
                      <span>Còn {deal.available} suất</span>
                    </div>
                  </div>
                  
                  <div className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      disabled={mockUserPoints.total < deal.pointsRequired}
                    >
                      {mockUserPoints.total >= deal.pointsRequired ? 'Đổi ngay' : 'Không đủ điểm'}
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
