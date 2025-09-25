export class FamilyService {
  static async createFamily(env: any, data: {
    name: string;
    description?: string;
    createdBy: string;
    settings?: any;
  }) {
    try {
      const familyId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/create-family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId,
          name: data.name,
          description: data.description,
          createdBy: data.createdBy,
          settings: data.settings,
        }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.createFamily error:', error);
      return { success: false, error: 'Failed to create family' };
    }
  }

  static async getFamilyDetails(env: any, familyId: string) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-family', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getFamilyDetails error:', error);
      return { success: false, error: 'Failed to get family details' };
    }
  }

  static async getUserFamilies(env: any, userId: string) {
    try {
      // For now, we'll use a simple approach - in production, you'd want a user index
      // This is a simplified implementation
      const userFamilyId = `user_families_${userId}`;
      const durableObjectId = env.FAMILY_DO.idFromName(userFamilyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-user-families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getUserFamilies error:', error);
      return { success: false, error: 'Failed to get user families' };
    }
  }

  static async inviteMember(env: any, data: {
    familyId: string;
    invitedEmail: string;
    invitedBy: string;
    role: string;
  }) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(data.familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/invite-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.inviteMember error:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }

  static async acceptInvitation(env: any, data: {
    token: string;
    userId: string;
  }) {
    try {
      // We need to find the family by invitation token
      // For now, we'll use a simple approach - in production, you'd want an invitation index
      const invitationId = `invitation_${data.token}`;
      const durableObjectId = env.FAMILY_DO.idFromName(invitationId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/accept-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.acceptInvitation error:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  }

  static async getFamilyMembers(env: any, familyId: string) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-members', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getFamilyMembers error:', error);
      return { success: false, error: 'Failed to get family members' };
    }
  }

  static async updateLocation(env: any, data: {
    familyId: string;
    userId: string;
    locationData: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      address?: string;
      timestamp: string;
    };
  }) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(data.familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.updateLocation error:', error);
      return { success: false, error: 'Failed to update location' };
    }
  }

  static async getFamilyLocations(env: any, familyId: string) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-family-locations', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getFamilyLocations error:', error);
      return { success: false, error: 'Failed to get family locations' };
    }
  }

  static async updateWellness(env: any, data: {
    familyId: string;
    userId: string;
    wellnessData: {
      type: string;
      value: number;
      unit?: string;
      notes?: string;
      timestamp: string;
    };
  }) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(data.familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/update-wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.updateWellness error:', error);
      return { success: false, error: 'Failed to update wellness data' };
    }
  }

  static async getFamilyWellness(env: any, familyId: string) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-family-wellness', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getFamilyWellness error:', error);
      return { success: false, error: 'Failed to get family wellness data' };
    }
  }

  static async triggerSOS(env: any, data: {
    familyId: string;
    triggeredBy: string;
    type: string;
    message?: string;
    location?: any;
    severity: string;
  }) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(data.familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/trigger-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.triggerSOS error:', error);
      return { success: false, error: 'Failed to trigger SOS' };
    }
  }

  static async resolveSOS(env: any, data: {
    familyId: string;
    sosId: string;
    resolvedBy: string;
    resolution?: string;
    notes?: string;
  }) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(data.familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/resolve-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.resolveSOS error:', error);
      return { success: false, error: 'Failed to resolve SOS' };
    }
  }

  static async getActiveSOS(env: any, familyId: string) {
    try {
      const durableObjectId = env.FAMILY_DO.idFromName(familyId);
      const durableObject = env.FAMILY_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-active-sos', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('FamilyService.getActiveSOS error:', error);
      return { success: false, error: 'Failed to get active SOS alerts' };
    }
  }
}