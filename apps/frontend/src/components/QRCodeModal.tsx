import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Copy, Download, RefreshCw } from 'lucide-react';
import { vietqrApi, VietQRResponse } from '@/lib/api/vietqr';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
  amount?: number;
  title?: string;
}

export function QRCodeModal({ isOpen, onClose, walletId, amount = 100000, title = "Nạp tiền vào ví cộng đồng" }: QRCodeModalProps) {
  const [qrData, setQrData] = useState<VietQRResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vietqrApi.generateDefaultQR({
        walletId,
        amount,
        template: 'compact'
      });
      setQrData(response);
    } catch (err) {
      setError('Không thể tạo mã QR. Vui lòng thử lại.');
      console.error('QR generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !qrData) {
      generateQR();
    }
  }, [isOpen, walletId, amount]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadQR = () => {
    if (qrData?.qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrData.qrDataUrl;
      link.download = `qr-${walletId}-${amount}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
              Quét mã QR để chuyển {formatCurrency(amount)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Đang tạo mã QR...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={generateQR} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          )}
          
          {qrData && (
            <>
              {/* QR Code Image */}
              <div className="flex justify-center">
                <img
                  src={qrData.qrDataUrl}
                  alt="VietQR Code"
                  className="w-64 h-64 border rounded-lg"
                />
              </div>
              
              {/* Bank Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{qrData.defaultAccount?.bankInfo?.shortName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Số tài khoản:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{qrData.requestInfo?.accountNo || qrData.defaultAccount?.accountNo || 'N/A'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(qrData.requestInfo?.accountNo || qrData.defaultAccount?.accountNo || '')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tên tài khoản:</span>
                  <span className="font-medium">{qrData.requestInfo?.accountName || qrData.defaultAccount?.accountName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Số tiền:</span>
                  <span className="font-bold text-green-600">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nội dung:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{walletId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletId)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => copyToClipboard(qrData.qrCodeUrl)}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Đã sao chép!' : 'Sao chép link'}
                </Button>
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
              
              {/* Instructions */}
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>• Quét mã QR bằng ứng dụng ngân hàng</p>
                <p>• Hoặc nhập thông tin chuyển khoản thủ công</p>
                <p>• <strong>Quan trọng:</strong> Nhập đúng nội dung chuyển khoản để hệ thống ghi nhận</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}