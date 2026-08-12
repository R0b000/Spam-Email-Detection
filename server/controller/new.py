import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib

# Get the input mail and subject from command line arguments
input_subject = ["Hello guies"]  # Wrap the input subject in a list

# Load the trained Random Forest model for the body
spam_classifier = joblib.load('spam_classifier_model.joblib')
print(type(spam_classifier))

try:
    # Make predictions using the trained Random Forest model
    prediction_body = spam_classifier.predict(input_subject)

    # Define class labels
    class_labels = {0: 'HAM (not spam)', 1: 'SPAM'}

    # Print the final prediction result
    print(f"Prediction: {prediction_body[0]} - This input mail is classified as {class_labels[prediction_body[0]].upper()}.")

except Exception as e:
    print("Error:", e)
