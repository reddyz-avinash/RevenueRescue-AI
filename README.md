🚀 RevenueRescue AI

AI-Powered Revenue Recovery Platform with Razorpay

RevenueRescue AI is an AI-assisted revenue recovery platform designed to
help businesses identify failed or at-risk payments, understand why they
failed, predict recovery probability, recommend suitable recovery
actions, execute recovery through Razorpay Test Mode, and verify whether
the revenue was actually recovered.

Built for the Razorpay AI Buildathon 2026 --- Track 3: AI Revenue
Recovery.

🎯 Problem Statement

Payment failures can directly result in lost revenue. However, not every
failed payment should be treated in the same way.

A business needs to understand:

Why did the payment fail?

How likely is the transaction to be recovered?

Which recovery action should be attempted?

Should the action happen automatically?

Does the case require human review?

Did the recovery action actually result in a successful payment?

How much revenue was actually recovered?

RevenueRescue AI connects detection, AI decision-making, recovery
execution, payment verification, auditability, and analytics into one
workflow.

💡 Solution

RevenueRescue AI provides an end-to-end revenue recovery workflow:

Failed / At-Risk Payment
          ↓
     Risk Detection
          ↓
 Recovery Probability
          ↓
   Failure Diagnosis
          ↓
  AI Recovery Decision
          ↓
      Guardrails
          ↓
 ┌────────┴─────────┐
 ↓                  ↓
Human Review     Automated
                  Recovery
                      ↓
             Razorpay Test Mode
                      ↓
             Payment Verification
                      ↓
                Recovery Result
                      ↓
                Audit Trail
                      ↓
             Analytics & Funnel

The AI makes the recovery decision, Razorpay executes the payment
action, and verification confirms whether money was actually
recovered.

🤖 AI Decision Flow

Transaction
     │
     ▼
Customer + Transaction Context
     │
     ▼
Recovery Probability
     │
     ├─────────────────┐
     │                 │
     ▼                 ▼
Failure Diagnosis   Risk Signals
     │                 │
     └────────┬────────┘
              ▼
       AI Decision Engine
              │
              ▼
       Recommended Action
              │
              ▼
          Guardrails
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
    Allowed       Requires
    Action        Human Review
       │             │
       ▼             ▼
   Recovery        Review
   Execution       Decision

The AI evaluates available transaction and customer-related signals to
determine:

Recovery probability

Likely failure reason

Recommended recovery action

Confidence

Recovery eligibility

🖥️ Application Screenshots

🏠 Revenue Recovery Command Center

The Overview dashboard provides a high-level view of revenue at risk,
transaction activity, recovery performance, and recovery outcomes.



🧠 AI Recovery

The AI Recovery module evaluates a transaction, estimates recovery
probability, diagnoses the failure, and recommends a recovery action.



🛡️ Guardrails

The Guardrails layer keeps AI-driven recovery actions within defined
boundaries and can route cases to Human Review when required.



👤 Human Review

Cases that require additional judgement can be reviewed before recovery
execution.



💳 Razorpay Execution

Recovery actions can be executed using Razorpay Test Mode Payment Links.



✅ Payment Verification

The system verifies the Razorpay payment result before counting revenue
as recovered.



📋 Audit Trail

Recovery attempts and their outcomes are recorded for traceability.



📊 Recovery Funnel

The funnel shows the journey from revenue exposure through verified
recovery.



📈 Recovery Analytics

Analytics provides a business and model-level view of recovery
performance, outcomes, failure reasons, strategies, and metrics.



🛡️ Guardrails

AI-powered recovery should not operate without boundaries.

             AI Recommendation
                    │
                    ▼
             ┌──────────────┐
             │  Guardrails  │
             └───────┬──────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       Allowed              Escalate
          │                     │
          ▼                     ▼
      Recovery             Human Review

Recovery eligibility

Confidence requirements

Action boundaries

High-risk cases

Human escalation

Verification requirements

Recovery stopping conditions

The AI can make a decision, but it still has to stay inside the
rules.

👤 Human Review

Not every recovery case should be handled automatically. Human Review
provides a controlled workflow for cases where additional judgement is
required.

Approve

Hold

Escalate

Reject

AI handles suitable cases while humans focus on cases where
judgement is actually useful.

💳 Razorpay Integration

RevenueRescue AI integrates with Razorpay Test Mode and uses
Razorpay Payment Links as the recovery mechanism.

AI Recovery Decision
        ↓
Recovery Action
        ↓
Razorpay Payment Link
        ↓
Customer Payment
        ↓
Razorpay Test Mode
        ↓
Payment Status
        ↓
RevenueRescue Verification

No real customer payment is required for the demonstration.

🔄 Recovery Execution

Transaction
     ↓
AI Recommendation
     ↓
Guardrail Check
     ↓
Recovery Action
     ↓
Razorpay Payment Link
     ↓
Customer Payment Attempt

✅ Payment Verification

A recovery action being triggered does not automatically mean
revenue was recovered.

The system checks Razorpay payment information and determines whether
the payment was actually completed.

Recovered

Partial

Pending

Failed

Unknown

Error

Successful Recovery

Payment Link
     ↓
Payment Completed
     ↓
Razorpay Payment Status
     ↓
Verification
     ↓
Recovered
     ↓
Recovered Amount Recorded

Unsuccessful / Incomplete Recovery

Payment Link
     ↓
Payment Not Completed
     ↓
Razorpay Payment Status
     ↓
Verification
     ↓
Not Recovered / Pending
     ↓
Recovered Amount = ₹0

Recovery Link Created ≠ Revenue Recovered

📋 Audit Trail

Every recovery attempt should be traceable. The Audit Trail can record
the transaction, recovery action, Payment Link, verification result,
amount, amount recovered, status, and outcome.

Both successful and unsuccessful/incomplete recovery attempts can be
recorded.

📊 Recovery Funnel

Revenue Exposure
       ↓
At-Risk Transactions
       ↓
AI Evaluation
       ↓
Recovery Decisions
       ↓
Recovery Actions
       ↓
Payment Attempts
       ↓
Verified Recovery

📈 Recovery Analytics

Transaction count

Revenue exposure

Recovered revenue

Average recovered amount per case

Recovery outcomes

Failure reasons

Recovery strategy performance

Machine learning model metrics

🏗️ System Architecture

┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│                                                         │
│ React + Vite                                            │
│ Dashboard • AI Recovery • Funnel • Analytics            │
│ Razorpay • Verification • Human Review • Audit • Guardrails
└────────────────────────┬────────────────────────────────┘
                         │
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│                                                         │
│ FastAPI • AI Agent • Decision Logic • Diagnosis         │
│ Recovery Logic • Audit Management                      │
└───────────────┬──────────────────────┬──────────────────┘
                │                      │
                ▼                      ▼
┌────────────────────────┐   ┌────────────────────────────┐
│    MACHINE LEARNING    │   │       DATA LAYER           │
│ Recovery Prediction    │   │ transactions.csv           │
│ Model Evaluation       │   │ recovery_audit.csv        │
│ Threshold Analysis     │   │                            │
│ Trained Model          │   │ Pandas                     │
└────────────┬───────────┘   └────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                  RAZORPAY TEST MODE                     │
│ Payment Links • Payment Execution • Payment Status      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────────┐
                │    VERIFICATION     │
                │ Payment Status      │
                │ Amount Paid         │
                │ Amount Recovered    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     AUDIT TRAIL     │
                └─────────────────────┘

📁 Project Structure

RevenueRescue-AI/
│
├── backend/
│   ├── agents/
│   ├── data/
│   ├── ml/
│   ├── payments/
│   ├── agent.py
│   ├── api.py
│   ├── batch_recovery.py
│   ├── evaluation.py
│   └── razorpay_client.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── screenshots/
│       ├── dashboard.png
│       ├── ai-recovery.png
│       ├── razorpay.png
│       ├── verification.png
│       ├── human-review.png
│       ├── audit-trail.png
│       ├── guardrails.png
│       ├── recovery-funnel.png
│       └── analytics.png
│
├── .gitignore
└── README.md

🧰 Technology Stack

Frontend: React, JavaScript, HTML, CSS, Vite

Backend: Python, FastAPI, Pandas

Machine Learning: Python, Scikit-learn, recovery prediction,
model evaluation, threshold analysis

Payment Integration: Razorpay Test Mode, Razorpay Payment Links

Data: CSV transaction data, recovery audit data, trained ML
model

🔗 Backend API

GET  /health
GET  /
POST /recover
GET  /verify/{payment_link_id}
GET  /metrics
GET  /transactions
GET  /audit

🚀 Setup Instructions

Prerequisites

Python 3.x

Node.js

npm

Git

1. Clone the Repository

git clone https://github.com/reddyz-avinash/RevenueRescue-AI.git
cd RevenueRescue-AI

2. Setup Backend

python -m venv venv312
venv312\Scripts\activate
pip install fastapi uvicorn pandas scikit-learn razorpay python-dotenv

3. Configure Environment Variables

Create a .env file in the project root:

RAZORPAY_KEY_ID=your_test_mode_key_id
RAZORPAY_KEY_SECRET=your_test_mode_key_secret
RAZORPAY_DEMO_PAYMENT_URL=your_demo_payment_url
RAZORPAY_DEMO_PAYMENT_LINK_ID=your_demo_payment_link_id

Never commit .env to GitHub.

4. Start the Backend

uvicorn backend.api:app --reload

5. Setup Frontend

cd frontend
npm install
npm run dev

🔄 Complete Demo Flow

1. Open Revenue Recovery Command Center
                    ↓
2. Select a failed / at-risk transaction
                    ↓
3. Run AI Recovery
                    ↓
4. View Recovery Probability
                    ↓
5. View Failure Diagnosis
                    ↓
6. View AI Recommended Action
                    ↓
7. Check Guardrails
                    ↓
8. Send cases to Human Review when required
                    ↓
9. Execute Recovery
                    ↓
10. Use Razorpay Test Mode
                    ↓
11. Complete Test Mode Payment
                    ↓
12. Verify Payment
                    ↓
13. Record Recovered Revenue
                    ↓
14. Store Audit Record
                    ↓
15. Review Recovery Funnel
                    ↓
16. Analyze Recovery Performance

🔐 Security

Sensitive credentials are intentionally excluded from the repository.
The .gitignore excludes .env, virtual environments, Node
dependencies, build files, and Python cache files.

Razorpay credentials should always be stored using environment
variables.

🔮 Future Improvements

Real-time Razorpay webhooks

Real-time payment event processing

More advanced customer-level recovery prediction

Personalized recovery messaging

Automated retry scheduling

Additional recovery channels

A/B testing of recovery strategies

Advanced fraud and risk detection

Production database integration

Role-based access control

Advanced model monitoring

Continuous model improvement