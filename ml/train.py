import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Ensure output dir exists
os.makedirs("ml", exist_ok=True)

# Load dataset
data_path = "ml/dataset/nova_synthetic_data.csv"
if not os.path.exists(data_path):
    print("Dataset not found. Generating it first...")
    import generate_dataset
    # generate_dataset logic will run

df = pd.read_csv(data_path)

# Separate input features and target
features = [
    'Age_Group', 'Occupation', 'Education', 'Daily_Free_Time', 
    'Learning_Style', 'Primary_Goal', 'Current_Productivity', 
    'Stress_Level', 'Focus_Level', 'Skill_Level', 'Planet_Focus'
]
target = 'Personalized_Plan'

X = df[features].copy()
y = df[target].copy()

# Encode categorical variables
encoders = {}
categorical_cols = [
    'Age_Group', 'Occupation', 'Education', 'Daily_Free_Time', 
    'Learning_Style', 'Primary_Goal', 'Planet_Focus'
]

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Target encoder
le_target = LabelEncoder()
y_encoded = le_target.fit_transform(y)
encoders['Personalized_Plan'] = le_target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Models evaluation
models = {
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
}

best_acc = 0.0
best_model_name = ""
best_model = None

print("=== Evaluating Models ===")
for name, model in models.items():
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"{name} Accuracy: {acc * 100:.2f}%")
    if acc > best_acc:
        best_acc = acc
        best_model_name = name
        best_model = model

print(f"\nBest Model: {best_model_name} with {best_acc*100:.2f}% accuracy.")

# Save best model and encoders
joblib.dump(best_model, "ml/model.pkl")
joblib.dump(encoders, "ml/encoder.pkl")
print("Saved best model to ml/model.pkl and label encoders to ml/encoder.pkl.")
