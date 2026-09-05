import os

import razorpay
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


KEY_ID = os.getenv(
    "RAZORPAY_KEY_ID"
)

KEY_SECRET = os.getenv(
    "RAZORPAY_KEY_SECRET"
)


# ============================================================
# VALIDATE CREDENTIALS
# ============================================================

if not KEY_ID:
    raise RuntimeError(
        "RAZORPAY_KEY_ID is missing from .env"
    )

if not KEY_SECRET:
    raise RuntimeError(
        "RAZORPAY_KEY_SECRET is missing from .env"
    )


# ============================================================
# CREATE CLIENT
# ============================================================

client = razorpay.Client(
    auth=(
        KEY_ID,
        KEY_SECRET
    )
)


def get_client():
    """
    Return the configured Razorpay client.
    """

    return client