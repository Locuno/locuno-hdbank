import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { CommunityWalletService } from '../services/CommunityWalletService.js';

const communities = new Hono();

// JWT middleware for all community routes
communities.use('*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env?.JWT_SECRET as string) || 'fallback-secret',
  });
  return jwtMiddleware(c, next);
});

// Create a new community
communities.post('/', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { name, type, description } = await c.req.json();

    if (!name || !type) {
      return c.json({ success: false, message: 'Community name and type are required' }, 400);
    }

    // Validate community type
    const validTypes = ['apartment', 'school', 'neighborhood'];
    if (!validTypes.includes(type)) {
      return c.json({ success: false, message: 'Invalid community type' }, 400);
    }

    // Create community wallet using the existing service
    const result = await CommunityWalletService.createWallet(c.env, {
      name,
      description: description || `${type} community: ${name}`,
      createdBy: userId,
      settings: {
        type,
        requiresApproval: true,
        votingThreshold: 0.5,
      },
    });

    if (result.success) {
      // Generate join link and wallet ID for frontend compatibility
      const communityId = result.walletId;
      const baseUrl = c.req.header('origin') || 'http://localhost:3000';
      const joinLink = `${baseUrl}/community/join/${communityId}`;
      
      const community = {
        id: communityId,
        name,
        type,
        description,
        members: 1,
        balance: 0,
        currency: 'VND',
        joinLink,
        walletId: communityId,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return c.json({
        success: true,
        message: 'Community created successfully',
        data: { community },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating community:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Get user's communities
communities.get('/', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;

    const result = await CommunityWalletService.getUserWallets(c.env, userId);

    if (result.success) {
      // Transform wallet data to community format for frontend compatibility
      const communities = result.wallets?.map((wallet: any) => ({
        id: wallet.id,
        name: wallet.name,
        type: wallet.settings?.type || 'neighborhood',
        description: wallet.description,
        members: wallet.memberCount || 1,
        balance: wallet.balance || 0,
        currency: 'VND',
        joinLink: `${c.req.header('origin') || 'http://localhost:3000'}/community/join/${wallet.id}`,
        walletId: wallet.id,
        createdBy: wallet.createdBy,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      })) || [];

      return c.json({
        success: true,
        message: 'Communities retrieved successfully',
        data: { communities },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting user communities:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Get community details
communities.get('/:communityId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const communityId = c.req.param('communityId');

    const result = await CommunityWalletService.getWalletDetails(c.env, communityId);

    if (result.success) {
      // Check if user is a member
      const memberResult = await CommunityWalletService.getWalletMembers(c.env, communityId);
      const isMember = memberResult.success && 
        memberResult.members?.some((member: any) => member.userId === userId);

      if (!isMember) {
        return c.json({ success: false, message: 'Access denied' }, 403);
      }

      // Transform wallet data to community format
      const community = {
        id: result.wallet.id,
        name: result.wallet.name,
        type: result.wallet.settings?.type || 'neighborhood',
        description: result.wallet.description,
        members: result.wallet.memberCount || 1,
        balance: result.wallet.balance || 0,
        currency: 'VND',
        joinLink: `${c.req.header('origin') || 'http://localhost:3000'}/community/join/${result.wallet.id}`,
        walletId: result.wallet.id,
        createdBy: result.wallet.createdBy,
        createdAt: result.wallet.createdAt,
        updatedAt: result.wallet.updatedAt,
      };

      return c.json({
        success: true,
        message: 'Community details retrieved successfully',
        data: { community },
      });
    } else {
      return c.json({ success: false, message: result.error }, 404);
    }
  } catch (error) {
    console.error('Error getting community details:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Join community (for future use)
communities.post('/:communityId/join', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const communityId = c.req.param('communityId');
    const { joinToken } = await c.req.json();

    // This would use the wallet invitation system
    const result = await CommunityWalletService.acceptInvitation(c.env, {
      token: joinToken,
      userId,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Successfully joined community',
        data: { communityId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error joining community:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export default communities;