import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split


# ============================================================
# LOAD DATA
# ============================================================

data_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "transactions.csv"
)

model_path = os.path.join(
    os.path.dirname(__file__),
    "recovery_model.pkl"
)

df = pd.read_csv(data_path)

model = joblib.load(model_path)


# ============================================================
# FEATURES
# ============================================================

X = df.drop(
    columns=[
        "transaction_id",
        "customer_id",
        "recovered"
    ]
)

y = df["recovered"]


# ============================================================
# SAME TEST SPLIT
# ============================================================

_, X_test, _, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# PREDICT PROBABILITIES
# ============================================================

probabilities = model.predict_proba(
    X_test
)[:, 1]


# ============================================================
# THRESHOLD ANALYSIS
# ============================================================

print("=" * 70)
print("REVENUE RECOVERY THRESHOLD ANALYSIS")
print("=" * 70)

print(
    "\nThreshold | Precision | Recall | F1"
)

print("-" * 45)


best_threshold = None
best_f1 = 0


for threshold in np.arange(
    0.30,
    0.81,
    0.05
):

    predictions = (
        probabilities >= threshold
    ).astype(int)

    tp = (
        (predictions == 1) &
        (y_test == 1)
    ).sum()

    fp = (
        (predictions == 1) &
        (y_test == 0)
    ).sum()

    fn = (
        (predictions == 0) &
        (y_test == 1)
    ).sum()

    precision = (
        tp / (tp + fp)
        if (tp + fp) > 0
        else 0
    )

    recall = (
        tp / (tp + fn)
        if (tp + fn) > 0
        else 0
    )

    f1 = (
        2 * precision * recall /
        (precision + recall)
        if (precision + recall) > 0
        else 0
    )

    print(
        f"{threshold:.2f}      | "
        f"{precision:.3f}     | "
        f"{recall:.3f}  | "
        f"{f1:.3f}"
    )

    if f1 > best_f1:

        best_f1 = f1
        best_threshold = threshold


# ============================================================
# BEST THRESHOLD
# ============================================================

print("\n" + "=" * 70)

print(
    f"BEST F1 THRESHOLD: "
    f"{best_threshold:.2f}"
)

print(
    f"BEST F1 SCORE: "
    f"{best_f1:.4f}"
)

print("=" * 70)