import { useState, useEffect } from 'react';
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
import { communityService } from '@/lib/api/community';
import { proposalsApi } from '@/lib/api/proposals';


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
  communityId?: string;
}



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
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentGroup = communityGroups.find(g => g.id === selectedGroup);

  // Fetch communities on component mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await communityService.getUserCommunities();
        
        if (response.success && response.data) {
          setCommunityGroups(response.data.communities);
          // Set first community as selected if available
          if (response.data.communities.length > 0) {
            setSelectedGroup(response.data.communities[0].id);
          }
        } else {
          setError(`Failed to load communities: ${response.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setError('Failed to connect to server. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Fetch proposals when selected community changes
  useEffect(() => {
    const fetchProposals = async () => {
      if (!selectedGroup) {
        setProposals([]);
        return;
      }
      
      try {
        const response = await proposalsApi.getProposals(selectedGroup);
        setProposals(response);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setProposals([]);
        // Note: Error handling for proposals can be added here if needed
      }
    };

    fetchProposals();
  }, [selectedGroup]);

  const getVotePercentage = (proposal: Proposal) => {
    if (!currentGroup) return 0;
    const requiredVotes = Math.ceil(currentGroup.members * 2 / 3);
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

  const handleProposalCreated = async (proposalData: any) => {
    try {
      // For now, add to local state (will be replaced with API call)
      const newProposal: Proposal = {
        ...proposalData,
        communityId: selectedGroup
      };
      setProposals(prev => [newProposal, ...prev]);
      setShowProposalModal(false);
      
      // TODO: Uncomment when backend API is ready
      // const response = await proposalsApi.createProposal({
      //   title: proposalData.title,
      //   description: proposalData.description,
      //   amount: proposalData.amount,
      //   category: proposalData.category,
      //   communityId: selectedGroup
      // });
      // if (response.success) {
      //   setProposals(prev => [response.data, ...prev]);
      //   setShowProposalModal(false);
      // }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Có lỗi xảy ra khi tạo đề xuất. Vui lòng thử lại.');
    }
  };

  const handleVote = async (proposalId: string, voteType: 'approve' | 'reject') => {
    try {
      // For now, update local state (will be replaced with API call)
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          const updatedVotes = {
            ...proposal.votes,
            [voteType]: proposal.votes[voteType] + 1,
            total: proposal.votes.total + 1
          };
          
          // Check if proposal should be approved (2/3 majority)
          const currentGroup = communityGroups.find(g => g.id === selectedGroup);
          const requiredVotes = currentGroup ? Math.ceil((currentGroup.members * 2) / 3) : 1;
          
          let newStatus = proposal.status;
          if (updatedVotes.approve >= requiredVotes) {
            newStatus = 'approved';
          } else if (updatedVotes.reject > (currentGroup?.members || 0) - requiredVotes) {
            newStatus = 'rejected';
          }
          
          return {
            ...proposal,
            votes: updatedVotes,
            status: newStatus
          };
        }
        return proposal;
      }));
      
      alert(`Bạn đã bỏ phiếu ${voteType === 'approve' ? 'đồng ý' : 'từ chối'} thành công!`);
      
      // TODO: Uncomment when backend API is ready
      // const response = await proposalsApi.voteOnProposal({
      //   proposalId,
      //   voteType
      // });
      // if (response.success) {
      //   setProposals(prev => prev.map(p => 
      //     p.id === proposalId ? response.data.proposal : p
      //   ));
      //   alert(`Bạn đã bỏ phiếu ${voteType === 'approve' ? 'đồng ý' : 'từ chối'} thành công!`);
      // }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Có lỗi xảy ra khi bỏ phiếu. Vui lòng thử lại.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu cộng đồng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
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
          <Button 
            size="sm" 
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setShowProposalModal(true)}
          >
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
          {communityGroups.length === 0 && !loading ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có cộng đồng nào</h3>
              <p className="text-gray-500 mb-4">Bạn chưa tham gia hoặc tạo cộng đồng nào. Hãy tạo cộng đồng đầu tiên của bạn!</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo cộng đồng đầu tiên
              </Button>
            </div>
          ) : (
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
          )}
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
                    {proposals.filter(p => p.status === 'pending').length} đề xuất
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
              {proposals.filter(proposal => !proposal.communityId || proposal.communityId === selectedGroup).map((proposal) => {
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200"
                            onClick={() => handleVote(proposal.id, 'reject')}
                          >
                            Từ chối
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVote(proposal.id, 'approve')}
                          >
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

        <Card 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setShowProposalModal(true)}
        >
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
      
      <CreateProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        onProposalCreated={handleProposalCreated}
        communityId={selectedGroup}
        communityName={currentGroup?.name || ''}
      />
    </div>
  );
}
