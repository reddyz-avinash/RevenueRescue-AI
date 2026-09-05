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

Payment failures can directly result in lost revenue.

However, not every failed payment should be treated in the same way.

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

Core Principle

The AI makes the recovery decision, Razorpay executes the payment
action, and verification confirms whether money was actually
recovered.

🤖 AI Decision Flow

The core of RevenueRescue AI is the recovery decision process.

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

The AI recommendation acts as a decision-support mechanism rather
than an uncontrolled automatic action.

🏠 Revenue Recovery Command Center

The Overview dashboard provides a high-level view of the revenue
recovery system.

It helps users understand:

Revenue at risk

Transaction activity

Recovery performance

Recovery outcomes

Important recovery metrics

Dashboard



🧠 AI Recovery

The AI Recovery module is the main decision-making interface.

It provides visibility into:

Transaction details

Recovery probability

Failure diagnosis

Recommended recovery strategy

Recovery decision

Confidence

Guardrail considerations

AI Recovery



🛡️ Guardrails

AI-powered recovery should not operate without boundaries.

RevenueRescue AI includes a Guardrails layer between the AI decision and
recovery execution.

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

The Guardrails layer is designed around:

Recovery eligibility

Confidence requirements

Action boundaries

High-risk cases

Human escalation

Verification requirements

Recovery stopping conditions

The AI can make a decision, but it still has to stay inside the
rules.

Guardrails



👤 Human Review

Not every recovery case should be handled automatically.

The Human Review module provides a controlled workflow for cases where
additional judgement is required.

Possible outcomes include:

Approve

Hold

Escalate

Reject

AI Decision
    │
    ▼
Guardrails
    │
    ├── Suitable → Automated Recovery
    │
    └── Requires Review
              │
              ▼
        Human Review
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Approve  Hold  Escalate

AI handles suitable cases while humans focus on cases where
judgement is actually useful.

Human Review



💳 Razorpay Integration

RevenueRescue AI integrates with Razorpay Test Mode to demonstrate
the payment recovery process.

The project uses Razorpay Payment Links as the recovery mechanism.

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

The project uses Test Mode for demonstration purposes and does not
require real customer payments.

Razorpay Execution



🔄 Recovery Execution

Once an appropriate recovery action has been selected and passes the
required guardrails, the recovery action can be executed.

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

The system then moves to the verification stage.

✅ Payment Verification

A recovery action being triggered does not automatically mean
revenue was recovered.

RevenueRescue AI therefore includes a separate payment verification
stage.

The system checks Razorpay payment information and determines whether
the payment was actually completed.

Possible recovery states include:

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

This prevents the system from reporting recovered revenue simply because
a payment link was created.

Payment Verification



📋 Audit Trail

Every recovery attempt should be traceable.

RevenueRescue AI records recovery outcomes in the Audit Trail.

The audit information can include:

Transaction

Recovery action

Payment Link

Verification result

Amount

Amount recovered

Status

Recovery outcome

Both successful and unsuccessful/incomplete recovery attempts can be
recorded.

Recovery Attempt
       │
       ▼
Payment Result
       │
       ├── Successful
       │       ↓
       │   Recovered
       │       ↓
       │   Audit Record
       │
       └── Unsuccessful / Incomplete
               ↓
           Not Recovered
               ↓
           Audit Record

This provides traceability across the recovery lifecycle.

Audit Trail



📊 Recovery Funnel

The Recovery Funnel shows the complete journey of revenue through the
recovery system.

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

The funnel helps users understand how transactions move through the
recovery pipeline.

Recovery Funnel



📈 Recovery Analytics

The Analytics module provides a business-level and system-level view of
recovery performance.

Overall Performance

Transaction count

Revenue exposure

Recovered revenue

Average recovered amount per case

Recovery Outcomes

Recovered

Pending

Not recovered

Other outcomes

Failure Reasons

The analytics view helps identify major reasons behind failed or at-risk
transactions.

Strategy Performance

Different recovery strategies can be compared to understand their
performance.

Model Metrics

The analytics section provides visibility into machine learning model
performance.

Recovery Analytics



🖥️ Application Overview

Module               Purpose

🏠 Command Center    Overall revenue recovery overview
🤖 AI Recovery       AI-based transaction evaluation
🛡️ Guardrails        Recovery safety rules and boundaries
👤 Human Review      Human-in-the-loop decision making
💳 Razorpay          Recovery payment execution
✅ Verification      Payment result verification
📋 Audit Trail       Recovery history and traceability
📊 Recovery Funnel   End-to-end recovery journey
📈 Analytics         Business and model performance

🏗️ System Architecture

RevenueRescue AI follows a frontend → backend → AI/ML → payment
integration architecture.

┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│                                                         │
│ React + Vite                                            │
│                                                         │
│ Dashboard                                               │
│ AI Recovery                                             │
│ Recovery Funnel                                         │
│ Analytics                                               │
│ Razorpay Execution                                      │
│ Verification                                            │
│ Human Review                                            │
│ Audit Trail                                             │
│ Guardrails                                              │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│                                                         │
│ FastAPI                                                 │
│                                                         │
│ Recovery API                                            │
│ AI Agent                                                │
│ Decision Logic                                          │
│ Failure Diagnosis                                       │
│ Recovery Logic                                          │
│ Audit Management                                        │
└───────────────┬──────────────────────┬──────────────────┘
                │                      │
                ▼                      ▼
┌────────────────────────┐   ┌────────────────────────────┐
│    MACHINE LEARNING    │   │       DATA LAYER           │
│                        │   │                            │
│ Recovery Prediction    │   │ transactions.csv           │
│ Model Evaluation       │   │ recovery_audit.csv        │
│ Threshold Analysis     │   │                            │
│ Trained Model          │   │ Pandas                     │
└────────────┬───────────┘   └────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                  RAZORPAY TEST MODE                     │
│                                                         │
│ Payment Links                                           │
│ Payment Execution                                       │
│ Payment Status                                          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────────┐
                │    VERIFICATION     │
                │                     │
                │ Payment Status      │
                │ Amount Paid         │
                │ Amount Recovered    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     AUDIT TRAIL     │
                └─────────────────────┘

🧩 AI + Razorpay Architecture

The system separates AI decision-making from payment execution.

┌───────────────────┐
│ Transaction Data  │
└─────────┬─────────┘
          │
          ▼
┌──────────────────────┐
│ ML Prediction        │
│ Recovery Probability │
└─────────┬────────────┘
          │
          ▼
┌───────────────────┐
│ Failure Diagnosis │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ AI Decision Engine│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│    Guardrails     │
└─────────┬─────────┘
          │
     ┌────┴─────┐
     │          │
     ▼          ▼
  Human       Approved
  Review      Recovery
                 │
                 ▼
          ┌──────────────┐
          │   Razorpay   │
          │  Test Mode   │
          └──────┬───────┘
                 │
                 ▼
          Payment Result
                 │
                 ▼
          ┌──────────────┐
          │ Verification │
          └──────┬───────┘
                 │
                 ▼
            Audit Trail

📁 Project Structure

RevenueRescue-AI/
│
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── audit.py
│   │   ├── decision.py
│   │   ├── diagnosis.py
│   │   └── recovery.py
│   │
│   ├── data/
│   │   ├── recovery_audit.csv
│   │   └── transactions.csv
│   │
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── generate_data.py
│   │   ├── predict.py
│   │   ├── recovery_model.pkl
│   │   ├── threshold_analysis.py
│   │   └── train_model.py
│   │
│   ├── payments/
│   │   ├── __init__.py
│   │   ├── payment_link.py
│   │   └── verification.py
│   │
│   ├── agent.py
│   ├── api.py
│   ├── batch_recovery.py
│   ├── evaluation.py
│   └── razorpay_client.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Analytics.css
│   │   ├── AnalyticsView.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Audit.css
│   │   ├── AuditView.jsx
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx
│   │   ├── Guardrails.css
│   │   ├── GuardrailsView.jsx
│   │   ├── HumanReview.css
│   │   ├── HumanReviewView.jsx
│   │   ├── Payment.css
│   │   ├── PaymentView.jsx
│   │   ├── RecoveryFunnel.css
│   │   ├── RecoveryFunnelView.jsx
│   │   ├── VerificationView.css
│   │   ├── VerificationView.jsx
│   │   └── main.jsx
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

Frontend

React

JavaScript

HTML

CSS

Vite

Backend

Python

FastAPI

Pandas

Machine Learning

Python

Scikit-learn

Recovery prediction

Model evaluation

Threshold analysis

Payment Integration

Razorpay Test Mode

Razorpay Payment Links

Data

CSV-based transaction data

Recovery audit data

Trained machine learning model

🔗 Backend API

The frontend communicates with the FastAPI backend through REST APIs.

GET  /health
GET  /
POST /recover
GET  /verify/{payment_link_id}
GET  /metrics
GET  /transactions
GET  /audit

/recover

Runs the recovery analysis and returns the AI recovery decision.

/verify/{payment_link_id}

Checks the Razorpay Payment Link and determines the payment/recovery
status.

/metrics

Provides dashboard and recovery metrics.

/transactions

Returns transaction information.

/audit

Returns recovery audit records.

🚀 Setup Instructions

Prerequisites

Install:

Python 3.x

Node.js

npm

Git

1. Clone the Repository

git clone https://github.com/reddyz-avinash/RevenueRescue-AI.git
cd RevenueRescue-AI

2. Setup Backend

Create a Python virtual environment:

python -m venv venv312

Activate it:

venv312\Scripts\activate

Install the required packages:

pip install fastapi uvicorn pandas scikit-learn razorpay python-dotenv

3. Configure Environment Variables

Create a .env file in the project root:

RAZORPAY_KEY_ID=your_test_mode_key_id
RAZORPAY_KEY_SECRET=your_test_mode_key_secret
RAZORPAY_DEMO_PAYMENT_URL=your_demo_payment_url
RAZORPAY_DEMO_PAYMENT_LINK_ID=your_demo_payment_link_id

Never commit .env to GitHub.

4. Start the Backend

From the project root:

uvicorn backend.api:app --reload

5. Setup Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL provided by Vite.

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

🧪 Successful and Unsuccessful Recovery

RevenueRescue AI demonstrates both successful and unsuccessful recovery
outcomes.

Successful Recovery

AI Decision
    ↓
Recovery Action
    ↓
Razorpay Payment
    ↓
Payment Captured
    ↓
Verification
    ↓
Recovered

The recovered amount is recorded only after verification.

Unsuccessful / Incomplete Recovery

AI Decision
    ↓
Recovery Action
    ↓
Razorpay Payment Attempt
    ↓
Payment Not Completed
    ↓
Verification
    ↓
Not Recovered / Pending
    ↓
Recovered Amount = ₹0

The unsuccessful or incomplete attempt can still be recorded in the
audit trail.

📌 Important Design Principle

RevenueRescue AI separates decision, execution, and
verification.

Decision
   ↓
Execution
   ↓
Payment
   ↓
Verification
   ↓
Recovery

Therefore:

Recovery Link Created
        ≠
Revenue Recovered

A recovery is counted only after the payment result has been verified.

🔐 Security

Sensitive credentials are intentionally excluded from the repository.

The .gitignore file excludes:

.env
.env.*
venv/
venv312/
node_modules/
dist/
__pycache__/
*.pyc

Razorpay credentials should always be stored using environment
variables.

Never place real API credentials directly inside source code or README
files.

🔮 Future Improvements

Potential future improvements include:

Real-time Razorpay webhooks

Real-time payment event processing

More advanced customer-level recovery prediction

Personalized recovery messaging

Automated retry scheduling

Additional recovery channels

A/B testing of recovery strategies

Advanced fraud and risk detection

Real-time recovery monitoring

Production database integration

Role-based access control

Advanced model monitoring

Continuous model improvement



🎯 Project Summary

RevenueRescue AI brings together:

AI Decision Making
        +
Machine Learning
        +
Razorpay Integration
        +
Guardrails
        +
Human Review
        +
Payment Verification
        +
Auditability
        +
Analytics

The complete recovery lifecycle is:

Detect → Predict → Diagnose → Decide → Guard → Recover → Verify →
Audit → Analyze

