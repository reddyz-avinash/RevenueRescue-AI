import pandas as pd
import joblib
import os


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "recovery_model.pkl"
)

model = joblib.load(MODEL_PATH)


# ============================================================
# PREDICT RECOVERY PROBABILITY
# ============================================================

def predict_recovery(transaction):
    """
    Predict the probability that a revenue-risk
    transaction can be successfully recovered.
    """

    # Convert transaction dictionary into DataFrame
    df = pd.DataFrame([transaction])

    # Remove fields that were not used during training
    columns_to_remove = [
        "transaction_id",
        "customer_id",
        "retry_count"
    ]

    for column in columns_to_remove:

        if column in df.columns:
            df = df.drop(
                columns=[column]
            )

    # Predict probability
    probability = model.predict_proba(
        df
    )[0][1]

    return round(
        float(probability),
        4
    )