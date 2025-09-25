import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Gavel,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Trophy,
  Timer,
  ArrowLeft,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuctionBid {
  id: string;
  dealId: string;
  dealTitle: string;
  dealImage: string;
  brand: string;
  category: string;
  originalPrice: number;
  myBidAmount: number;
  currentHighestBid: number;
  winningBid?: number;
  status: 'active' | 'won' | 'lost' | 'ended';
  auctionEndTime: string;
  bidTime: string;
  totalBids: number;
  myBidRank: number;
  isWinner: boolean;
}

const mockMyBids: AuctionBid[] = [
  {
    id: '1',
    dealId: '1',
    dealTitle: 'Vé máy bay Hà Nội - TP.HCM',
    dealImage: '✈️',
    brand: 'VietJet Air',
    category: 'flight',
    originalPrice: 2500000,
    myBidAmount: 1350000,
    currentHighestBid: 1450000,
    status: 'active',
    auctionEndTime: '2024-01-28T23:59:59',
    bidTime: '2024-01-25T14:30:00',
    totalBids: 52,
    myBidRank: 3,
    isWinner: false
  },
  {
    id: '2',
    dealId: '4',
    dealTitle: 'Thẻ tín dụng HD Bank miễn phí',
    dealImage: '💳',
    brand: 'HD Bank',
    category: 'banking',
    originalPrice: 500000,
    myBidAmount: 25000,
    currentHighestBid: 25000,
    winningBid: 25000,
    status: 'won',
    auctionEndTime: '2024-01-24T18:00:00',
    bidTime: '2024-01-24T17:45:00',
    totalBids: 28,
    myBidRank: 1,
    isWinner: true
  },
  {
    id: '3',
    dealId: '8',
    dealTitle: 'Vinpearl Resort Nha Trang - 2N1Đ',
    dealImage: '🏖️',
    brand: 'Vinpearl',
    category: 'hotel',
    originalPrice: 4500000,
    myBidAmount: 2900000,
    currentHighestBid: 3100000,
    winningBid: 3100000,
    status: 'lost',
    auctionEndTime: '2024-01-23T20:00:00',
    bidTime: '2024-01-23T15:20:00',
    totalBids: 95,
    myBidRank: 4,
    isWinner: false
  },
  {
    id: '4',
    dealId: '9',
    dealTitle: 'VinFast VF5 Test Drive + Voucher 50M',
    dealImage: '🚗',
    brand: 'VinFast',
    category: 'transport',
    originalPrice: 50000000,
    myBidAmount: 15000,
    currentHighestBid: 18000,
    status: 'ended',
    auctionEndTime: '2024-01-22T16:00:00',
    bidTime: '2024-01-22T10:30:00',
    totalBids: 156,
    myBidRank: 8,
    isWinner: false
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-blue-600 bg-blue-100';
    case 'won': return 'text-green-600 bg-green-100';
    case 'lost': return 'text-red-600 bg-red-100';
    case 'ended': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Đang diễn ra';
    case 'won': return 'Thắng cuộc';
    case 'lost': return 'Thua cuộc';
    case 'ended': return 'Đã kết thúc';
    default: return 'Không xác định';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <Clock className="w-4 h-4" />;
    case 'won': return <Trophy className="w-4 h-4" />;
    case 'lost': return <XCircle className="w-4 h-4" />;
    case 'ended': return <Timer className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export function MyAuctionsPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredBids = selectedFilter === 'all' 
    ? mockMyBids 
    : mockMyBids.filter(bid => bid.status === selectedFilter);

  const stats = {
    total: mockMyBids.length,
    active: mockMyBids.filter(bid => bid.status === 'active').length,
    won: mockMyBids.filter(bid => bid.status === 'won').length,
    lost: mockMyBids.filter(bid => bid.status === 'lost').length,
    totalSpent: mockMyBids.filter(bid => bid.isWinner).reduce((sum, bid) => sum + bid.myBidAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 sm:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/rewards')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đấu giá của tôi</h1>
            <p className="text-gray-600">Theo dõi các cuộc đấu giá bạn đã tham gia</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Gavel className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Tổng đấu giá</div>
              </div>
              <Gavel className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-orange-100">Đang diễn ra</div>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.won}</div>
                <div className="text-sm text-green-100">Thắng cuộc</div>
              </div>
              <Trophy className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.lost}</div>
                <div className="text-sm text-red-100">Thua cuộc</div>
              </div>
              <XCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent).replace('₫', '')}</div>
                <div className="text-sm text-purple-100">Tổng chi tiêu</div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Lọc theo trạng thái</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tất cả', icon: <Gavel className="w-4 h-4" /> },
              { key: 'active', label: 'Đang diễn ra', icon: <Clock className="w-4 h-4" /> },
              { key: 'won', label: 'Thắng cuộc', icon: <Trophy className="w-4 h-4" /> },
              { key: 'lost', label: 'Thua cuộc', icon: <XCircle className="w-4 h-4" /> },
              { key: 'ended', label: 'Đã kết thúc', icon: <Timer className="w-4 h-4" /> }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.key)}
                className="flex items-center space-x-2"
              >
                {filter.icon}
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auction Bids List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gavel className="w-5 h-5" />
            <span>Danh sách đấu giá ({filteredBids.length})</span>
          </CardTitle>
          <CardDescription>
            Theo dõi chi tiết các cuộc đấu giá bạn đã tham gia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <Card key={bid.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{bid.dealImage}</div>
                      <div>
                        <h3 className="font-bold text-lg">{bid.dealTitle}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{bid.brand}</span>
                          <span>•</span>
                          <Calendar className="w-4 h-4" />
                          <span>Đấu giá: {new Date(bid.bidTime).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(bid.status)}`}>
                      {getStatusIcon(bid.status)}
                      <span>{getStatusText(bid.status)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Giá gốc</div>
                      <div className="font-bold text-gray-500 line-through">{formatCurrency(bid.originalPrice)}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">Giá đấu của bạn</div>
                      <div className="font-bold text-blue-700">{formatCurrency(bid.myBidAmount)}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm text-orange-600 mb-1">
                        {bid.status === 'active' ? 'Giá cao nhất hiện tại' : 'Giá thắng cuộc'}
                      </div>
                      <div className="font-bold text-orange-700">
                        {formatCurrency(bid.winningBid || bid.currentHighestBid)}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">Thứ hạng của bạn</div>
                      <div className="font-bold text-purple-700 flex items-center space-x-1">
                        <span>#{bid.myBidRank}</span>
                        <span className="text-sm">/ {bid.totalBids}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{bid.totalBids} lượt đấu giá</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>Kết thúc: {new Date(bid.auctionEndTime).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {bid.status === 'won' && (
                      <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Chúc mừng! Bạn đã thắng</span>
                      </div>
                    )}

                    {bid.status === 'active' && bid.myBidRank === 1 && (
                      <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        <Trophy className="w-4 h-4" />
                        <span className="font-medium">Bạn đang dẫn đầu!</span>
                      </div>
                    )}

                    {bid.status === 'active' && bid.myBidRank > 1 && (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => navigate('/rewards')}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Đấu giá thêm
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBids.length === 0 && (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đấu giá nào</h3>
              <p className="text-gray-600 mb-4">
                {selectedFilter === 'all'
                  ? 'Bạn chưa tham gia đấu giá nào. Hãy khám phá các deal hấp dẫn!'
                  : `Không có đấu giá nào với trạng thái "${getStatusText(selectedFilter)}"`
                }
              </p>
              <Button
                onClick={() => navigate('/rewards')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Gavel className="w-4 h-4 mr-2" />
                Khám phá đấu giá
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
