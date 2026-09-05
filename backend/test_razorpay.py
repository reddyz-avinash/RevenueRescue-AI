from backend.razorpay_client import get_client


def test_razorpay_connection():

    client = get_client()

    print("=" * 60)
    print("RAZORPAY TEST MODE CONNECTION")
    print("=" * 60)

    try:

        # Fetch a small set of payments.
        # This is a read-only API operation.
        payments = client.payment.all({
            "count": 1
        })

        print("\nRazorpay API connection successful.")

        print(
            "Test Mode API is responding."
        )

        print(
            f"Payments returned: "
            f"{len(payments.get('items', []))}"
        )

    except Exception as error:

        print(
            "\nRazorpay API connection failed."
        )

        print(
            f"Error: {error}"
        )


if __name__ == "__main__":

    test_razorpay_connection()