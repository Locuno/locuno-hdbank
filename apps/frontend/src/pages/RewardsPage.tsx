import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
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

  Utensils,
  Building,
  Sparkles,
  Flame,
  Timer,
  Percent,
  Wallet,
  Gavel,
  QrCode,
  CheckCircle,
  X,
  Plus,
  Minus
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
  isAuction?: boolean;
  auctionStartPrice?: number;
  currentBid?: number;
  auctionEndTime?: string;
  bidCount?: number;
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
    validUntil: '2025-02-15',
    available: 15,
    image: '✈️',
    isHot: true,
    discount: 28,
    brandLogo: '🟠',
    isAuction: true,
    auctionStartPrice: 1000,
    currentBid: 1250000,
    auctionEndTime: '2025-01-28T23:59:59',
    bidCount: 47
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
    validUntil: '2025-02-28',
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
    validUntil: '2025-03-15',
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
    validUntil: '2025-12-31',
    available: 50,
    image: '💳',
    isHot: true,
    discount: 100,
    brandLogo: '🔵',
    isAuction: true,
    auctionStartPrice: 1000,
    currentBid: 15000,
    auctionEndTime: '2025-01-30T18:00:00',
    bidCount: 23
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
    validUntil: '2025-06-30',
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
    validUntil: '2025-04-30',
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
    validUntil: '2025-03-01',
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
    validUntil: '2025-02-20',
    available: 8,
    image: '🏖️',
    isHot: true,
    discount: 29,
    brandLogo: '🟢',
    isAuction: true,
    auctionStartPrice: 1000,
    currentBid: 2800000,
    auctionEndTime: '2025-01-29T20:00:00',
    bidCount: 89
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
    validUntil: '2025-03-31',
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
    validUntil: '2025-05-15',
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
    validUntil: '2025-02-29',
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
    validUntil: '2025-01-31',
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
    validUntil: '2025-01-31',
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
    validUntil: '2025-04-15',
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
    validUntil: '2025-02-10',
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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [purchaseMethod, setPurchaseMethod] = useState<'wallet' | 'qr'>('wallet');

  const filteredDeals = selectedCategory === 'all'
    ? mockDeals
    : mockDeals.filter(deal => deal.category === selectedCategory);

  const handlePurchase = (deal: Deal, method: 'wallet' | 'qr') => {
    setSelectedDeal(deal);
    setPurchaseMethod(method);
    if (method === 'qr') {
      setShowQRModal(true);
    } else {
      setShowPurchaseModal(true);
    }
  };

  const handleAuction = (deal: Deal) => {
    setSelectedDeal(deal);
    setBidAmount(((deal.currentBid || deal.auctionStartPrice || 1000) + 1000).toString());
    setShowAuctionModal(true);
  };

  const confirmPurchase = () => {
    if (selectedDeal) {
      alert(`Đã mua thành công "${selectedDeal.title}" bằng ${purchaseMethod === 'wallet' ? 'ví gia đình/cộng đồng' : 'QR code'}!`);
      setShowPurchaseModal(false);
      setShowQRModal(false);
      setSelectedDeal(null);
    }
  };

  const confirmBid = () => {
    if (selectedDeal && bidAmount) {
      alert(`Đã đặt giá thành công ${parseInt(bidAmount).toLocaleString()} VND cho "${selectedDeal.title}"!`);
      setShowAuctionModal(false);
      setSelectedDeal(null);
      setBidAmount('');
      // Navigate to My Auctions page after successful bid
      setTimeout(() => {
        navigate('/my-auctions');
      }, 1000);
    }
  };

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

      {/* Hot Auction Deals */}
      <Card className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">🔥 Đấu giá HOT - Bắt đầu từ 1,000 VND</CardTitle>
                <CardDescription className="text-yellow-100">
                  Cơ hội sở hữu deal độc quyền với giá không thể tin được!
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-yellow-100">Đang diễn ra</div>
              <div className="text-lg font-bold text-white animate-pulse">
                {filteredDeals.filter(deal => deal.isAuction).length} cuộc đấu giá
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDeals.filter(deal => deal.isAuction).slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="rounded-lg p-4 border border-white border-opacity-20 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, #FFD600 0%, #FF6F00 50%, #FF1744 100%)',
                  boxShadow: '0 4px 24px 0 rgba(255, 107, 0, 0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{deal.image}</span>
                  <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-red-500">{deal.brand}</span>
                  </div>
                </div>
                <h4 className="font-bold text-white mb-1 text-sm">{deal.title}</h4>
                <div className="flex items-center justify-between text-xs text-white mb-2">
                  <span>Giá hiện tại:</span>
                  <span className="font-bold text-yellow-200">{formatCurrency(deal.currentBid || 1000)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-300" />
                    <span>{deal.bidCount || 0} lượt đấu</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Timer className="w-3 h-3 text-red-300" />
                    <span>Còn {Math.ceil((new Date(deal.auctionEndTime || '').getTime() - new Date().getTime()) / (1000 * 60 * 60))}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Star className="w-4 h-4 mr-1" />
                Tất cả
              </Button>
              <Button
                variant={selectedCategory === 'flight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('flight')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Plane className="w-4 h-4 mr-1" />
                VietJet Air
              </Button>
              <Button
                variant={selectedCategory === 'banking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('banking')}
                className="transition-all duration-200 hover:scale-105"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                HD Bank
              </Button>
              <Button
                variant={selectedCategory === 'hotel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('hotel')}
                className="transition-all duration-200 hover:scale-105"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Vinpearl
              </Button>
              <Button
                variant={selectedCategory === 'transport' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('transport')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Car className="w-4 h-4 mr-1" />
                VinFast
              </Button>
              <Button
                variant={selectedCategory === 'retail' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('retail')}
                className="transition-all duration-200 hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                VinMart
              </Button>
              <Button
                variant={selectedCategory === 'restaurant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('restaurant')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Utensils className="w-4 h-4 mr-1" />
                Ẩm thực
              </Button>
              <Button
                variant={selectedCategory === 'entertainment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('entertainment')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Star className="w-4 h-4 mr-1" />
                Giải trí
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
                  {deal.isAuction && (
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-bounce">
                      <Gavel className="w-3 h-3" />
                      <span>ĐẤU GIÁ</span>
                    </div>
                  )}
                  {deal.isHot && !deal.isAuction && (
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
                      {deal.isAuction ? (
                        <>
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-yellow-800">Giá khởi điểm</span>
                              <span className="text-sm text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-yellow-700">Giá hiện tại</span>
                              <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(deal.currentBid || deal.auctionStartPrice || 1000)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-1 text-blue-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>{deal.bidCount || 0} lượt đấu giá</span>
                              </div>
                              <div className="flex items-center space-x-1 text-red-600">
                                <Timer className="w-4 h-4" />
                                <span>Kết thúc: {new Date(deal.auctionEndTime || '').toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 line-through">{formatCurrency(deal.originalPrice)}</span>
                            <span className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                              {formatCurrency(deal.discountPrice)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-sm text-blue-600 font-medium">
                              <Wallet className="w-4 h-4" />
                              <span>Ví gia đình/cộng đồng</span>
                            </div>
                            <div className="bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 rounded-full">
                              <span className="text-sm text-orange-700 font-bold">
                                Tiết kiệm {Math.round((1 - deal.discountPrice / deal.originalPrice) * 100)}%
                              </span>
                            </div>
                          </div>
                        </>
                      )}
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
                    {deal.isAuction ? (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleAuction(deal)}
                          className="w-full font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Gavel className="w-4 h-4" />
                            <span>Đấu giá ngay</span>
                          </div>
                        </Button>
                        <div className="text-xs text-center text-gray-500">
                          Bắt đầu từ 1,000 VND
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handlePurchase(deal, 'wallet')}
                          className="w-full font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Wallet className="w-4 h-4" />
                            <span>Mua bằng ví gia đình/cộng đồng</span>
                          </div>
                        </Button>
                        <Button
                          onClick={() => handlePurchase(deal, 'qr')}
                          className="w-full font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <QrCode className="w-4 h-4" />
                            <span>Mua bằng QR Code</span>
                          </div>
                        </Button>
                      </div>
                    )}
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

      {/* Purchase Modal */}
      {showPurchaseModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Xác nhận mua hàng</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPurchaseModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedDeal.image}</span>
                <div>
                  <h4 className="font-medium">{selectedDeal.title}</h4>
                  <p className="text-sm text-gray-600">{selectedDeal.brand}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Giá gốc:</span>
                  <span className="line-through text-gray-500">{formatCurrency(selectedDeal.originalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Giá ưu đãi:</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedDeal.discountPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phương thức:</span>
                  <span className="font-medium text-blue-600">Ví gia đình/cộng đồng</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={confirmPurchase}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Xác nhận mua
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Thanh toán QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-gray-100 p-8 rounded-lg mb-4">
                  <div className="w-32 h-32 bg-black mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Quét mã QR để thanh toán</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium">{selectedDeal.title}</h4>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedDeal.discountPrice)}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowQRModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={confirmPurchase}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Đã thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auction Modal */}
      {showAuctionModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Đấu giá sản phẩm</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuctionModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedDeal.image}</span>
                <div>
                  <h4 className="font-medium">{selectedDeal.title}</h4>
                  <p className="text-sm text-gray-600">{selectedDeal.brand}</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-center mb-2">
                  <span>Giá hiện tại:</span>
                  <span className="font-bold text-yellow-700">{formatCurrency(selectedDeal.currentBid || selectedDeal.auctionStartPrice || 1000)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Số lượt đấu:</span>
                  <span className="text-blue-600">{selectedDeal.bidCount || 0} lượt</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kết thúc:</span>
                  <span className="text-red-600">{new Date(selectedDeal.auctionEndTime || '').toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Giá đấu của bạn (VND):</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount((parseInt(bidAmount || '0') - 1000).toString())}
                    disabled={parseInt(bidAmount || '0') <= (selectedDeal.currentBid || selectedDeal.auctionStartPrice || 1000)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min={(selectedDeal.currentBid || selectedDeal.auctionStartPrice || 1000) + 1000}
                    step="1000"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount((parseInt(bidAmount || '0') + 1000).toString())}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu: {formatCurrency((selectedDeal.currentBid || selectedDeal.auctionStartPrice || 1000) + 1000)}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAuctionModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  onClick={confirmBid}
                  disabled={!bidAmount || parseInt(bidAmount) <= (selectedDeal.currentBid || selectedDeal.auctionStartPrice || 1000)}
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Đặt giá
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
