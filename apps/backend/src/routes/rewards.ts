import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { SmartRewardsService } from '../services/SmartRewardsService.js';

const rewards = new Hono();

// JWT middleware for all rewards routes
rewards.use('*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env?.JWT_SECRET as string) || 'fallback-secret',
  });
  return jwtMiddleware(c, next);
});

// User Rewards Profile Management
rewards.get('/profile', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;

    const result = await SmartRewardsService.getUserProfile(c.env, userId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Rewards profile retrieved successfully',
        data: { profile: result.profile },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting rewards profile:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/profile', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { preferences, goals } = await c.req.json();

    const result = await SmartRewardsService.createUserProfile(c.env, {
      userId,
      preferences,
      goals,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Rewards profile created successfully',
        data: { profile: result.profile },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating rewards profile:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.put('/profile', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { preferences, goals } = await c.req.json();

    const result = await SmartRewardsService.updateUserProfile(c.env, {
      userId,
      preferences,
      goals,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Rewards profile updated successfully',
        data: { profile: result.profile },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error updating rewards profile:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Points Management
rewards.post('/points/award', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { points, activity, category, metadata } = await c.req.json();

    if (!points || !activity) {
      return c.json({ 
        success: false, 
        message: 'Points and activity are required' 
      }, 400);
    }

    const result = await SmartRewardsService.awardPoints(c.env, {
      userId,
      points,
      activity,
      category,
      metadata,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Points awarded successfully',
        data: { 
          pointsAwarded: result.pointsAwarded,
          totalPoints: result.totalPoints,
          newLevel: result.newLevel,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error awarding points:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/points/spend', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { points, activity, reference } = await c.req.json();

    if (!points || !activity) {
      return c.json({ 
        success: false, 
        message: 'Points and activity are required' 
      }, 400);
    }

    const result = await SmartRewardsService.spendPoints(c.env, {
      userId,
      points,
      activity,
      reference,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Points spent successfully',
        data: { 
          pointsSpent: result.pointsSpent,
          remainingPoints: result.remainingPoints,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error spending points:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.get('/points/activities', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const type = c.req.query('type'); // 'earned' or 'spent'

    const result = await SmartRewardsService.getPointsActivities(c.env, {
      userId,
      limit,
      offset,
      ...(type && { type }),
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Points activities retrieved successfully',
        data: { 
          activities: result.activities,
          total: result.total,
          hasMore: result.hasMore,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting points activities:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Deals Management
rewards.get('/deals', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const category = c.req.query('category');
    const minLevel = c.req.query('minLevel');
    const featured = c.req.query('featured');
    const status = c.req.query('status') || 'active';

    const result = await SmartRewardsService.getDeals(c.env, {
      userId,
      ...(category && { category }),
      ...(minLevel && { minLevel: parseInt(minLevel) }),
      featured: featured === 'true',
      status,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Deals retrieved successfully',
        data: { deals: result.deals },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting deals:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/deals', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { 
      title, 
      description, 
      category, 
      pointsCost, 
      originalPrice, 
      discountedPrice, 
      minLevel, 
      maxRedemptions, 
      validUntil, 
      terms, 
      featured 
    } = await c.req.json();

    if (!title || !description || !pointsCost) {
      return c.json({ 
        success: false, 
        message: 'Title, description, and points cost are required' 
      }, 400);
    }

    const result = await SmartRewardsService.createDeal(c.env, {
      createdBy: userId,
      title,
      description,
      category,
      pointsCost,
      originalPrice,
      discountedPrice,
      minLevel,
      maxRedemptions,
      validUntil,
      terms,
      featured,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Deal created successfully',
        data: { dealId: result.dealId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/deals/:dealId/redeem', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const dealId = c.req.param('dealId');
    const { quantity = 1 } = await c.req.json();

    const result = await SmartRewardsService.redeemDeal(c.env, {
      userId,
      dealId,
      quantity,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Deal redeemed successfully',
        data: { 
          redemptionId: result.redemptionId,
          redemptionCode: result.redemptionCode,
          pointsSpent: result.pointsSpent,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error redeeming deal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.get('/deals/my-redemptions', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const status = c.req.query('status'); // 'pending', 'used', 'expired'
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await SmartRewardsService.getUserRedemptions(c.env, {
      userId,
      ...(status && { status }),
      limit,
      offset,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'User redemptions retrieved successfully',
        data: { 
          redemptions: result.redemptions,
          total: result.total,
          hasMore: result.hasMore,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting user redemptions:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Auctions Management
rewards.get('/auctions', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const status = c.req.query('status') || 'active';
    const category = c.req.query('category');

    const result = await SmartRewardsService.getAuctions(c.env, {
      userId,
      status,
      ...(category && { category }),
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Auctions retrieved successfully',
        data: { auctions: result.auctions },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting auctions:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/auctions', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { 
      title, 
      description, 
      category, 
      startingBid, 
      minBidIncrement, 
      endTime, 
      terms 
    } = await c.req.json();

    if (!title || !description || !startingBid || !endTime) {
      return c.json({ 
        success: false, 
        message: 'Title, description, starting bid, and end time are required' 
      }, 400);
    }

    const result = await SmartRewardsService.createAuction(c.env, {
      createdBy: userId,
      title,
      description,
      category,
      startingBid,
      minBidIncrement,
      endTime,
      terms,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Auction created successfully',
        data: { auctionId: result.auctionId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating auction:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/auctions/:auctionId/bid', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const auctionId = c.req.param('auctionId');
    const { bidAmount } = await c.req.json();

    if (!bidAmount) {
      return c.json({ 
        success: false, 
        message: 'Bid amount is required' 
      }, 400);
    }

    const result = await SmartRewardsService.placeBid(c.env, {
      auctionId,
      bidderId: userId,
      bidAmount,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Bid placed successfully',
        data: { 
          bidId: result.bidId,
          currentHighestBid: result.currentHighestBid,
          isHighestBidder: result.isHighestBidder,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error placing bid:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.get('/auctions/:auctionId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const auctionId = c.req.param('auctionId');

    const result = await SmartRewardsService.getAuctionDetails(c.env, {
      auctionId,
      userId,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Auction details retrieved successfully',
        data: { auction: result.auction },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting auction details:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Challenges Management
rewards.get('/challenges', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const status = c.req.query('status') || 'active';
    const category = c.req.query('category');

    const result = await SmartRewardsService.getChallenges(c.env, {
      userId,
      status,
      ...(category && { category }),
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Challenges retrieved successfully',
        data: { challenges: result.challenges },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting challenges:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/challenges/:challengeId/join', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const challengeId = c.req.param('challengeId');

    const result = await SmartRewardsService.joinChallenge(c.env, {
      challengeId,
      userId,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Challenge joined successfully',
        data: { participationId: result.participationId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error joining challenge:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.post('/challenges/:challengeId/progress', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const challengeId = c.req.param('challengeId');
    const { progress, evidence } = await c.req.json();

    if (progress === undefined) {
      return c.json({ 
        success: false, 
        message: 'Progress is required' 
      }, 400);
    }

    const result = await SmartRewardsService.updateChallengeProgress(c.env, {
      challengeId,
      userId,
      progress,
      evidence,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Challenge progress updated successfully',
        data: { 
          currentProgress: result.currentProgress,
          isCompleted: result.isCompleted,
          pointsEarned: result.pointsEarned,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

rewards.get('/challenges/my-participations', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const status = c.req.query('status'); // 'active', 'completed', 'failed'

    const result = await SmartRewardsService.getUserChallengeParticipations(c.env, {
      userId,
      ...(status && { status }),
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'User challenge participations retrieved successfully',
        data: { participations: result.participations },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting user challenge participations:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Leaderboards
rewards.get('/leaderboard', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const period = c.req.query('period') || 'all-time'; // 'weekly', 'monthly', 'all-time'
    const category = c.req.query('category');
    const limit = parseInt(c.req.query('limit') || '50');

    const result = await SmartRewardsService.getLeaderboard(c.env, {
      userId,
      period,
      ...(category && { category }),
      limit,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Leaderboard retrieved successfully',
        data: { 
          leaderboard: result.leaderboard,
          userRank: result.userRank,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export { rewards };