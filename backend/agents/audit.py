from datetime import datetime


def create_audit_log(
    transaction,
    probability,
    diagnosis,
    decision,
    result
):
    """
    Create an audit record for every AI recovery decision.

    The audit log records:
    - What transaction was evaluated
    - Recovery probability
    - AI diagnosis
    - Selected action
    - Reason for the action
    - Safety/risk level
    - Execution result
    - Money recovered
    """

    audit_record = {
        "timestamp":
            datetime.now().isoformat(),

        "transaction_id":
            transaction.get(
                "transaction_id"
            ),

        "customer_id":
            transaction.get(
                "customer_id"
            ),

        "amount":
            float(
                transaction.get(
                    "amount",
                    0
                )
            ),

        "recovery_probability":
            round(
                float(probability),
                4
            ),

        "diagnosis":
            diagnosis.get(
                "cause"
            ),

        "recommended_strategy":
            diagnosis.get(
                "recommended_strategy"
            ),

        "selected_action":
            decision.get(
                "action"
            ),

        "decision_reason":
            decision.get(
                "reason"
            ),

        "risk_level":
            decision.get(
                "risk_level"
            ),

        "result_status":
            result.get(
                "status"
            ),

        "result_message":
            result.get(
                "message"
            ),

        "amount_recovered":
            float(
                result.get(
                    "amount_recovered",
                    0
                )
            ),

        "payment_link_id":
            result.get(
                "payment_link_id"
            ),

        "payment_url":
            result.get(
                "payment_url"
            )
    }

    return audit_record