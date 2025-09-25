import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Users, Building, School, MapPin, Copy, Check } from 'lucide-react';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: CommunityGroup) => void;
}

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

const communityTypes = [
  {
    id: 'apartment' as const,
    name: 'Chung cư',
    description: 'Quỹ chung cư, tòa nhà',
    icon: Building,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'school' as const,
    name: 'Trường học',
    description: 'Quỹ lớp học, phụ huynh',
    icon: School,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'neighborhood' as const,
    name: 'Khu phố',
    description: 'Quỹ khu phố, cộng đồng',
    icon: MapPin,
    color: 'bg-purple-100 text-purple-600'
  }
];

export function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }: CreateCommunityModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: 'apartment' | 'school' | 'neighborhood';
  }>({
    name: '',
    description: '',
    type: 'apartment'
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdCommunity, setCreatedCommunity] = useState<CommunityGroup | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const generateWalletId = (name: string, type: string) => {
    const prefix = type === 'apartment' ? 'apt' : type === 'school' ? 'sch' : 'nbh';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}_${cleanName}_${timestamp}`;
  };

  const generateJoinLink = (communityId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/community/join/${communityId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const communityId = `comm_${Date.now()}`;
      const walletId = generateWalletId(formData.name, formData.type);
      const joinLink = generateJoinLink(communityId);
      
      const newCommunity: CommunityGroup = {
        id: communityId,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        members: 1, // Creator is the first member
        balance: 0,
        currency: 'VND',
        joinLink,
        walletId
      };
      
      setCreatedCommunity(newCommunity);
      setStep('success');
      onCommunityCreated(newCommunity);
    } catch (error) {
      console.error('Failed to create community:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyJoinLink = async () => {
    if (createdCommunity?.joinLink) {
      try {
        await navigator.clipboard.writeText(createdCommunity.joinLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', description: '', type: 'apartment' });
    setCreatedCommunity(null);
    setCopiedLink(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">
              {step === 'form' ? 'Tạo cộng đồng mới' : 'Cộng đồng đã được tạo!'}
            </CardTitle>
            <CardDescription>
              {step === 'form' 
                ? 'Tạo quỹ cộng đồng để quản lý tài chính minh bạch'
                : 'Chia sẻ link tham gia với các thành viên khác'
              }
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Community Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Loại cộng đồng</label>
                <div className="grid grid-cols-1 gap-3">
                  {communityTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.type === type.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Community Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Tên cộng đồng *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="VD: Chung cư Vinhomes Central Park - Tòa P1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Mô tả ngắn về cộng đồng của bạn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Tạo cộng đồng
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{createdCommunity?.name}</h3>
                <p className="text-gray-600">Cộng đồng đã được tạo thành công!</p>
              </div>

              {/* Community Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ID Ví:</span>
                  <span className="font-mono text-sm">{createdCommunity?.walletId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thành viên:</span>
                  <span>{createdCommunity?.members} người</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số dư:</span>
                  <span className="text-green-600 font-semibold">0 VND</span>
                </div>
              </div>

              {/* Join Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Link tham gia</label>
                <div className="flex space-x-2">
                  <Input
                    value={createdCommunity?.joinLink || ''}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyJoinLink}
                    variant="outline"
                    size="sm"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Chia sẻ link này với các thành viên để họ tham gia cộng đồng
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleClose}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Hoàn thành
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}