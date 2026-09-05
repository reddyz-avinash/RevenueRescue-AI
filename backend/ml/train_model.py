import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)


# ============================================================
# 1. LOAD DATA
# ============================================================

data_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "transactions.csv"
)

df = pd.read_csv(data_path)

print("=" * 60)
print("REVENUE RECOVERY ML MODEL")
print("=" * 60)

print(f"\nTotal records: {len(df)}")

print("\nTarget distribution:")
print(df["recovered"].value_counts())


# ============================================================
# 2. FEATURES / TARGET
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
# 3. FEATURE TYPES
# ============================================================

categorical_features = [
    "failure_reason"
]

numerical_features = [
    column
    for column in X.columns
    if column not in categorical_features
]


# ============================================================
# 4. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records :", len(X_test))


# ============================================================
# 5. PREPROCESSING
# ============================================================

logistic_preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numerical",
            StandardScaler(),
            numerical_features
        )
    ]
)


random_forest_preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)


# ============================================================
# 6. MODELS
# ============================================================

models = {

    "Logistic Regression": Pipeline(
        steps=[
            (
                "preprocessor",
                logistic_preprocessor
            ),
            (
                "model",
                LogisticRegression(
                    max_iter=3000,
                    random_state=42
                )
            )
        ]
    ),

    "Random Forest": Pipeline(
        steps=[
            (
                "preprocessor",
                random_forest_preprocessor
            ),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=300,
                    max_depth=10,
                    min_samples_leaf=3,
                    class_weight="balanced",
                    random_state=42,
                    n_jobs=-1
                )
            )
        ]
    )
}


# ============================================================
# 7. TRAIN / EVALUATE
# ============================================================

results = {}

best_model = None
best_model_name = None
best_f1 = -1


for name, model in models.items():

    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0
    )

    roc_auc = roc_auc_score(
        y_test,
        probabilities
    )

    cm = confusion_matrix(
        y_test,
        predictions
    )

    results[name] = {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": roc_auc
    }

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")

    print("\nConfusion Matrix:")
    print(cm)

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0
        )
    )

    if f1 > best_f1:

        best_f1 = f1
        best_model = model
        best_model_name = name


# ============================================================
# 8. SAVE BEST MODEL
# ============================================================

model_path = os.path.join(
    os.path.dirname(__file__),
    "recovery_model.pkl"
)

joblib.dump(
    best_model,
    model_path
)


# ============================================================
# 9. FINAL RESULT
# ============================================================

print("\n" + "=" * 60)
print("BEST MODEL")
print("=" * 60)

print(f"Model    : {best_model_name}")
print(f"F1 Score : {best_f1:.4f}")

print(
    f"\nSaved model to:\n{model_path}"
)