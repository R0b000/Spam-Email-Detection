import sys
import os
import joblib

# Ensure standard output and error use UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Folder where this script + models live (cwd-independent)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Get the input mail and subject from command line arguments
input_subject = sys.argv[1]
input_mail = sys.argv[2]

print("Input Subject:", input_subject)
print("Input Mail:", input_mail)

# Load the TF-IDF vectorizer for body
tfidf_vectorizer = joblib.load(os.path.join(BASE_DIR, 'tfidf_vectorizer.joblib'))

# Load the TF-IDF vectorizer for subject
sub_vectorizer = joblib.load(os.path.join(BASE_DIR, 'sub_vectorizer.joblib'))

# Load the trained Random Forest model for the body
spam_classifier = joblib.load(os.path.join(BASE_DIR, 'spam_classifier.joblib'))

# Load the trained Random Forest model for the subject
subject_classifier = joblib.load(os.path.join(BASE_DIR, 'subject_classifier.joblib'))

print("Model Loaded Successfully")

try:
    # Transform the input mail and subject using the TF-IDF vectorizers
    input_data_features = tfidf_vectorizer.transform([input_mail])
    input_subject_features = sub_vectorizer.transform([input_subject])

    # Make predictions using the trained Random Forest models
    prediction_body = spam_classifier.predict_proba(input_data_features)[:, 1][0]  # Probability of being spam
    prediction_subject = subject_classifier.predict_proba(input_subject_features)[:, 1][0]  # Probability of being spam
    print(prediction_body, prediction_subject)

    # Define class labels
    class_labels = {0: 'HAM (not spam)', 1: 'SPAM'}

    # Set probability threshold for classification
    threshold = 0.5

    # Final prediction logic
    if prediction_body > threshold and prediction_subject > threshold:
        final_prediction = 1  # SPAM
    else:
        final_prediction = 0  # HAM

    # Print the final prediction result
    print(f"Prediction: {final_prediction} - This input mail is classified as {class_labels[final_prediction].upper()}.")

except Exception as e:
    print("Error:", e)
