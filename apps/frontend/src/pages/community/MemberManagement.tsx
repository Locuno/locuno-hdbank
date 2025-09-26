import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Mail, 
  Phone, 
  Shield, 
  MoreVertical,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AddMemberModal } from '@/components/AddMemberModal';
import { memberService } from '@/lib/api/member';
import { communityService } from '@/lib/api/community';

interface Member {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  invitedBy?: string;
}

interface CommunityInfo {
  id: string;
  name: string;
  type: string;
  members: number;
}

export function MemberManagement() {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [communityInfo, setCommunityInfo] = useState<CommunityInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      loadData();
    }
  }, [communityId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load community info and members in parallel
      const [communityResult, membersResult] = await Promise.all([
        communityService.getCommunityById(communityId!),
        memberService.getMembers(communityId!)
      ]);

      if (communityResult.success && communityResult.data) {
        setCommunityInfo(communityResult.data.community);
      }

      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data.members);
      } else {
        setError(membersResult.message || 'Không thể tải danh sách thành viên');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: { email: string; phoneNumber: string; role: 'admin' | 'member' | 'viewer' }) => {
    try {
      const result = await memberService.inviteMember(communityId!, memberData);
      
      if (result.success) {
        // Reload members list
        await loadData();
        setShowAddModal(false);
        // Show success notification (you can implement toast notification here)
        alert('Thêm thành viên thành công!');
      } else {
        alert(result.message || 'Có lỗi xảy ra khi thêm thành viên');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Có lỗi xảy ra khi thêm thành viên');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      return;
    }

    try {
      const result = await memberService.removeMember(communityId!, memberId);
      
      if (result.success) {
        await loadData();
        alert('Xóa thành viên thành công!');
      } else {
        alert(result.message || 'Có lỗi xảy ra khi xóa thành viên');
      }
    } catch (err) {
      console.error('Error removing member:', err);
      alert('Có lỗi xảy ra khi xóa thành viên');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'member':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Shield className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'member':
        return 'Thành viên';
      case 'viewer':
        return 'Người xem';
      default:
        return 'Không xác định';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'invited':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đã mời</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Tạm khóa</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/community')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý thành viên</h1>
            {communityInfo && (
              <p className="text-gray-600">
                {communityInfo.name} • {members.length} thành viên
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thành viên
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Danh sách thành viên</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành viên nào</h3>
              <p className="text-gray-500 mb-4">Hãy mời thành viên đầu tiên vào cộng đồng!</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm thành viên đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {member.firstName && member.lastName 
                            ? `${member.firstName} ${member.lastName}`
                            : member.email || 'Chưa có tên'
                          }
                        </h3>
                        {getRoleIcon(member.role)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {member.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.phoneNumber && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{member.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {getRoleName(member.role)}
                      </div>
                      {getStatusBadge(member.status)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Xóa thành viên
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
        communityName={communityInfo?.name || ''}
      />
    </div>
  );
}
