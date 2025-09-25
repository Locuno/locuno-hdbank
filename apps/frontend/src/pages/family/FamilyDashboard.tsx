
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Clock
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return 'text-green-600 bg-green-100';
    case 'active': return 'text-blue-600 bg-blue-100';
    case 'sleeping': return 'text-purple-600 bg-purple-100';
    case 'alert': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'safe': return 'An toàn';
    case 'active': return 'Đang hoạt động';
    case 'sleeping': return 'Đang ngủ';
    case 'alert': return 'Cảnh báo';
    default: return 'Không rõ';
  }
};

export function FamilyDashboard() {

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
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm thành viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFamilyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{member.avatar}</div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Cập nhật {member.lastSeen}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Moon className="w-4 h-4 text-purple-600" />
                        <span>{member.wellness.sleep}h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Footprints className="w-4 h-4 text-orange-600" />
                        <span>{member.wellness.steps.toLocaleString()}</span>
                      </div>
                      {member.wellness.heartRate && (
                        <div className="flex items-center space-x-1">
                          <Activity className="w-4 h-4 text-red-600" />
                          <span>{member.wellness.heartRate} bpm</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
