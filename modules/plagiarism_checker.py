import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import os

nltk.download('stopwords', quiet=True)

class PlagiarismChecker:
    def __init__(self, reference_path='reference.txt'):
        self.reference_path = reference_path
        self.stop_words = set(stopwords.words('english'))
        self.stemmer = PorterStemmer()
        self.KEYWORDS = {"if", "else", "while", "for", "int", "float", "return", "char", "break", "continue", "void", "class", "public", "private", "static"}

    def preprocess(self, text):
        """
        Full lexical + textual preprocessing:
        - Lowercasing
        - Removing punctuation
        - Tokenization
        - Stopword removal
        - Stemming
        """
        text = text.lower()
        text = text.translate(str.maketrans('', '', string.punctuation))
        tokens = re.findall(r'\b[a-zA-Z]+\b', text)

        # Remove stopwords and apply stemming
        cleaned_tokens = [self.stemmer.stem(word) for word in tokens if word not in self.stop_words]

        # Lexical analysis insight (optional metadata)
        lexical_features = {
            "keyword_count": sum(1 for word in cleaned_tokens if word in self.KEYWORDS),
            "unique_tokens": len(set(cleaned_tokens)),
            "total_tokens": len(cleaned_tokens)
        }

        return ' '.join(cleaned_tokens), lexical_features

    def check(self, user_text):
        """
        Calculate similarity index using TF-IDF cosine similarity.
        Includes preprocessing and lexical analysis internally.
        """
        if not os.path.exists(self.reference_path):
            return {"message": "Reference file not found!"}

        with open(self.reference_path, 'r', encoding='utf-8') as file:
            reference_text = file.read()

        if not reference_text.strip() or not user_text.strip():
            return {"message": "One of the texts is empty!"}

        # Step 1: Preprocessing & lexical info
        user_processed, user_lex = self.preprocess(user_text)
        ref_processed, ref_lex = self.preprocess(reference_text)

        # Step 2: TF-IDF vectorization
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([user_processed, ref_processed])

        # Step 3: Cosine similarity computation
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100

        # Step 4: Result packaging
        result = {
            "similarity_score": f"{similarity_score:.2f}%",
            "lexical_analysis": {
                "user": user_lex,
                "reference": ref_lex
            },
            "interpretation": self.interpret(similarity_score)
        }

        return result

    def interpret(self, score):
        """
        Interpret similarity score for readability
        """
        if score >= 80:
            return "High plagiarism detected"
        elif score >= 50:
            return "Moderate similarity detected"
        elif score >= 20:
            return "Low similarity detected"
        else:
            return "No significant plagiarism detected"
