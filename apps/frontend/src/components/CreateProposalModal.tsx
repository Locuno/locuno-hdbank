import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, X } from 'lucide-react';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalCreated: (proposal: any) => void;
  communityId: string;
  communityName: string;
}

interface ProposalFormData {
  title: string;
  description: string;
  amount: string;
  category: string;
}

export function CreateProposalModal({
  isOpen,
  onClose,
  onProposalCreated,
  communityId,
  communityName
}: CreateProposalModalProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    title: '',
    description: '',
    amount: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdProposal, setCreatedProposal] = useState<any>(null);

  const categories = [
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'improvement', label: 'Cải thiện' },
    { value: 'emergency', label: 'Khẩn cấp' },
    { value: 'other', label: 'Khác' }
  ];

  const handleInputChange = (field: keyof ProposalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateProposalId = () => {
    return `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.amount || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Số tiền phải là một số dương hợp lệ');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProposal = {
        id: generateProposalId(),
        title: formData.title,
        description: formData.description,
        amount: amount,
        currency: 'VND',
        proposer: 'Người dùng hiện tại', // TODO: Get from auth context
        votes: { approve: 0, reject: 0, total: 0 },
        status: 'pending' as const,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        category: categories.find(c => c.value === formData.category)?.label || formData.category,
        communityId: communityId
      };
      
      setCreatedProposal(newProposal);
      setStep('success');
      onProposalCreated(newProposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Có lỗi xảy ra khi tạo đề xuất. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', amount: '', category: '' });
    setStep('form');
    setCreatedProposal(null);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {step === 'form' ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tạo đề xuất mới</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Tạo đề xuất chi tiêu cho cộng đồng {communityName}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề đề xuất *</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  placeholder="Ví dụ: Sửa chữa thang máy số 2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả chi tiết *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về đề xuất, lý do cần thiết và kế hoạch thực hiện..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Số tiền (VND) *</label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('amount', e.target.value)}
                  placeholder="Ví dụ: 25000000"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang tạo...' : 'Tạo đề xuất'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-green-600">
                <CheckCircle className="h-5 w-5" />
                Đề xuất đã được tạo thành công!
              </h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">{createdProposal?.title}</h3>
                <p className="text-green-700 text-sm mb-2">{createdProposal?.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600">Số tiền: {createdProposal && formatCurrency(createdProposal.amount)}</span>
                  <span className="text-green-600">Danh mục: {createdProposal?.category}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Thông tin bỏ phiếu:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Thời hạn bỏ phiếu: 7 ngày kể từ bây giờ</li>
                  <li>• Cần 2/3 số phiếu đồng ý để thông qua</li>
                  <li>• Tất cả thành viên đều có thể tham gia bỏ phiếu</li>
                  <li>• Kết quả sẽ được cập nhật theo thời gian thực</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleClose}>
                  Hoàn tất
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}