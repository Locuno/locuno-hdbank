import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, Users, Heart, Gift, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Chào mừng đến với Locuno',
    description: 'Nền tảng tin cậy kỹ thuật số cho gia đình và cộng đồng Việt Nam',
    icon: <Shield className="w-12 h-12 text-blue-600" />
  },
  {
    id: 'role-selection',
    title: 'Chọn vai trò của bạn',
    description: 'Bạn muốn sử dụng Locuno cho mục đích gì?',
    icon: <Users className="w-12 h-12 text-blue-600" />
  },
  {
    id: 'ekyc',
    title: 'Xác thực danh tính',
    description: 'Xác thực eKYC để đảm bảo an toàn cho cộng đồng',
    icon: <CheckCircle className="w-12 h-12 text-green-600" />
  },
  {
    id: 'privacy',
    title: 'Cài đặt quyền riêng tư',
    description: 'Kiểm soát thông tin bạn muốn chia sẻ',
    icon: <Heart className="w-12 h-12 text-red-600" />
  }
];

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'family' | 'community' | 'both' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    idNumber: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Save onboarding data and redirect based on role
    localStorage.setItem('locuno_onboarding_complete', 'true');
    localStorage.setItem('locuno_user_role', selectedRole || 'both');
    
    if (selectedRole === 'family') {
      navigate('/family');
    } else if (selectedRole === 'community') {
      navigate('/community');
    } else {
      navigate('/family'); // Default to family dashboard
    }
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            {step.icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card className="border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader className="text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Locuno Family</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Kết nối gia đình, theo dõi sức khỏe, và hệ thống SOS khẩn cấp
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-orange-200 hover:border-orange-400 transition-colors">
                <CardHeader className="text-center">
                  <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <CardTitle className="text-lg">Locuno Community Wallets</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Quản lý quỹ cộng đồng minh bạch với hệ thống bỏ phiếu dân chủ
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'role-selection':
        return (
          <div className="text-center space-y-6">
            {step.icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="space-y-4">
              <Button
                variant={selectedRole === 'family' ? 'default' : 'outline'}
                className="w-full p-6 h-auto"
                onClick={() => setSelectedRole('family')}
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Chỉ cho Gia đình</div>
                    <div className="text-sm opacity-80">Theo dõi sức khỏe và an toàn gia đình</div>
                  </div>
                </div>
              </Button>
              <Button
                variant={selectedRole === 'community' ? 'default' : 'outline'}
                className="w-full p-6 h-auto"
                onClick={() => setSelectedRole('community')}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Chỉ cho Cộng đồng</div>
                    <div className="text-sm opacity-80">Quản lý quỹ và hoạt động cộng đồng</div>
                  </div>
                </div>
              </Button>
              <Button
                variant={selectedRole === 'both' ? 'default' : 'outline'}
                className="w-full p-6 h-auto"
                onClick={() => setSelectedRole('both')}
              >
                <div className="flex items-center space-x-3">
                  <Gift className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Cả hai (Khuyến nghị)</div>
                    <div className="text-sm opacity-80">Trải nghiệm đầy đủ + Safe Deals 1K</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        );

      case 'ekyc':
        return (
          <div className="text-center space-y-6">
            {step.icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <Input
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <Input
                placeholder="Số điện thoại"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
              <Input
                placeholder="Số CCCD/CMND"
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
              <Input
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔒 Thông tin của bạn được mã hóa và bảo mật tuyệt đối
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="text-center space-y-6">
            {step.icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto text-left">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ Bạn kiểm soát hoàn toàn:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Ai có thể xem vị trí của bạn</li>
                  <li>• Thông tin sức khỏe nào được chia sẻ</li>
                  <li>• Khi nào nhận thông báo</li>
                  <li>• Quyền truy cập dữ liệu</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  🎯 Mục tiêu: Xây dựng niềm tin thông qua sự minh bạch và kiểm soát
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {onboardingSteps.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedRole}
              className="flex items-center space-x-2"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
