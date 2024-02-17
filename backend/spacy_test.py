import spacy

# Load spaCy English model
nlp = spacy.load("en_core_web_lg")

# Sample text content
sample_text = """
The title is Recycling Business Stack.
The end goal is Circular economy.
The mission statement is to Develop the capability to turn every object back into its base components with 100% efficiency.
The Operating walls are Collecting trash and Selling recycled trash as commodities.
"""

# Process the text using spaCy
doc = nlp(sample_text)

def answer_question(question, document):
    # Process the question using spaCy
    question_doc = nlp(question)

    # Find sentences in the document that are most relevant to the question
    sentences = []
    for sent in document.sents:
        if question_doc.similarity(sent) > 0.7:
            sentences.append(sent.text)

    if not sentences:
        return "I couldn't find an answer in the document."

    # Concatenate relevant sentences to form the answer
    answer = " ".join(sentences)
    return answer

# Example questions
questions = [
    "What is the title?",
    "What is the end goal?",
    "What is the mission statement?",
    "What are the operating walls?"
]

for question in questions:
    print(question, answer_question(question, doc))