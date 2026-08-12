import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_curve, auc, roc_auc_score
from wordcloud import WordCloud
from joblib import dump

def main():
    # 1. Data Collection & Pre-Processing
    raw_mail_data = pd.read_csv('mail_data.csv')
    mail_data = raw_mail_data.fillna('')

    # 2. Label Encoding
    mail_data.loc[mail_data['Category']=='spam', 'Category',]=1
    mail_data.loc[mail_data['Category']=='ham', 'Category',]=0
    mail_data['Category'] = mail_data['Category'].astype(int)

    X = mail_data['Message']
    Y = mail_data['Category']

    # 3. Feature Extraction
    feature_extraction = TfidfVectorizer(ngram_range=(1, 2), min_df=1, stop_words='english')
    X_features = feature_extraction.fit_transform(X)

    # 4. Splitting the data into training and test sets
    X_train, X_test, Y_train, Y_test = train_test_split(X_features, Y, test_size=0.2, random_state=3)

    # 5. Training the Model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, Y_train)

    # 6. Evaluating the trained model
    prediction_on_training_data = model.predict(X_train)
    accuracy_on_training_data = accuracy_score(Y_train, prediction_on_training_data)
    print('Accuracy on training data: ', accuracy_on_training_data)

    prediction_on_test_data = model.predict(X_test)
    accuracy_on_test_data = accuracy_score(Y_test, prediction_on_test_data)
    print('Accuracy on test data: ', accuracy_on_test_data)

    # 7. Hyperparameter Tuning (optional)
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5, 10]
    }
    grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, n_jobs=-1)
    grid_search.fit(X_train, Y_train)
    best_params = grid_search.best_params_

    # 8. Model Evaluation Metrics
    precision = precision_score(Y_test, prediction_on_test_data)
    recall = recall_score(Y_test, prediction_on_test_data)
    f1 = f1_score(Y_test, prediction_on_test_data)
    roc_auc = roc_auc_score(Y_test, prediction_on_test_data)

    # 9. ROC Curve
    Y_pred_prob = model.predict_proba(X_test)[:, 1]
    fpr, tpr, thresholds = roc_curve(Y_test, Y_pred_prob)

    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label='ROC curve (area = %0.2f)' % roc_auc)
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    plt.show()

    # 10. Word Cloud Visualization
    spam_text = ' '.join(mail_data[mail_data['Category'] == 1]['Message'])
    spam_wordcloud = WordCloud(width=800, height=400, background_color='white').generate(spam_text)
    plt.figure(figsize=(10, 5))
    plt.imshow(spam_wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title('Spam Word Cloud')
    plt.show()

    ham_text = ' '.join(mail_data[mail_data['Category'] == 0]['Message'])
    ham_wordcloud = WordCloud(width=800, height=400, background_color='white').generate(ham_text)
    plt.figure(figsize=(10, 5))
    plt.imshow(ham_wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title('Ham Word Cloud')
    plt.show()

    # Save the trained model and feature extraction pipeline
    dump((model, feature_extraction), 'spam_classifier_model.joblib')

    # Define the predict_spam function
    def predict_spam(predict_msg, model, feature_extraction):
        new_seq = feature_extraction.transform(predict_msg)
        prediction_prob = model.predict_proba(new_seq)[0][1]  # Probability of being spam
        if prediction_prob > 0.9:
            return 'Spam Email'
        else:
            return 'Not Spam Email'

    # Test the predict_spam function with an example message
    input_mail = ["hello"]
    prediction = predict_spam(input_mail, model, feature_extraction)
    print(prediction)

if __name__ == "__main__":
    main()
