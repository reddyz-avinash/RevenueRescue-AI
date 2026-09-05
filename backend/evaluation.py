import pandas as pd
import os


# ============================================================
# BUSINESS IMPACT EVALUATION
# ============================================================

def evaluate_business_impact():

    audit_path = os.path.join(
        "backend",
        "data",
        "recovery_audit.csv"
    )

    df = pd.read_csv(
        audit_path
    )

    print("\n")
    print("=" * 70)
    print("             REVENUE RECOVERY EVALUATION")
    print("=" * 70)

    # --------------------------------------------------------
    # Basic metrics
    # --------------------------------------------------------

    transactions = len(df)

    revenue_at_risk = df[
        "amount"
    ].sum()

    revenue_recovered = df[
        "amount_recovered"
    ].sum()

    recovery_rate = (
        revenue_recovered
        /
        revenue_at_risk
    ) * 100


    # --------------------------------------------------------
    # Outcome counts
    # --------------------------------------------------------

    recovered_count = (
        df["result_status"]
        == "recovered"
    ).sum()

    pending_count = (
        df["result_status"]
        == "pending"
    ).sum()

    escalated_count = (
        df["result_status"]
        == "escalated"
    ).sum()

    stopped_count = (
        df["result_status"]
        == "stopped"
    ).sum()

    failed_count = (
        df["result_status"]
        == "failed"
    ).sum()


    # --------------------------------------------------------
    # Intervention counts
    # --------------------------------------------------------

    automatic_actions = df[
        df["selected_action"].isin(
            [
                "retry_payment",
                "send_payment_reminder",
                "request_payment_method_update",
                "offer_alternative_payment"
            ]
        )
    ]

    automatic_count = len(
        automatic_actions
    )


    # --------------------------------------------------------
    # Simulated intervention costs
    # --------------------------------------------------------

    RETRY_COST = 5
    REMINDER_COST = 1
    PAYMENT_UPDATE_COST = 1
    ALTERNATIVE_PAYMENT_COST = 2
    HUMAN_REVIEW_COST = 50


    intervention_cost = 0


    for action in df[
        "selected_action"
    ]:

        if action == "retry_payment":

            intervention_cost += RETRY_COST

        elif action == "send_payment_reminder":

            intervention_cost += REMINDER_COST

        elif action == "request_payment_method_update":

            intervention_cost += PAYMENT_UPDATE_COST

        elif action == "offer_alternative_payment":

            intervention_cost += (
                ALTERNATIVE_PAYMENT_COST
            )

        elif action == "human_review":

            intervention_cost += (
                HUMAN_REVIEW_COST
            )


    # --------------------------------------------------------
    # Net recovery
    # --------------------------------------------------------

    net_recovered_value = (
        revenue_recovered
        -
        intervention_cost
    )


    # --------------------------------------------------------
    # Average recovered transaction
    # --------------------------------------------------------

    if recovered_count > 0:

        average_recovered = (
            revenue_recovered
            /
            recovered_count
        )

    else:

        average_recovered = 0


    # ========================================================
    # PRINT RESULTS
    # ========================================================

    print(
        f"\nTransactions evaluated:"
        f" {transactions}"
    )

    print(
        f"Revenue at risk:"
        f" ₹{revenue_at_risk:,.2f}"
    )

    print(
        f"Gross revenue recovered:"
        f" ₹{revenue_recovered:,.2f}"
    )

    print(
        f"Recovery rate:"
        f" {recovery_rate:.2f}%"
    )

    print(
        f"Intervention cost:"
        f" ₹{intervention_cost:,.2f}"
    )

    print(
        f"Net recovery value:"
        f" ₹{net_recovered_value:,.2f}"
    )

    print(
        f"Average recovered transaction:"
        f" ₹{average_recovered:,.2f}"
    )

    print("\nOutcome breakdown:")

    print(
        f"Recovered:"
        f" {recovered_count}"
    )

    print(
        f"Failed:"
        f" {failed_count}"
    )

    print(
        f"Pending:"
        f" {pending_count}"
    )

    print(
        f"Human escalation:"
        f" {escalated_count}"
    )

    print(
        f"Stopped:"
        f" {stopped_count}"
    )

    print(
        f"\nAutomatic interventions:"
        f" {automatic_count}"
    )


    # ========================================================
    # RETURN RESULTS
    # ========================================================

    return {

        "transactions":
            transactions,

        "revenue_at_risk":
            revenue_at_risk,

        "revenue_recovered":
            revenue_recovered,

        "recovery_rate":
            recovery_rate,

        "intervention_cost":
            intervention_cost,

        "net_recovery_value":
            net_recovered_value,

        "average_recovered":
            average_recovered,

        "recovered_count":
            recovered_count,

        "failed_count":
            failed_count,

        "pending_count":
            pending_count,

        "escalated_count":
            escalated_count,

        "stopped_count":
            stopped_count,

        "automatic_interventions":
            automatic_count
    }


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    evaluate_business_impact()