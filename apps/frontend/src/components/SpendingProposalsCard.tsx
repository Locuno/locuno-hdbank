import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Vote,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Plus
} from 'lucide-react';
import { mockProposals, mockProposalStats } from '@/data/proposalsMockData';
import { PROPOSAL_STATUS_CONFIG, PROPOSAL_CATEGORY_CONFIG } from '@/types/proposals';

interface SpendingProposalsCardProps {
  communityId: string;
}

export function SpendingProposalsCard({ communityId }: SpendingProposalsCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'stats'>('active');

  const communityProposals = mockProposals.filter(p => p.communityId === communityId);
  const activeProposals = communityProposals.filter(p => p.status === 'voting' || p.status === 'pending');
  const completedProposals = communityProposals.filter(p => p.status === 'approved' || p.status === 'rejected' || p.status === 'completed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getVotingProgress = (proposal: any) => {
    if (proposal.totalMembers === 0) return 0;
    return Math.round((proposal.totalVotes / proposal.totalMembers) * 100);
  };

  const getApprovalProgress = (proposal: any) => {
    if (proposal.totalVotes === 0) return 0;
    return Math.round((proposal.approveVotes / proposal.requiredVotes) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'voting':
        return <Vote className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Vote className="w-5 h-5 text-blue-600" />
              <span>Đề xuất chi tiêu</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Hệ thống bỏ phiếu 2/3 đa số để phê duyệt
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/community/${communityId}/proposals/new`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Đề xuất mới
            </Button>
            <Button
              onClick={() => navigate(`/community/${communityId}/proposals`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem tất cả
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-900">{mockProposalStats.totalProposals}</div>
            <div className="text-xs text-blue-600">Tổng đề xuất</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-900">{activeProposals.length}</div>
            <div className="text-xs text-yellow-600">Đang bỏ phiếu</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-900">{mockProposalStats.approvedProposals}</div>
            <div className="text-xs text-green-600">Đã phê duyệt</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <DollarSign className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-purple-900">
              {formatCurrency(mockProposalStats.totalAmountApproved)}
            </div>
            <div className="text-xs text-purple-600">Đã phê duyệt</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'active' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Đang bỏ phiếu ({activeProposals.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Đã hoàn thành ({completedProposals.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Thống kê
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeProposals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Vote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Không có đề xuất nào đang bỏ phiếu</p>
              </div>
            ) : (
              activeProposals.slice(0, 3).map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{PROPOSAL_CATEGORY_CONFIG[proposal.category].icon}</span>
                        <h4 className="font-semibold text-gray-900">{proposal.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getUrgencyColor(proposal.urgency)}`}>
                          {proposal.urgency === 'high' ? 'Khẩn cấp' : 
                           proposal.urgency === 'medium' ? 'Bình thường' : 'Không gấp'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatCurrency(proposal.amount)}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {proposal.proposedBy}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Hạn: {new Date(proposal.votingDeadline).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${PROPOSAL_STATUS_CONFIG[proposal.status].color} ${PROPOSAL_STATUS_CONFIG[proposal.status].bgColor}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">{PROPOSAL_STATUS_CONFIG[proposal.status].label}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {proposal.status === 'voting' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tỷ lệ tham gia: {proposal.totalVotes}/{proposal.totalMembers}</span>
                        <span>{getVotingProgress(proposal)}%</span>
                      </div>
                      <Progress value={getVotingProgress(proposal)} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Tỷ lệ phê duyệt: {proposal.approveVotes}/{proposal.requiredVotes}</span>
                        <span className={getApprovalProgress(proposal) >= 100 ? 'text-green-600 font-semibold' : ''}>
                          {getApprovalProgress(proposal)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(getApprovalProgress(proposal), 100)} 
                        className="h-2"
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span className="text-green-600">✓ {proposal.approveVotes} đồng ý</span>
                        <span className="text-red-600">✗ {proposal.rejectVotes} từ chối</span>
                        <span className="text-gray-600">~ {proposal.abstainVotes} trung lập</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedProposals.slice(0, 3).map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{PROPOSAL_CATEGORY_CONFIG[proposal.category].icon}</span>
                  <div>
                    <div className="font-medium text-sm">{proposal.title}</div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(proposal.amount)} • {proposal.proposedBy}
                    </div>
                  </div>
                </div>
                <Badge className={`${PROPOSAL_STATUS_CONFIG[proposal.status].color} ${PROPOSAL_STATUS_CONFIG[proposal.status].bgColor}`}>
                  {PROPOSAL_STATUS_CONFIG[proposal.status].label}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Tổng giá trị đề xuất</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatCurrency(mockProposalStats.totalAmountProposed)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Tỷ lệ phê duyệt</div>
                <div className="text-lg font-bold text-green-900">
                  {mockProposalStats.averageApprovalRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Đã phê duyệt:</span>
                <span className="font-medium">{formatCurrency(mockProposalStats.totalAmountApproved)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Còn lại:</span>
                <span className="font-medium">
                  {formatCurrency(mockProposalStats.totalAmountProposed - mockProposalStats.totalAmountApproved)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" className="flex-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Đề xuất khẩn cấp
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Lịch sử bỏ phiếu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
