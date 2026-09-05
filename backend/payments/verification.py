from backend.razorpay_client import get_client


def verify_payment_link(payment_link_id):
    """
    Verify a Razorpay Payment Link.

    A payment is considered recovered when Razorpay reports
    the Payment Link as paid OR when a captured payment is
    associated with the Payment Link.
    """

    if not payment_link_id:
        return {
            "status": "error",
            "message": "Payment Link ID is required.",
            "payment_link_id": payment_link_id,
            "amount": 0,
            "amount_paid": 0,
            "amount_recovered": 0,
        }

    client = get_client()

    try:
        # ====================================================
        # FETCH PAYMENT LINK
        # ====================================================

        response = client.payment_link.fetch(
            payment_link_id
        )

        print(
            "\n========== RAZORPAY VERIFICATION =========="
        )

        print(
            "Payment Link ID:",
            payment_link_id
        )

        print(
            "Payment Link Status:",
            response.get("status")
        )

        print(
            "Amount:",
            response.get("amount")
        )

        print(
            "Amount Paid:",
            response.get("amount_paid")
        )


        # ====================================================
        # BASIC PAYMENT LINK DATA
        # ====================================================

        status = str(
            response.get(
                "status",
                ""
            )
        ).lower()

        amount = float(
            response.get(
                "amount",
                0
            )
        ) / 100


        amount_paid = float(
            response.get(
                "amount_paid",
                0
            )
        ) / 100


        # ====================================================
        # INSPECT ASSOCIATED PAYMENTS
        # ====================================================

        payments = response.get(
            "payments"
        )


        captured_amount = 0


        if isinstance(
            payments,
            list
        ):

            for payment in payments:

                payment_status = str(
                    payment.get(
                        "status",
                        ""
                    )
                ).lower()

                payment_amount = int(
                    payment.get(
                        "amount",
                        0
                    )
                )

                print(
                    "Payment:",
                    payment.get("id"),
                    "| Status:",
                    payment_status,
                    "| Amount:",
                    payment_amount / 100
                )

                if payment_status == "captured":

                    captured_amount += (
                        payment_amount
                    )


        # ====================================================
        # USE CAPTURED PAYMENT AMOUNT
        # ====================================================

        if captured_amount > 0:

            amount_paid = (
                captured_amount / 100
            )


        # ====================================================
        # DETERMINE STATUS
        # ====================================================

        if (
            status == "paid"
            or
            amount_paid >= amount > 0
        ):

            result_status = "recovered"

        elif (
            status == "partially_paid"
            or
            (
                amount_paid > 0
                and
                amount_paid < amount
            )
        ):

            result_status = "partial"

        elif status in [
            "created",
            "issued"
        ]:

            result_status = "pending"

        elif status in [
            "expired",
            "cancelled"
        ]:

            result_status = "failed"

        else:

            result_status = "unknown"


        # ====================================================
        # RECOVERED AMOUNT
        # ====================================================

        if result_status == "recovered":

            if amount_paid <= 0:
                amount_paid = amount

            amount_recovered = amount_paid

        else:

            amount_recovered = 0


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        result = {

            "status":
                result_status,

            "payment_link_status":
                status,

            "amount":
                round(
                    amount,
                    2
                ),

            "amount_paid":
                round(
                    amount_paid,
                    2
                ),

            "amount_recovered":
                round(
                    amount_recovered,
                    2
                ),

            "payment_link_id":
                payment_link_id
        }


        print(
            "Verification Result:",
            result_status
        )

        print(
            "Amount Recovered:",
            amount_recovered
        )

        print(
            "===========================================\n"
        )


        return result


    except Exception as error:

        print(
            "\nRazorpay verification error:",
            str(error)
        )

        return {

            "status":
                "error",

            "message":
                str(error),

            "payment_link_id":
                payment_link_id,

            "amount":
                0,

            "amount_paid":
                0,

            "amount_recovered":
                0
        }