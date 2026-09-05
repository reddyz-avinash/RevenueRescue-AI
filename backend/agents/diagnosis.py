def diagnose(transaction):
    """
    Identify the likely reason for revenue being at risk
    and recommend an appropriate recovery strategy.
    """

    failure_reason = transaction.get(
        "failure_reason",
        "none"
    )

    if failure_reason == "temporary_failure":
        return {
            "cause": "Temporary payment failure",
            "recommended_strategy": "retry"
        }

    elif failure_reason == "network_error":
        return {
            "cause": "Network-related payment failure",
            "recommended_strategy": "retry"
        }

    elif failure_reason == "insufficient_funds":
        return {
            "cause": "Insufficient customer funds",
            "recommended_strategy": "payment_reminder"
        }

    elif failure_reason == "expired_card":
        return {
            "cause": "Expired payment method",
            "recommended_strategy": "payment_method_update"
        }

    elif failure_reason == "authentication_failure":
        return {
            "cause": "Authentication failure",
            "recommended_strategy": "customer_action"
        }

    elif failure_reason == "bank_declined":
        return {
            "cause": "Bank declined the transaction",
            "recommended_strategy": "alternative_payment"
        }

    return {
        "cause": "No specific payment failure",
        "recommended_strategy": "reminder"
    }