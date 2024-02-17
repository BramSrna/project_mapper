import os
import sys
from component_types import ComponentType

sys.path.insert(1, os.path.join(sys.path[0], '..'))

import helper_training_functions

dirname = os.path.dirname(__file__)

# Initialize pre-trained T5 tokenizer
# You want to use the tokenizer that corresponds to the pretrained model
# https://huggingface.co/docs/transformers/preprocessing
TARGET_PRETRAINED_MODEL = "bert-base-cased"

CHECKPOINT_DIR = os.path.join(dirname, "./training_checkpoints")
SAVED_MODEL_PATH = os.path.join(dirname, "./current_model")

DATA_PATH = os.path.join(dirname, "./data.json")

LABEL_DICT = {
    str(ComponentType.DIFFICULTIES): 0,
    str(ComponentType.SOFTWARE_REPO): 1,
    str(ComponentType.TODO): 2,
    str(ComponentType.USE_CASES): 3,
    str(ComponentType.COMPONENT_DESCRIPTION): 4,
    str(ComponentType.DOCUMENTATION_SECTION): 5,
    str(ComponentType.NESTED_COMPONENT): 6
}

def load_model():
    return helper_training_functions.load_model(SAVED_MODEL_PATH, LABEL_DICT, TARGET_PRETRAINED_MODEL)

def train_model():
    return helper_training_functions.train_model(DATA_PATH, LABEL_DICT, TARGET_PRETRAINED_MODEL, CHECKPOINT_DIR, SAVED_MODEL_PATH)

def run_classification(input_paragraph):
    return helper_training_functions.run_classification(SAVED_MODEL_PATH, LABEL_DICT, TARGET_PRETRAINED_MODEL, input_paragraph)

if __name__ == "__main__":
    train_model()