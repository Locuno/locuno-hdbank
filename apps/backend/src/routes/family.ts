import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { FamilyService } from '../services/FamilyService';

const family = new Hono();

// JWT middleware for all family routes
family.use('*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env?.JWT_SECRET || 'fallback-secret',
  });
  return jwtMiddleware(c, next);
});

// Family Circle Management
family.post('/circles', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { name, description, settings } = await c.req.json();

    if (!name) {
      return c.json({ success: false, message: 'Family name is required' }, 400);
    }

    const result = await FamilyService.createFamily(c.env, {
      name,
      description,
      createdBy: userId,
      settings,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family circle created successfully',
        data: { familyId: result.familyId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating family circle:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;

    const result = await FamilyService.getUserFamilies(c.env, userId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'User families retrieved successfully',
        data: { families: result.families },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting user families:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles/:familyId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');

    // First check if user is a member of this family
    const memberResult = await FamilyService.getFamilyMembers(c.env, familyId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Family not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await FamilyService.getFamilyDetails(c.env, familyId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family details retrieved successfully',
        data: { family: result.family },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting family details:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Member Management
family.post('/circles/:familyId/invite', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const { email, role = 'member' } = await c.req.json();

    if (!email) {
      return c.json({ success: false, message: 'Email is required' }, 400);
    }

    const result = await FamilyService.inviteMember(c.env, {
      familyId,
      invitedEmail: email,
      invitedBy: userId,
      role,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family invitation sent successfully',
        data: { invitationId: result.invitationId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error inviting family member:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.post('/invitations/:token/accept', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const token = c.req.param('token');

    const result = await FamilyService.acceptInvitation(c.env, {
      token,
      userId,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family invitation accepted successfully',
        data: { familyId: result.familyId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error accepting family invitation:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles/:familyId/members', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');

    // Check if user is a member of this family
    const memberResult = await FamilyService.getFamilyMembers(c.env, familyId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Family not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    return c.json({
      success: true,
      message: 'Family members retrieved successfully',
      data: { members: memberResult.members },
    });
  } catch (error) {
    console.error('Error getting family members:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Location Sharing
family.post('/circles/:familyId/location', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const { latitude, longitude, accuracy, address, timestamp } = await c.req.json();

    if (!latitude || !longitude) {
      return c.json({ success: false, message: 'Latitude and longitude are required' }, 400);
    }

    const result = await FamilyService.updateLocation(c.env, {
      familyId,
      userId,
      locationData: {
        latitude,
        longitude,
        accuracy,
        address,
        timestamp: timestamp || new Date().toISOString(),
      },
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Location updated successfully',
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error updating location:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles/:familyId/locations', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');

    // Check if user is a member of this family
    const memberResult = await FamilyService.getFamilyMembers(c.env, familyId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Family not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await FamilyService.getFamilyLocations(c.env, familyId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family locations retrieved successfully',
        data: { locations: result.locations },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting family locations:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Wellness Tracking
family.post('/circles/:familyId/wellness', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const { type, value, unit, notes, timestamp } = await c.req.json();

    if (!type || value === undefined) {
      return c.json({ success: false, message: 'Type and value are required' }, 400);
    }

    const result = await FamilyService.updateWellness(c.env, {
      familyId,
      userId,
      wellnessData: {
        type,
        value,
        unit,
        notes,
        timestamp: timestamp || new Date().toISOString(),
      },
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Wellness data updated successfully',
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error updating wellness data:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles/:familyId/wellness', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');

    // Check if user is a member of this family
    const memberResult = await FamilyService.getFamilyMembers(c.env, familyId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Family not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await FamilyService.getFamilyWellness(c.env, familyId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Family wellness data retrieved successfully',
        data: { wellness: result.wellness },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting family wellness data:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Emergency SOS
family.post('/circles/:familyId/sos', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const { type, message, location, severity = 'medium' } = await c.req.json();

    if (!type) {
      return c.json({ success: false, message: 'SOS type is required' }, 400);
    }

    const result = await FamilyService.triggerSOS(c.env, {
      familyId,
      triggeredBy: userId,
      type,
      message,
      location,
      severity,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Emergency SOS triggered successfully',
        data: { sosId: result.sosId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error triggering SOS:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.post('/circles/:familyId/sos/:sosId/resolve', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const sosId = c.req.param('sosId');
    const { resolution, notes } = await c.req.json();

    const result = await FamilyService.resolveSOS(c.env, {
      familyId,
      sosId,
      resolvedBy: userId,
      resolution,
      notes,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Emergency SOS resolved successfully',
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error resolving SOS:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

family.get('/circles/:familyId/sos', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const familyId = c.req.param('familyId');
    const status = c.req.query('status'); // 'active' or 'resolved'

    // Check if user is a member of this family
    const memberResult = await FamilyService.getFamilyMembers(c.env, familyId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Family not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await FamilyService.getActiveSOS(c.env, familyId);

    if (result.success) {
      let sosAlerts = result.sosAlerts || [];
      
      // Filter by status if provided
      if (status) {
        sosAlerts = sosAlerts.filter((sos: any) => sos.status === status);
      }

      return c.json({
        success: true,
        message: 'SOS alerts retrieved successfully',
        data: { sosAlerts },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting SOS alerts:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export { family };