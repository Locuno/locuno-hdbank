import { z } from 'zod';

// Community Wallet Schema
const CommunityWalletSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdBy: z.string(), // userId
  createdAt: z.string(),
  updatedAt: z.string(),
  balance: z.number().default(0),
  currency: z.string().default('VND'),
  settings: z.object({
    approvalThreshold: z.number().default(0.67), // 2/3 approval
    maxTransactionAmount: z.number().optional(),
    requiresApprovalAbove: z.number().default(0), // All transactions require approval
    autoApproveBelow: z.number().default(0),
  }),
  status: z.enum(['active', 'suspended', 'closed']).default('active'),
});

// Wallet Member Schema
const WalletMemberSchema = z.object({
  userId: z.string(),
  walletId: z.string(),
  role: z.enum(['admin', 'member', 'viewer']),
  status: z.enum(['active', 'invited', 'suspended']),
  joinedAt: z.string(),
  invitedBy: z.string().optional(),
  permissions: z.object({
    canViewTransactions: z.boolean().default(true),
    canProposeTransactions: z.boolean().default(true),
    canVoteOnTransactions: z.boolean().default(true),
    canManageMembers: z.boolean().default(false),
    canManageWallet: z.boolean().default(false),
  }),
  votingWeight: z.number().default(1), // For weighted voting if needed
});

// Transaction Proposal Schema
const TransactionProposalSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  proposedBy: z.string(), // userId
  type: z.enum(['expense', 'income', 'transfer', 'withdrawal']),
  amount: z.number(),
  currency: z.string().default('VND'),
  recipient: z.string(), // Can be external account or member
  description: z.string(),
  category: z.string().optional(),
  attachments: z.array(z.string()).optional(), // File URLs
  proposedAt: z.string(),
  requiredApprovals: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'executed', 'cancelled']),
  executedAt: z.string().optional(),
  executedBy: z.string().optional(),
  notes: z.string().optional(),
});

// Vote Schema
const VoteSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  walletId: z.string(),
  voterId: z.string(), // userId
  vote: z.enum(['approve', 'reject', 'abstain']),
  reason: z.string().optional(),
  votedAt: z.string(),
  weight: z.number().default(1),
});

// Transaction Record Schema (for executed transactions)
const TransactionRecordSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  proposalId: z.string().optional(), // Link to original proposal
  type: z.enum(['expense', 'income', 'transfer', 'withdrawal', 'deposit']),
  amount: z.number(),
  currency: z.string().default('VND'),
  fromAccount: z.string().optional(),
  toAccount: z.string().optional(),
  description: z.string(),
  category: z.string().optional(),
  executedBy: z.string(),
  executedAt: z.string(),
  balanceBefore: z.number(),
  balanceAfter: z.number(),
  reference: z.string().optional(), // External transaction reference
  metadata: z.record(z.any()).optional(),
});

// Wallet Invitation Schema
const WalletInvitationSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  invitedEmail: z.string().email(),
  invitedBy: z.string(), // userId
  role: z.enum(['admin', 'member', 'viewer']),
  token: z.string(),
  expiresAt: z.string(),
  status: z.enum(['pending', 'accepted', 'declined', 'expired']),
  createdAt: z.string(),
});

type CommunityWallet = z.infer<typeof CommunityWalletSchema>;
type WalletMember = z.infer<typeof WalletMemberSchema>;
type TransactionProposal = z.infer<typeof TransactionProposalSchema>;
type Vote = z.infer<typeof VoteSchema>;
type TransactionRecord = z.infer<typeof TransactionRecordSchema>;
type WalletInvitation = z.infer<typeof WalletInvitationSchema>;

export class CommunityWalletDO {
  private storage: any;
  private env: any;

  constructor(state: any, env: any) {
    this.storage = state.storage;
    this.env = env;
  }

  // Wallet Management
  async createWallet(data: {
    name: string;
    description?: string;
    createdBy: string;
    initialBalance?: number;
    settings?: Partial<CommunityWallet['settings']>;
  }): Promise<{ success: boolean; walletId?: string; error?: string }> {
    try {
      const walletId = crypto.randomUUID();
      const now = new Date().toISOString();

      const wallet: CommunityWallet = {
        id: walletId,
        name: data.name,
        description: data.description,
        createdBy: data.createdBy,
        createdAt: now,
        updatedAt: now,
        balance: data.initialBalance || 0,
        currency: 'VND',
        settings: {
          approvalThreshold: 0.67,
          requiresApprovalAbove: 0,
          autoApproveBelow: 0,
          ...data.settings,
        },
        status: 'active',
      };

      await this.storage.put(`wallet:${walletId}`, wallet);

      // Add creator as admin member
      const member: WalletMember = {
        userId: data.createdBy,
        walletId,
        role: 'admin',
        status: 'active',
        joinedAt: now,
        permissions: {
          canViewTransactions: true,
          canProposeTransactions: true,
          canVoteOnTransactions: true,
          canManageMembers: true,
          canManageWallet: true,
        },
        votingWeight: 1,
      };

      await this.storage.put(`wallet_member:${walletId}:${data.createdBy}`, member);
      
      // Track user's wallets
      const userWallets = await this.storage.get(`user_wallets:${data.createdBy}`) || [];
      userWallets.push(walletId);
      await this.storage.put(`user_wallets:${data.createdBy}`, userWallets);

      // Record initial deposit if any
      if (data.initialBalance && data.initialBalance > 0) {
        await this.recordTransaction({
          walletId,
          type: 'deposit',
          amount: data.initialBalance,
          description: 'Initial wallet funding',
          executedBy: data.createdBy,
        });
      }

      return { success: true, walletId };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return { success: false, error: 'Failed to create wallet' };
    }
  }

  async getWalletDetails(walletId: string): Promise<{ success: boolean; wallet?: CommunityWallet; error?: string }> {
    try {
      const wallet = await this.storage.get(`wallet:${walletId}`);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }
      return { success: true, wallet };
    } catch (error) {
      console.error('Error getting wallet details:', error);
      return { success: false, error: 'Failed to get wallet details' };
    }
  }

  async getUserWallets(userId: string): Promise<{ success: boolean; wallets?: CommunityWallet[]; error?: string }> {
    try {
      const walletIds = await this.storage.get(`user_wallets:${userId}`) || [];
      const wallets: CommunityWallet[] = [];

      for (const walletId of walletIds) {
        const wallet = await this.storage.get(`wallet:${walletId}`);
        if (wallet) {
          wallets.push(wallet);
        }
      }

      return { success: true, wallets };
    } catch (error) {
      console.error('Error getting user wallets:', error);
      return { success: false, error: 'Failed to get user wallets' };
    }
  }

  // Member Management
  async inviteMember(data: {
    walletId: string;
    invitedEmail: string;
    invitedBy: string;
    role: 'admin' | 'member' | 'viewer';
  }): Promise<{ success: boolean; invitationId?: string; error?: string }> {
    try {
      // Check if inviter has permission
      const inviterMember = await this.storage.get(`wallet_member:${data.walletId}:${data.invitedBy}`);
      if (!inviterMember || !inviterMember.permissions.canManageMembers) {
        return { success: false, error: 'Insufficient permissions' };
      }

      const invitationId = crypto.randomUUID();
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      const invitation: WalletInvitation = {
        id: invitationId,
        walletId: data.walletId,
        invitedEmail: data.invitedEmail,
        invitedBy: data.invitedBy,
        role: data.role,
        token,
        expiresAt,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await this.storage.put(`wallet_invitation:${invitationId}`, invitation);
      await this.storage.put(`wallet_invitation_token:${token}`, invitationId);

      return { success: true, invitationId };
    } catch (error) {
      console.error('Error inviting member:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }

  async acceptWalletInvitation(data: {
    token: string;
    userId: string;
  }): Promise<{ success: boolean; walletId?: string; error?: string }> {
    try {
      const invitationId = await this.storage.get(`wallet_invitation_token:${data.token}`);
      if (!invitationId) {
        return { success: false, error: 'Invalid invitation token' };
      }

      const invitation = await this.storage.get(`wallet_invitation:${invitationId}`);
      if (!invitation || invitation.status !== 'pending') {
        return { success: false, error: 'Invitation not found or already processed' };
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        return { success: false, error: 'Invitation has expired' };
      }

      // Add user as wallet member
      const permissions = {
        canViewTransactions: true,
        canProposeTransactions: invitation.role !== 'viewer',
        canVoteOnTransactions: invitation.role !== 'viewer',
        canManageMembers: invitation.role === 'admin',
        canManageWallet: invitation.role === 'admin',
      };

      const member: WalletMember = {
        userId: data.userId,
        walletId: invitation.walletId,
        role: invitation.role,
        status: 'active',
        joinedAt: new Date().toISOString(),
        invitedBy: invitation.invitedBy,
        permissions,
        votingWeight: 1,
      };

      await this.storage.put(`wallet_member:${invitation.walletId}:${data.userId}`, member);
      
      // Update user's wallets list
      const userWallets = await this.storage.get(`user_wallets:${data.userId}`) || [];
      userWallets.push(invitation.walletId);
      await this.storage.put(`user_wallets:${data.userId}`, userWallets);

      // Mark invitation as accepted
      invitation.status = 'accepted';
      await this.storage.put(`wallet_invitation:${invitationId}`, invitation);

      return { success: true, walletId: invitation.walletId };
    } catch (error) {
      console.error('Error accepting wallet invitation:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  }

  async getWalletMembers(walletId: string): Promise<{ success: boolean; members?: WalletMember[]; error?: string }> {
    try {
      const members: WalletMember[] = [];
      const memberKeys = await this.storage.list({ prefix: `wallet_member:${walletId}:` });
      
      for (const [, member] of memberKeys) {
        members.push(member as WalletMember);
      }

      return { success: true, members };
    } catch (error) {
      console.error('Error getting wallet members:', error);
      return { success: false, error: 'Failed to get wallet members' };
    }
  }

  // Transaction Proposals and Voting
  async proposeTransaction(data: {
    walletId: string;
    proposedBy: string;
    type: 'expense' | 'income' | 'transfer' | 'withdrawal';
    amount: number;
    recipient: string;
    description: string;
    category?: string;
    attachments?: string[];
  }): Promise<{ success: boolean; proposalId?: string; error?: string }> {
    try {
      // Verify proposer is member with permission
      const member = await this.storage.get(`wallet_member:${data.walletId}:${data.proposedBy}`);
      if (!member || member.status !== 'active' || !member.permissions.canProposeTransactions) {
        return { success: false, error: 'User not authorized to propose transactions' };
      }

      // Get wallet and check settings
      const wallet = await this.storage.get(`wallet:${data.walletId}`);
      if (!wallet || wallet.status !== 'active') {
        return { success: false, error: 'Wallet not found or inactive' };
      }

      // Calculate required approvals based on 2/3 threshold
      const members = await this.getWalletMembers(data.walletId);
      if (!members.success || !members.members) {
        return { success: false, error: 'Failed to get wallet members' };
      }

      const votingMembers = members.members.filter(m => 
        m.status === 'active' && m.permissions.canVoteOnTransactions
      );
      const totalVotingWeight = votingMembers.reduce((sum, m) => sum + m.votingWeight, 0);
      const requiredApprovals = Math.ceil(totalVotingWeight * wallet.settings.approvalThreshold);

      const proposalId = crypto.randomUUID();
      const now = new Date().toISOString();

      const proposal: TransactionProposal = {
        id: proposalId,
        walletId: data.walletId,
        proposedBy: data.proposedBy,
        type: data.type,
        amount: data.amount,
        currency: wallet.currency,
        recipient: data.recipient,
        description: data.description,
        category: data.category,
        attachments: data.attachments,
        proposedAt: now,
        requiredApprovals,
        status: 'pending',
      };

      await this.storage.put(`proposal:${proposalId}`, proposal);
      await this.storage.put(`wallet_proposal:${data.walletId}:${proposalId}`, true);

      // Auto-approve if amount is below threshold
      if (data.amount <= wallet.settings.autoApproveBelow) {
        proposal.status = 'approved';
        await this.storage.put(`proposal:${proposalId}`, proposal);
      }

      return { success: true, proposalId };
    } catch (error) {
      console.error('Error proposing transaction:', error);
      return { success: false, error: 'Failed to propose transaction' };
    }
  }

  async voteOnProposal(data: {
    proposalId: string;
    voterId: string;
    vote: 'approve' | 'reject' | 'abstain';
    reason?: string;
  }): Promise<{ success: boolean; proposalStatus?: string; error?: string }> {
    try {
      const proposal = await this.storage.get(`proposal:${data.proposalId}`);
      if (!proposal) {
        return { success: false, error: 'Proposal not found' };
      }

      if (proposal.status !== 'pending') {
        return { success: false, error: 'Proposal is no longer pending' };
      }

      // Verify voter is member with permission
      const member = await this.storage.get(`wallet_member:${proposal.walletId}:${data.voterId}`);
      if (!member || member.status !== 'active' || !member.permissions.canVoteOnTransactions) {
        return { success: false, error: 'User not authorized to vote' };
      }

      // Check if user already voted
      const existingVote = await this.storage.get(`vote:${data.proposalId}:${data.voterId}`);
      if (existingVote) {
        return { success: false, error: 'User has already voted on this proposal' };
      }

      const voteId = crypto.randomUUID();
      const vote: Vote = {
        id: voteId,
        transactionId: data.proposalId,
        walletId: proposal.walletId,
        voterId: data.voterId,
        vote: data.vote,
        reason: data.reason,
        votedAt: new Date().toISOString(),
        weight: member.votingWeight,
      };

      await this.storage.put(`vote:${data.proposalId}:${data.voterId}`, vote);

      // Check if proposal has enough approvals
      const approvalStatus = await this.checkProposalApproval(data.proposalId);
      if (approvalStatus.success && approvalStatus.status) {
        proposal.status = approvalStatus.status;
        await this.storage.put(`proposal:${data.proposalId}`, proposal);
      }

      return { success: true, proposalStatus: proposal.status };
    } catch (error) {
      console.error('Error voting on proposal:', error);
      return { success: false, error: 'Failed to vote on proposal' };
    }
  }

  private async checkProposalApproval(proposalId: string): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const proposal = await this.storage.get(`proposal:${proposalId}`);
      if (!proposal) {
        return { success: false, error: 'Proposal not found' };
      }

      // Get all votes for this proposal
      const voteKeys = await this.storage.list({ prefix: `vote:${proposalId}:` });
      let approvalWeight = 0;
      let rejectionWeight = 0;

      for (const [, vote] of voteKeys) {
        const voteData = vote as Vote;
        if (voteData.vote === 'approve') {
          approvalWeight += voteData.weight;
        } else if (voteData.vote === 'reject') {
          rejectionWeight += voteData.weight;
        }
      }

      // Check if we have enough approvals
      if (approvalWeight >= proposal.requiredApprovals) {
        return { success: true, status: 'approved' };
      }

      // Check if rejection is impossible to overcome
      const members = await this.getWalletMembers(proposal.walletId);
      if (members.success && members.members) {
        const totalWeight = members.members
          .filter(m => m.status === 'active' && m.permissions.canVoteOnTransactions)
          .reduce((sum, m) => sum + m.votingWeight, 0);
        
        const remainingWeight = totalWeight - approvalWeight - rejectionWeight;
        if (approvalWeight + remainingWeight < proposal.requiredApprovals) {
          return { success: true, status: 'rejected' };
        }
      }

      return { success: true, status: 'pending' };
    } catch (error) {
      console.error('Error checking proposal approval:', error);
      return { success: false, error: 'Failed to check proposal approval' };
    }
  }

  async executeTransaction(data: {
    proposalId: string;
    executedBy: string;
    reference?: string;
    notes?: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const proposal = await this.storage.get(`proposal:${data.proposalId}`);
      if (!proposal) {
        return { success: false, error: 'Proposal not found' };
      }

      if (proposal.status !== 'approved') {
        return { success: false, error: 'Proposal is not approved' };
      }

      // Verify executor has permission
      const member = await this.storage.get(`wallet_member:${proposal.walletId}:${data.executedBy}`);
      if (!member || member.status !== 'active') {
        return { success: false, error: 'User not authorized to execute transactions' };
      }

      // Get current wallet balance
      const wallet = await this.storage.get(`wallet:${proposal.walletId}`);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Check if wallet has sufficient balance for expenses/withdrawals
      if ((proposal.type === 'expense' || proposal.type === 'withdrawal') && 
          wallet.balance < proposal.amount) {
        return { success: false, error: 'Insufficient wallet balance' };
      }

      // Calculate new balance
      let newBalance = wallet.balance;
      if (proposal.type === 'expense' || proposal.type === 'withdrawal') {
        newBalance -= proposal.amount;
      } else if (proposal.type === 'income') {
        newBalance += proposal.amount;
      }

      // Record the transaction
      const transactionData: any = {
        walletId: proposal.walletId,
        proposalId: data.proposalId,
        type: proposal.type,
        amount: proposal.amount,
        fromAccount: proposal.type === 'transfer' ? proposal.walletId : undefined,
        toAccount: proposal.recipient,
        description: proposal.description,
        category: proposal.category,
        executedBy: data.executedBy,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
      };
      
      if (data.reference) {
        transactionData.reference = data.reference;
      }
      if (data.notes) {
        transactionData.notes = data.notes;
      }
      
      const transactionResult = await this.recordTransaction(transactionData);

      if (!transactionResult.success) {
        return { success: false, error: 'Failed to record transaction' };
      }

      // Update wallet balance
      wallet.balance = newBalance;
      wallet.updatedAt = new Date().toISOString();
      await this.storage.put(`wallet:${proposal.walletId}`, wallet);

      // Mark proposal as executed
      proposal.status = 'executed';
      proposal.executedAt = new Date().toISOString();
      proposal.executedBy = data.executedBy;
      proposal.notes = data.notes;
      await this.storage.put(`proposal:${data.proposalId}`, proposal);

      return { success: true, transactionId: transactionResult.transactionId! };
    } catch (error) {
      console.error('Error executing transaction:', error);
      return { success: false, error: 'Failed to execute transaction' };
    }
  }

  private async recordTransaction(data: {
    walletId: string;
    proposalId?: string;
    type: 'expense' | 'income' | 'transfer' | 'withdrawal' | 'deposit';
    amount: number;
    fromAccount?: string;
    toAccount?: string;
    description: string;
    category?: string;
    executedBy: string;
    balanceBefore?: number;
    balanceAfter?: number;
    reference?: string;
    notes?: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const transactionId = crypto.randomUUID();
      const now = new Date().toISOString();

      const wallet = await this.storage.get(`wallet:${data.walletId}`);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      const transaction: TransactionRecord = {
        id: transactionId,
        walletId: data.walletId,
        proposalId: data.proposalId,
        type: data.type,
        amount: data.amount,
        currency: wallet.currency,
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        description: data.description,
        category: data.category,
        executedBy: data.executedBy,
        executedAt: now,
        balanceBefore: data.balanceBefore || wallet.balance,
        balanceAfter: data.balanceAfter || wallet.balance,
        reference: data.reference,
        metadata: data.notes ? { notes: data.notes } : undefined,
      };

      await this.storage.put(`transaction:${transactionId}`, transaction);
      await this.storage.put(`wallet_transaction:${data.walletId}:${now}:${transactionId}`, true);

      return { success: true, transactionId };
    } catch (error) {
      console.error('Error recording transaction:', error);
      return { success: false, error: 'Failed to record transaction' };
    }
  }

  async getWalletTransactions(walletId: string, limit: number = 50): Promise<{ success: boolean; transactions?: TransactionRecord[]; error?: string }> {
    try {
      const transactions: TransactionRecord[] = [];
      const transactionKeys = await this.storage.list({ 
        prefix: `wallet_transaction:${walletId}:`,
        limit,
        reverse: true // Get most recent first
      });
      
      for (const [key] of transactionKeys) {
        const transactionId = key.split(':')[3];
        const transaction = await this.storage.get(`transaction:${transactionId}`);
        if (transaction) {
          transactions.push(transaction as TransactionRecord);
        }
      }

      return { success: true, transactions };
    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      return { success: false, error: 'Failed to get wallet transactions' };
    }
  }

  async getWalletProposals(walletId: string, status?: string): Promise<{ success: boolean; proposals?: TransactionProposal[]; error?: string }> {
    try {
      const proposals: TransactionProposal[] = [];
      const proposalKeys = await this.storage.list({ prefix: `wallet_proposal:${walletId}:` });
      
      for (const [key] of proposalKeys) {
        const proposalId = key.split(':')[2];
        const proposal = await this.storage.get(`proposal:${proposalId}`);
        if (proposal && (!status || proposal.status === status)) {
          proposals.push(proposal as TransactionProposal);
        }
      }

      // Sort by proposed date (most recent first)
      proposals.sort((a, b) => new Date(b.proposedAt).getTime() - new Date(a.proposedAt).getTime());

      return { success: true, proposals };
    } catch (error) {
      console.error('Error getting wallet proposals:', error);
      return { success: false, error: 'Failed to get wallet proposals' };
    }
  }

  async getProposalVotes(proposalId: string): Promise<{ success: boolean; votes?: Vote[]; error?: string }> {
    try {
      const votes: Vote[] = [];
      const voteKeys = await this.storage.list({ prefix: `vote:${proposalId}:` });
      
      for (const [, vote] of voteKeys) {
        votes.push(vote as Vote);
      }

      return { success: true, votes };
    } catch (error) {
      console.error('Error getting proposal votes:', error);
      return { success: false, error: 'Failed to get proposal votes' };
    }
  }

  async updateWalletBalance(data: {
    amount: number;
    transactionId: string;
    description: string;
    reference: string;
  }): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      // Get wallet details
      const walletList = await this.storage.list({ prefix: 'wallet:' });
      let wallet: CommunityWallet | null = null;
      let walletId = '';
      
      for (const [key, w] of walletList) {
        wallet = w;
        walletId = w.id;
        break; // Get the first (and should be only) wallet
      }
      
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Check if transaction already processed
      const existingTransaction = await this.storage.get(`transaction:${data.transactionId}`);
      if (existingTransaction) {
        return { success: false, error: 'Transaction already processed' };
      }

      // Update wallet balance
      const newBalance = wallet.balance + data.amount;
      wallet.balance = newBalance;
      wallet.updatedAt = new Date().toISOString();
      await this.storage.put(`wallet:${walletId}`, wallet);

      // Record the transaction
      const transactionResult = await this.recordTransaction({
        walletId,
        type: 'deposit',
        amount: data.amount,
        description: data.description,
        executedBy: 'system', // SePay system
        balanceBefore: wallet.balance - data.amount,
        balanceAfter: newBalance,
        reference: data.reference,
        notes: `SePay deposit - Transaction ID: ${data.transactionId}`
      });

      if (!transactionResult.success) {
        return { success: false, error: 'Failed to record transaction' };
      }

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
        case 'POST /create-wallet': {
          const data = await request.json() as { name: string; description?: string; createdBy: string; initialBalance?: number; settings?: any; };
          const result = await this.createWallet(data);
          return Response.json(result);
        }

        case 'GET /wallet': {
          const walletId = url.searchParams.get('walletId');
          if (!walletId) {
            return Response.json({ success: false, error: 'Wallet ID required' }, { status: 400 });
          }
          const result = await this.getWalletDetails(walletId);
          return Response.json(result);
        }

        case 'GET /user-wallets': {
          const userId = url.searchParams.get('userId');
          if (!userId) {
            return Response.json({ success: false, error: 'User ID required' }, { status: 400 });
          }
          const result = await this.getUserWallets(userId);
          return Response.json(result);
        }

        case 'POST /invite-member': {
          const data = await request.json() as { walletId: string; invitedEmail: string; invitedBy: string; role: 'admin' | 'member' | 'viewer'; };
          const result = await this.inviteMember(data);
          return Response.json(result);
        }

        case 'POST /accept-invitation': {
          const data = await request.json() as { token: string; userId: string; };
          const result = await this.acceptWalletInvitation(data);
          return Response.json(result);
        }

        case 'GET /wallet-members': {
          const walletId = url.searchParams.get('walletId');
          if (!walletId) {
            return Response.json({ success: false, error: 'Wallet ID required' }, { status: 400 });
          }
          const result = await this.getWalletMembers(walletId);
          return Response.json(result);
        }

        case 'POST /propose-transaction': {
          const data = await request.json() as { walletId: string; proposedBy: string; type: 'expense' | 'income' | 'transfer' | 'withdrawal'; amount: number; recipient: string; description: string; category?: string; attachments?: string[]; };
          const result = await this.proposeTransaction(data);
          return Response.json(result);
        }

        case 'POST /vote': {
          const data = await request.json() as { proposalId: string; voterId: string; vote: 'approve' | 'reject' | 'abstain'; reason?: string; };
          const result = await this.voteOnProposal(data);
          return Response.json(result);
        }

        case 'POST /execute-transaction': {
          const data = await request.json() as { proposalId: string; executedBy: string; reference?: string; notes?: string; };
          const result = await this.executeTransaction(data);
          return Response.json(result);
        }

        case 'GET /wallet-transactions': {
          const walletId = url.searchParams.get('walletId');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          if (!walletId) {
            return Response.json({ success: false, error: 'Wallet ID required' }, { status: 400 });
          }
          const result = await this.getWalletTransactions(walletId, limit);
          return Response.json(result);
        }

        case 'GET /wallet-proposals': {
          const walletId = url.searchParams.get('walletId');
          const status = url.searchParams.get('status') || undefined;
          if (!walletId) {
            return Response.json({ success: false, error: 'Wallet ID required' }, { status: 400 });
          }
          const result = await this.getWalletProposals(walletId, status);
          return Response.json(result);
        }

        case 'GET /proposal-votes': {
          const proposalId = url.searchParams.get('proposalId');
          if (!proposalId) {
            return Response.json({ success: false, error: 'Proposal ID required' }, { status: 400 });
          }
          const result = await this.getProposalVotes(proposalId);
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
      console.error('CommunityWalletDO fetch error:', error);
      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  }
}