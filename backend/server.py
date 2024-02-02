# https://medium.com/@pooranjoy/integration-deployment-of-ml-model-with-react-flask-3033dd6034b3

import json
import os
from pathlib import Path
import component_classifier_model.component_classifier_training_script
import component_description_builder_model.component_description_builder_training_script
import use_cases_builder_model.use_cases_builder_training_script
import difficulties_builder_model.difficulties_builder_training_script
import software_repo_builder_model.software_repo_builder_training_script
import todo_builder_model.todo_builder_training_script
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

classifier_map = {
    "ComponentDescription": component_description_builder_model.component_description_builder_training_script.run_classification,
    "DocumentationSection": None,
    "UseCases": use_cases_builder_model.use_cases_builder_training_script.run_classification,
    "Todo": todo_builder_model.todo_builder_training_script.run_classification,
    "SoftwareRepo": software_repo_builder_model.software_repo_builder_training_script.run_classification,
    "Difficulties": difficulties_builder_model.difficulties_builder_training_script.run_classification,
    "NestedComponent": None
}

@app.route("/")
def home():
    return {"message": "Hello from backend"}

@app.route("/run_component_builder", methods=['POST'])
def run_component_builder():
    request_data = request.json
    raw_text = request_data["rawText"]

    component_type = component_classifier_model.component_classifier_training_script.run_classification(raw_text)[0]["label"]
    builder_info = {"componentType": component_type}

    if ((component_type in classifier_map) and (classifier_map[component_type] != None)):
        classifier_func = classifier_map[component_type]
        for sentence in raw_text.split("."):
            sentence_type = classifier_func(sentence)[0]["label"]
            if sentence_type not in builder_info:
                builder_info[sentence_type] = []
            builder_info[sentence_type].append(sentence)
    else:
        raise Exception("Unknown component type: {}".format(component_type))
    
    return(jsonify(builder_info))

@app.route("/run_component_builder_with_type", methods=['POST'])
def run_component_builder_with_type():
    request_data = request.json
    inputParagraph = request_data["inputParagraph"]
    component_type = request_data["componentType"]

    builder_info = {}

    if ((component_type in classifier_map) and (classifier_map[component_type] != None)):
        classifier_func = classifier_map[component_type]
        for sentence in inputParagraph.split("."):
            sentence_type = classifier_func(sentence)[0]["label"]
            if sentence_type not in builder_info:
                builder_info[sentence_type] = []
            builder_info[sentence_type].append(sentence)
    else:
        raise Exception("Unknown component type: {}".format(request.json["component"]))
    
    return(jsonify(builder_info))

@app.route("/upload_data", methods=['POST'])
def upload_data():
    write_json_datapoint_to_file("./component_classifier_model/data.json", request.json["id"], {
        "text": request.json["input_paragraph"],
        "text_label": request.json["component"]
    })

    save_component_info(request.json)

    return(jsonify({}))

def save_component_info(requestJsonData):
    if (requestJsonData["component"] == "ComponentDescription"):
        data_json_path = "./component_description_builder_model/data.json"
        write_json_datapoint_to_file(data_json_path, "endGoal_{}".format(requestJsonData["id"]), {
            "text": requestJsonData["component_info"]["endGoal"],
            "text_label": "endGoal"
        })
        write_json_datapoint_to_file(data_json_path, "missionStatement_{}".format(requestJsonData["id"]), {
            "text": requestJsonData["component_info"]["missionStatement"],
            "text_label": "missionStatement"
        })
    elif (requestJsonData["component"] == "DocumentationSection"):
        # For DocumentationSections, all of the input raw text gets dumped directly into the text box, so not model is needed
        pass
    elif (requestJsonData["component"] == "UseCases"):
        data_json_path = "./use_cases_builder_model/data.json"
        write_json_datapoint_to_file(data_json_path, "startOperatingWall_{}".format(requestJsonData["id"]), {
            "text": requestJsonData["component_info"]["startOperatingWall"],
            "text_label": "startOperatingWall"
        })
        write_json_datapoint_to_file(data_json_path, "endOperatingWall_{}".format(requestJsonData["id"]), {
            "text": requestJsonData["component_info"]["endOperatingWall"],
            "text_label": "endOperatingWall"
        })
        for index, currUseCase in enumerate(requestJsonData["component_info"]["useCases"]):
            write_json_datapoint_to_file(data_json_path, "useCase_{}_{}".format(requestJsonData["id"], index), {
                "text": currUseCase["description"],
                "text_label": "useCase"
            })
    elif (requestJsonData["component"] == "Todo"):
        data_json_path = "./todo_builder_model/data.json"
        for index, currTodoItem in enumerate(requestJsonData["component_info"]["items"]):
            write_json_datapoint_to_file(data_json_path, "todoItem_{}_{}".format(requestJsonData["id"], index), {
                "text": currTodoItem["description"],
                "text_label": "{}".format("complete" if currTodoItem["isComplete"] else "incomplete")
            })
    elif (requestJsonData["component"] == "SoftwareRepo"):
        data_json_path = "./software_repo_builder_model/data.json"
        write_json_datapoint_to_file(data_json_path, "initRepoName_{}".format(requestJsonData["id"]), {
            "text": requestJsonData["component_info"]["initRepoName"],
            "text_label": "initRepoName"
        })
        for index, currCodeSample in enumerate(requestJsonData["component_info"]["codeSamples"]):
            write_json_datapoint_to_file(data_json_path, "title_{}_{}".format(requestJsonData["id"], index), {
                "text": currCodeSample["title"],
                "text_label": "title"
            })
            write_json_datapoint_to_file(data_json_path, "language_{}_{}".format(requestJsonData["id"], index), {
                "text": currCodeSample["language"],
                "text_label": "language"
            })
            write_json_datapoint_to_file(data_json_path, "codeBlock_{}_{}".format(requestJsonData["id"], index), {
                "text": currCodeSample["codeBlock"],
                "text_label": "codeBlock"
            })
    elif (requestJsonData["component"] == "Difficulties"):
        data_json_path = "./difficulties_builder_model/data.json"
        for index, currDifficultyEntry in enumerate(requestJsonData["component_info"]["difficulties"]):
            write_json_datapoint_to_file(data_json_path, "difficultyDescription_{}_{}".format(requestJsonData["id"], index), {
                "text": currCodeSample["description"],
                "text_label": "difficultyDescription"
            })
            for index, currPossibleSolution in enumerate(currDifficultyEntry["possibleSolutions"]):
                write_json_datapoint_to_file(data_json_path, "possibleSolutionDescription_{}_{}".format(requestJsonData["id"], index), {
                    "text": currPossibleSolution["description"],
                    "text_label": "possibleSolutionDescription"
                })
    elif (requestJsonData["component"] == "NestedComponent"):
        data_json_path = "./nested_component_builder_model/data.json"
        for index, currComponent in enumerate(requestJsonData["component_info"]["components"]):
            save_component_info(currComponent)
    else:
        raise Exception("Unknown component type: {}".format(requestJsonData["component"]))

def write_json_datapoint_to_file(file_path, datapoint_id, datapoint):
    curr_data = read_json_from_file(file_path)
    curr_data[datapoint_id] = datapoint
    write_json_to_file(file_path, curr_data)

def read_json_from_file(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return(json.load(f))
    return {}

def write_json_to_file(file_path, data):
    dirname = os.path.dirname(file_path)
    if not os.path.exists(dirname):
        Path(dirname).mkdir(parents=True, exist_ok=True)

    with open(file_path, "w") as f:
        json.dump(data, f)

if __name__ == '__main__':
    app.run(debug=True)