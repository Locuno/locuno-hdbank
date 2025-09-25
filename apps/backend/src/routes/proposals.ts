import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { CommunityWalletService } from '../services/CommunityWalletService.js';

const proposals = new Hono();

// JWT middleware for all proposal routes
proposals.use('*', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env?.JWT_SECRET as string) || 'fallback-secret',
  });
  return jwtMiddleware(c, next);
});

// Get proposals for a community
proposals.get('/community/:communityId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const communityId = c.req.param('communityId');
    const status = c.req.query('status'); // optional filter by status

    // Membership check removed for demo purposes

    // Get proposals from the community wallet
    const result = await CommunityWalletService.getProposals(c.env, communityId, status);

    if (result.success) {
      // Transform wallet proposals to frontend format
      const proposals = result.proposals?.map((proposal: any) => ({
        id: proposal.id,
        title: proposal.description || 'Untitled Proposal',
        description: proposal.description,
        amount: proposal.amount,
        currency: 'VND',
        category: proposal.category || 'other',
        status: proposal.status,
        communityId: communityId,
        createdBy: proposal.proposedBy,
        createdAt: proposal.createdAt,
        updatedAt: proposal.updatedAt,
        votes: {
          approve: proposal.votes?.approve || 0,
          reject: proposal.votes?.reject || 0,
          abstain: proposal.votes?.abstain || 0,
        },
        votingDeadline: proposal.votingDeadline,
        executedAt: proposal.executedAt,
        recipient: proposal.recipient,
      })) || [];

      return c.json({
        success: true,
        message: 'Proposals retrieved successfully',
        data: proposals,
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error getting community proposals:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Create a new proposal
proposals.post('/', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const { title, description, amount, category, communityId, recipient } = await c.req.json();

    if (!title || !description || !amount || !communityId) {
      return c.json({ 
        success: false, 
        message: 'Title, description, amount, and community ID are required' 
      }, 400);
    }

    // Check if user is a member of the community
    const memberResult = await CommunityWalletService.getWalletMembers(c.env, communityId);
    if (!memberResult.success) {
      return c.json({ success: false, message: 'Community not found' }, 404);
    }

    const isMember = memberResult.members?.some((member: any) => member.userId === userId);
    if (!isMember) {
      return c.json({ success: false, message: 'Access denied' }, 403);
    }

    // Create proposal using the wallet service
    const result = await CommunityWalletService.proposeTransaction(c.env, {
      walletId: communityId,
      proposedBy: userId,
      amount: parseFloat(amount),
      recipient: recipient || 'Community Fund',
      description: `${title}: ${description}`,
      category: category || 'other',
    });

    if (result.success) {
      // Transform the created proposal to frontend format
      const proposal = {
        id: result.proposalId,
        title,
        description,
        amount: parseFloat(amount),
        currency: 'VND',
        category: category || 'other',
        status: 'pending',
        communityId,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: {
          approve: 0,
          reject: 0,
          abstain: 0,
        },
        recipient: recipient || 'Community Fund',
      };

      return c.json({
        success: true,
        message: 'Proposal created successfully',
        data: proposal,
      });
    } else {
      return c.json({ success: false, message: result.error }, 400);
    }
  } catch (error) {
    console.error('Error creating proposal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Vote on a proposal
proposals.post('/:proposalId/vote', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const proposalId = c.req.param('proposalId');
    const { vote, reason } = await c.req.json();

    if (!vote || !['approve', 'reject', 'abstain'].includes(vote)) {
      return c.json({ 
        success: false, 
        message: 'Valid vote (approve, reject, abstain) is required' 
      }, 400);
    }

    // Note: We need the walletId to vote on a proposal
    // For now, we'll need to get it from the proposal or pass it as a parameter
    // This is a limitation of the current wallet service design
    return c.json({
      success: false,
      message: 'Voting endpoint requires walletId - not yet fully implemented',
    }, 501);
  } catch (error) {
    console.error('Error voting on proposal:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

// Get proposal details
proposals.get('/:proposalId', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;
    const proposalId = c.req.param('proposalId');

    // This would require implementing a getProposalDetails method in CommunityWalletService
    // For now, we'll return a placeholder response
    return c.json({
      success: false,
      message: 'Proposal details endpoint not yet implemented',
    }, 501);
  } catch (error) {
    console.error('Error getting proposal details:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
});

export default proposals;