import pandas as pd

from backend.agent import run_revenue_recovery_agent


# ============================================================
# BATCH REVENUE RECOVERY ENGINE
# ============================================================

def run_batch_recovery(limit=500):

    print("\n")
    print("=" * 70)
    print("              REVENUERESCUE AI")
    print("          BATCH RECOVERY ENGINE")
    print("=" * 70)

    # --------------------------------------------------------
    # Load transaction data
    # --------------------------------------------------------

    df = pd.read_csv(
        "backend/data/transactions.csv"
    )

    df = df.head(limit)

    print(
        f"\nProcessing {len(df)} transactions..."
    )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    total_revenue_at_risk = 0.0
    total_revenue_recovered = 0.0

    successful_recoveries = 0
    failed_recoveries = 0
    pending_cases = 0
    escalated_cases = 0
    stopped_cases = 0

    audit_records = []

    # --------------------------------------------------------
    # Process transactions
    # --------------------------------------------------------

    for index, row in df.iterrows():

        transaction = row.to_dict()

        transaction["retry_count"] = 0

        amount = float(
            transaction["amount"]
        )

        total_revenue_at_risk += amount

        # ----------------------------------------------------
        # Run agent
        # ----------------------------------------------------

        result = run_revenue_recovery_agent(
            transaction,
            verbose=False
        )

        # ----------------------------------------------------
        # Extract result
        # ----------------------------------------------------

        agent_result = result["result"]

        status = agent_result["status"]

        recovered = float(
            agent_result.get(
                "amount_recovered",
                0
            )
        )

        total_revenue_recovered += recovered

        # ----------------------------------------------------
        # Count outcomes
        # ----------------------------------------------------

        if status == "recovered":

            successful_recoveries += 1

        elif status == "failed":

            failed_recoveries += 1

        elif status == "pending":

            pending_cases += 1

        elif status == "escalated":

            escalated_cases += 1

        elif status == "stopped":

            stopped_cases += 1

        # ----------------------------------------------------
        # Save audit
        # ----------------------------------------------------

        audit_records.append(
            result["audit"]
        )

        # ----------------------------------------------------
        # Progress
        # ----------------------------------------------------

        current = index + 1

        if (
            current % 50 == 0
            or current == len(df)
        ):

            print(
                f"Processed "
                f"{current}/{len(df)} transactions"
            )

    # ========================================================
    # RECOVERY RATE
    # ========================================================

    if total_revenue_at_risk > 0:

        recovery_rate = (
            total_revenue_recovered
            /
            total_revenue_at_risk
        ) * 100

    else:

        recovery_rate = 0


    # ========================================================
    # FINAL RESULTS
    # ========================================================

    print("\n")
    print("=" * 70)
    print("              BATCH RECOVERY RESULTS")
    print("=" * 70)

    print(
        f"\nTransactions processed:"
        f" {len(df)}"
    )

    print(
        f"Revenue at risk:"
        f" ₹{total_revenue_at_risk:,.2f}"
    )

    print(
        f"Revenue recovered:"
        f" ₹{total_revenue_recovered:,.2f}"
    )

    print(
        f"Recovery rate:"
        f" {recovery_rate:.2f}%"
    )

    print("\nOutcome breakdown:")

    print(
        f"Successful recoveries:"
        f" {successful_recoveries}"
    )

    print(
        f"Failed recoveries:"
        f" {failed_recoveries}"
    )

    print(
        f"Pending cases:"
        f" {pending_cases}"
    )

    print(
        f"Human escalations:"
        f" {escalated_cases}"
    )

    print(
        f"Stopped cases:"
        f" {stopped_cases}"
    )


    # ========================================================
    # SAVE AUDIT TRAIL
    # ========================================================

    audit_df = pd.DataFrame(
        audit_records
    )

    audit_path = (
        "backend/data/"
        "recovery_audit.csv"
    )

    audit_df.to_csv(
        audit_path,
        index=False
    )

    print(
        f"\nAudit trail saved to:"
        f"\n{audit_path}"
    )


    # ========================================================
    # RETURN METRICS
    # ========================================================

    return {

        "transactions_processed":
            len(df),

        "revenue_at_risk":
            total_revenue_at_risk,

        "revenue_recovered":
            total_revenue_recovered,

        "recovery_rate":
            recovery_rate,

        "successful_recoveries":
            successful_recoveries,

        "failed_recoveries":
            failed_recoveries,

        "pending_cases":
            pending_cases,

        "human_escalations":
            escalated_cases,

        "stopped_cases":
            stopped_cases
    }


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    run_batch_recovery(
        limit=500
    )