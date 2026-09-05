import pandas as pd

from backend.agent import run_revenue_recovery_agent


# ==================================================
# LOAD TRANSACTION DATA
# ==================================================

df = pd.read_csv(
    "backend/data/transactions.csv"
)


# ==================================================
# SELECT ONE TRANSACTION
# ==================================================

transaction = df.iloc[0].to_dict()


# ==================================================
# ADD AGENT STATE
# ==================================================

transaction["retry_count"] = 0


# ==================================================
# DISPLAY INPUT
# ==================================================

print("\n")
print("=" * 70)
print("TEST TRANSACTION")
print("=" * 70)

print(
    f"Transaction ID: "
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


# ==================================================
# RUN AGENT
# ==================================================

result = run_revenue_recovery_agent(
    transaction
)


# ==================================================
# DISPLAY AUDIT TRAIL
# ==================================================

print("\n")
print("=" * 70)
print("AUDIT TRAIL")
print("=" * 70)

for key, value in result["audit"].items():

    print(
        f"{key}: {value}"
    )