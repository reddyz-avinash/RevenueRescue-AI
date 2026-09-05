from backend.razorpay_client import get_client


def create_recovery_payment_link(
    transaction
):
    """
    Create a Razorpay Test Mode payment link
    for a revenue recovery transaction.

    Amount is converted from rupees to paise.
    """

    client = get_client()

    transaction_id = transaction[
        "transaction_id"
    ]

    amount = float(
        transaction["amount"]
    )

    # Razorpay expects amount in paise
    amount_paise = int(
        round(amount * 100)
    )

    customer_name = transaction.get(
        "customer_name",
        "Test Customer"
    )

    customer_email = transaction.get(
        "customer_email",
        "test@example.com"
    )

    customer_phone = transaction.get(
        "customer_phone",
        "9999999999"
    )

    payment_link_data = {

        "amount": amount_paise,

        "currency": "INR",

        "accept_partial": False,

        "description":
            f"Revenue recovery for {transaction_id}",

        "reference_id":
            transaction_id,

        "customer": {

            "name":
                customer_name,

            "email":
                customer_email,

            "contact":
                customer_phone
        },

        "notify": {

            "sms": False,

            "email": False
        },

        "reminder_enable": False
    }

    try:

        response = client.payment_link.create(
            payment_link_data
        )

        return {

            "status": "created",

            "payment_link_id":
                response.get("id"),

            "short_url":
                response.get("short_url"),

            "amount":
                amount,

            "amount_paise":
                amount_paise,

            "transaction_id":
                transaction_id
        }

    except Exception as error:

        return {

            "status": "error",

            "message":
                str(error),

            "transaction_id":
                transaction_id,

            "amount":
                amount,

            "amount_paise":
                amount_paise
        }