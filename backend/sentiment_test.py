import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

#nltk.download('vader_lexicon')

def is_deletion_sentence(sentence):
    # Create a SentimentIntensityAnalyzer instance
    sid = SentimentIntensityAnalyzer()

    # Get the sentiment score for the sentence
    sentiment_score = sid.polarity_scores(sentence)
    print(sentence, sentiment_score)

    # If the sentiment score is negative, consider it a deletion sentence
    return sentiment_score["compound"] < 0

# Examples
delete_sentence = "Delete the blue component"
add_sentence = "Add a new component"

# Check if the sentences are deletion sentences
is_delete = is_deletion_sentence(delete_sentence)
is_add = is_deletion_sentence(add_sentence)

print(f"Is '{delete_sentence}' a deletion sentence? {is_delete}")
print(f"Is '{add_sentence}' a deletion sentence? {is_add}")