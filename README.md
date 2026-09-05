🚀 RevenueRescue AI

AI-Powered Revenue Recovery Platform with Razorpay

RevenueRescue AI is an AI-assisted revenue recovery platform built for the Razorpay AI Buildathon 2026 — Track 3: AI Revenue Recovery.

It helps businesses identify failed or at-risk payments, predict recovery probability, diagnose failure reasons, recommend recovery actions, execute recovery through Razorpay Test Mode, verify the actual payment result, and track outcomes through an audit trail and analytics.

Detect → Predict → Diagnose → Decide → Guard → Recover → Verify → Audit → Analyze

🎯 Problem Statement

Payment failures can directly result in lost revenue. But every failed payment should not be handled in the same way.

A business needs to understand:

Why did the payment fail?

How likely is the transaction to be recovered?

Which recovery action should be attempted?

Should the action happen automatically?

Does the case require human review?

Did the recovery action actually result in a successful payment?

How much revenue was actually recovered?

RevenueRescue AI connects these steps into one controlled workflow.

💡 Solution

The platform combines:

Machine learning

AI recovery decisions

Failure diagnosis

Recovery strategy selection

Guardrails

Human review

Razorpay Test Mode

Payment verification

Audit trail

Recovery analytics

End-to-End Recovery Flow

flowchart LR
    A[Failed / At-Risk Payment] --> B[Risk Detection]
    B --> C[Recovery Probability]
    C --> D[Failure Diagnosis]
    D --> E[AI Recovery Decision]
    E --> F[Guardrails]
    F -->|Needs Review| G[Human Review]
    F -->|Allowed| H[Recovery Execution]
    G -->|Approved| H
    H --> I[Razorpay Test Mode]
    I --> J[Payment Verification]
    J --> K[Recovery Result]
    K --> L[Audit Trail]
    L --> M[Analytics]

The AI makes the recovery decision, Razorpay executes the payment action, and verification confirms whether money was actually recovered.

🖥️ Application Screenshots

The following screenshots show the main modules of RevenueRescue AI.

🏠 Revenue Recovery Command Center

The main dashboard provides an overview of revenue at risk, transactions, recovery performance, and key metrics.



🤖 AI Recovery

The AI Recovery page evaluates a transaction, estimates recovery probability, diagnoses the failure, and recommends a suitable recovery action.



🛡️ Guardrails

Guardrails keep AI-driven recovery actions within defined boundaries and help route cases to Human Review when required.



👤 Human Review

Cases that require additional judgement can be reviewed before recovery execution.



💳 Razorpay Execution

Recovery actions can be executed using Razorpay Test Mode Payment Links.



✅ Payment Verification

The system verifies the Razorpay payment result before counting the transaction as recovered revenue.



📋 Audit Trail

Recovery attempts and their outcomes are recorded for traceability.



📊 Recovery Funnel

The Recovery Funnel shows the journey from revenue exposure through verified recovery.



📈 Recovery Analytics

Analytics provides visibility into recovery performance, outcomes, failure reasons, strategy performance, and model metrics.



🤖 AI Decision Flow

RevenueRescue AI evaluates transaction and customer-related signals to support the recovery decision.

flowchart TD
    A[Transaction Data] --> B[Recovery Prediction]
    B --> C[Recovery Probability]
    C --> D[Failure Diagnosis]
    D --> E[AI Decision Engine]
    E --> F[Recommended Recovery Action]
    F --> G[Guardrails]
    G -->|Allowed| H[Recovery Execution]
    G -->|Needs Judgement| I[Human Review]
    I -->|Approved| H

The AI decision process considers:

Recovery probability

Likely failure reason

Recommended recovery strategy

Confidence

Recovery eligibility

The AI acts as a decision-support layer rather than an uncontrolled automatic system.

🛡️ Guardrails

AI-powered recovery should not operate without boundaries.

RevenueRescue AI places a Guardrails layer between the AI decision and recovery execution.

Guardrail principles

Recovery eligibility

Confidence requirements

Action boundaries

High-risk case handling

Human escalation

Verification requirements

Recovery stopping conditions

The AI can make a decision, but it still has to stay inside the rules.

👤 Human-in-the-Loop

Not every recovery case should be handled automatically.

Cases that require additional judgement can be routed to Human Review.

Possible review outcomes include:

Decision

Purpose

Approve

Allow the recovery action

Hold

Temporarily stop the case

Escalate

Send the case for additional attention

Reject

Do not proceed with recovery

AI handles suitable cases while humans focus on cases where judgement is actually useful.

💳 Razorpay Integration

RevenueRescue AI integrates with Razorpay Test Mode to demonstrate the recovery payment workflow.

The project uses Razorpay Payment Links as the recovery mechanism.

Razorpay Flow

flowchart LR
    A[AI Recovery Decision] --> B[Recovery Action]
    B --> C[Razorpay Payment Link]
    C --> D[Customer Payment]
    D --> E[Razorpay Test Mode]
    E --> F[Payment Status]
    F --> G[RevenueRescue Verification]

No real customer payment is required for the demonstration.

🔄 Recovery Execution

Once a recovery action passes the required guardrails, it can be executed.

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

The system then moves to payment verification.

✅ Payment Verification

A recovery action being triggered does not automatically mean revenue was recovered.

RevenueRescue AI checks the Razorpay payment information and determines whether the payment was actually completed.

Possible states

Status

Meaning

Recovered

Payment was successfully completed and verified

Partial

A partial payment was detected

Pending

Payment has not been completed

Failed

Recovery was not successful

Unknown

Payment state could not be determined

Error

Verification could not be completed

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
Verification
     ↓
Not Recovered / Pending
     ↓
Recovered Amount = ₹0

Recovery Link Created ≠ Revenue Recovered

A transaction is counted as recovered only after the payment result has been verified.

📋 Audit Trail

The Audit Trail provides traceability across the recovery lifecycle.

An audit record can contain:

Transaction

Recovery action

Payment Link

Verification result

Amount

Amount recovered

Status

Recovery outcome

Both successful and unsuccessful/incomplete recovery attempts can be recorded.

This means the system does not only track successful recoveries — it also keeps a record of recovery attempts that did not result in recovered revenue.

📊 Recovery Funnel

The Recovery Funnel shows the journey of money through the recovery system.

flowchart LR
    A[Revenue Exposure] --> B[At-Risk Transactions]
    B --> C[AI Evaluation]
    C --> D[Recovery Decisions]
    D --> E[Recovery Actions]
    E --> F[Payment Attempts]
    F --> G[Verified Recovery]

This helps identify where transactions progress successfully and where recovery opportunities are lost.

📈 Recovery Analytics

The Analytics module provides a business and system-level view of recovery performance.

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

The system can analyze major reasons behind failed or at-risk transactions.

Strategy Performance

Recovery strategies can be compared to understand which approaches perform better.

Model Metrics

Machine learning model performance can also be reviewed through the analytics interface.

🏗️ System Architecture

flowchart TB
    subgraph Frontend["Frontend - React + Vite"]
        A[Dashboard]
        B[AI Recovery]
        C[Recovery Funnel]
        D[Analytics]
        E[Razorpay]
        F[Verification]
        G[Human Review]
        H[Audit Trail]
        I[Guardrails]
    end

    subgraph Backend["Backend - FastAPI"]
        J[REST API]
        K[AI Agent]
        L[Decision Logic]
        M[Failure Diagnosis]
        N[Recovery Logic]
        O[Audit Management]
    end

    subgraph ML["Machine Learning"]
        P[Recovery Prediction]
        Q[Model Evaluation]
        R[Threshold Analysis]
        S[Trained Model]
    end

    subgraph Data["Data Layer"]
        T[transactions.csv]
        U[recovery_audit.csv]
    end

    subgraph Razorpay["Razorpay Test Mode"]
        V[Payment Links]
        W[Payment Execution]
        X[Payment Status]
    end

    Frontend --> J
    J --> K
    K --> L
    L --> M
    L --> P
    P --> L
    L --> N
    N --> I
    I --> V
    V --> W
    W --> X
    X --> F
    F --> O
    O --> U
    T --> P

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

Layer

Technologies

Frontend

React, JavaScript, HTML, CSS, Vite

Backend

Python, FastAPI, Pandas

Machine Learning

Python, Scikit-learn

Payment Integration

Razorpay Test Mode, Payment Links

Data

CSV, Pandas

Model

Trained recovery prediction model

🔗 Backend API

GET  /health
GET  /
POST /recover
GET  /verify/{payment_link_id}
GET  /metrics
GET  /transactions
GET  /audit

/recover

Runs recovery analysis and returns the AI recovery decision.

/verify/{payment_link_id}

Checks the Razorpay Payment Link and determines the payment/recovery status.

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

Create a virtual environment:

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

5. Start the Frontend

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

🔐 Security

Sensitive credentials are intentionally excluded from the repository.

The .gitignore excludes:

.env
.env.*
venv/
venv312/
node_modules/
dist/
__pycache__/
*.pyc

Razorpay credentials should always be stored using environment variables.

Never place real API credentials directly inside source code or README files.

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