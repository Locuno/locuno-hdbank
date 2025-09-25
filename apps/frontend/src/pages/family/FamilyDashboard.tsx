
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { familyService, FamilyCircle, FamilyMember as ApiFamilyMember } from '@/lib/api/family';

import {
  MapPin,
  Activity,
  Shield,
  Users,
  AlertTriangle,
  Plus,
  Settings,
  Moon,
  Footprints,
  Clock,
  Mail,
  X
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'elderly';
  avatar: string;
  status: 'safe' | 'active' | 'sleeping' | 'alert';
  location: string;
  lastSeen: string;
  wellness: {
    sleep: number;
    steps: number;
    heartRate?: number;
  };
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Mẹ - Nguyễn Thị Lan',
    role: 'parent',
    avatar: '👩‍💼',
    status: 'active',
    location: 'Văn phòng, Quận 1',
    lastSeen: '2 phút trước',
    wellness: {
      sleep: 7.5,
      steps: 8420,
      heartRate: 72
    }
  },
  {
    id: '2',
    name: 'Con - Nguyễn Minh An',
    role: 'child',
    avatar: '👦',
    status: 'safe',
    location: 'Trường THPT Lê Quý Đôn',
    lastSeen: '15 phút trước',
    wellness: {
      sleep: 8.2,
      steps: 12500
    }
  },
  {
    id: '3',
    name: 'Ông - Nguyễn Văn Hùng',
    role: 'elderly',
    avatar: '👴',
    status: 'sleeping',
    location: 'Nhà, Quận 7',
    lastSeen: '1 giờ trước',
    wellness: {
      sleep: 6.8,
      steps: 3200,
      heartRate: 68
    }
  }
];



export function FamilyDashboard() {

  const [currentFamily, setCurrentFamily] = useState<FamilyCircle | null>(null);
  const [familyMembers, setFamilyMembers] = useState<ApiFamilyMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user's families on component mount
  useEffect(() => {
    loadFamilies();
  }, []);

  // Load family members when current family changes
  useEffect(() => {
    if (currentFamily) {
      loadFamilyMembers(currentFamily.id);
    }
  }, [currentFamily]);

  const loadFamilies = async () => {
    try {
      const result = await familyService.getUserFamilies();
      if (result.success && result.data) {
        // Set the first family as current if available
        if (result.data.families.length > 0) {
          setCurrentFamily(result.data.families[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load families:', error);
    }
  };

  const loadFamilyMembers = async (familyId: string) => {
    try {
      const result = await familyService.getFamilyMembers(familyId);
      if (result.success && result.data) {
        setFamilyMembers(result.data.members);
      }
    } catch (error) {
      console.error('Failed to load family members:', error);
    }
  };

  const handleInviteMember = async () => {
    if (!currentFamily || !inviteEmail.trim()) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await familyService.inviteMember(currentFamily.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });

      if (result.success) {
        setSuccess('Lời mời đã được gửi thành công!');
        setInviteEmail('');
        setShowInviteModal(false);
        // Reload family members to show the invitation
        loadFamilyMembers(currentFamily.id);
      } else {
        setError(result.message || 'Không thể gửi lời mời');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi lời mời');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locuno Family</h1>
          <p className="text-gray-600">Kết nối và chăm sóc gia đình bạn</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            SOS Khẩn cấp
          </Button>
        </div>
      </div>

      {/* Family Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tình trạng gia đình</p>
                <p className="text-lg font-semibold text-green-600">Tất cả an toàn</p>
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
                <p className="text-lg font-semibold">{mockFamilyMembers.length} người</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giấc ngủ TB</p>
                <p className="text-lg font-semibold">7.5 giờ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Footprints className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bước chân TB</p>
                <p className="text-lg font-semibold">8,040</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Thành viên gia đình</CardTitle>
              <CardDescription>Theo dõi vị trí và sức khỏe của từng thành viên</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm thành viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.length > 0 ? familyMembers.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'invited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'active' ? 'Hoạt động' :
                         member.status === 'invited' ? 'Đã mời' : 'Tạm dừng'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Tham gia {new Date(member.joinedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Quyền hạn:</span>
                      <div className="flex items-center space-x-1">
                        {member.permissions.canViewLocation && (
                          <MapPin className="w-4 h-4 text-green-600" />
                        )}
                        {member.permissions.canReceiveAlerts && (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                        {member.permissions.canManageMembers && (
                          <Settings className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có thành viên nào trong gia đình</p>
                <p className="text-sm">Nhấn "Thêm thành viên" để mời người khác tham gia</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Vị trí gia đình</h3>
            <p className="text-sm text-gray-600">Xem vị trí thời gian thực của tất cả thành viên</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Báo cáo sức khỏe</h3>
            <p className="text-sm text-gray-600">Theo dõi các chỉ số sức khỏe và hoạt động</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Mạng lưới hàng xóm</h3>
            <p className="text-sm text-gray-600">Kết nối với hàng xóm đã xác thực eKYC</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency SOS Info */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Hệ thống SOS Khẩn cấp</h3>
              <p className="text-red-700 mb-3">
                Trong trường hợp khẩn cấp, nhấn nút SOS để thông báo ngay lập tức cho:
              </p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Tất cả thành viên gia đình</li>
                <li>• Mạng lưới hàng xóm đã xác thực (bán kính 2km)</li>
                <li>• Dịch vụ cấp cứu địa phương</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {success}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mời thành viên mới</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email người được mời
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="member">Thành viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Thành viên:</strong> Có thể xem thông tin gia đình và nhận cảnh báo</p>
                <p><strong>Quản trị viên:</strong> Có thể quản lý thành viên và cài đặt gia đình</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleInviteMember}
                disabled={isLoading || !inviteEmail.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Gửi lời mời
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
