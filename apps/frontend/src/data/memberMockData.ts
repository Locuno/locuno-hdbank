import { Member, MemberListResponse } from '../lib/api/member';
import { ApiResponse } from '../lib/api/auth';

const members: Member[] = [
  {
    id: '1',
    userId: 'user-1',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'An',
    lastName: 'Nguyễn Văn',
    email: 'an.nguyen@example.com',
    phoneNumber: '0987654321',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-01-15T10:00:00Z',
    invitedBy: 'system',
  },
  {
    id: '2',
    userId: 'user-2',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'Bình',
    lastName: 'Trần Thị',
    email: 'binh.tran@example.com',
    phoneNumber: '0912345678',
    role: 'member',
    status: 'active',
    joinedAt: '2023-02-20T14:30:00Z',
    invitedBy: 'An Nguyễn Văn',
  },
  {
    id: '3',
    userId: 'user-3',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'Cường',
    lastName: 'Lê Văn',
    email: 'cuong.le@example.com',
    phoneNumber: '0905123456',
    role: 'member',
    status: 'active',
    joinedAt: '2023-03-10T09:00:00Z',
    invitedBy: 'An Nguyễn Văn',
  },
  {
    id: '4',
    userId: 'user-4',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'Dung',
    lastName: 'Phạm Thị',
    email: 'dung.pham@example.com',
    phoneNumber: '0978123456',
    role: 'viewer',
    status: 'invited',
    joinedAt: '2023-10-01T12:00:00Z',
    invitedBy: 'Bình Trần Thị',
  },
    {
    id: '5',
    userId: 'user-5',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'Hà',
    lastName: 'Hoàng Thị',
    email: 'ha.hoang@example.com',
    phoneNumber: '0988123456',
    role: 'member',
    status: 'active',
    joinedAt: '2023-05-05T18:00:00Z',
    invitedBy: 'An Nguyễn Văn',
  },
  {
    id: '6',
    userId: 'user-6',
    communityId: '939d2ad5-bddf-4d8c-9210-59dec912ce88',
    firstName: 'Linh',
    lastName: 'Vũ Thị',
    email: 'linh.vu@example.com',
    phoneNumber: '0969123456',
    role: 'member',
    status: 'suspended',
    joinedAt: '2023-06-12T11:45:00Z',
    invitedBy: 'Cường Lê Văn',
  },
];

export const mockGetMembers = (communityId: string): Promise<ApiResponse<MemberListResponse>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const communityMembers = members.filter(m => m.communityId === communityId);
      resolve({
        success: true,
        message: 'Successfully retrieved members.',
        data: {
          members: communityMembers,
          total: communityMembers.length,
        },
      });
    }, 500);
  });
};