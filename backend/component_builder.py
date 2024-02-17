import spacy
from component_types import ComponentType
import component_classifier_model.component_classifier_training_script

class SpacyContext():
    def __init__(self, context_text: str):
        self.context_text = context_text

        self.nlp = spacy.load("en_core_web_lg")
        self.processed_context_text = self.nlp(self.context_text)

    def answer_question(self, question: str):
        # Process the question using spaCy
        question_doc = self.nlp(question)

        # Find sentences in the document that are most relevant to the question
        sentences = []
        for sent in self.processed_context_text.sents:
            if question_doc.similarity(sent) > 0.7:
                sentences.append(sent.text)

        if not sentences:
            return "I couldn't find an answer in the document."

        # Concatenate relevant sentences to form the answer
        return sentences

def identify_component_type_from_raw_text(raw_text: str) -> ComponentType:
    return component_classifier_model.component_classifier_training_script.run_classification(raw_text)[0]["label"]

def build_component_of_type_from_raw_text(component_type: ComponentType, raw_text: str) -> dict:
    spacy_context = SpacyContext(raw_text)

    component_info = {}
    component_info["componentName"] = spacy_context.answer_question("What is the name of the component?")
    if (component_type == str(ComponentType.DIFFICULTIES)):
        component_info["difficulties"] = []
        difficulties = spacy_context.answer_question("What are the difficulties described in the text?")
        for difficulty in difficulties:
            possible_solutions = spacy_context.answer_question("What are the possible solutions for {}?".format(difficulty))
            component_info["difficulties"].append({
                "difficultyDescription": difficulty,
                "possibleSolutions": possible_solutions
            })
    elif (component_type == str(ComponentType.SOFTWARE_REPO)):
        component_info["initRepoName"] = spacy_context.answer_question("What is the repo name?")
        code_samples = spacy_context.answer_question("What code samples are described in the text?")
        component_info["codeSamples"] = []
        for sample in code_samples:
            code_sample_title = spacy_context.answer_question("What is the title for the {} code sample?".format(sample))
            code_sample_language = spacy_context.answer_question("What language is used for the {} code sample?".format(sample))
            code_sample_code_block = spacy_context.answer_question("What code is present for the {} code sample?".format(sample))
            component_info["codeSamples"].append({
                "title": code_sample_title,
                "language": code_sample_language,
                "codeBlock": code_sample_code_block
            })
    elif (component_type == str(ComponentType.TODO)):
        component_info["items"] = spacy_context.answer_question("What items need to be completed?")
    elif (component_type == str(ComponentType.USE_CASES)):
        component_info["startOperatingWall"] = spacy_context.answer_question("What is the start operating wall?")
        component_info["endOperatingWall"] = spacy_context.answer_question("What is the end operating wall?")
        component_info["useCases"] = spacy_context.answer_question("What are the use cases from the text?")
    elif (component_type == str(ComponentType.COMPONENT_DESCRIPTION)):
        component_info["endGoal"] = spacy_context.answer_question("What is the end goal?")
        component_info["missionStatement"] = spacy_context.answer_question("What is the mission statement?")
    elif (component_type == str(ComponentType.DOCUMENTATION_SECTION)):
        component_info["content"] = spacy_context.answer_question("What is the content of the text excluding the title?")
    elif (component_type == str(ComponentType.NESTED_COMPONENT)):
        pass
    else:
        raise Exception("Unknown component type: {}".format(component_type))