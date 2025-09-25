import { z } from 'zod';

// User Rewards Profile Schema
const UserRewardsProfileSchema = z.object({
  userId: z.string(),
  totalPoints: z.number().default(0),
  availablePoints: z.number().default(0),
  spentPoints: z.number().default(0),
  level: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']).default('bronze'),
  streak: z.object({
    current: z.number().default(0),
    longest: z.number().default(0),
    lastActivity: z.string().optional(),
  }),
  achievements: z.array(z.string()).default([]),
  joinedAt: z.string(),
  updatedAt: z.string(),
  preferences: z.object({
    categories: z.array(z.string()).default([]),
    notifications: z.boolean().default(true),
    publicProfile: z.boolean().default(false),
  }),
});

// Reward Activity Schema
const RewardActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    'daily_checkin',
    'wellness_goal',
    'family_interaction',
    'community_participation',
    'referral',
    'purchase',
    'review',
    'social_share',
    'challenge_completion',
    'bonus'
  ]),
  points: z.number(),
  description: z.string(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
  source: z.string().optional(), // Source app/feature
  multiplier: z.number().default(1),
  validated: z.boolean().default(true),
});

// Deal Schema
const DealSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  brand: z.string(),
  originalPrice: z.number(),
  discountedPrice: z.number(),
  pointsCost: z.number(),
  discountPercentage: z.number(),
  imageUrl: z.string().optional(),
  termsAndConditions: z.string(),
  validFrom: z.string(),
  validUntil: z.string(),
  maxRedemptions: z.number().optional(),
  currentRedemptions: z.number().default(0),
  minLevel: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']).default('bronze'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'inactive', 'expired', 'sold_out']).default('active'),
  createdAt: z.string(),
  updatedAt: z.string(),
  exclusiveUntil: z.string().optional(), // For early access
  featured: z.boolean().default(false),
});

// Deal Redemption Schema
const DealRedemptionSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  userId: z.string(),
  pointsSpent: z.number(),
  redemptionCode: z.string(),
  status: z.enum(['pending', 'confirmed', 'used', 'expired', 'cancelled']),
  redeemedAt: z.string(),
  usedAt: z.string().optional(),
  expiresAt: z.string(),
  metadata: z.record(z.any()).optional(),
});

// Auction Schema
const AuctionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  brand: z.string(),
  imageUrl: z.string().optional(),
  startingBid: z.number(), // in points
  currentBid: z.number(),
  currentBidder: z.string().optional(),
  minBidIncrement: z.number().default(10),
  maxBid: z.number().optional(), // Buy it now price
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(['upcoming', 'active', 'ended', 'cancelled']),
  minLevel: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']).default('bronze'),
  featured: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  winnerUserId: z.string().optional(),
  finalPrice: z.number().optional(),
});

// Auction Bid Schema
const AuctionBidSchema = z.object({
  id: z.string(),
  auctionId: z.string(),
  userId: z.string(),
  bidAmount: z.number(),
  timestamp: z.string(),
  status: z.enum(['active', 'outbid', 'winning', 'won', 'lost']),
  autoMaxBid: z.number().optional(), // For automatic bidding
});

// Challenge Schema
const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['daily', 'weekly', 'monthly', 'special']),
  category: z.string(),
  pointsReward: z.number(),
  bonusMultiplier: z.number().default(1),
  requirements: z.record(z.any()), // Flexible requirements structure
  startDate: z.string(),
  endDate: z.string(),
  maxParticipants: z.number().optional(),
  currentParticipants: z.number().default(0),
  status: z.enum(['upcoming', 'active', 'completed', 'cancelled']),
  featured: z.boolean().default(false),
  createdAt: z.string(),
});

// Challenge Participation Schema
const ChallengeParticipationSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  userId: z.string(),
  status: z.enum(['joined', 'in_progress', 'completed', 'failed', 'abandoned']),
  progress: z.record(z.any()), // Flexible progress tracking
  joinedAt: z.string(),
  completedAt: z.string().optional(),
  pointsEarned: z.number().default(0),
});

type UserRewardsProfile = z.infer<typeof UserRewardsProfileSchema>;
type RewardActivity = z.infer<typeof RewardActivitySchema>;
type Deal = z.infer<typeof DealSchema>;
type DealRedemption = z.infer<typeof DealRedemptionSchema>;
type Auction = z.infer<typeof AuctionSchema>;
type AuctionBid = z.infer<typeof AuctionBidSchema>;
type Challenge = z.infer<typeof ChallengeSchema>;
type ChallengeParticipation = z.infer<typeof ChallengeParticipationSchema>;

export class SmartRewardsDO {
  private storage: any;
  private env: any;

  constructor(state: any, env: any) {
    this.storage = state.storage;
    this.env = env;
  }

  // User Rewards Profile Management
  async createUserProfile(userId: string): Promise<{ success: boolean; profile?: UserRewardsProfile; error?: string }> {
    try {
      const existingProfile = await this.storage.get(`user_profile:${userId}`);
      if (existingProfile) {
        return { success: true, profile: existingProfile };
      }

      const now = new Date().toISOString();
      const profile: UserRewardsProfile = {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        spentPoints: 0,
        level: 'bronze',
        streak: {
          current: 0,
          longest: 0,
        },
        achievements: [],
        joinedAt: now,
        updatedAt: now,
        preferences: {
          categories: [],
          notifications: true,
          publicProfile: false,
        },
      };

      await this.storage.put(`user_profile:${userId}`, profile);
      return { success: true, profile };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: 'Failed to create user profile' };
    }
  }

  async getUserProfile(userId: string): Promise<{ success: boolean; profile?: UserRewardsProfile; error?: string }> {
    try {
      const profile = await this.storage.get(`user_profile:${userId}`);
      if (!profile) {
        // Auto-create profile if it doesn't exist
        return await this.createUserProfile(userId);
      }
      return { success: true, profile };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: 'Failed to get user profile' };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserRewardsProfile>): Promise<{ success: boolean; profile?: UserRewardsProfile; error?: string }> {
    try {
      const profile = await this.storage.get(`user_profile:${userId}`);
      if (!profile) {
        return { success: false, error: 'User profile not found' };
      }

      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.put(`user_profile:${userId}`, updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  // Points and Rewards Management
  async awardPoints(data: {
    userId: string;
    type: RewardActivity['type'];
    points: number;
    description: string;
    metadata?: Record<string, any>;
    source?: string;
    multiplier?: number;
  }): Promise<{ success: boolean; activity?: RewardActivity; newBalance?: number; error?: string }> {
    try {
      const profileResult = await this.getUserProfile(data.userId);
      if (!profileResult.success || !profileResult.profile) {
        return { success: false, error: 'User profile not found' };
      }

      const profile = profileResult.profile;
      const multiplier = data.multiplier || 1;
      const finalPoints = Math.round(data.points * multiplier);

      // Create activity record
      const activityId = crypto.randomUUID();
      const activity: RewardActivity = {
        id: activityId,
        userId: data.userId,
        type: data.type,
        points: finalPoints,
        description: data.description,
        metadata: data.metadata,
        timestamp: new Date().toISOString(),
        source: data.source,
        multiplier,
        validated: true,
      };

      await this.storage.put(`activity:${activityId}`, activity);
      await this.storage.put(`user_activity:${data.userId}:${activity.timestamp}:${activityId}`, true);

      // Update user profile
      const newTotalPoints = profile.totalPoints + finalPoints;
      const newAvailablePoints = profile.availablePoints + finalPoints;
      
      // Update level based on total points
      const newLevel = this.calculateLevel(newTotalPoints);
      
      // Update streak for daily activities
      let newStreak = profile.streak;
      if (data.type === 'daily_checkin') {
        newStreak = this.updateStreak(profile.streak, activity.timestamp);
      }

      const updatedProfile = {
        ...profile,
        totalPoints: newTotalPoints,
        availablePoints: newAvailablePoints,
        level: newLevel,
        streak: newStreak,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.put(`user_profile:${data.userId}`, updatedProfile);

      return { success: true, activity, newBalance: newAvailablePoints };
    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, error: 'Failed to award points' };
    }
  }

  async spendPoints(data: {
    userId: string;
    points: number;
    description: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      const profileResult = await this.getUserProfile(data.userId);
      if (!profileResult.success || !profileResult.profile) {
        return { success: false, error: 'User profile not found' };
      }

      const profile = profileResult.profile;
      if (profile.availablePoints < data.points) {
        return { success: false, error: 'Insufficient points' };
      }

      // Create spending activity record
      const activityId = crypto.randomUUID();
      const activity: RewardActivity = {
        id: activityId,
        userId: data.userId,
        type: 'purchase',
        points: -data.points, // Negative for spending
        description: data.description,
        metadata: { ...data.metadata, reference: data.reference },
        timestamp: new Date().toISOString(),
        multiplier: 1,
        validated: true,
      };

      await this.storage.put(`activity:${activityId}`, activity);
      await this.storage.put(`user_activity:${data.userId}:${activity.timestamp}:${activityId}`, true);

      // Update user profile
      const newAvailablePoints = profile.availablePoints - data.points;
      const newSpentPoints = profile.spentPoints + data.points;

      const updatedProfile = {
        ...profile,
        availablePoints: newAvailablePoints,
        spentPoints: newSpentPoints,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.put(`user_profile:${data.userId}`, updatedProfile);

      return { success: true, newBalance: newAvailablePoints };
    } catch (error) {
      console.error('Error spending points:', error);
      return { success: false, error: 'Failed to spend points' };
    }
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<{ success: boolean; activities?: RewardActivity[]; error?: string }> {
    try {
      const activities: RewardActivity[] = [];
      const activityKeys = await this.storage.list({ 
        prefix: `user_activity:${userId}:`,
        limit,
        reverse: true // Get most recent first
      });
      
      for (const [key] of activityKeys) {
        const activityId = key.split(':')[3];
        const activity = await this.storage.get(`activity:${activityId}`);
        if (activity) {
          activities.push(activity as RewardActivity);
        }
      }

      return { success: true, activities };
    } catch (error) {
      console.error('Error getting user activities:', error);
      return { success: false, error: 'Failed to get user activities' };
    }
  }

  // Deal Management
  async createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'currentRedemptions'>): Promise<{ success: boolean; dealId?: string; error?: string }> {
    try {
      const dealId = crypto.randomUUID();
      const now = new Date().toISOString();

      const deal: Deal = {
        ...dealData,
        id: dealId,
        currentRedemptions: 0,
        createdAt: now,
        updatedAt: now,
      };

      await this.storage.put(`deal:${dealId}`, deal);
      await this.storage.put(`deal_category:${dealData.category}:${dealId}`, true);
      
      if (deal.featured) {
        await this.storage.put(`featured_deal:${dealId}`, true);
      }

      return { success: true, dealId };
    } catch (error) {
      console.error('Error creating deal:', error);
      return { success: false, error: 'Failed to create deal' };
    }
  }

  async getDeals(filters?: {
    category?: string;
    minLevel?: string;
    featured?: boolean;
    status?: string;
    limit?: number;
  }): Promise<{ success: boolean; deals?: Deal[]; error?: string }> {
    try {
      const deals: Deal[] = [];
      const limit = filters?.limit || 50;

      if (filters?.category) {
        // Get deals by category
        const categoryKeys = await this.storage.list({ 
          prefix: `deal_category:${filters.category}:`,
          limit
        });
        
        for (const [key] of categoryKeys) {
          const dealId = key.split(':')[2];
          const deal = await this.storage.get(`deal:${dealId}`);
          if (deal && this.matchesFilters(deal, filters)) {
            deals.push(deal as Deal);
          }
        }
      } else if (filters?.featured) {
        // Get featured deals
        const featuredKeys = await this.storage.list({ 
          prefix: 'featured_deal:',
          limit
        });
        
        for (const [key] of featuredKeys) {
          const dealId = key.split(':')[1];
          const deal = await this.storage.get(`deal:${dealId}`);
          if (deal && this.matchesFilters(deal, filters)) {
            deals.push(deal as Deal);
          }
        }
      } else {
        // Get all deals
        const dealKeys = await this.storage.list({ 
          prefix: 'deal:',
          limit
        });
        
        for (const [, deal] of dealKeys) {
          if (this.matchesFilters(deal as Deal, filters)) {
            deals.push(deal as Deal);
          }
        }
      }

      // Sort by creation date (newest first)
      deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { success: true, deals };
    } catch (error) {
      console.error('Error getting deals:', error);
      return { success: false, error: 'Failed to get deals' };
    }
  }

  async redeemDeal(data: {
    dealId: string;
    userId: string;
  }): Promise<{ success: boolean; redemption?: DealRedemption; error?: string }> {
    try {
      const deal = await this.storage.get(`deal:${data.dealId}`);
      if (!deal) {
        return { success: false, error: 'Deal not found' };
      }

      if (deal.status !== 'active') {
        return { success: false, error: 'Deal is not active' };
      }

      if (new Date(deal.validUntil) < new Date()) {
        return { success: false, error: 'Deal has expired' };
      }

      if (deal.maxRedemptions && deal.currentRedemptions >= deal.maxRedemptions) {
        return { success: false, error: 'Deal is sold out' };
      }

      // Check user level requirement
      const profileResult = await this.getUserProfile(data.userId);
      if (!profileResult.success || !profileResult.profile) {
        return { success: false, error: 'User profile not found' };
      }

      const profile = profileResult.profile;
      if (!this.hasRequiredLevel(profile.level, deal.minLevel)) {
        return { success: false, error: 'Insufficient user level' };
      }

      // Check if user has enough points
      if (profile.availablePoints < deal.pointsCost) {
        return { success: false, error: 'Insufficient points' };
      }

      // Spend points
      const spendResult = await this.spendPoints({
        userId: data.userId,
        points: deal.pointsCost,
        description: `Redeemed deal: ${deal.title}`,
        reference: data.dealId,
        metadata: { dealId: data.dealId, dealTitle: deal.title },
      });

      if (!spendResult.success) {
        return { success: false, error: spendResult.error || 'Failed to spend points' };
      }

      // Create redemption record
      const redemptionId = crypto.randomUUID();
      const redemptionCode = this.generateRedemptionCode();
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

      const redemption: DealRedemption = {
        id: redemptionId,
        dealId: data.dealId,
        userId: data.userId,
        pointsSpent: deal.pointsCost,
        redemptionCode,
        status: 'confirmed',
        redeemedAt: now,
        expiresAt,
        metadata: {
          dealTitle: deal.title,
          brand: deal.brand,
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
        },
      };

      await this.storage.put(`redemption:${redemptionId}`, redemption);
      await this.storage.put(`user_redemption:${data.userId}:${now}:${redemptionId}`, true);
      await this.storage.put(`deal_redemption:${data.dealId}:${redemptionId}`, true);

      // Update deal redemption count
      deal.currentRedemptions += 1;
      deal.updatedAt = now;
      await this.storage.put(`deal:${data.dealId}`, deal);

      return { success: true, redemption };
    } catch (error) {
      console.error('Error redeeming deal:', error);
      return { success: false, error: 'Failed to redeem deal' };
    }
  }

  async getUserRedemptions(userId: string, limit: number = 50): Promise<{ success: boolean; redemptions?: DealRedemption[]; error?: string }> {
    try {
      const redemptions: DealRedemption[] = [];
      const redemptionKeys = await this.storage.list({ 
        prefix: `user_redemption:${userId}:`,
        limit,
        reverse: true
      });
      
      for (const [key] of redemptionKeys) {
        const redemptionId = key.split(':')[3];
        const redemption = await this.storage.get(`redemption:${redemptionId}`);
        if (redemption) {
          redemptions.push(redemption as DealRedemption);
        }
      }

      return { success: true, redemptions };
    } catch (error) {
      console.error('Error getting user redemptions:', error);
      return { success: false, error: 'Failed to get user redemptions' };
    }
  }

  // Auction Management
  async createAuction(auctionData: Omit<Auction, 'id' | 'createdAt' | 'updatedAt' | 'currentBid' | 'currentBidder' | 'status'>): Promise<{ success: boolean; auctionId?: string; error?: string }> {
    try {
      const auctionId = crypto.randomUUID();
      const now = new Date().toISOString();
      const startTime = new Date(auctionData.startTime);
      const currentTime = new Date();

      const auction: Auction = {
        ...auctionData,
        id: auctionId,
        currentBid: auctionData.startingBid,
        status: startTime > currentTime ? 'upcoming' : 'active',
        createdAt: now,
        updatedAt: now,
      };

      await this.storage.put(`auction:${auctionId}`, auction);
      
      if (auction.featured) {
        await this.storage.put(`featured_auction:${auctionId}`, true);
      }

      // Schedule status updates based on start/end times
      if (auction.status === 'upcoming') {
        await this.storage.put(`upcoming_auction:${auctionData.startTime}:${auctionId}`, true);
      } else {
        await this.storage.put(`active_auction:${auctionData.endTime}:${auctionId}`, true);
      }

      return { success: true, auctionId };
    } catch (error) {
      console.error('Error creating auction:', error);
      return { success: false, error: 'Failed to create auction' };
    }
  }

  async placeBid(data: {
    auctionId: string;
    userId: string;
    bidAmount: number;
    autoMaxBid?: number;
  }): Promise<{ success: boolean; bid?: AuctionBid; isWinning?: boolean; error?: string }> {
    try {
      const auction = await this.storage.get(`auction:${data.auctionId}`);
      if (!auction) {
        return { success: false, error: 'Auction not found' };
      }

      if (auction.status !== 'active') {
        return { success: false, error: 'Auction is not active' };
      }

      if (new Date(auction.endTime) < new Date()) {
        return { success: false, error: 'Auction has ended' };
      }

      // Check user level requirement
      const profileResult = await this.getUserProfile(data.userId);
      if (!profileResult.success || !profileResult.profile) {
        return { success: false, error: 'User profile not found' };
      }

      const profile = profileResult.profile;
      if (!this.hasRequiredLevel(profile.level, auction.minLevel)) {
        return { success: false, error: 'Insufficient user level' };
      }

      // Validate bid amount
      const minBid = auction.currentBid + auction.minBidIncrement;
      if (data.bidAmount < minBid) {
        return { success: false, error: `Minimum bid is ${minBid} points` };
      }

      // Check if user has enough points
      if (profile.availablePoints < data.bidAmount) {
        return { success: false, error: 'Insufficient points' };
      }

      // Check max bid if specified
      if (auction.maxBid && data.bidAmount >= auction.maxBid) {
        // Buy it now
        return await this.buyNowAuction({
          auctionId: data.auctionId,
          userId: data.userId,
          bidAmount: auction.maxBid,
        });
      }

      const bidId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Mark previous winning bid as outbid
      if (auction.currentBidder) {
        const previousBids = await this.storage.list({ prefix: `auction_bid:${data.auctionId}:` });
        for (const [, bid] of previousBids) {
          const bidData = bid as AuctionBid;
          if (bidData.userId === auction.currentBidder && bidData.status === 'winning') {
            bidData.status = 'outbid';
            await this.storage.put(`bid:${bidData.id}`, bidData);
          }
        }
      }

      const bid: AuctionBid = {
        id: bidId,
        auctionId: data.auctionId,
        userId: data.userId,
        bidAmount: data.bidAmount,
        timestamp: now,
        status: 'winning',
        autoMaxBid: data.autoMaxBid,
      };

      await this.storage.put(`bid:${bidId}`, bid);
      await this.storage.put(`auction_bid:${data.auctionId}:${now}:${bidId}`, true);
      await this.storage.put(`user_bid:${data.userId}:${now}:${bidId}`, true);

      // Update auction
      auction.currentBid = data.bidAmount;
      auction.currentBidder = data.userId;
      auction.updatedAt = now;
      await this.storage.put(`auction:${data.auctionId}`, auction);

      return { success: true, bid, isWinning: true };
    } catch (error) {
      console.error('Error placing bid:', error);
      return { success: false, error: 'Failed to place bid' };
    }
  }

  private async buyNowAuction(data: {
    auctionId: string;
    userId: string;
    bidAmount: number;
  }): Promise<{ success: boolean; bid?: AuctionBid; isWinning?: boolean; error?: string }> {
    try {
      const auction = await this.storage.get(`auction:${data.auctionId}`);
      
      // Spend points for buy now
      const spendResult = await this.spendPoints({
        userId: data.userId,
        points: data.bidAmount,
        description: `Won auction: ${auction.title}`,
        reference: data.auctionId,
        metadata: { auctionId: data.auctionId, auctionTitle: auction.title },
      });

      if (!spendResult.success) {
        return { success: false, error: spendResult.error || 'Failed to spend points for auction' };
      }

      const bidId = crypto.randomUUID();
      const now = new Date().toISOString();

      const bid: AuctionBid = {
        id: bidId,
        auctionId: data.auctionId,
        userId: data.userId,
        bidAmount: data.bidAmount,
        timestamp: now,
        status: 'won',
      };

      await this.storage.put(`bid:${bidId}`, bid);

      // End auction
      auction.status = 'ended';
      auction.currentBid = data.bidAmount;
      auction.currentBidder = data.userId;
      auction.winnerUserId = data.userId;
      auction.finalPrice = data.bidAmount;
      auction.updatedAt = now;
      await this.storage.put(`auction:${data.auctionId}`, auction);

      return { success: true, bid, isWinning: true };
    } catch (error) {
      console.error('Error buying now auction:', error);
      return { success: false, error: 'Failed to buy now auction' };
    }
  }

  async getActiveAuctions(limit: number = 20): Promise<{ success: boolean; auctions?: Auction[]; error?: string }> {
    try {
      const auctions: Auction[] = [];
      const auctionKeys = await this.storage.list({ prefix: 'auction:', limit });
      
      for (const [, auction] of auctionKeys) {
        const auctionData = auction as Auction;
        if (auctionData.status === 'active' || auctionData.status === 'upcoming') {
          auctions.push(auctionData);
        }
      }

      // Sort by end time (ending soonest first)
      auctions.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

      return { success: true, auctions };
    } catch (error) {
      console.error('Error getting active auctions:', error);
      return { success: false, error: 'Failed to get active auctions' };
    }
  }

  // Helper Methods
  private calculateLevel(totalPoints: number): UserRewardsProfile['level'] {
    if (totalPoints >= 50000) return 'diamond';
    if (totalPoints >= 20000) return 'platinum';
    if (totalPoints >= 10000) return 'gold';
    if (totalPoints >= 5000) return 'silver';
    return 'bronze';
  }

  private updateStreak(currentStreak: UserRewardsProfile['streak'], activityTimestamp: string): UserRewardsProfile['streak'] {
    const activityDate = new Date(activityTimestamp).toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (activityDate === today) {
      // Same day, don't update streak
      return currentStreak;
    }

    if (currentStreak.lastActivity) {
      const lastActivityDate = new Date(currentStreak.lastActivity).toDateString();
      
      if (lastActivityDate === yesterday) {
        // Consecutive day
        const newCurrent = currentStreak.current + 1;
        return {
          current: newCurrent,
          longest: Math.max(newCurrent, currentStreak.longest),
          lastActivity: activityTimestamp,
        };
      } else {
        // Streak broken
        return {
          current: 1,
          longest: currentStreak.longest,
          lastActivity: activityTimestamp,
        };
      }
    } else {
      // First activity
      return {
        current: 1,
        longest: Math.max(1, currentStreak.longest),
        lastActivity: activityTimestamp,
      };
    }
  }

  private matchesFilters(deal: Deal, filters?: any): boolean {
    if (!filters) return true;
    
    if (filters.status && deal.status !== filters.status) return false;
    if (filters.minLevel && !this.hasRequiredLevel(filters.minLevel, deal.minLevel)) return false;
    if (filters.featured !== undefined && deal.featured !== filters.featured) return false;
    
    return true;
  }

  private hasRequiredLevel(userLevel: string, requiredLevel: string): boolean {
    const levels = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const userLevelIndex = levels.indexOf(userLevel);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    return userLevelIndex >= requiredLevelIndex;
  }

  private generateRedemptionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Handle HTTP requests to the Durable Object
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    try {
      switch (`${method} ${url.pathname}`) {
        case 'GET /user-profile': {
          const userId = url.searchParams.get('userId');
          if (!userId) {
            return Response.json({ success: false, error: 'User ID required' }, { status: 400 });
          }
          const result = await this.getUserProfile(userId);
          return Response.json(result);
        }

        case 'PUT /user-profile': {
          const data = await request.json() as { userId: string; updates: Partial<UserRewardsProfile>; };
          const result = await this.updateUserProfile(data.userId, data.updates);
          return Response.json(result);
        }

        case 'POST /award-points': {
          const data = await request.json() as { userId: string; type: RewardActivity['type']; points: number; description: string; metadata?: Record<string, any>; source?: string; multiplier?: number; };
          const result = await this.awardPoints(data);
          return Response.json(result);
        }

        case 'POST /spend-points': {
          const data = await request.json() as { userId: string; points: number; description: string; reference?: string; metadata?: Record<string, any>; };
          const result = await this.spendPoints(data);
          return Response.json(result);
        }

        case 'GET /user-activities': {
          const userId = url.searchParams.get('userId');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          if (!userId) {
            return Response.json({ success: false, error: 'User ID required' }, { status: 400 });
          }
          const result = await this.getUserActivities(userId, limit);
          return Response.json(result);
        }

        case 'POST /create-deal': {
          const data = await request.json() as Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'currentRedemptions'>;
          const result = await this.createDeal(data);
          return Response.json(result);
        }

        case 'GET /deals': {
          const category = url.searchParams.get('category');
          const minLevel = url.searchParams.get('minLevel');
          const featuredParam = url.searchParams.get('featured');
          const status = url.searchParams.get('status');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          
          const filters: any = { limit };
          if (category) filters.category = category;
          if (minLevel) filters.minLevel = minLevel;
          if (featuredParam === 'true') filters.featured = true;
          if (status) filters.status = status;
          
          const result = await this.getDeals(filters);
          return Response.json(result);
        }

        case 'POST /redeem-deal': {
          const data = await request.json() as { dealId: string; userId: string; };
          const result = await this.redeemDeal(data);
          return Response.json(result);
        }

        case 'GET /user-redemptions': {
          const userId = url.searchParams.get('userId');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          if (!userId) {
            return Response.json({ success: false, error: 'User ID required' }, { status: 400 });
          }
          const result = await this.getUserRedemptions(userId, limit);
          return Response.json(result);
        }

        case 'POST /create-auction': {
          const data = await request.json() as Omit<Auction, 'id' | 'createdAt' | 'updatedAt' | 'currentBid' | 'currentBidder' | 'status'>;
          const result = await this.createAuction(data);
          return Response.json(result);
        }

        case 'POST /place-bid': {
          const data = await request.json() as { auctionId: string; userId: string; bidAmount: number; autoMaxBid?: number; };
          const result = await this.placeBid(data);
          return Response.json(result);
        }

        case 'GET /active-auctions': {
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const result = await this.getActiveAuctions(limit);
          return Response.json(result);
        }

        default:
          return Response.json({ success: false, error: 'Endpoint not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('SmartRewardsDO fetch error:', error);
      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  }
}