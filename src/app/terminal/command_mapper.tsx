import Project from "../project/project";
import DocumentationSection from "../project/project_component/components/documentation_section";
import ProjectComponent from "../project/project_component/project_component";
import { CommandJsonInterface } from "./command_json_interface";

export function mapRawTextToCommands(executionContext: Project | ProjectComponent, rawText: string) {
    let commands: CommandJsonInterface[] = [];
    commands.push({
        "dependencies": [],
        "commandName": "ADD_COMPONENT",
        "commandParams": ["DocumentationSection"]
    })
    commands.push({
        "dependencies": [-1],
        "commandName": "CHANGE_FOCUS",
        "commandParams": [{
            "dependencyInd": 0,
            "resolverFunc": ((inputObj: DocumentationSection) => inputObj.getId())
        }]
    })
    commands.push({
        "dependencies": [],
        "commandName": "SET_CONTENT",
        "commandParams": [rawText]
    })
    commands.push({
        "dependencies": [],
        "commandName": "CHANGE_FOCUS",
        "commandParams": [executionContext.getId()]
    })

    return commands;
}