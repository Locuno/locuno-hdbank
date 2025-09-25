# Locuno – Hackathon Slides (Top-Level)

Goal
- Demonstrate Community Wallet + Social Credit Score + ESG transparency
- End-to-end demo: deposit → score → loan → repay → vote → execute → ESG

Problem
- Families: lack of private, consent-based safety net (location + wellness + SOS)
- Communities: opaque fund management (Zalo + Excel), no shared truth

Solution
- Unified Trust Platform: Locuno Family + Locuno Community
- Community Wallet: 2/3 Approval, real-time ledger (Business Logic Blockchain), VietQR deposits
- Social Credit Score: 0–100, explainable features, unlocks bank-backed community credit
- ESG: Social + Governance metrics, auditable history

Demo Flow
1) Deposit via VietQR (SePay) → balance and ledger update
2) Recompute score → show reasons and tips
3) Apply & auto-approve loan if score threshold met
4) Disburse funds → show schedule; repayments via "REPAY <shortID> <amount>"
5) Create spend request → 2/3 votes → execute
6) ESG card updates (participation, vote compliance)

Key APIs
- POST /communities/:id/credit/score
- GET /communities/:id/credit/score
- POST /communities/:id/loan/apply | /disburse | /repay
- GET /communities/:id/loan/status

Value to Bank & Ecosystem
- New deposits, responsible credit expansion
- Transparent governance with measurable ESG
- Loyalty OS for Sovico (HDBank, Vietjet, retail partners)

Roadmap
- Day 1: live demo end-to-end
- Month 1: pilots (residences, schools)
- Quarter 2: Family SOS live, richer social signals

Risks & Mitigations
- Privacy/bias → consent, explainability, fairness checks
- Fraud → eKYC, anomaly detection
- Governance capture → quorum thresholds, audit trail

Call to Action
- Approve pilot to validate trust-driven growth