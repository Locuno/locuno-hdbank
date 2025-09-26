import { GetTransactionsResponse, Transaction } from "@/lib/api/transactions";

const now = new Date();

const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    type: "deposit",
    amount: 500000,
    currency: "VND",
    description: "Nguyễn Văn A - Nộp quỹ tháng 12",
    fromAccount: "user_a",
    toAccount: "community_wallet",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 1)).toISOString(),
    createdBy: "user_a",
    metadata: {
      bankCode: "VCB",
      transactionRef: "FT2336500001",
    },
  },
  {
    id: "txn_2",
    type: "deposit",
    amount: 500000,
    currency: "VND",
    description: "Trần Thị B - Nộp quỹ tháng 12",
    fromAccount: "user_b",
    toAccount: "community_wallet",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 2)).toISOString(),
    createdBy: "user_b",
    metadata: {
      bankCode: "TCB",
      transactionRef: "FT2336400002",
    },
  },
  {
    id: "txn_3",
    type: "proposal_payment",
    amount: 750000,
    currency: "VND",
    description: "Thanh toán tiền điện hành lang",
    fromAccount: "community_wallet",
    toAccount: "EVN HCMC",
    communityId: "cmy_1",
    proposalId: "prop_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 3)).toISOString(),
    createdBy: "system",
    metadata: {
      approvedBy: ["user_a", "user_b", "user_c"],
    },
  },
  {
    id: "txn_4",
    type: "deposit",
    amount: 2000000,
    currency: "VND",
    description: "Chị Lê Thị C - Gửi tiền mừng đám cưới",
    fromAccount: "user_c",
    toAccount: "community_wallet",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 4)).toISOString(),
    createdBy: "user_c",
    metadata: {
      bankCode: "ACB",
      transactionRef: "FT2336200003",
    },
  },
  {
    id: "txn_5",
    type: "withdrawal",
    amount: 1000000,
    currency: "VND",
    description: "Rút tiền cho vay anh Nguyễn Văn A",
    fromAccount: "community_wallet",
    toAccount: "user_a",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 5)).toISOString(),
    createdBy: "system",
    metadata: {
      transactionRef: "LOAN_DISBURSE_001",
    },
  },
  {
    id: "txn_6",
    type: "deposit",
    amount: 100000,
    currency: "VND",
    description: "Anh Nguyễn Văn A - Trả lãi vay",
    fromAccount: "user_a",
    toAccount: "community_wallet",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 6)).toISOString(),
    createdBy: "user_a",
    metadata: {
      bankCode: "VCB",
      transactionRef: "FT2336000004",
    },
  },
  {
    id: "txn_7",
    type: "proposal_payment",
    amount: 1200000,
    currency: "VND",
    description: "Thanh toán phí vệ sinh chung cư",
    fromAccount: "community_wallet",
    toAccount: "Công ty Môi trường Đô thị",
    communityId: "cmy_1",
    proposalId: "prop_2",
    status: "pending",
    timestamp: new Date(now.setDate(now.getDate() - 7)).toISOString(),
    createdBy: "user_d",
    metadata: {
      approvedBy: ["user_a", "user_b"],
    },
  },
  {
    id: "txn_8",
    type: "deposit",
    amount: 500000,
    currency: "VND",
    description: "Phạm Văn D - Nộp quỹ tháng 11",
    fromAccount: "user_d",
    toAccount: "community_wallet",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 30)).toISOString(),
    createdBy: "user_d",
    metadata: {
      bankCode: "VIB",
      transactionRef: "FT2333500005",
    },
  },
  {
    id: "txn_9",
    type: "withdrawal",
    amount: 300000,
    currency: "VND",
    description: "Mua đồ cúng rằm tháng 7",
    fromAccount: "community_wallet",
    toAccount: "user_b",
    communityId: "cmy_1",
    status: "failed",
    timestamp: new Date(now.setDate(now.getDate() - 150)).toISOString(),
    createdBy: "user_b",
    metadata: {
      transactionRef: "WD_230815_001",
    },
  },
  {
    id: "txn_10",
    type: "transfer",
    amount: 500000,
    currency: "VND",
    description: "Anh A chuyển tiền cho Chị B",
    fromAccount: "user_a",
    toAccount: "user_b",
    communityId: "cmy_1",
    status: "completed",
    timestamp: new Date(now.setDate(now.getDate() - 10)).toISOString(),
    createdBy: "user_a",
    metadata: {
      transactionRef: "P2P_TRANSFER_001",
    },
  },
];

export const mockGetTransactions = (
  options: any
): Promise<GetTransactionsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        limit = 10,
        type = "all",
        status = "all",
      } = options;

      let filteredTransactions = mockTransactions;

      if (type !== "all") {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.type === type
        );
      }

      if (status !== "all") {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.status === status
        );
      }

      const total = filteredTransactions.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedTransactions = filteredTransactions.slice(
        (page - 1) * limit,
        page * limit
      );

      const summary = {
        totalDeposits: mockTransactions
          .filter((t) => t.type === "deposit" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        totalWithdrawals: mockTransactions
          .filter((t) => t.type === "withdrawal" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        totalTransfers: mockTransactions
          .filter((t) => t.type === "transfer" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        balance: 50000000, // Mock balance
        currency: "VND",
        transactionCount: mockTransactions.length,
      };

      resolve({
        success: true,
        data: {
          transactions: paginatedTransactions,
          summary,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      });
    }, 500);
  });
};