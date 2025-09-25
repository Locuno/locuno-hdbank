import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { CommunityWalletService } from '../services/CommunityWalletService.js';
import { createConfig } from '../config/index.js';

const communities = new Hono();

// JWT middleware for all community routes
communities.use('*', async (c, next) => {
  try {
    const config = createConfig(c.env);
    const jwtMiddleware = jwt({
      secret: config.jwt.secret,
    });

    return await jwtMiddleware(c, async () => {
      // Continue to the actual endpoint
      return await next();
    });
  } catch (error) {
    console.error('JWT middleware error in communities:', error);
    return c.json({
      success: false,
      message: 'Authentication required',
      error: 'Invalid or missing JWT token',
      code: 'AUTH_TOKEN_INVALID'
    }, 401);
  }
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

    // For demo purposes, return all communities instead of user-specific ones
    const result = await CommunityWalletService.getAllWallets(c.env);

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

// Get community transactions
communities.get('/:communityId/transactions', async (c) => {
  const communityId = c.req.param('communityId');
  const { page = '1', limit = '10', type, status, startDate, endDate } = c.req.query();

  try {
    // Mock transaction data for now
    const mockTransactions = [
      {
        id: 'txn-001',
        type: 'deposit',
        amount: 500000,
        currency: 'VND',
        description: 'Nạp tiền vào quỹ cộng đồng',
        fromAccount: 'user-123',
        toAccount: communityId,
        communityId,
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        createdBy: 'user-123',
        metadata: {
          bankCode: 'VCB',
          transactionRef: 'VCB123456789',
        }
      },
      {
        id: 'txn-002',
        type: 'deposit',
        amount: 1000000,
        currency: 'VND',
        description: 'Đóng góp cho dự án cải tạo sân chơi',
        fromAccount: 'user-456',
        toAccount: communityId,
        communityId,
        status: 'completed',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        createdBy: 'user-456',
        metadata: {
          bankCode: 'TCB',
          transactionRef: 'TCB987654321',
        }
      },
      {
        id: 'txn-003',
        type: 'proposal_payment',
        amount: 300000,
        currency: 'VND',
        description: 'Thanh toán cho đề xuất mua thiết bị',
        fromAccount: communityId,
        toAccount: 'vendor-789',
        communityId,
        proposalId: 'prop-001',
        status: 'completed',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        createdBy: 'system',
        metadata: {
          approvedBy: ['user-123', 'user-456', 'user-789'],
        }
      },
      {
        id: 'txn-004',
        type: 'deposit',
        amount: 750000,
        currency: 'VND',
        description: 'Nạp tiền định kỳ tháng 12',
        fromAccount: 'user-789',
        toAccount: communityId,
        communityId,
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        createdBy: 'user-789',
        metadata: {
          bankCode: 'MB',
          transactionRef: 'MB555666777',
        }
      }
    ];

    // Apply filters
    let filteredTransactions = mockTransactions;

    if (type && type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (status && status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Calculate summary
    const summary = {
      totalDeposits: filteredTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: filteredTransactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      totalTransfers: filteredTransactions
        .filter(t => t.type === 'transfer' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      balance: 1950000, // Mock balance
      currency: 'VND',
      transactionCount: filteredTransactions.length
    };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return c.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        summary,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredTransactions.length,
          totalPages: Math.ceil(filteredTransactions.length / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching community transactions:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Create deposit transaction
communities.post('/:communityId/transactions/deposit', async (c) => {
  const communityId = c.req.param('communityId');

  try {
    const body = await c.req.json();
    const { amount, currency = 'VND', description } = body;

    // Mock deposit creation
    const newTransaction = {
      id: 'txn-' + Date.now(),
      type: 'deposit',
      amount: parseFloat(amount),
      currency,
      description: description || 'Nạp tiền vào quỹ cộng đồng',
      fromAccount: 'current-user', // Would get from JWT
      toAccount: communityId,
      communityId,
      status: 'pending',
      timestamp: new Date().toISOString(),
      createdBy: 'current-user', // Would get from JWT
      metadata: {
        bankCode: 'VCB',
        transactionRef: 'VCB' + Date.now(),
      }
    };

    return c.json({
      success: true,
      data: {
        transaction: newTransaction,
        qrCode: `https://api.vietqr.io/v2/generate/970436/1234567890/${amount}/compact.jpg?memo=${encodeURIComponent(description || 'Nap tien cong dong')}`
      }
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Get specific transaction
communities.get('/:communityId/transactions/:transactionId', async (c) => {
  const communityId = c.req.param('communityId');
  const transactionId = c.req.param('transactionId');

  try {
    // Mock transaction data
    const mockTransaction = {
      id: transactionId,
      type: 'deposit',
      amount: 500000,
      currency: 'VND',
      description: 'Nạp tiền vào quỹ cộng đồng',
      fromAccount: 'user-123',
      toAccount: communityId,
      communityId,
      status: 'completed',
      timestamp: new Date().toISOString(),
      createdBy: 'user-123',
      metadata: {
        bankCode: 'VCB',
        transactionRef: 'VCB123456789',
      }
    };

    return c.json({
      success: true,
      data: mockTransaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export default communities;