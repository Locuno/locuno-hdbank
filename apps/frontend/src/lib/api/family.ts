import { api } from './index';
import { ApiResponse } from './auth';

// Family Types
export interface FamilyCircle {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    locationSharingEnabled: boolean;
    emergencySOSEnabled: boolean;
    wellnessTrackingEnabled: boolean;
  };
}

export interface FamilyMember {
  userId: string;
  familyId: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
  invitedBy?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  permissions: {
    canViewLocation: boolean;
    canReceiveAlerts: boolean;
    canManageMembers: boolean;
  };
}

export interface FamilyInvitation {
  id: string;
  familyId: string;
  invitedEmail: string;
  invitedBy: string;
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface LocationData {
  userId: string;
  familyId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  address?: string;
  isEmergency: boolean;
}

export interface WellnessData {
  userId: string;
  familyId: string;
  date: string;
  sleepHours?: number;
  steps?: number;
  heartRate?: number;
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  notes?: string;
  timestamp: string;
}

export interface EmergencySOS {
  id: string;
  userId: string;
  familyId: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message?: string;
  status: 'active' | 'resolved' | 'false_alarm';
  createdAt: string;
  resolvedAt?: string;
  notifiedMembers: string[];
}

// Family API Service
export const familyService = {
  // Family Circle Management
  async createFamily(data: {
    name: string;
    description?: string;
    settings?: Partial<FamilyCircle['settings']>;
  }): Promise<ApiResponse<{ familyId: string }>> {
    try {
      const response = await api.post<ApiResponse<{ familyId: string }>>(
        '/api/family/circles',
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create family',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getUserFamilies(): Promise<ApiResponse<{ families: FamilyCircle[] }>> {
    try {
      const response = await api.get<ApiResponse<{ families: FamilyCircle[] }>>(
        '/api/family/circles'
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get families',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getFamilyDetails(familyId: string): Promise<ApiResponse<{ family: FamilyCircle }>> {
    try {
      const response = await api.get<ApiResponse<{ family: FamilyCircle }>>(
        `/api/family/circles/${familyId}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get family details',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Member Management
  async inviteMember(
    familyId: string,
    data: { email: string; role?: 'admin' | 'member' }
  ): Promise<ApiResponse<{ invitationId: string }>> {
    try {
      const response = await api.post<ApiResponse<{ invitationId: string }>>(
        `/api/family/circles/${familyId}/invite`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to invite member',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async acceptInvitation(token: string): Promise<ApiResponse<{ familyId: string }>> {
    try {
      const response = await api.post<ApiResponse<{ familyId: string }>>(
        `/api/family/invitations/${token}/accept`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to accept invitation',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getFamilyMembers(familyId: string): Promise<ApiResponse<{ members: FamilyMember[] }>> {
    try {
      const response = await api.get<ApiResponse<{ members: FamilyMember[] }>>(
        `/api/family/circles/${familyId}/members`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get family members',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Location Sharing
  async updateLocation(
    familyId: string,
    locationData: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      address?: string;
      timestamp?: string;
    }
  ): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `/api/family/circles/${familyId}/location`,
        locationData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update location',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getFamilyLocations(familyId: string): Promise<ApiResponse<{ locations: LocationData[] }>> {
    try {
      const response = await api.get<ApiResponse<{ locations: LocationData[] }>>(
        `/api/family/circles/${familyId}/locations`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get family locations',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Wellness Tracking
  async updateWellness(
    familyId: string,
    wellnessData: {
      type: string;
      value: number;
      unit?: string;
      notes?: string;
      timestamp?: string;
    }
  ): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `/api/family/circles/${familyId}/wellness`,
        wellnessData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update wellness data',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getFamilyWellness(familyId: string): Promise<ApiResponse<{ wellness: WellnessData[] }>> {
    try {
      const response = await api.get<ApiResponse<{ wellness: WellnessData[] }>>(
        `/api/family/circles/${familyId}/wellness`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get wellness data',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Emergency SOS
  async triggerSOS(
    familyId: string,
    sosData: {
      type: string;
      message?: string;
      location?: { latitude: number; longitude: number; address?: string };
      severity?: 'low' | 'medium' | 'high';
    }
  ): Promise<ApiResponse<{ sosId: string }>> {
    try {
      const response = await api.post<ApiResponse<{ sosId: string }>>(
        `/api/family/circles/${familyId}/sos`,
        sosData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to trigger SOS',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async getSOSAlerts(
    familyId: string,
    status?: 'active' | 'resolved'
  ): Promise<ApiResponse<{ sosAlerts: EmergencySOS[] }>> {
    try {
      const url = status 
        ? `/api/family/circles/${familyId}/sos?status=${status}`
        : `/api/family/circles/${familyId}/sos`;
      
      const response = await api.get<ApiResponse<{ sosAlerts: EmergencySOS[] }>>(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get SOS alerts',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  async resolveSOS(
    familyId: string,
    sosId: string,
    data: { resolution: string; notes?: string }
  ): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        `/api/family/circles/${familyId}/sos/${sosId}/resolve`,
        data
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resolve SOS',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },
};

export default familyService;
