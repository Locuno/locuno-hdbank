import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { CommunityWalletService } from '../services/CommunityWalletService.js';

const wallet = new Hono();

// JWT middleware for all wallet routes
wallet.use('*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env?.JWT_SECRET as string) || 'fallback-secret',
  });
  return jwtMiddleware(c, next);
});

// Wallet Management
wallet.post('/create', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { name, description, settings } = await c.req.json();

    if (!name) {
      return c.json({ success: false, message: 'Wallet name is required' }, 400);
    }

    const result = await CommunityWalletService.createWallet(c.env, {
      name,
      description,
      createdBy: userId,
      settings,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Community wallet created successfully',
        data: { walletId: result.walletId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating community wallet:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

wallet.get('/my-wallets', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;

    const result = await CommunityWalletService.getUserWallets(c.env, userId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'User wallets retrieved successfully',
        data: { wallets: result.wallets },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting user wallets:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

wallet.get('/:walletId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');

    // First check if user is a member of this wallet
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, walletId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Wallet not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await CommunityWalletService.getWalletDetails(c.env, walletId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Wallet details retrieved successfully',
        data: { wallet: result.wallet },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting wallet details:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Member Management
wallet.post('/:walletId/invite', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const { email, phoneNumber, role = 'member' } = await c.req.json();

    if (!email) {
      return c.json({ success: false, message: 'Email is required' }, 400);
    }

    // Validate phone number if provided
    if (phoneNumber && !/^[0-9]{10,11}$/.test(phoneNumber.replace(/\s/g, ''))) {
      return c.json({ success: false, message: 'Invalid phone number format' }, 400);
    }

    const result = await CommunityWalletService.inviteMember(c.env, {
      walletId,
      invitedEmail: email,
      phoneNumber: phoneNumber ? phoneNumber.replace(/\s/g, '') : undefined,
      invitedBy: userId,
      role,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Wallet invitation sent successfully',
        data: { invitationId: result.invitationId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error inviting wallet member:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

wallet.post('/invitations/:token/accept', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const token = c.req.param('token');

    const result = await CommunityWalletService.acceptInvitation(c.env, {
      token,
      userId,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Wallet invitation accepted successfully',
        data: { walletId: result.walletId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error accepting wallet invitation:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

wallet.get('/:walletId/members', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');

    // Check if user is a member of this wallet
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, walletId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Wallet not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    return c.json({
      success: true,
      message: 'Wallet members retrieved successfully',
      data: { members: memberResult.members },
    });
  } catch (error) {
    console.error('Error getting wallet members:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Transaction Proposals
wallet.post('/:walletId/proposals', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const { amount, recipient, description, category, reference } = await c.req.json();

    if (!amount || !recipient || !description) {
      return c.json({ 
        success: false, 
        message: 'Amount, recipient, and description are required' 
      }, 400);
    }

    const result = await CommunityWalletService.proposeTransaction(c.env, {
      walletId,
      proposedBy: userId,
      amount,
      recipient,
      description,
      category,
      reference,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Transaction proposal created successfully',
        data: { proposalId: result.proposalId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating transaction proposal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

wallet.get('/:walletId/proposals', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const status = c.req.query('status'); // 'pending', 'approved', 'rejected', 'executed'

    // Check if user is a member of this wallet
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, walletId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Wallet not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await CommunityWalletService.getProposals(c.env, walletId, status);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Transaction proposals retrieved successfully',
        data: { proposals: result.proposals },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting transaction proposals:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Voting on Proposals
wallet.post('/:walletId/proposals/:proposalId/vote', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const proposalId = c.req.param('proposalId');
    const { vote, reason } = await c.req.json();

    if (!vote || !['approve', 'reject'].includes(vote)) {
      return c.json({ 
        success: false, 
        message: 'Vote must be either "approve" or "reject"' 
      }, 400);
    }

    const result = await CommunityWalletService.voteOnProposal(c.env, {
      walletId,
      proposalId,
      voterId: userId,
      vote,
      reason,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Vote recorded successfully',
        data: { 
          voteId: result.voteId,
          proposalStatus: result.proposalStatus,
          isApproved: result.isApproved,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error voting on proposal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Execute Approved Transactions
wallet.post('/:walletId/proposals/:proposalId/execute', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const proposalId = c.req.param('proposalId');
    const { notes } = await c.req.json();

    const result = await CommunityWalletService.executeTransaction(c.env, {
      walletId,
      proposalId,
      executedBy: userId,
      notes,
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Transaction executed successfully',
        data: { transactionId: result.transactionId },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error executing transaction:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Transaction History
wallet.get('/:walletId/transactions', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    const category = c.req.query('category');

    // Check if user is a member of this wallet
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, walletId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Wallet not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const categoryParam = c.req.query('category');
    const result = await CommunityWalletService.getTransactionHistory(c.env, {
      walletId,
      limit,
      offset,
      ...(categoryParam && { category: categoryParam }),
    });

    if (result.success) {
      return c.json({
        success: true,
        message: 'Transaction history retrieved successfully',
        data: { 
          transactions: result.transactions,
          total: result.total,
          hasMore: result.hasMore,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Wallet Balance and Statistics
wallet.get('/:walletId/balance', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const walletId = c.req.param('walletId');

    // Check if user is a member of this wallet
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, walletId);
    if (!memberResult.success || !memberResult.members) {
      return c.json({ success: false, message: 'Wallet not found' }, 404);
    }

    const isMember = memberResult.members.some((member: any) => 
      member.userId === userId && member.status === 'active'
    );

    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    const result = await CommunityWalletService.getWalletBalance(c.env, walletId);

    if (result.success) {
      return c.json({
        success: true,
        message: 'Wallet balance retrieved successfully',
        data: { 
          balance: result.balance,
          pendingAmount: result.pendingAmount,
          totalTransactions: result.totalTransactions,
        },
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export { wallet };