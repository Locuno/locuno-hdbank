# Locuno: Engineering Trust for Vietnam’s Families and Communities

A single platform that turns social trust into tangible financial power. We combine:
- Community Wallet with 2/3 Approval and a real-time “Business Logic Blockchain” ledger
- Social Credit Score (explainable, consent-based) that unlocks bank-backed community credit
- ESG transparency (Social + Governance) with measurable impact
- Safety rails (SOS and neighbor assistance) to reinforce trust in daily life

## Executive Summary
Vietnam’s families and communities face two connected trust gaps: peace of mind for loved ones and transparency for shared funds. Locuno unifies both into one trust infrastructure. For this hackathon, we showcase a powerful Community-first MVP: transparent shared finance, explainable social credit scoring, and a bank-integrated community loan flow—demonstrating inclusion, accountability, and immediate utility.

## What We Deliver in the Demo
- Live Community Wallet: VietQR deposits, instant ledger updates, proposals, and 2/3 approval for spend requests.
- Social Credit Score (0–100): computed from wallet behaviors; shows top reasons and tips to improve.
- Community Credit Line: auto-approval above threshold; disbursement and repayment flows.
- ESG Dashboard: social participation, savings stability, governance compliance (vote ratios), transparent audit trail.

## Community Wallet: Radical Transparency
- “2/3 Approval” policy enforced in code; every request, vote, and payment recorded on an immutable real-time ledger.
- Deposits via QR (SePay) update balances instantly; spend requests wait for supermajority approval.
- Member visibility: who proposed, who voted, when executed—trust through shared truth.

## Social Credit Score: Explainable and Actionable
- Features (fast, transparent):
  - Deposit frequency (last 30 days)
  - Average deposit amount
  - Balance growth vs. volatility
  - Participation (unique depositors/voters)
  - Recency (time since last deposit)
- Output: Score 0–100 + top 3 reasons and improvement tips.
- Policy (demo): approve community credit if Score ≥ 60 and recent deposits ≥ X; cap loan at ~30% of recent deposits; simple interest; weekly amortization.
- Repayment: deposits tagged “REPAY <shortID> <amount>” auto-apply to reduce outstanding principal.
- Consent & fairness: explicit community opt-in, data minimization, bias checks, explainability by design.

## ESG: Measurable Social and Governance Impact
- Social:
  - Participation rate (active depositors/voters)
  - Savings consistency and resilience
  - Emergency support (optional SOS interactions)
- Governance:
  - Proposal coverage, 2/3 approval adherence
  - Auditability: every action on the ledger
- Optional “E” hooks later: micro-donations per transaction to local environmental causes.

## Safety: Everyday Peace of Mind (Roadmap-ready)
- Family SOS and neighbor alert network (eKYC-verified), consent-based location/wellness sharing.
- Ties into Community Wallet: communities can fund emergency micro-grants, recorded and governed transparently.

## Architecture (Built for Trust and Scale)
- Cloudflare Workers + Durable Objects: deterministic, low-latency, globally distributed.
- Business Logic Blockchain: a shared, append-only ledger with verifiable state transitions.
- Webhooks (SePay) + VietQR: frictionless deposits into community balances.
- Scoring service: lightweight inference + feature store; results persisted with reasons.
- Minimal APIs: score compute/fetch, loan apply/disburse/repay/status.
- Frontend: modern, real-time view of balance, votes, score, loan status, and ESG metrics.

## Demo Script (Interactive)
1) Show community balance and ledger.  
2) Scan QR, make a small deposit → webhook updates balance.  
3) Score recomputes; display score and reasons.  
4) Apply for loan; auto-approve based on policy.  
5) Disburse and show balance increase + loan status/schedule.  
6) Simulate repayment (“REPAY … 50,000”) → outstanding decreases.  
7) Create a spend request; members vote; execute on 2/3 approval.  
8) ESG card updates with participation and governance metrics.

## Why Banks Love This
- New deposits from underserved community segments.
- Risk-aware credit expansion via explainable social scoring.
- ESG-aligned reporting (S + G) with auditable metrics.
- Brand differentiation: trust infrastructure for everyday life.
- Cost-efficient infra; rapid iteration and compliance-friendly data model.

## Monetization
- Community premium (tools + analytics), bank origination fees, interchange on payments, ESG data services for corporate programs.

## Roadmap
- Day 1 (Hackathon): end-to-end demo (deposit → score → loan → repay → vote → execute → ESG dashboard).
- Month 1: pilots with parent associations and neighborhood committees; score tuning; simple consent UX.
- Quarter 2: expand features (Family SOS live, richer social graph signals, bias audits, micro-grants).
- Later: global payments rails, optional RWA tokenization for large community assets.

## Risks & Mitigations
- Privacy/bias: opt-in consent, explainable features, regular fairness checks.
- Fraud: identity verification, deposit source checks, anomaly detection.
- Governance capture: quorum thresholds, transparent histories, role-based controls.
- Compliance: data minimization, audit logs, configurable policies.

## Success Metrics
- Active communities and monthly deposits
- Approval-to-execution latency and vote participation
- Average credit score and repayment on-time rate
- ESG participation and governance compliance

## Call to Action
Locuno turns everyday social trust into financial inclusion, transparency, and safety. Let’s pilot with real communities, prove impact with ESG metrics, and grow deposits and responsible credit—built on a ledger everyone can trust.