🚀 RevenueRescue AI

AI-Powered Revenue Recovery Platform with Razorpay

RevenueRescue AI is an AI-assisted revenue recovery platform built for the Razorpay AI Buildathon 2026 — Track 3: AI Revenue Recovery.

It helps businesses identify failed or at-risk payments, predict recovery probability, diagnose failure reasons, recommend recovery actions, execute recovery through Razorpay Test Mode, verify the actual payment result, and track outcomes through audit and analytics.

Detect → Predict → Diagnose → Decide → Guard → Recover → Verify → Audit → Analyze

🎯 Problem Statement

Payment failures can directly result in lost revenue. However, every failed payment should not be treated in the same way.

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

Failed / At-Risk Payment

          |
          v

     Risk Detection

          |
          v

 Recovery Probability

          |
          v

   Failure Diagnosis

          |
          v

  AI Recovery Decision

          |
          v

      Guardrails

       /       \
      v         v

Human Review   Automated Recovery

      |             |
      +------->-----+

                  |
                  v
          Razorpay Test Mode

                  |
                  v

          Payment Verification

                  |
                  v

            Recovery Result

                  |
                  v

              Audit Trail

                  |
                  v

               Analytics

The AI makes the recovery decision, Razorpay executes the payment action, and verification confirms whether money was actually recovered.

🖥️ Application Screenshots

🏠 Revenue Recovery Command Center

The main dashboard provides an overview of revenue at risk, transactions, recovery performance, and key metrics.

<img src="./docs/screenshots/dashboard.png" alt="Revenue Recovery Command Center" width="900"/>

🤖 AI Recovery

The AI Recovery page evaluates a transaction, estimates recovery probability, diagnoses the failure, and recommends a suitable recovery action.

<img src="./docs/screenshots/ai-recovery.png" alt="AI Recovery" width="900"/>

🛡️ Guardrails

Guardrails keep AI-driven recovery actions within defined boundaries and help route cases to Human Review when required.

<img src="./docs/screenshots/guardrails.png" alt="Guardrails" width="900"/>

👤 Human Review

Cases that require additional judgement can be reviewed before recovery execution.

<img src="./docs/screenshots/human-review.png" alt="Human Review" width="900"/>

💳 Razorpay Execution

Recovery actions can be executed using Razorpay Test Mode Payment Links.

<img src="./docs/screenshots/razorpay.png" alt="Razorpay Execution" width="900"/>

✅ Payment Verification

The system verifies the Razorpay payment result before counting the transaction as recovered revenue.

<img src="./docs/screenshots/verification.png" alt="Payment Verification" width="900"/>

📋 Audit Trail

Recovery attempts and their outcomes are recorded for traceability.

<img src="./docs/screenshots/audit-trail.png" alt="Audit Trail" width="900"/>

📊 Recovery Funnel

The Recovery Funnel shows the journey from revenue exposure through verified recovery.

<img src="./docs/screenshots/recovery-funnel.png" alt="Recovery Funnel" width="900"/>

📈 Recovery Analytics

Analytics provides visibility into recovery performance, outcomes, failure reasons, strategy performance, and model metrics.

<img src="./docs/screenshots/analytics.png" alt="Recovery Analytics" width="900"/>

🤖 AI Decision Flow

RevenueRescue AI evaluates transaction and customer-related signals to support the recovery decision.

Transaction Data

       |
       v

Recovery Prediction

       |
       v

Recovery Probability

       |
       v
       
Failure Diagnosis

       |
       v

AI Decision Engine

       |
       v

Recommended Recovery Action

       |
       v

Guardrails

     /   \
    v     v

Allowed  Needs Judgement

    |         |
    v         v

Recovery   Human Review
Execution      |
               v

             Approved

               |
               v

         Recovery Execution

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

AI Recovery Decision

        |
        v

Recovery Action

        |
        v

Razorpay Payment Link

        |
        v

Customer Payment

        |
        v

Razorpay Test Mode

        |
        v

Payment Status

        |
        v

RevenueRescue Verification

No real customer payment is required for the demonstration.

🔄 Recovery Execution

Once a recovery action passes the required guardrails, it can be executed.

Transaction

    |
    v

AI Recommendation

    |
    v

Guardrail Check

    |
    v

Recovery Action

    |
    v
    
Razorpay Payment Link

    |
    v
    
Customer Payment Attempt

The system then moves to payment verification.

✅ Payment Verification

A recovery action being triggered does not automatically mean revenue was recovered.

RevenueRescue AI checks Razorpay payment information and determines whether the payment was actually completed.

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

     |
     v

Payment Completed

     |
     v

Razorpay Payment Status

     |
     v

Verification

     |
     v

Recovered

     |
     v

Recovered Amount Recorded

Unsuccessful / Incomplete Recovery

Payment Link

     |
     v

Payment Not Completed

     |
     v
     
Verification

     |
     v

Not Recovered / Pending

     |
     v

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

📊 Recovery Funnel

The Recovery Funnel shows the journey of money through the recovery system.

Revenue Exposure

       |
       v

At-Risk Transactions

       |
       v

AI Evaluation

       |
       v

Recovery Decisions

       |
       v

Recovery Actions

       |
       v

Payment Attempts

       |
       v

Verified Recovery

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

+-----------------------------------------------------------+
|                  FRONTEND - React + Vite                  |
|                                                           |
| Dashboard | AI Recovery | Funnel | Analytics              |
| Razorpay | Verification | Human Review | Audit | Guardrails|
+----------------------------+------------------------------+

                             |
                          REST API
                             |
                             v

+-----------------------------------------------------------+
|                    BACKEND - FastAPI                     |
|                                                           |
| REST API | AI Agent | Decision Logic | Failure Diagnosis |
| Recovery Logic | Audit Management                        |
+-------------------+--------------------+------------------+

                    |                    |
                    v                    v

+-------------------------+   +----------------------------+
|    MACHINE LEARNING     |   |       DATA LAYER           |
|                         |   |                            |
| Recovery Prediction     |   | transactions.csv           |
| Model Evaluation        |   | recovery_audit.csv        |
| Threshold Analysis     |   |                            |
| Trained Model           |   | Pandas                     |
+------------+------------+   +----------------------------+

             |
             v

+-----------------------------------------------------------+
|                  RAZORPAY TEST MODE                      |
|                                                           |
| Payment Links | Payment Execution | Payment Status       |
+----------------------------+------------------------------+

                             |
                             v
                             
+-----------------------------------------------------------+
|                    VERIFICATION                          |
|                                                           |
| Payment Status | Amount Paid | Amount Recovered          |
+----------------------------+------------------------------+

                             |
                             v
                             
+-----------------------------------------------------------+
|                     AUDIT TRAIL                          |
+-----------------------------------------------------------+

📁 Project Structure

RevenueRescue-AI/
|
+-- backend/
|   +-- agents/
|   +-- data/
|   +-- ml/
|   +-- payments/
|   +-- agent.py
|   +-- api.py
|   +-- batch_recovery.py
|   +-- evaluation.py
|   +-- razorpay_client.py
|
+-- frontend/
|   +-- public/
|   +-- src/
|   +-- package.json
|   +-- vite.config.js
|
+-- docs/
|   +-- screenshots/
|       +-- dashboard.png
|       +-- ai-recovery.png
|       +-- analytics.png
|       +-- audit-trail.png
|       +-- guardrails.png
|       +-- human-review.png
|       +-- razorpay.png
|       +-- recovery-funnel.png
|       +-- verification.png
|
+-- .gitignore
+-- README.md

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

Open Revenue Recovery Command Center

Select a failed / at-risk transaction

Run AI Recovery

View Recovery Probability

View Failure Diagnosis

View AI Recommended Action

Check Guardrails

Send cases to Human Review when required

Execute Recovery

Use Razorpay Test Mode

Complete Test Mode Payment

Verify Payment

Record Recovered Revenue

Store Audit Record

Review Recovery Funnel

Analyze Recovery Performance

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