import os
from transformers import TrainingArguments, Trainer, AutoModelForSequenceClassification, AutoTokenizer, pipeline
import numpy as np
import json
import evaluate
import datasets
import pandas as pd

def load_model(saved_model_path, label_dict, target_pretrained_model):
    if (os.path.exists(saved_model_path)):
        print("Found saved model. Continuing training model...")
        model = AutoModelForSequenceClassification.from_pretrained(saved_model_path)
    else:
        print("Could not find saved model. Training from pretrained model...")
        id2labelDict = dict((v,k) for k,v in label_dict.items())
        model = AutoModelForSequenceClassification.from_pretrained(target_pretrained_model, num_labels=len(id2labelDict), id2label=id2labelDict)
    return model

def train_model(data_path, label_dict, target_pretrained_model, checkpoint_dir, saved_model_path):
    print("Loading and formatting dataset...")
    # Parse the raw data from the JSON file
    all_data = {}
    if not os.path.exists(data_path):
        raise Exception("Could not read data from: {}. Path does not exist.".format(data_path))
    with open(data_path, "r") as f:
        all_data = json.load(f)

    preprocessed_data = []
    for id, curr_data_point in all_data.items():
        preprocessed_data.append({
            "text": curr_data_point["text"],
            "label": label_dict[curr_data_point["text_label"]]
        })

    # Convert the loaded data into a hugging face dataset
    dataset = datasets.Dataset.from_pandas(pd.DataFrame(data=preprocessed_data))

    print("Tokenizing and splitting data...")
    # Tokenize the datapoints
    tokenizer = AutoTokenizer.from_pretrained(target_pretrained_model)

    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True)

    tokenized_datasets = dataset.map(tokenize_function, batched=True)

    tokenized_datasets = tokenized_datasets.train_test_split(test_size=0.3)

    # Split the dataset into training and test
    small_train_dataset = tokenized_datasets["train"].shuffle()
    small_eval_dataset = tokenized_datasets["test"].shuffle()

    print("Setting up model and trainer...")
    # Initialize pre-trained T5 model
    # https://huggingface.co/docs/transformers/v4.37.0/en/main_classes/trainer#transformers.Trainer
    model = load_model(saved_model_path, label_dict, target_pretrained_model)

    # https://huggingface.co/docs/transformers/v4.37.0/en/main_classes/trainer#transformers.TrainingArguments
    # output_dir is the directory for checkpoints
    # evaluation_strategy says when to report the evaluation metric during training (here it is every epoch)
    training_args = TrainingArguments(output_dir=checkpoint_dir, evaluation_strategy="epoch")

    # https://huggingface.co/docs/evaluate/index
    metric = evaluate.load("accuracy")

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        predictions = np.argmax(logits, axis=-1)
        return metric.compute(predictions=predictions, references=labels)

    # https://huggingface.co/docs/transformers/v4.37.0/en/main_classes/trainer#transformers.Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=small_train_dataset,
        eval_dataset=small_eval_dataset,
        compute_metrics=compute_metrics,
    )

    print("Training...")
    # https://huggingface.co/docs/transformers/v4.37.0/en/main_classes/trainer#transformers.Trainer.train
    trainer.train()
    print("Training complete.")

    trainer.save_model(saved_model_path)

def run_classification(saved_model_path, label_dict, target_pretrained_model, input_paragraph):
    model = load_model(saved_model_path, label_dict, target_pretrained_model)
    tokenizer = AutoTokenizer.from_pretrained(target_pretrained_model)

    # https://huggingface.co/docs/transformers/v4.37.1/en/main_classes/pipelines#transformers.pipeline
    classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

    return classifier(input_paragraph)