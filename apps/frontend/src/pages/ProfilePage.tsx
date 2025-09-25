import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  MapPin, 
  Heart,
  Users,
  Settings,
  Edit,
  Check,
  X,
  Phone,
  Mail,
  Home,
  Calendar
} from 'lucide-react';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  idNumber: string;
  avatar: string;
  role: 'family' | 'community' | 'both';
  eKYCVerified: boolean;
  joinedDate: string;
}

interface PrivacySettings {
  shareLocation: boolean;
  shareWellness: boolean;
  allowEmergencyContact: boolean;
  communityNotifications: boolean;
  familyNotifications: boolean;
  marketingEmails: boolean;
}

const mockUserProfile: UserProfile = {
  id: '1',
  fullName: 'Nguyễn Văn An',
  email: 'nguyen.van.an@email.com',
  phone: '+84 901 234 567',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  dateOfBirth: '1985-03-15',
  idNumber: '079085001234',
  avatar: '👨‍💼',
  role: 'both',
  eKYCVerified: true,
  joinedDate: '2024-01-01'
};

const mockPrivacySettings: PrivacySettings = {
  shareLocation: true,
  shareWellness: true,
  allowEmergencyContact: true,
  communityNotifications: true,
  familyNotifications: true,
  marketingEmails: false
};

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [privacy, setPrivacy] = useState<PrivacySettings>(mockPrivacySettings);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockUserProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const togglePrivacySetting = (key: keyof PrivacySettings) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin và cài đặt bảo mật</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt nâng cao
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{profile.avatar}</div>
              <div>
                <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  {profile.eKYCVerified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span>Đã xác thực eKYC</span>
                    </div>
                  )}
                  <span>•</span>
                  <span>Tham gia từ {new Date(profile.joinedDate).toLocaleDateString('vi-VN')}</span>
                </CardDescription>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Họ và tên</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.fullName}
                    onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{profile.fullName}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Số điện thoại</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Địa chỉ</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ngày sinh</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Số CCCD/CMND</label>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="font-mono">***********{profile.idNumber.slice(-3)}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Đã xác thực</span>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role & Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Vai trò và sở thích</CardTitle>
          <CardDescription>Tùy chỉnh trải nghiệm Locuno của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Bạn đang sử dụng Locuno cho:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`cursor-pointer transition-all ${profile.role === 'family' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Chỉ gia đình</h3>
                    <p className="text-xs text-gray-600">Theo dõi sức khỏe và an toàn</p>
                  </CardContent>
                </Card>
                <Card className={`cursor-pointer transition-all ${profile.role === 'community' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Chỉ cộng đồng</h3>
                    <p className="text-xs text-gray-600">Quản lý quỹ và hoạt động</p>
                  </CardContent>
                </Card>
                <Card className={`cursor-pointer transition-all ${profile.role === 'both' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center space-x-1 mb-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold">Cả hai</h3>
                    <p className="text-xs text-gray-600">Trải nghiệm đầy đủ + Rewards</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt quyền riêng tư</CardTitle>
          <CardDescription>Kiểm soát thông tin bạn chia sẻ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Chia sẻ dữ liệu</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Chia sẻ vị trí</p>
                      <p className="text-sm text-gray-600">Cho phép gia đình xem vị trí của bạn</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.shareLocation ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('shareLocation')}
                  >
                    {privacy.shareLocation ? 'Bật' : 'Tắt'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Chia sẻ dữ liệu sức khỏe</p>
                      <p className="text-sm text-gray-600">Chia sẻ thông tin giấc ngủ và hoạt động</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.shareWellness ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('shareWellness')}
                  >
                    {privacy.shareWellness ? 'Bật' : 'Tắt'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Liên hệ khẩn cấp</p>
                      <p className="text-sm text-gray-600">Cho phép hàng xóm liên hệ khi khẩn cấp</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.allowEmergencyContact ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('allowEmergencyContact')}
                  >
                    {privacy.allowEmergencyContact ? 'Bật' : 'Tắt'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thông báo gia đình</p>
                      <p className="text-sm text-gray-600">Cập nhật về hoạt động gia đình</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.familyNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('familyNotifications')}
                  >
                    {privacy.familyNotifications ? 'Bật' : 'Tắt'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thông báo cộng đồng</p>
                      <p className="text-sm text-gray-600">Bỏ phiếu và hoạt động cộng đồng</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.communityNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('communityNotifications')}
                  >
                    {privacy.communityNotifications ? 'Bật' : 'Tắt'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email marketing</p>
                      <p className="text-sm text-gray-600">Ưu đãi và tin tức từ Sovico</p>
                    </div>
                  </div>
                  <Button
                    variant={privacy.marketingEmails ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrivacySetting('marketingEmails')}
                  >
                    {privacy.marketingEmails ? 'Bật' : 'Tắt'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Bảo mật và quyền riêng tư</h3>
              <p className="text-blue-700 mb-3">
                Locuno cam kết bảo vệ thông tin cá nhân của bạn:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Mã hóa end-to-end cho tất cả dữ liệu nhạy cảm</li>
                <li>• Không bán hoặc chia sẻ thông tin với bên thứ ba</li>
                <li>• Bạn có quyền xóa tài khoản và dữ liệu bất cứ lúc nào</li>
                <li>• Tuân thủ nghiêm ngặt luật bảo vệ dữ liệu cá nhân Việt Nam</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
