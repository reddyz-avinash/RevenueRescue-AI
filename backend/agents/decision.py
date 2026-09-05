def choose_action(
    recovery_probability,
    diagnosis,
    transaction
):
    """
    Business-aware Revenue Recovery Decision Engine.

    Risk tiers:

    LOW RISK
        Safe for automatic recovery.

    MEDIUM RISK
        Assisted recovery such as reminders.

    HIGH RISK
        Requires human review.
    """

    amount = float(
        transaction.get("amount", 0)
    )

    retry_count = int(
        transaction.get("retry_count", 0)
    )

    failure_reason = transaction.get(
        "failure_reason",
        "temporary_failure"
    )

    strategy = diagnosis.get(
        "recommended_strategy",
        "reminder"
    )

    # ==================================================
    # TIER 1 — PERMANENT FAILURE
    # ==================================================

    permanent_failures = [
        "expired_card",
        "bank_declined"
    ]

    if failure_reason in permanent_failures:

        return {
            "action": "human_review",
            "reason": (
                "Permanent or bank-declined failure "
                "should not be automatically retried."
            ),
            "risk_level": "high"
        }

    # ==================================================
    # TIER 2 — VERY LOW RECOVERY PROBABILITY
    # ==================================================

    if recovery_probability < 0.40:

        return {
            "action": "no_action",
            "reason": (
                "Recovery probability is below "
                "the 0.40 operating threshold."
            ),
            "risk_level": "low"
        }

    # ==================================================
    # TIER 3 — HIGH VALUE
    # ==================================================

    if amount > 75000:

        return {
            "action": "human_review",
            "reason": (
                "High-value transaction requires "
                "human approval."
            ),
            "risk_level": "high"
        }

    # ==================================================
    # TIER 4 — RETRY LIMIT
    # ==================================================

    if retry_count >= 2:

        return {
            "action": "human_review",
            "reason": (
                "Maximum automatic retry limit "
                "has been reached."
            ),
            "risk_level": "medium"
        }

       # ==================================================
    # TIER 5 — HIGH-CONFIDENCE RECOVERY
    # ==================================================

    if (
        strategy == "retry"
        and recovery_probability >= 0.70
    ):

        return {
            "action":
                "create_recovery_link",

            "reason": (
                "High recovery probability and "
                "retryable payment failure. "
                "Customer-initiated recovery is "
                "safer than an automatic retry."
            ),

            "risk_level": "low"
        }

          # ==================================================
    # TIER 6 — MODERATE RECOVERY PROBABILITY
    # ==================================================

    if recovery_probability >= 0.40:

        # ------------------------------------------------
        # Payment method problems
        # ------------------------------------------------

        if strategy == "payment_method_update":

            return {
                "action":
                    "create_recovery_link",

                "reason": (
                    "Payment method requires customer "
                    "action. A recovery payment link "
                    "provides a safe alternative."
                ),

                "risk_level": "medium"
            }

        # ------------------------------------------------
        # Alternative payment
        # ------------------------------------------------

        if strategy == "alternative_payment":

            return {
                "action":
                    "create_recovery_link",

                "reason": (
                    "Alternative payment is safer than "
                    "automatically retrying the failed payment."
                ),

                "risk_level": "medium"
            }

        # ------------------------------------------------
        # High-confidence payment recovery
        # ------------------------------------------------

        if (
            recovery_probability >= 0.55
            and failure_reason in [
                "temporary_failure",
                "network_error"
            ]
        ):

            return {
                "action":
                    "create_recovery_link",

                "reason": (
                    "Recoverable payment failure with "
                    "sufficient confidence for a bounded "
                    "customer-initiated recovery."
                ),

                "risk_level": "medium"
            }

        # ------------------------------------------------
        # Default assisted recovery
        # ------------------------------------------------

        return {
            "action":
                "send_payment_reminder",

            "reason": (
                "Moderate recovery probability; "
                "assisted recovery is safer."
            ),

            "risk_level": "medium"
        }