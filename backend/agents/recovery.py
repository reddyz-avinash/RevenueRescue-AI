import os
import random

from backend.payments.payment_link import (
    create_recovery_payment_link
)


# ============================================================
# SAFETY CONFIGURATION
# ============================================================

MAX_RETRIES = 2


# ============================================================
# DEMO RAZORPAY TEST PAYMENT LINK
# ============================================================
#
# Razorpay Test Mode has already reached the Payment Link
# creation limit in this project.
#
# Therefore, when Razorpay refuses to create another link,
# we reuse the existing Test Mode Payment Link.
#
# You can later move these values to .env.
#

DEMO_PAYMENT_URL = os.getenv(
    "RAZORPAY_DEMO_PAYMENT_URL",
    "https://rzp.io/rzp/Gss3ZP6c"
)

# Optional.
# If you know the actual plink_... ID of the existing link,
# put it in your .env as RAZORPAY_DEMO_PAYMENT_LINK_ID.
#
# We intentionally do not invent a Payment Link ID here.
DEMO_PAYMENT_LINK_ID = os.getenv(
    "RAZORPAY_DEMO_PAYMENT_LINK_ID",
    ""
)


# ============================================================
# TRANSACTION-AWARE RECOVERY SIMULATION
# ============================================================

def calculate_simulated_success_probability(
    transaction
):
    """
    Estimate the probability of a successful
    recovery action based on transaction characteristics.

    This is ONLY for our synthetic test environment.

    It will later be replaced by actual Razorpay
    Test Mode results.
    """

    failure_reason = transaction.get(
        "failure_reason",
        "none"
    )

    previous_successes = int(
        transaction.get(
            "previous_successes",
            0
        )
    )

    previous_failures = int(
        transaction.get(
            "previous_failures",
            0
        )
    )

    previous_recovery = int(
        transaction.get(
            "previous_recovery_success",
            0
        )
    )

    # --------------------------------------------------------
    # Base probability
    # --------------------------------------------------------

    probability = 0.50

    # --------------------------------------------------------
    # Customer payment history
    # --------------------------------------------------------

    probability += min(
        previous_successes * 0.02,
        0.20
    )

    probability -= min(
        previous_failures * 0.04,
        0.20
    )

    # --------------------------------------------------------
    # Previous recovery success
    # --------------------------------------------------------

    if previous_recovery == 1:
        probability += 0.15

    # --------------------------------------------------------
    # Failure reason
    # --------------------------------------------------------

    if failure_reason == "temporary_failure":

        probability += 0.20

    elif failure_reason == "network_error":

        probability += 0.15

    elif failure_reason == "insufficient_funds":

        probability -= 0.10

    elif failure_reason == "authentication_failure":

        probability -= 0.05

    elif failure_reason == "expired_card":

        probability -= 0.30

    elif failure_reason == "bank_declined":

        probability -= 0.25

    # --------------------------------------------------------
    # Keep probability in reasonable range
    # --------------------------------------------------------

    probability = max(
        0.05,
        min(
            probability,
            0.95
        )
    )

    return probability


# ============================================================
# EXECUTE RECOVERY
# ============================================================

def execute_recovery(
    action,
    transaction
):
    """
    Execute the selected recovery action.

    Recovery-link behavior:

    1. Try to create a real Razorpay Test Mode Payment Link.
    2. If Razorpay rejects creation because the Test Mode
       Payment Link limit has been reached, use the configured
       existing demo Payment Link.
    """

    amount = float(
        transaction.get(
            "amount",
            0
        )
    )

    retry_count = int(
        transaction.get(
            "retry_count",
            0
        )
    )


    # ========================================================
    # HUMAN REVIEW
    # ========================================================

    if action == "human_review":

        return {
            "status": "escalated",

            "message": (
                "Transaction requires human review."
            ),

            "amount_recovered": 0
        }


    # ========================================================
    # NO ACTION
    # ========================================================

    if action == "no_action":

        return {
            "status": "stopped",

            "message": (
                "Recovery stopped by decision policy."
            ),

            "amount_recovered": 0
        }


    # ========================================================
    # RAZORPAY RECOVERY PAYMENT LINK
    # ========================================================

    if action == "create_recovery_link":

        try:

            payment_link = (
                create_recovery_payment_link(
                    transaction
                )
            )

        except Exception as exc:

            payment_link = {
                "status": "error",
                "message": str(exc)
            }


        # ----------------------------------------------------
        # NORMAL CASE
        # ----------------------------------------------------

        if (
            payment_link
            and payment_link.get("status") == "created"
        ):

            return {
                "status": "recovery_link_created",

                "message": (
                    "Razorpay Test Mode recovery "
                    "payment link created."
                ),

                "amount_recovered": 0,

                "payment_link_id":
                    payment_link.get(
                        "payment_link_id"
                    ),

                "payment_url":
                    payment_link.get(
                        "short_url"
                    )
            }


        # ----------------------------------------------------
        # FALLBACK CASE
        #
        # Razorpay Test Mode has reached its 30 Payment Link
        # creation limit.
        # ----------------------------------------------------

        error_message = ""

        if payment_link:

            error_message = str(
                payment_link.get(
                    "message",
                    ""
                )
            )

        limit_reached = (
            "limit"
            in error_message.lower()
            and
            "payment_link"
            in error_message.lower()
        )

        if limit_reached:

            return {
                "status": "recovery_link_created",

                "message": (
                    "Using existing Razorpay Test Mode "
                    "recovery payment link because the "
                    "Test Mode Payment Link creation limit "
                    "has been reached."
                ),

                "amount_recovered": 0,

                "payment_link_id":
                    DEMO_PAYMENT_LINK_ID or None,

                "payment_url":
                    DEMO_PAYMENT_URL,

                "demo_fallback": True
            }


        # ----------------------------------------------------
        # OTHER RAZORPAY ERROR
        # ----------------------------------------------------

        return {
            "status": "error",

            "message": (
                "Failed to create Razorpay "
                "recovery payment link."
            ),

            "error":
                error_message,

            "amount_recovered": 0
        }


    # ========================================================
    # PAYMENT RETRY
    # ========================================================

    if action == "retry_payment":

        # Safety check
        if retry_count >= MAX_RETRIES:

            return {
                "status": "stopped",

                "message": (
                    "Maximum retry limit reached."
                ),

                "amount_recovered": 0
            }


        # ----------------------------------------------------
        # Calculate transaction-specific probability
        # ----------------------------------------------------

        success_probability = (
            calculate_simulated_success_probability(
                transaction
            )
        )


        # ----------------------------------------------------
        # Simulate outcome
        # ----------------------------------------------------

        success = (
            random.random()
            < success_probability
        )


        if success:

            return {
                "status": "recovered",

                "message": (
                    "Payment successfully recovered "
                    "in simulation mode."
                ),

                "amount_recovered":
                    amount,

                "retry_number":
                    retry_count + 1,

                "simulated_success_probability":
                    round(
                        success_probability,
                        4
                    )
            }


        return {
            "status": "failed",

            "message": (
                "Payment retry failed "
                "in simulation mode."
            ),

            "amount_recovered": 0,

            "retry_number":
                retry_count + 1,

            "simulated_success_probability":
                round(
                    success_probability,
                    4
                )
        }


    # ========================================================
    # PAYMENT REMINDER
    # ========================================================

    if action == "send_payment_reminder":

        return {
            "status": "pending",

            "message": (
                "Payment recovery reminder generated."
            ),

            "amount_recovered": 0
        }


    # ========================================================
    # PAYMENT METHOD UPDATE
    # ========================================================

    if action == "request_payment_method_update":

        return {
            "status": "pending",

            "message": (
                "Customer requested to update "
                "payment method."
            ),

            "amount_recovered": 0
        }


    # ========================================================
    # ALTERNATIVE PAYMENT
    # ========================================================

    if action == "offer_alternative_payment":

        return {
            "status": "pending",

            "message": (
                "Alternative payment method offered."
            ),

            "amount_recovered": 0
        }


    # ========================================================
    # UNKNOWN ACTION
    # ========================================================

    return {
        "status": "error",

        "message": (
            f"Unknown recovery action: {action}"
        ),

        "amount_recovered": 0
    }