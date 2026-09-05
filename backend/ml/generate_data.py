import pandas as pd
import numpy as np
import os

np.random.seed(42)

N = 2000

data = {
    "transaction_id": [f"TXN_{100000+i}" for i in range(N)],
    "customer_id": [f"CUST_{1000+i%500}" for i in range(N)],

    "amount": np.round(
        np.random.uniform(300, 50000, N), 2
    ),

    "customer_tenure_months": np.random.randint(
        1, 60, N
    ),

    "previous_successes": np.random.randint(
        0, 15, N
    ),

    "previous_failures": np.random.randint(
        0, 6, N
    ),

    "days_since_last_payment": np.random.randint(
        0, 90, N
    ),

    "checkout_duration_minutes": np.round(
        np.random.uniform(0.5, 20, N), 2
    ),

    "checkout_started": np.random.choice(
        [0, 1], N, p=[0.1, 0.9]
    ),

    "checkout_completed": np.random.choice(
        [0, 1], N, p=[0.35, 0.65]
    ),

    "subscription_active": np.random.choice(
        [0, 1], N, p=[0.45, 0.55]
    ),

    "days_overdue": np.random.randint(
        0, 60, N
    ),

    "previous_recovery_success": np.random.choice(
        [0, 1], N, p=[0.6, 0.4]
    ),

    "failure_reason": np.random.choice(
        [
            "temporary_failure",
            "insufficient_funds",
            "bank_declined",
            "authentication_failure",
            "network_error",
            "expired_card",
            "none"
        ],
        N,
        p=[0.18, 0.12, 0.15, 0.08, 0.12, 0.08, 0.27]
    )
}

df = pd.DataFrame(data)

# --------------------------------------------------
# Create a realistic recovery probability
# --------------------------------------------------

score = (
    0.25 * df["previous_successes"]
    - 0.30 * df["previous_failures"]
    + 0.35 * df["previous_recovery_success"]
    - 0.015 * df["days_since_last_payment"]
    - 0.01 * df["days_overdue"]
)

score += np.where(
    df["failure_reason"].isin(
        ["temporary_failure", "network_error"]
    ),
    1.2,
    0
)

score += np.where(
    df["failure_reason"] == "insufficient_funds",
    -0.7,
    0
)

score += np.where(
    df["failure_reason"] == "expired_card",
    -1.0,
    0
)

score += np.random.normal(0, 1, N)

probability = 1 / (1 + np.exp(-score))

df["recovered"] = np.random.binomial(
    1,
    probability
)

# --------------------------------------------------
# Create output directory
# --------------------------------------------------

output_dir = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data"
)

os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(
    output_dir,
    "transactions.csv"
)

df.to_csv(output_path, index=False)

print("Dataset generated successfully!")
print(f"Records: {len(df)}")
print(f"Saved to: {output_path}")

print("\nRecovery distribution:")
print(df["recovered"].value_counts())

print("\nFirst 5 records:")
print(df.head())