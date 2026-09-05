from backend.payments.payment_link import (
    create_recovery_payment_link
)


transaction = {

    "transaction_id":
        "RECOVERY_TEST_001",

    "amount":
        500,

    "customer_name":
        "RevenueRescue Test Customer",

    "customer_email":
        "test@example.com",

    "customer_phone":
        "9232541234"
}


print("=" * 70)
print("RAZORPAY TEST PAYMENT LINK")
print("=" * 70)


result = create_recovery_payment_link(
    transaction
)


print("\nResult:")
print(
    f"Status: "
    f"{result['status']}"
)


if result["status"] == "created":

    print(
        f"Payment Link ID: "
        f"{result['payment_link_id']}"
    )

    print(
        f"Amount: "
        f"₹{result['amount']:.2f}"
    )

    print(
        f"Payment URL: "
        f"{result['short_url']}"
    )

else:

    print(
        f"Error: "
        f"{result.get('message')}"
    )