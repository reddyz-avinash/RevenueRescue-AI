from backend.agent import (
    run_revenue_recovery_agent
)


# ============================================================
# RAZORPAY RECOVERY DEMO TRANSACTION
# ============================================================

transaction = {

    # ------------------------------------------
    # Transaction information
    # ------------------------------------------

    "transaction_id":
        "RECOVERY_DEMO_001",

    "customer_id":
        "CUST_DEMO_001",

    "amount":
        500,

    "failure_reason": 
       "temporary_failure",
    # ------------------------------------------
    # Agent state
    # ------------------------------------------

    "retry_count":
        0,

    # ------------------------------------------
    # Customer history
    # ------------------------------------------

    "previous_successes":
        10,

    "previous_failures":
        0,

    "previous_recovery_success":
        0,

    # ------------------------------------------
    # Customer information
    # ------------------------------------------

    "customer_name":
        "RevenueRescue Demo Customer",

    "customer_email":
        "test@example.com",

    "customer_phone":
        "9876543210",

    # ------------------------------------------
    # ML MODEL FEATURES
    # ------------------------------------------

    "checkout_duration_minutes":
        4,

    "checkout_started":
        1,

    "checkout_completed":
        0,

    "customer_tenure_months":
        18,

    "subscription_active":
        1,

    "days_overdue":
        0,

    "days_since_last_payment":
        25
}


# ============================================================
# DISPLAY
# ============================================================

print("=" * 70)

print(
    "REVENUERESCUE AI"
)

print(
    "RAZORPAY RECOVERY DEMO"
)

print("=" * 70)


print(
    f"\nTransaction ID: "
    f"{transaction['transaction_id']}"
)

print(
    f"Amount: "
    f"₹{transaction['amount']:.2f}"
)

print(
    f"Failure Reason: "
    f"{transaction['failure_reason']}"
)


# ============================================================
# RUN AGENT
# ============================================================

result = run_revenue_recovery_agent(
    transaction
)


# ============================================================
# FINAL RESULT
# ============================================================

print("\n")
print("=" * 70)
print("FINAL RESULT")
print("=" * 70)


print(
    f"Recovery Probability: "
    f"{result['prediction'] * 100:.2f}%"
)

print(
    f"Diagnosis: "
    f"{result['diagnosis']['cause']}"
)

print(
    f"Recommended Strategy: "
    f"{result['diagnosis']['recommended_strategy']}"
)

print(
    f"Action: "
    f"{result['decision']['action']}"
)

print(
    f"Risk Level: "
    f"{result['decision']['risk_level']}"
)

print(
    f"Result: "
    f"{result['result']['status']}"
)


# ============================================================
# RAZORPAY INFORMATION
# ============================================================

if "payment_url" in result["result"]:

    print(
        "\nRazorpay Recovery Payment Link:"
    )

    print(
        result["result"]["payment_url"]
    )


if "payment_link_id" in result["result"]:

    print(
        "\nPayment Link ID:"
    )

    print(
        result["result"]["payment_link_id"]
    )


# ============================================================
# AUDIT
# ============================================================

print("\n")
print("=" * 70)
print("AUDIT TRAIL")
print("=" * 70)

for key, value in result["audit"].items():

    print(
        f"{key}: {value}"
    )