from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import csv
import os
from datetime import datetime

import pandas as pd

from backend.agent import run_revenue_recovery_agent
from backend.payments.verification import verify_payment_link


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)

AUDIT_FILE = os.path.join(
    DATA_DIR,
    "recovery_audit.csv"
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="RevenueRescue AI",
    description="AI Revenue Recovery Agent",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class RecoveryRequest(BaseModel):

    transaction_id: str

    customer_id: str

    amount: float

    failure_reason: str

    retry_count: int = 0

    previous_successes: int = 0

    previous_failures: int = 0

    previous_recovery_success: int = 0

    customer_name: str = "Demo Customer"

    customer_email: str = "test@example.com"

    customer_phone: str = "9876543210"

    checkout_duration_minutes: float = 5

    checkout_started: int = 1

    checkout_completed: int = 0

    customer_tenure_months: int = 12

    subscription_active: int = 1

    days_overdue: int = 0

    days_since_last_payment: int = 30


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "RevenueRescue AI"
    }


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "RevenueRescue AI API",
        "status": "running"
    }


# ============================================================
# RUN RECOVERY AGENT
# ============================================================

@app.post("/recover")
def recover(
    request: RecoveryRequest
):

    transaction = request.model_dump()

    try:

        result = run_revenue_recovery_agent(
            transaction
        )

        return {
            "success": True,
            "result": result
        }

    except Exception as error:

        print(
            "RECOVERY ERROR:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# UPDATE AUDIT AFTER RAZORPAY VERIFICATION
# ============================================================

def update_audit_after_verification(
    payment_link_id,
    verification_result
):

    # --------------------------------------------------------
    # Make sure data directory exists
    # --------------------------------------------------------

    os.makedirs(
        DATA_DIR,
        exist_ok=True
    )


    # --------------------------------------------------------
    # Get verification values
    # --------------------------------------------------------

    result_status = str(
        verification_result.get(
            "status",
            ""
        )
    ).strip().lower()


    amount = float(
        verification_result.get(
            "amount",
            0
        ) or 0
    )


    amount_recovered = float(
        verification_result.get(
            "amount_recovered",
            0
        ) or 0
    )


    amount_paid = float(
        verification_result.get(
            "amount_paid",
            0
        ) or 0
    )


    payment_link_status = str(
        verification_result.get(
            "payment_link_status",
            ""
        )
    ).strip()


    # --------------------------------------------------------
    # Determine audit status
    # --------------------------------------------------------
    #
    # recovered
    #   -> money successfully recovered
    #
    # partial
    #   -> partially recovered
    #
    # pending
    #   -> payment link exists but recovery is not confirmed
    #
    # failed
    #   -> recovery/payment failed
    #
    # unknown
    #   -> Razorpay returned an unexpected state
    #
    # --------------------------------------------------------

    if result_status == "recovered":

        audit_status = "recovered"

    elif result_status == "partial":

        audit_status = "partial"

    elif result_status == "failed":

        audit_status = "failed"

    elif result_status == "pending":

        audit_status = "pending"

    else:

        audit_status = "not_recovered"


    # --------------------------------------------------------
    # Read existing audit CSV
    # --------------------------------------------------------

    rows = []

    fieldnames = []


    if os.path.exists(
        AUDIT_FILE
    ):

        with open(
            AUDIT_FILE,
            "r",
            newline="",
            encoding="utf-8"
        ) as file:

            reader = csv.DictReader(
                file
            )

            fieldnames = (
                reader.fieldnames or []
            )

            rows = list(
                reader
            )


    # --------------------------------------------------------
    # Required columns
    # --------------------------------------------------------

    required_fields = [

        "timestamp",

        "transaction_id",

        "amount",

        "recovery_probability",

        "diagnosis",

        "recommended_strategy",

        "selected_action",

        "risk_level",

        "decision_reason",

        "result_status",

        "amount_recovered",

        "payment_link_id",

        "payment_link_status",

        "amount_paid",

        "verification_status",

        "recovery_outcome"

    ]


    for field in required_fields:

        if field not in fieldnames:

            fieldnames.append(
                field
            )


    # --------------------------------------------------------
    # Find existing record using Payment Link ID
    # --------------------------------------------------------

    matched_index = None


    for index, row in enumerate(
        rows
    ):

        existing_id = str(
            row.get(
                "payment_link_id",
                ""
            )
        ).strip()


        if (
            existing_id ==
            str(payment_link_id).strip()
        ):

            matched_index = index

            break


    # --------------------------------------------------------
    # UPDATE EXISTING RECORD
    # --------------------------------------------------------

    if matched_index is not None:

        row = rows[
            matched_index
        ]


        # ----------------------------------------------------
        # Update payment information
        # ----------------------------------------------------

        row[
            "payment_link_id"
        ] = str(
            payment_link_id
        )


        row[
            "payment_link_status"
        ] = payment_link_status


        row[
            "amount_paid"
        ] = str(
            amount_paid
        )


        row[
            "verification_status"
        ] = result_status


        row[
            "result_status"
        ] = audit_status


        row[
            "amount_recovered"
        ] = str(
            amount_recovered
        )


        # ----------------------------------------------------
        # Recovery outcome for human-readable audit
        # ----------------------------------------------------

        if audit_status == "recovered":

            row[
                "recovery_outcome"
            ] = "Recovered successfully"

        elif audit_status == "partial":

            row[
                "recovery_outcome"
            ] = "Partially recovered"

        elif audit_status == "failed":

            row[
                "recovery_outcome"
            ] = "Recovery failed"

        elif audit_status == "pending":

            row[
                "recovery_outcome"
            ] = "Recovery pending / payment not completed"

        else:

            row[
                "recovery_outcome"
            ] = "Not recovered"


        # ----------------------------------------------------
        # Update diagnosis if it was missing
        # ----------------------------------------------------

        if not row.get(
            "diagnosis"
        ):

            if audit_status == "recovered":

                row[
                    "diagnosis"
                ] = "Payment recovered through Razorpay"

            elif audit_status == "failed":

                row[
                    "diagnosis"
                ] = "Razorpay recovery payment failed"

            elif audit_status == "pending":

                row[
                    "diagnosis"
                ] = "Recovery payment not completed"

            else:

                row[
                    "diagnosis"
                ] = "Recovery not confirmed"


        # ----------------------------------------------------
        # Update decision reason
        # ----------------------------------------------------

        if audit_status == "recovered":

            row[
                "decision_reason"
            ] = "Razorpay confirmed the recovery payment."

        elif audit_status == "failed":

            row[
                "decision_reason"
            ] = "Razorpay did not confirm a successful recovery payment."

        elif audit_status == "pending":

            row[
                "decision_reason"
            ] = "Recovery payment has not been confirmed."

        else:

            row[
                "decision_reason"
            ] = "Recovery outcome could not be confirmed."


        # ----------------------------------------------------
        # If original amount is missing,
        # fill it from Razorpay.
        # ----------------------------------------------------

        if not row.get(
            "amount"
        ):

            row[
                "amount"
            ] = str(
                amount
            )


        rows[
            matched_index
        ] = row


        print(
            "AUDIT EXISTING RECORD UPDATED:",
            payment_link_id,
            "Status:",
            audit_status,
            "Amount Paid:",
            amount_paid,
            "Amount Recovered:",
            amount_recovered
        )


    # ========================================================
    # CREATE RECORD IF NOT FOUND
    # ========================================================

    else:

        if audit_status == "recovered":

            diagnosis = (
                "Payment recovered through Razorpay"
            )

            decision_reason = (
                "Razorpay confirmed the recovery payment."
            )

            recovery_outcome = (
                "Recovered successfully"
            )

        elif audit_status == "failed":

            diagnosis = (
                "Razorpay recovery payment failed"
            )

            decision_reason = (
                "Razorpay did not confirm a successful recovery payment."
            )

            recovery_outcome = (
                "Recovery failed"
            )

        elif audit_status == "pending":

            diagnosis = (
                "Recovery payment not completed"
            )

            decision_reason = (
                "Recovery payment has not been confirmed."
            )

            recovery_outcome = (
                "Recovery pending / payment not completed"
            )

        else:

            diagnosis = (
                "Recovery not confirmed"
            )

            decision_reason = (
                "Recovery outcome could not be confirmed."
            )

            recovery_outcome = (
                "Not recovered"
            )


        new_row = {

            "timestamp":
                datetime.now().isoformat(),

            "transaction_id":
                "VERIFIED_" +
                datetime.now().strftime(
                    "%Y%m%d%H%M%S"
                ),

            "amount":
                str(
                    amount
                ),

            "recovery_probability":
                "1.0",

            "diagnosis":
                diagnosis,

            "recommended_strategy":
                "payment_verification",

            "selected_action":
                "create_recovery_link",

            "risk_level":
                "low",

            "decision_reason":
                decision_reason,

            "result_status":
                audit_status,

            "amount_recovered":
                str(
                    amount_recovered
                ),

            "payment_link_id":
                str(
                    payment_link_id
                ),

            "payment_link_status":
                payment_link_status,

            "amount_paid":
                str(
                    amount_paid
                ),

            "verification_status":
                result_status,

            "recovery_outcome":
                recovery_outcome

        }


        rows.append(
            new_row
        )


        print(
            "AUDIT NEW RECORD CREATED:",
            payment_link_id,
            "Status:",
            audit_status,
            "Amount Paid:",
            amount_paid,
            "Amount Recovered:",
            amount_recovered
        )


    # ========================================================
    # WRITE AUDIT CSV
    # ========================================================

    with open(
        AUDIT_FILE,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames,
            extrasaction="ignore"
        )

        writer.writeheader()

        writer.writerows(
            rows
        )


    return {

        "updated": True,

        "payment_link_id":
            payment_link_id,

        "payment_link_status":
            payment_link_status,

        "verification_status":
            result_status,

        "result_status":
            audit_status,

        "amount_paid":
            amount_paid,

        "amount_recovered":
            amount_recovered,

        "recovery_outcome":
            recovery_outcome

    }


# ============================================================
# VERIFY RAZORPAY PAYMENT
# ============================================================

@app.get("/verify/{payment_link_id}")
def verify(
    payment_link_id: str
):

    try:

        print(
            "\n========================================"
        )

        print(
            "       RAZORPAY VERIFICATION"
        )

        print(
            "========================================"
        )

        print(
            "Payment Link ID:",
            payment_link_id
        )


        # ----------------------------------------------------
        # 1. ASK RAZORPAY FOR REAL PAYMENT STATUS
        # ----------------------------------------------------

        verification_result = (
            verify_payment_link(
                payment_link_id
            )
        )


        print(
            "Verification Result:",
            verification_result
        )


        # ----------------------------------------------------
        # 2. UPDATE AUDIT FOR EVERY OUTCOME
        # ----------------------------------------------------
        #
        # Previously this happened only when:
        #
        #     status == "recovered"
        #
        # Now every verification outcome is recorded.
        #
        # recovered -> recovered
        # partial   -> partial
        # failed    -> failed
        # pending   -> pending
        # unknown   -> not_recovered
        #
        # ----------------------------------------------------

        audit_updated = False

        audit_error = None


        verification_status = (
            verification_result.get(
                "status",
                ""
            )
        )


        try:

            audit_result = (
                update_audit_after_verification(
                    payment_link_id,
                    verification_result
                )
            )


            audit_updated = (
                audit_result.get(
                    "updated",
                    False
                )
            )


            print(
                "AUDIT UPDATED SUCCESSFULLY"
            )

            print(
                "Audit Status:",
                audit_result.get(
                    "result_status"
                )
            )

            print(
                "Amount Paid:",
                audit_result.get(
                    "amount_paid"
                )
            )

            print(
                "Amount Recovered:",
                audit_result.get(
                    "amount_recovered"
                )
            )


        except Exception as error:

            audit_error = str(
                error
            )


            print(
                "AUDIT UPDATE ERROR:",
                audit_error
            )


        # ----------------------------------------------------
        # 3. RETURN RESULT TO FRONTEND
        # ----------------------------------------------------

        return {

            "success": True,

            "result":
                verification_result,

            "audit_updated":
                audit_updated,

            "audit_error":
                audit_error

        }


    except Exception as error:

        print(
            "RAZORPAY VERIFICATION ERROR:",
            str(error)
        )


        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# METRICS
# ============================================================

@app.get("/metrics")
def metrics():

    if not os.path.exists(
        AUDIT_FILE
    ):

        return {

            "transactions":
                0,

            "revenue_at_risk":
                0,

            "revenue_recovered":
                0,

            "recovery_rate":
                0,

            "recovered":
                0,

            "pending":
                0,

            "failed":
                0,

            "escalated":
                0,

            "stopped":
                0

        }


    try:

        df = pd.read_csv(
            AUDIT_FILE
        )


        # ----------------------------------------------------
        # Make sure expected columns exist
        # ----------------------------------------------------

        if "amount" not in df.columns:

            df["amount"] = 0


        if "amount_recovered" not in df.columns:

            df[
                "amount_recovered"
            ] = 0


        if "result_status" not in df.columns:

            df[
                "result_status"
            ] = "unknown"


        # ----------------------------------------------------
        # Ensure numeric columns
        # ----------------------------------------------------

        df[
            "amount"
        ] = pd.to_numeric(
            df[
                "amount"
            ],
            errors="coerce"
        ).fillna(0)


        df[
            "amount_recovered"
        ] = pd.to_numeric(
            df[
                "amount_recovered"
            ],
            errors="coerce"
        ).fillna(0)


        # ----------------------------------------------------
        # Calculate metrics
        # ----------------------------------------------------

        transactions = len(
            df
        )


        revenue_at_risk = float(
            df[
                "amount"
            ].sum()
        )


        revenue_recovered = float(
            df[
                "amount_recovered"
            ].sum()
        )


        if (
            revenue_at_risk > 0
        ):

            recovery_rate = (
                revenue_recovered
                /
                revenue_at_risk
            ) * 100

        else:

            recovery_rate = 0


        # ----------------------------------------------------
        # Result counts
        # ----------------------------------------------------

        result_status = (
            df[
                "result_status"
            ]
            .astype(str)
            .str.lower()
            .str.strip()
        )


        recovered_count = int(
            (
                result_status
                == "recovered"
            ).sum()
        )


        pending_count = int(
            (
                result_status
                == "pending"
            ).sum()
        )


        failed_count = int(
            (
                result_status
                == "failed"
            ).sum()
        )


        escalated_count = int(
            (
                result_status
                == "escalated"
            ).sum()
        )


        stopped_count = int(
            (
                result_status
                == "stopped"
            ).sum()
        )


        return {

            "transactions":
                transactions,

            "revenue_at_risk":
                round(
                    revenue_at_risk,
                    2
                ),

            "revenue_recovered":
                round(
                    revenue_recovered,
                    2
                ),

            "recovery_rate":
                round(
                    recovery_rate,
                    2
                ),

            "recovered":
                recovered_count,

            "pending":
                pending_count,

            "failed":
                failed_count,

            "escalated":
                escalated_count,

            "stopped":
                stopped_count

        }


    except Exception as error:

        print(
            "METRICS ERROR:",
            str(error)
        )


        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# TRANSACTIONS
# ============================================================

@app.get("/transactions")
def transactions():

    if not os.path.exists(
        AUDIT_FILE
    ):

        return {
            "transactions": []
        }


    try:

        df = pd.read_csv(
            AUDIT_FILE
        )


        # ----------------------------------------------------
        # Convert NaN to None
        # ----------------------------------------------------

        df = df.astype(
            object
        )


        df = df.where(
            pd.notna(df),
            None
        )


        records = (
            df
            .tail(100)
            .to_dict(
                orient="records"
            )
        )


        return {

            "transactions":
                records

        }


    except Exception as error:

        print(
            "TRANSACTIONS ERROR:",
            str(error)
        )


        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# AUDIT TRAIL
# ============================================================

@app.get("/audit")
def audit():

    if not os.path.exists(
        AUDIT_FILE
    ):

        return {
            "audit": []
        }


    try:

        df = pd.read_csv(
            AUDIT_FILE
        )


        # ----------------------------------------------------
        # Convert NaN to None
        # ----------------------------------------------------

        df = df.astype(
            object
        )


        df = df.where(
            pd.notna(df),
            None
        )


        records = (
            df
            .tail(100)
            .to_dict(
                orient="records"
            )
        )


        return {

            "audit":
                records

        }


    except Exception as error:

        print(
            "AUDIT READ ERROR:",
            str(error)
        )


        raise HTTPException(
            status_code=500,
            detail=str(error)
        )