from backend.payments.verification import (
    verify_payment_link
)


PAYMENT_LINK_ID = "plink_TVu478q6sZzwhq"


print("=" * 70)
print("REVENUERESCUE AI")
print("CLOSED-LOOP RECOVERY VERIFICATION")
print("=" * 70)


result = verify_payment_link(
    PAYMENT_LINK_ID
)


print("\n")
print("=" * 70)
print("RAZORPAY VERIFICATION")
print("=" * 70)


print(
    f"Payment Link ID: "
    f"{PAYMENT_LINK_ID}"
)

print(
    f"Razorpay Status: "
    f"{result.get('payment_link_status')}"
)

print(
    f"Agent Result: "
    f"{result.get('status')}"
)

print(
    f"Amount: "
    f"₹{result.get('amount', 0):,.2f}"
)

print(
    f"Amount Paid: "
    f"₹{result.get('amount_paid', 0):,.2f}"
)

print(
    f"Amount Recovered: "
    f"₹{result.get('amount_recovered', 0):,.2f}"
)


# ============================================================
# BUSINESS DECISION
# ============================================================

print("\n")
print("=" * 70)
print("RECOVERY DECISION")
print("=" * 70)


if result.get("status") == "recovered":

    print(
        "✓ PAYMENT VERIFIED"
    )

    print(
        f"✓ Revenue recovered: "
        f"₹{result.get('amount_recovered', 0):,.2f}"
    )

    print(
        "✓ Recovery workflow completed."
    )

elif result.get("status") == "pending":

    print(
        "⏳ PAYMENT STILL PENDING"
    )

    print(
        "No revenue is counted as recovered."
    )

elif result.get("status") == "partial":

    print(
        "⚠ PARTIAL PAYMENT"
    )

    print(
        f"Amount recovered: "
        f"₹{result.get('amount_recovered', 0):,.2f}"
    )

else:

    print(
        "✗ PAYMENT NOT RECOVERED"
    )

    print(
        "No revenue is counted as recovered."
    )