export class SmartRewardsService {
  static async getUserProfile(env: any, userId: string) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/get-profile', {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getUserProfile error:', error);
      return { success: false, error: 'Failed to get user profile' };
    }
  }

  static async createUserProfile(env: any, data: {
    userId: string;
    preferences?: any;
    goals?: any;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.createUserProfile error:', error);
      return { success: false, error: 'Failed to create user profile' };
    }
  }

  static async updateUserProfile(env: any, data: {
    userId: string;
    preferences?: any;
    goals?: any;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.updateUserProfile error:', error);
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  static async awardPoints(env: any, data: {
    userId: string;
    points: number;
    activity: string;
    category?: string;
    metadata?: any;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/award-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.awardPoints error:', error);
      return { success: false, error: 'Failed to award points' };
    }
  }

  static async spendPoints(env: any, data: {
    userId: string;
    points: number;
    activity: string;
    reference?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/spend-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.spendPoints error:', error);
      return { success: false, error: 'Failed to spend points' };
    }
  }

  static async getPointsActivities(env: any, data: {
    userId: string;
    limit: number;
    offset: number;
    type?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/get-activities');
      url.searchParams.set('limit', data.limit.toString());
      url.searchParams.set('offset', data.offset.toString());
      if (data.type) {
        url.searchParams.set('type', data.type);
      }
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getPointsActivities error:', error);
      return { success: false, error: 'Failed to get points activities' };
    }
  }

  static async getDeals(env: any, data: {
    userId: string;
    category?: string;
    minLevel?: number;
    featured?: boolean;
    status?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('deals_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/deals');
      if (data.category) url.searchParams.set('category', data.category);
      if (data.minLevel) url.searchParams.set('minLevel', data.minLevel.toString());
      if (data.featured) url.searchParams.set('featured', data.featured.toString());
      if (data.status) url.searchParams.set('status', data.status);
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getDeals error:', error);
      return { success: false, error: 'Failed to get deals' };
    }
  }

  static async createDeal(env: any, data: {
    createdBy: string;
    title: string;
    description: string;
    category?: string;
    pointsCost: number;
    originalPrice?: number;
    discountedPrice?: number;
    minLevel?: number;
    maxRedemptions?: number;
    validUntil?: string;
    terms?: string;
    featured?: boolean;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('deals_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.createDeal error:', error);
      return { success: false, error: 'Failed to create deal' };
    }
  }

  static async redeemDeal(env: any, data: {
    userId: string;
    dealId: string;
    quantity: number;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/redeem-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.redeemDeal error:', error);
      return { success: false, error: 'Failed to redeem deal' };
    }
  }

  static async getUserRedemptions(env: any, data: {
    userId: string;
    status?: string;
    limit: number;
    offset: number;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/get-redemptions');
      url.searchParams.set('limit', data.limit.toString());
      url.searchParams.set('offset', data.offset.toString());
      if (data.status) {
        url.searchParams.set('status', data.status);
      }
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getUserRedemptions error:', error);
      return { success: false, error: 'Failed to get user redemptions' };
    }
  }

  static async getAuctions(env: any, data: {
    userId: string;
    status?: string;
    category?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('auctions_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/auctions');
      if (data.status) url.searchParams.set('status', data.status);
      if (data.category) url.searchParams.set('category', data.category);
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getAuctions error:', error);
      return { success: false, error: 'Failed to get auctions' };
    }
  }

  static async createAuction(env: any, data: {
    createdBy: string;
    title: string;
    description: string;
    category?: string;
    startingBid: number;
    minBidIncrement?: number;
    endTime: string;
    terms?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('auctions_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.createAuction error:', error);
      return { success: false, error: 'Failed to create auction' };
    }
  }

  static async placeBid(env: any, data: {
    auctionId: string;
    bidderId: string;
    bidAmount: number;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('auctions_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/place-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.placeBid error:', error);
      return { success: false, error: 'Failed to place bid' };
    }
  }

  static async getAuctionDetails(env: any, data: {
    auctionId: string;
    userId: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('auctions_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch(`http://localhost/auctions/${data.auctionId}`, {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getAuctionDetails error:', error);
      return { success: false, error: 'Failed to get auction details' };
    }
  }

  static async getChallenges(env: any, data: {
    userId: string;
    status?: string;
    category?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('challenges_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/challenges');
      if (data.status) url.searchParams.set('status', data.status);
      if (data.category) url.searchParams.set('category', data.category);
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getChallenges error:', error);
      return { success: false, error: 'Failed to get challenges' };
    }
  }

  static async joinChallenge(env: any, data: {
    challengeId: string;
    userId: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/join-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.joinChallenge error:', error);
      return { success: false, error: 'Failed to join challenge' };
    }
  }

  static async updateChallengeProgress(env: any, data: {
    challengeId: string;
    userId: string;
    progress: number;
    evidence?: any;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const response = await durableObject.fetch('http://localhost/update-challenge-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.updateChallengeProgress error:', error);
      return { success: false, error: 'Failed to update challenge progress' };
    }
  }

  static async getUserChallengeParticipations(env: any, data: {
    userId: string;
    status?: string;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName(data.userId);
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/get-challenge-participations');
      if (data.status) {
        url.searchParams.set('status', data.status);
      }
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getUserChallengeParticipations error:', error);
      return { success: false, error: 'Failed to get user challenge participations' };
    }
  }

  static async getLeaderboard(env: any, data: {
    userId: string;
    period?: string;
    category?: string;
    limit: number;
  }) {
    try {
      const durableObjectId = env.SMART_REWARDS_DO.idFromName('leaderboard_global');
      const durableObject = env.SMART_REWARDS_DO.get(durableObjectId);
      
      const url = new URL('http://localhost/leaderboard');
      url.searchParams.set('limit', data.limit.toString());
      if (data.period) url.searchParams.set('period', data.period);
      if (data.category) url.searchParams.set('category', data.category);
      
      const response = await durableObject.fetch(url.toString(), {
        method: 'GET',
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SmartRewardsService.getLeaderboard error:', error);
      return { success: false, error: 'Failed to get leaderboard' };
    }
  }
}