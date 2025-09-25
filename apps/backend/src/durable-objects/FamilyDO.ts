import { z } from 'zod';

// Family Circle Schema
const FamilyCircleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdBy: z.string(), // userId
  createdAt: z.string(),
  updatedAt: z.string(),
  settings: z.object({
    locationSharingEnabled: z.boolean().default(true),
    emergencySOSEnabled: z.boolean().default(true),
    wellnessTrackingEnabled: z.boolean().default(true),
  }),
});

// Family Member Schema
const FamilyMemberSchema = z.object({
  userId: z.string(),
  familyId: z.string(),
  role: z.enum(['admin', 'member']),
  status: z.enum(['active', 'invited', 'suspended']),
  joinedAt: z.string(),
  invitedBy: z.string().optional(),
  permissions: z.object({
    canViewLocation: z.boolean().default(true),
    canReceiveAlerts: z.boolean().default(true),
    canManageMembers: z.boolean().default(false),
  }),
});

// Location Data Schema
const LocationDataSchema = z.object({
  userId: z.string(),
  familyId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  timestamp: z.string(),
  address: z.string().optional(),
  isEmergency: z.boolean().default(false),
});

// Wellness Data Schema
const WellnessDataSchema = z.object({
  userId: z.string(),
  familyId: z.string(),
  date: z.string(), // YYYY-MM-DD format
  sleepHours: z.number().optional(),
  steps: z.number().optional(),
  heartRate: z.number().optional(),
  mood: z.enum(['excellent', 'good', 'okay', 'poor', 'terrible']).optional(),
  notes: z.string().optional(),
  timestamp: z.string(),
});

// Emergency SOS Schema
const EmergencySOSSchema = z.object({
  id: z.string(),
  userId: z.string(),
  familyId: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  message: z.string().optional(),
  status: z.enum(['active', 'resolved', 'false_alarm']),
  createdAt: z.string(),
  resolvedAt: z.string().optional(),
  notifiedMembers: z.array(z.string()), // userIds
});

// Invitation Schema
const FamilyInvitationSchema = z.object({
  id: z.string(),
  familyId: z.string(),
  invitedEmail: z.string().email(),
  invitedBy: z.string(), // userId
  token: z.string(),
  expiresAt: z.string(),
  status: z.enum(['pending', 'accepted', 'declined', 'expired']),
  createdAt: z.string(),
});

type FamilyCircle = z.infer<typeof FamilyCircleSchema>;
type FamilyMember = z.infer<typeof FamilyMemberSchema>;
type LocationData = z.infer<typeof LocationDataSchema>;
type WellnessData = z.infer<typeof WellnessDataSchema>;
type EmergencySOS = z.infer<typeof EmergencySOSSchema>;
type FamilyInvitation = z.infer<typeof FamilyInvitationSchema>;

export class FamilyDO {
  private storage: any;
  private env: any;

  constructor(state: any, env: any) {
    this.storage = state.storage;
    this.env = env;
  }

  // Family Circle Management
  async createFamily(data: {
    name: string;
    description?: string;
    createdBy: string;
  }): Promise<{ success: boolean; familyId?: string; error?: string }> {
    try {
      const familyId = crypto.randomUUID();
      const now = new Date().toISOString();

      const family: FamilyCircle = {
        id: familyId,
        name: data.name,
        description: data.description,
        createdBy: data.createdBy,
        createdAt: now,
        updatedAt: now,
        settings: {
          locationSharingEnabled: true,
          emergencySOSEnabled: true,
          wellnessTrackingEnabled: true,
        },
      };

      // Create the family
      await this.storage.put(`family:${familyId}`, family);

      // Add creator as admin member
      const member: FamilyMember = {
        userId: data.createdBy,
        familyId,
        role: 'admin',
        status: 'active',
        joinedAt: now,
        permissions: {
          canViewLocation: true,
          canReceiveAlerts: true,
          canManageMembers: true,
        },
      };

      await this.storage.put(`member:${familyId}:${data.createdBy}`, member);
      
      // Track user's families
      const userFamilies = await this.storage.get(`user_families:${data.createdBy}`) || [];
      userFamilies.push(familyId);
      await this.storage.put(`user_families:${data.createdBy}`, userFamilies);

      return { success: true, familyId };
    } catch (error) {
      console.error('Error creating family:', error);
      return { success: false, error: 'Failed to create family' };
    }
  }

  async getFamilyDetails(familyId: string): Promise<{ success: boolean; family?: FamilyCircle; error?: string }> {
    try {
      const family = await this.storage.get(`family:${familyId}`);
      if (!family) {
        return { success: false, error: 'Family not found' };
      }
      return { success: true, family };
    } catch (error) {
      console.error('Error getting family details:', error);
      return { success: false, error: 'Failed to get family details' };
    }
  }

  async getUserFamilies(userId: string): Promise<{ success: boolean; families?: FamilyCircle[]; error?: string }> {
    try {
      const familyIds = await this.storage.get(`user_families:${userId}`) || [];
      const families: FamilyCircle[] = [];

      for (const familyId of familyIds) {
        const family = await this.storage.get(`family:${familyId}`);
        if (family) {
          families.push(family);
        }
      }

      return { success: true, families };
    } catch (error) {
      console.error('Error getting user families:', error);
      return { success: false, error: 'Failed to get user families' };
    }
  }

  // Member Management
  async inviteMember(data: {
    familyId: string;
    invitedEmail: string;
    invitedBy: string;
  }): Promise<{ success: boolean; invitationId?: string; error?: string }> {
    try {
      // Check if inviter has permission
      const inviterMember = await this.storage.get(`member:${data.familyId}:${data.invitedBy}`);
      if (!inviterMember || !inviterMember.permissions.canManageMembers) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const invitationId = crypto.randomUUID();
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      const invitation: FamilyInvitation = {
        id: invitationId,
        familyId: data.familyId,
        invitedEmail: data.invitedEmail,
        invitedBy: data.invitedBy,
        token,
        expiresAt,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await this.storage.put(`invitation:${invitationId}`, invitation);
      await this.storage.put(`invitation_token:${token}`, invitationId);

      return { success: true, invitationId };
    } catch (error) {
      console.error('Error inviting member:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }

  async acceptInvitation(data: {
    token: string;
    userId: string;
  }): Promise<{ success: boolean; familyId?: string; error?: string }> {
    try {
      const invitationId = await this.storage.get(`invitation_token:${data.token}`);
      if (!invitationId) {
        return { success: false, error: 'Invalid invitation token' };
      }

      const invitation = await this.storage.get(`invitation:${invitationId}`);
      if (!invitation || invitation.status !== 'pending') {
        return { success: false, error: 'Invitation not found or already processed' };
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        return { success: false, error: 'Invitation has expired' };
      }

      // Add user as family member
      const member: FamilyMember = {
        userId: data.userId,
        familyId: invitation.familyId,
        role: 'member',
        status: 'active',
        joinedAt: new Date().toISOString(),
        invitedBy: invitation.invitedBy,
        permissions: {
          canViewLocation: true,
          canReceiveAlerts: true,
          canManageMembers: false,
        },
      };

      await this.storage.put(`member:${invitation.familyId}:${data.userId}`, member);
      
      // Update user's families list
      const userFamilies = await this.storage.get(`user_families:${data.userId}`) || [];
      userFamilies.push(invitation.familyId);
      await this.storage.put(`user_families:${data.userId}`, userFamilies);

      // Mark invitation as accepted
      invitation.status = 'accepted';
      await this.storage.put(`invitation:${invitationId}`, invitation);

      return { success: true, familyId: invitation.familyId };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  }

  async getFamilyMembers(familyId: string): Promise<{ success: boolean; members?: FamilyMember[]; error?: string }> {
    try {
      const members: FamilyMember[] = [];
      const memberKeys = await this.storage.list({ prefix: `member:${familyId}:` });
      
      for (const [, member] of memberKeys) {
        members.push(member as FamilyMember);
      }

      return { success: true, members };
    } catch (error) {
      console.error('Error getting family members:', error);
      return { success: false, error: 'Failed to get family members' };
    }
  }

  // Location Sharing
  async updateLocation(data: {
    userId: string;
    familyId: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
    isEmergency?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify user is member of family
      const member = await this.storage.get(`member:${data.familyId}:${data.userId}`);
      if (!member || member.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const locationData: LocationData = {
        userId: data.userId,
        familyId: data.familyId,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        timestamp: new Date().toISOString(),
        address: data.address,
        isEmergency: data.isEmergency || false,
      };

      await this.storage.put(`location:${data.familyId}:${data.userId}`, locationData);
      
      // Keep location history (last 24 hours)
      const historyKey = `location_history:${data.familyId}:${data.userId}:${Date.now()}`;
      await this.storage.put(historyKey, locationData);

      return { success: true };
    } catch (error) {
      console.error('Error updating location:', error);
      return { success: false, error: 'Failed to update location' };
    }
  }

  async getFamilyLocations(familyId: string, requesterId: string): Promise<{ success: boolean; locations?: LocationData[]; error?: string }> {
    try {
      // Verify requester is member of family
      const requesterMember = await this.storage.get(`member:${familyId}:${requesterId}`);
      if (!requesterMember || requesterMember.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const locations: LocationData[] = [];
      const locationKeys = await this.storage.list({ prefix: `location:${familyId}:` });
      
      for (const [, location] of locationKeys) {
        locations.push(location as LocationData);
      }

      return { success: true, locations };
    } catch (error) {
      console.error('Error getting family locations:', error);
      return { success: false, error: 'Failed to get family locations' };
    }
  }

  // Wellness Tracking
  async updateWellness(data: {
    userId: string;
    familyId: string;
    date: string;
    sleepHours?: number;
    steps?: number;
    heartRate?: number;
    mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
    notes?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify user is member of family
      const member = await this.storage.get(`member:${data.familyId}:${data.userId}`);
      if (!member || member.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const wellnessData: WellnessData = {
        userId: data.userId,
        familyId: data.familyId,
        date: data.date,
        sleepHours: data.sleepHours,
        steps: data.steps,
        heartRate: data.heartRate,
        mood: data.mood,
        notes: data.notes,
        timestamp: new Date().toISOString(),
      };

      await this.storage.put(`wellness:${data.familyId}:${data.userId}:${data.date}`, wellnessData);

      return { success: true };
    } catch (error) {
      console.error('Error updating wellness:', error);
      return { success: false, error: 'Failed to update wellness data' };
    }
  }

  async getFamilyWellness(familyId: string, requesterId: string, days: number = 7): Promise<{ success: boolean; wellness?: WellnessData[]; error?: string }> {
    try {
      // Verify requester is member of family
      const requesterMember = await this.storage.get(`member:${familyId}:${requesterId}`);
      if (!requesterMember || requesterMember.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const wellness: WellnessData[] = [];
      const wellnessKeys = await this.storage.list({ prefix: `wellness:${familyId}:` });
      
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      for (const [, wellnessData] of wellnessKeys) {
        const data = wellnessData as WellnessData;
        if (new Date(data.timestamp) >= cutoffDate) {
          wellness.push(data);
        }
      }

      return { success: true, wellness };
    } catch (error) {
      console.error('Error getting family wellness:', error);
      return { success: false, error: 'Failed to get family wellness data' };
    }
  }

  // Emergency SOS
  async triggerSOS(data: {
    userId: string;
    familyId: string;
    latitude: number;
    longitude: number;
    address?: string;
    message?: string;
  }): Promise<{ success: boolean; sosId?: string; error?: string }> {
    try {
      // Verify user is member of family
      const member = await this.storage.get(`member:${data.familyId}:${data.userId}`);
      if (!member || member.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const sosId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Get all family members to notify
      const members: FamilyMember[] = [];
      const memberKeys = await this.storage.list({ prefix: `member:${data.familyId}:` });
      
      for (const [, memberData] of memberKeys) {
        const familyMember = memberData as FamilyMember;
        if (familyMember.userId !== data.userId && familyMember.permissions.canReceiveAlerts) {
          members.push(familyMember);
        }
      }

      const sos: EmergencySOS = {
        id: sosId,
        userId: data.userId,
        familyId: data.familyId,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
        },
        message: data.message,
        status: 'active',
        createdAt: now,
        notifiedMembers: members.map(m => m.userId),
      };

      await this.storage.put(`sos:${sosId}`, sos);
      await this.storage.put(`active_sos:${data.familyId}:${sosId}`, true);

      // Update location with emergency flag
      await this.updateLocation({
        ...data,
        isEmergency: true,
      });

      return { success: true, sosId };
    } catch (error) {
      console.error('Error triggering SOS:', error);
      return { success: false, error: 'Failed to trigger SOS' };
    }
  }

  async resolveSOS(data: {
    sosId: string;
    resolvedBy: string;
    status: 'resolved' | 'false_alarm';
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const sos = await this.storage.get(`sos:${data.sosId}`);
      if (!sos) {
        return { success: false, error: 'SOS not found' };
      }

      // Verify resolver is member of family
      const member = await this.storage.get(`member:${sos.familyId}:${data.resolvedBy}`);
      if (!member || member.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      sos.status = data.status;
      sos.resolvedAt = new Date().toISOString();

      await this.storage.put(`sos:${data.sosId}`, sos);
      await this.storage.delete(`active_sos:${sos.familyId}:${data.sosId}`);

      return { success: true };
    } catch (error) {
      console.error('Error resolving SOS:', error);
      return { success: false, error: 'Failed to resolve SOS' };
    }
  }

  async getActiveSOS(familyId: string, requesterId: string): Promise<{ success: boolean; emergencies?: EmergencySOS[]; error?: string }> {
    try {
      // Verify requester is member of family
      const requesterMember = await this.storage.get(`member:${familyId}:${requesterId}`);
      if (!requesterMember || requesterMember.status !== 'active') {
        return { success: false, error: 'User not authorized for this family' };
      }

      const emergencies: EmergencySOS[] = [];
      const activeSosKeys = await this.storage.list({ prefix: `active_sos:${familyId}:` });
      
      for (const [key] of activeSosKeys) {
        const sosId = key.split(':')[2];
        const sos = await this.storage.get(`sos:${sosId}`);
        if (sos) {
          emergencies.push(sos as EmergencySOS);
        }
      }

      return { success: true, emergencies };
    } catch (error) {
      console.error('Error getting active SOS:', error);
      return { success: false, error: 'Failed to get active emergencies' };
    }
  }

  async updateWalletBalance(data: {
    amount: number;
    transactionId: string;
    description: string;
    reference: string;
  }): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      // Get current wallet balance
      let currentBalance = await this.storage.get('wallet:balance') || 0;
      
      // Check if transaction already processed
      const existingTransaction = await this.storage.get(`transaction:${data.transactionId}`);
      if (existingTransaction) {
        return { success: false, error: 'Transaction already processed' };
      }

      // Update balance
      const newBalance = currentBalance + data.amount;
      await this.storage.put('wallet:balance', newBalance);

      // Store transaction record
      const transaction = {
        id: data.transactionId,
        amount: data.amount,
        description: data.description,
        reference: data.reference,
        timestamp: new Date().toISOString(),
        type: 'deposit',
        source: 'sepay'
      };
      await this.storage.put(`transaction:${data.transactionId}`, transaction);

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return { success: false, error: 'Failed to update wallet balance' };
    }
  }

  // Handle HTTP requests to the Durable Object
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    try {
      switch (`${method} ${url.pathname}`) {
        case 'POST /create-family': {
          const data = await request.json() as { name: string; description?: string; createdBy: string; };
          const result = await this.createFamily(data);
          return Response.json(result);
        }

        case 'GET /family': {
          const familyId = url.searchParams.get('familyId');
          if (!familyId) {
            return Response.json({ success: false, error: 'Family ID required' }, { status: 400 });
          }
          const result = await this.getFamilyDetails(familyId);
          return Response.json(result);
        }

        case 'GET /user-families': {
          const userId = url.searchParams.get('userId');
          if (!userId) {
            return Response.json({ success: false, error: 'User ID required' }, { status: 400 });
          }
          const result = await this.getUserFamilies(userId);
          return Response.json(result);
        }

        case 'POST /invite-member': {
          const data = await request.json() as { familyId: string; invitedEmail: string; invitedBy: string; };
          const result = await this.inviteMember(data);
          return Response.json(result);
        }

        case 'POST /accept-invitation': {
          const data = await request.json() as { token: string; userId: string; };
          const result = await this.acceptInvitation(data);
          return Response.json(result);
        }

        case 'GET /family-members': {
          const familyId = url.searchParams.get('familyId');
          if (!familyId) {
            return Response.json({ success: false, error: 'Family ID required' }, { status: 400 });
          }
          const result = await this.getFamilyMembers(familyId);
          return Response.json(result);
        }

        case 'POST /update-location': {
          const data = await request.json() as { userId: string; familyId: string; latitude: number; longitude: number; accuracy?: number; address?: string; isEmergency?: boolean; };
          const result = await this.updateLocation(data);
          return Response.json(result);
        }

        case 'GET /family-locations': {
          const familyId = url.searchParams.get('familyId');
          const requesterId = url.searchParams.get('requesterId');
          if (!familyId || !requesterId) {
            return Response.json({ success: false, error: 'Family ID and requester ID required' }, { status: 400 });
          }
          const result = await this.getFamilyLocations(familyId, requesterId);
          return Response.json(result);
        }

        case 'POST /update-wellness': {
          const data = await request.json() as { userId: string; familyId: string; date: string; sleepHours?: number; steps?: number; heartRate?: number; mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible'; notes?: string; };
          const result = await this.updateWellness(data);
          return Response.json(result);
        }

        case 'GET /family-wellness': {
          const familyId = url.searchParams.get('familyId');
          const requesterId = url.searchParams.get('requesterId');
          const days = parseInt(url.searchParams.get('days') || '7');
          if (!familyId || !requesterId) {
            return Response.json({ success: false, error: 'Family ID and requester ID required' }, { status: 400 });
          }
          const result = await this.getFamilyWellness(familyId, requesterId, days);
          return Response.json(result);
        }

        case 'POST /trigger-sos': {
          const data = await request.json() as { userId: string; familyId: string; latitude: number; longitude: number; address?: string; message?: string; };
          const result = await this.triggerSOS(data);
          return Response.json(result);
        }

        case 'POST /resolve-sos': {
          const data = await request.json() as { sosId: string; resolvedBy: string; status: 'resolved' | 'false_alarm'; };
          const result = await this.resolveSOS(data);
          return Response.json(result);
        }

        case 'GET /active-sos': {
          const familyId = url.searchParams.get('familyId');
          const requesterId = url.searchParams.get('requesterId');
          if (!familyId || !requesterId) {
            return Response.json({ success: false, error: 'Family ID and requester ID required' }, { status: 400 });
          }
          const result = await this.getActiveSOS(familyId, requesterId);
          return Response.json(result);
        }

        case 'POST /update-wallet-balance': {
          const data = await request.json() as { amount: number; transactionId: string; description: string; reference: string; };
          const result = await this.updateWalletBalance(data);
          return Response.json(result);
        }

        default:
          return Response.json({ success: false, error: 'Endpoint not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('FamilyDO fetch error:', error);
      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  }
}