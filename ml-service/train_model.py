from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "Crop_recommendation.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "crop_recommendation_model.joblib"

FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]
TARGET = "label"


def main():
    df = pd.read_csv(DATA_PATH)

    if df[FEATURES + [TARGET]].isnull().any().any():
        raise ValueError("Dataset contains missing values.")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    models = {
        "Decision Tree": DecisionTreeClassifier(
            random_state=42
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1,
        ),
    }

    results = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        results[name] = (accuracy, model)

        print(f"\n{'=' * 55}")
        print(f"Model: {name}")
        print(f"Test accuracy: {accuracy:.4f}")
        print("\nClassification report:")
        print(
            classification_report(
                y_test,
                predictions,
                zero_division=0,
            )
        )

    best_name = max(results, key=lambda name: results[name][0])
    best_accuracy, best_model = results[best_name]

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    artifact = {
        "model": best_model,
        "features": FEATURES,
        "target": TARGET,
        "model_name": best_name,
        "test_accuracy": float(best_accuracy),
        "dataset_rows": int(len(df)),
        "random_state": 42,
    }

    joblib.dump(artifact, MODEL_PATH)

    print(f"\n{'=' * 55}")
    print(f"Selected model: {best_name}")
    print(f"Held-out test accuracy: {best_accuracy:.4f}")
    print(f"Saved model to: {MODEL_PATH}")
    print(f"Confusion matrix for selected model:")
    print(
        confusion_matrix(
            y_test,
            best_model.predict(X_test),
            labels=best_model.classes_,
        )
    )


if __name__ == "__main__":
    main()