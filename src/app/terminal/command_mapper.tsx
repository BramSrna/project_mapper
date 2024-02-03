import axios from "axios";
import Project from "../project/project";
import DocumentationSection from "../project/project_component/components/documentation_section";
import ProjectComponent from "../project/project_component/project_component";
import { CommandJsonInterface } from "./command_json_interface";
import Difficulties from "../project/project_component/components/difficulties/difficulties";

function rebuildStringFromResponseData(responseData: any, key: string) {
    let rebuiltString: string = "";
    if (key in responseData) {
        for (var currSentence of responseData[key]) {
            rebuiltString += currSentence;
            if (rebuiltString[rebuiltString.length - 1] !== ".") {
                rebuiltString += ".";
            }
        }
    }
    return rebuiltString;
}

export async function mapRawTextToCommands(executionContext: Project | ProjectComponent, rawText: string) {
    let response = await axios.post("http://localhost:5000/run_component_builder", {"rawText": rawText});
    let componentType = response.data.componentType;

    let commands: CommandJsonInterface[] = [];
    commands.push({ "dependencies": [], "commandName": "ADD_COMPONENT", "commandParams": [componentType] });
    commands.push({ "dependencies": [-1], "commandName": "CHANGE_FOCUS", "commandParams": [{ "dependencyInd": 0, "resolverFunc": ((inputObj: ProjectComponent) => inputObj.getId()) }] });
    
    commands = commands.concat(getBuildCommandsFromResponseData(componentType, response.data));
    
    commands.push({ "dependencies": [], "commandName": "CHANGE_FOCUS", "commandParams": [executionContext.getId()] })

    return commands;
}

export function getBuildCommandsFromResponseData(componentType: string, responseData: any) {
    let commands: CommandJsonInterface[] = [];

    let componentName: string = rebuildStringFromResponseData(responseData, "componentName");
    commands.push({ "dependencies": [], "commandName": "SET_NAME", "commandParams": [componentName] });

    switch (componentType) {
        case "ComponentDescription":
            let missionStatement: string = rebuildStringFromResponseData(responseData, "missionStatement");
            let endGoal: string = rebuildStringFromResponseData(responseData, "endGoal");
            commands.push({ "dependencies": [], "commandName": "SET_END_GOAL", "commandParams": [endGoal] });
            commands.push({ "dependencies": [], "commandName": "SET_MISSION_STATEMENT", "commandParams": [missionStatement] });
            break;
        case "DocumentationSection":
            let text: string = rebuildStringFromResponseData(responseData, "text");
            commands.push({ "dependencies": [], "commandName": "SET_CONTENT", "commandParams": [text] });
            break;
        case "UseCases":
            let startOperatingWall: string = rebuildStringFromResponseData(responseData, "startOperatingWall");
            let endOperatingWall: string = rebuildStringFromResponseData(responseData, "endOperatingWall");
            commands.push({ "dependencies": [], "commandName": "SET_START_OPERATING_WALL", "commandParams": [startOperatingWall] });
            commands.push({ "dependencies": [], "commandName": "SET_END_OPERATING_WALL", "commandParams": [endOperatingWall] });
            if ("useCase" in responseData) {
                for (var currUseCaseItem of responseData["useCase"]) {
                    commands.push({ "dependencies": [], "commandName": "ADD_USE_CASE", "commandParams": [currUseCaseItem] });
                }
            }
            break;
        case "Todo":
            if ("complete" in responseData) {
                for (var currItem of responseData["complete"]) {
                    commands.push({ "dependencies": [], "commandName": "ADD_ITEM", "commandParams": [currItem] });
                    commands.push({ "dependencies": [-1], "commandName": "SET_ITEM_STATUS", "commandParams": [{ "dependencyInd": 0, "resolverFunc": ((inputObj: ProjectComponent) => inputObj.getId()) }, "true"] });
                }
            }
            if ("incomplete" in responseData) {
                for (var currItem of responseData["incomplete"]) {
                    commands.push({ "dependencies": [], "commandName": "ADD_ITEM", "commandParams": [currItem] });
                }
            }
            break;
        case "Difficulties":
            let difficultyDescription: string = rebuildStringFromResponseData(responseData, "difficultyDescription");
            commands.push({ "dependencies": [], "commandName": "ADD_DIFFICULTY", "commandParams": [difficultyDescription] });
            let possibleSolutionDescription: string = rebuildStringFromResponseData(responseData, "possibleSolutionDescription");
            commands.push({ "dependencies": [-1], "commandName": "ADD_POSSIBLE_SOLUTION", "commandParams": [{ "dependencyInd": 0, "resolverFunc": ((inputObj: ProjectComponent) => inputObj.getId()) }, possibleSolutionDescription] });
            break;
        default:
            throw(`Unknown component type: ${componentType}`);    
    }

    return commands;

}