import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Users, 
  Vote, 
  TrendingUp,
  Plus,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Eye,
  QrCode,
  Link,

} from 'lucide-react';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';
import { QRCodeModal } from '@/components/QRCodeModal';
import { CreateProposalModal } from '@/components/CreateProposalModal';

interface CommunityGroup {
  id: string;
  name: string;
  type: 'apartment' | 'school' | 'neighborhood';
  members: number;
  balance: number;
  currency: string;
  description?: string;
  joinLink?: string;
  walletId?: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  proposer: string;
  votes: {
    approve: number;
    reject: number;
    total: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  deadline: string;
  category: string;
}

const mockCommunityGroups: CommunityGroup[] = [
  {
    id: '1',
    name: 'Chung cư Vinhomes Central Park - Tòa P1',
    type: 'apartment',
    members: 45,
    balance: 125000000,
    currency: 'VND',
    description: 'Quỹ chung cư tòa P1 để chi trả các khoản bảo trì và sửa chữa',
    joinLink: `${window.location.origin}/community/join/1`,
    walletId: 'apt_vinhomes_p1_240125'
  },
  {
    id: '2',
    name: 'Hội phụ huynh lớp 10A1 - THPT Lê Quý Đôn',
    type: 'school',
    members: 32,
    balance: 15000000,
    currency: 'VND',
    description: 'Quỹ lớp 10A1 cho các hoạt động ngoại khóa và sinh nhật tập thể',
    joinLink: `${window.location.origin}/community/join/2`,
    walletId: 'sch_lequydon_10a1_240120'
  }
];

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Sửa chữa hệ thống thang máy số 2',
    description: 'Thay thế bộ điều khiển và cảm biến an toàn cho thang máy số 2 do hư hỏng',
    amount: 25000000,
    currency: 'VND',
    proposer: 'Ban quản lý tòa nhà',
    votes: { approve: 28, reject: 5, total: 45 },
    status: 'pending',
    deadline: '2024-01-15',
    category: 'Bảo trì'
  },
  {
    id: '2',
    title: 'Tổ chức sinh nhật tập thể tháng 1',
    description: 'Mua bánh kem và trang trí cho buổi sinh nhật tập thể các bạn sinh tháng 1',
    amount: 2500000,
    currency: 'VND',
    proposer: 'Nguyễn Thị Lan',
    votes: { approve: 25, reject: 2, total: 32 },
    status: 'approved',
    deadline: '2024-01-10',
    category: 'Sự kiện'
  }
];

const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
  return `${amount} ${currency}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'approved': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'executed': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Đang bỏ phiếu';
    case 'approved': return 'Đã phê duyệt';
    case 'rejected': return 'Bị từ chối';
    case 'executed': return 'Đã thực hiện';
    default: return 'Không rõ';
  }
};

export function CommunityDashboard() {
  const [selectedGroup, setSelectedGroup] = useState<string>(mockCommunityGroups[0].id);
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>(mockCommunityGroups);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const currentGroup = communityGroups.find(g => g.id === selectedGroup);

  const getVotePercentage = (proposal: Proposal) => {
    const requiredVotes = Math.ceil(currentGroup!.members * 2 / 3);
    return (proposal.votes.approve / requiredVotes) * 100;
  };

  const handleCommunityCreated = (newCommunity: CommunityGroup) => {
    setCommunityGroups(prev => [...prev, newCommunity]);
    setSelectedGroup(newCommunity.id);
  };

  const copyJoinLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const openDepositQR = () => {
    if (currentGroup?.walletId) {
      setShowQRModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locuno Community</h1>
          <p className="text-gray-600">Quản lý quỹ cộng đồng minh bạch và dân chủ</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo cộng đồng
          </Button>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Đề xuất chi tiêu
          </Button>
        </div>
      </div>

      {/* Community Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Cộng đồng của bạn</CardTitle>
          <CardDescription>Chọn cộng đồng để xem chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityGroups.map((group) => (
              <Card
                key={group.id}
                className={`transition-all ${
                  selectedGroup === group.id ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-sm">{group.name}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {group.type === 'apartment' ? 'Chung cư' : 
                         group.type === 'school' ? 'Trường học' : 'Khu phố'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{group.members} thành viên</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(group.balance, group.currency)}
                        </p>
                        <p className="text-xs text-gray-500">Số dư hiện tại</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (group.joinLink) copyJoinLink(group.joinLink);
                      }}
                    >
                      {copiedLink === group.joinLink ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Link className="w-3 h-3 mr-1" />
                      )}
                      {copiedLink === group.joinLink ? 'Đã sao chép' : 'Link tham gia'}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group.id);
                        openDepositQR();
                      }}
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      Nạp tiền
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Overview */}
      {currentGroup && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số dư quỹ</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(currentGroup.balance, currentGroup.currency)}
                  </p>
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
                  <p className="text-sm text-gray-600">Thành viên</p>
                  <p className="text-lg font-semibold">{currentGroup.members} người</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Vote className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đang bỏ phiếu</p>
                  <p className="text-lg font-semibold">
                    {mockProposals.filter(p => p.status === 'pending').length} đề xuất
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ tham gia</p>
                  <p className="text-lg font-semibold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Proposals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Đề xuất chi tiêu</CardTitle>
              <CardDescription>Hệ thống bỏ phiếu 2/3 đa số để phê duyệt</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProposals.map((proposal) => {
              const votePercentage = getVotePercentage(proposal);
              const requiredVotes = Math.ceil(currentGroup!.members * 2 / 3);
              
              return (
                <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {proposal.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Đề xuất bởi: {proposal.proposer}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Hạn: {proposal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(proposal.amount, proposal.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiến độ bỏ phiếu ({proposal.votes.approve}/{requiredVotes} cần thiết)</span>
                      <span>{Math.round(votePercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(votePercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{proposal.votes.approve} đồng ý</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>{proposal.votes.reject} từ chối</span>
                        </div>
                      </div>
                      {proposal.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            Từ chối
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Đồng ý
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Lịch sử giao dịch</h3>
            <p className="text-sm text-gray-600">Xem tất cả giao dịch và báo cáo tài chính</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Tạo đề xuất</h3>
            <p className="text-sm text-gray-600">Đề xuất chi tiêu mới cho cộng đồng</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quản lý thành viên</h3>
            <p className="text-sm text-gray-600">Mời thêm thành viên và phân quyền</p>
          </CardContent>
        </Card>
      </div>

      {/* Transparency Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Minh bạch tuyệt đối</h3>
              <p className="text-blue-700 mb-3">
                Mọi giao dịch đều được ghi lại bất biến trên sổ cái chung:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Tất cả thành viên đều có thể xem mọi giao dịch</li>
                <li>• Hệ thống bỏ phiếu 2/3 đa số đảm bảo dân chủ</li>
                <li>• Không thể chỉnh sửa hoặc xóa lịch sử giao dịch</li>
                <li>• Báo cáo tài chính tự động và thời gian thực</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Modals */}
      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />
      
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        walletId={currentGroup?.walletId || ''}
        amount={100000}
        title={`Nạp tiền vào ${currentGroup?.name}`}
      />
    </div>
  );
}
