from backend.ml.predict import predict_recovery

from backend.agents.diagnosis import diagnose
from backend.agents.decision import choose_action
from backend.agents.recovery import execute_recovery
from backend.agents.audit import create_audit_log

def run_revenue_recovery_agent(
    transaction,
    verbose=True
):
    """
    Main Revenue Recovery Agent.

    Pipeline:

    Transaction
        ↓
    ML prediction
        ↓
    Diagnosis
        ↓
    Decision
        ↓
    Safety check
        ↓
    Recovery action
        ↓
    Result
        ↓
    Audit trail
    """

    # ==================================================
    # STEP 1 — ML PREDICTION
    # ==================================================

    probability = predict_recovery(
        transaction
    )


    # ==================================================
    # STEP 2 — DIAGNOSIS
    # ==================================================

    diagnosis = diagnose(
        transaction
    )


    # ==================================================
    # STEP 3 — DECISION
    # ==================================================

    decision = choose_action(
        probability,
        diagnosis,
        transaction
    )


    # ==================================================
    # STEP 4 — EXECUTE
    # ==================================================

    result = execute_recovery(
        decision["action"],
        transaction
    )


    # ==================================================
    # STEP 5 — AUDIT
    # ==================================================

    audit = create_audit_log(
        transaction,
        probability,
        diagnosis,
        decision,
        result
    )


    # ==================================================
    # VERBOSE OUTPUT
    # ==================================================

    if verbose:

        print("\n")
        print("=" * 70)
        print("              REVENUERESCUE AI")
        print("          REVENUE RECOVERY AGENT")
        print("=" * 70)

        print(
            f"\nRecovery Probability: "
            f"{probability * 100:.2f}%"
        )

        print(
            f"Diagnosis: "
            f"{diagnosis['cause']}"
        )

        print(
            f"Recommended Strategy: "
            f"{diagnosis['recommended_strategy']}"
        )

        print(
            f"Selected Action: "
            f"{decision['action']}"
        )

        print(
            f"Risk Level: "
            f"{decision['risk_level']}"
        )

        print(
            f"Decision Reason: "
            f"{decision['reason']}"
        )

        print(
            f"Result: "
            f"{result['status']}"
        )

        print(
            f"Message: "
            f"{result['message']}"
        )

        print(
            "\nAudit record created successfully."
        )


    return {

        "transaction":
            transaction,

        "prediction":
            probability,

        "diagnosis":
            diagnosis,

        "decision":
            decision,

        "result":
            result,

        "audit":
            audit
    }