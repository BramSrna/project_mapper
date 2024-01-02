import IdGenerator from "../id_generator";
import Project, { ProjectJsonInterface } from "./project";
import ComponentDescription, { ComponentDescriptionJsonInterface } from "./project_component/components/component_description";
import Difficulties, { DifficultiesJsonInterface } from "./project_component/components/difficulties/difficulties";
import DifficultyEntry, { DifficultyEntryJsonInterface } from "./project_component/components/difficulties/difficulty_entry";
import PossibleSolution, { PossibleSolutionsJsonInterface } from "./project_component/components/difficulties/possible_solution";
import DocumentationSection, { DocumentationSectionJsonInterface } from "./project_component/components/documentation_section";
import NestedComponent, { NestedComponentJsonInterface } from "./project_component/components/nested_component";
import CodeSample from "./project_component/components/software_repo/code_sample";
import Mock, { CodeSamplesJsonInterface } from "./project_component/components/software_repo/code_sample";
import SoftwareRepo, { SoftwareRepoJsonInterface } from "./project_component/components/software_repo/software_repo";
import Todo, { TodoJsonInterface } from "./project_component/components/todo/todo";
import TodoItem, { TodoItemJsonInterface } from "./project_component/components/todo/todo_item";
import UseCaseItem, { UseCaseItemJsonInterface } from "./project_component/components/uses_cases/use_case_item";
import UseCases, { UseCaseJsonInterface } from "./project_component/components/uses_cases/use_cases";
import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component/project_component";
import ProjectComponentConnection, { ProjectComponentConnectionJsonInterface } from "./project_component_connection";

function compJsonToComponent(compJson: ProjectComponentToJsonInterface, parent: Project | NestedComponent) {
    let connections: ProjectComponentConnection[] = [];
    let currConnection: ProjectComponentConnectionJsonInterface;
    for (let connectionIndex: number = 0; connectionIndex < compJson["connections"].length; connectionIndex++) {
        currConnection = compJson["connections"][connectionIndex];
        connections.push(new ProjectComponentConnection(
            currConnection["startId"],
            currConnection["endId"],
            currConnection["type"]
        ));
    }

    let newComp: ProjectComponent;
    const compType = compJson["type"];
    switch(compType) {
        case "NestedComponent": {
            let nestedCompInfo: NestedComponentJsonInterface = compJson as NestedComponentJsonInterface;
            let newNestedComp: NestedComponent = new NestedComponent(
                nestedCompInfo["id"],
                parent,
                nestedCompInfo["componentName"],
                connections,
                []
            );

            for (var compInfo of nestedCompInfo["components"]) {
                newNestedComp.addComponent(compJsonToComponent(compInfo, newNestedComp))
            }

            newComp = newNestedComp;
            break;
        }
        case "ComponentDescription": {
            let compDescInfo: ComponentDescriptionJsonInterface = compJson as ComponentDescriptionJsonInterface;
            newComp = new ComponentDescription(
                compDescInfo["id"],
                parent,
                compDescInfo["componentName"],
                connections,
                compDescInfo["endGoal"],
                compDescInfo["missionStatement"]
            );
            break;
        }
        case "DocumentationSection": {
            let docSectionInfo: DocumentationSectionJsonInterface = compJson as DocumentationSectionJsonInterface;
            newComp = new DocumentationSection(
                docSectionInfo["id"],
                parent,
                docSectionInfo["componentName"],
                connections,
                docSectionInfo["content"]
            );
            break;
        }
        case "SoftwareRepo": {
            let softwareRepoInfo: SoftwareRepoJsonInterface = compJson as SoftwareRepoJsonInterface;
            
            let newSoftwareRepo: SoftwareRepo = new SoftwareRepo(
                softwareRepoInfo["id"],
                parent,
                softwareRepoInfo["componentName"],
                connections,
                softwareRepoInfo["initRepoName"],
                []
            );

            let currCodeSampleInfo: CodeSamplesJsonInterface;
            for (let codeSampleIndex: number = 0; codeSampleIndex < softwareRepoInfo["codeSamples"].length; codeSampleIndex++) {
                currCodeSampleInfo = softwareRepoInfo["codeSamples"][codeSampleIndex];
                newSoftwareRepo.addCodeSample(new CodeSample(
                    newSoftwareRepo,
                    currCodeSampleInfo["title"],
                    currCodeSampleInfo["language"],
                    currCodeSampleInfo["codeBlock"]
                ));
            }

            newComp = newSoftwareRepo;

            break;
        }
        case "Todo": {
            let todoInfo: TodoJsonInterface = compJson as TodoJsonInterface;
            
            let newTodo: Todo = new Todo(
                todoInfo["id"],
                parent,
                todoInfo["componentName"],
                connections,
                []
            );

            let currTodoItemInfo: TodoItemJsonInterface;
            for (let todoItemIndex: number = 0; todoItemIndex < todoInfo["items"].length; todoItemIndex++) {
                currTodoItemInfo = todoInfo["items"][todoItemIndex];
                newTodo.addItem(new TodoItem(
                    newTodo,
                    currTodoItemInfo["description"],
                    currTodoItemInfo["isComplete"]
                ));
            }

            newComp = newTodo;

            break;
        }
        case "UseCases":
            let useCaseInfo: UseCaseJsonInterface = compJson as UseCaseJsonInterface;
            
            let newUseCases: UseCases = new UseCases(
                useCaseInfo["id"],
                parent,
                useCaseInfo["componentName"],
                connections,
                useCaseInfo["startOperatingWall"],
                useCaseInfo["endOperatingWall"],
                []
            );

            let currUseCaseItemInfo: UseCaseItemJsonInterface;
            for (let useCaseItemIndex: number = 0; useCaseItemIndex < useCaseInfo["useCases"].length; useCaseItemIndex++) {
                currUseCaseItemInfo = useCaseInfo["useCases"][useCaseItemIndex];
                newUseCases.addUseCase(new UseCaseItem(
                    newUseCases,
                    currUseCaseItemInfo["description"]
                ));
            }

            newComp = newUseCases;

            break;
        case "Difficulties":
            let difficultyInfo: DifficultiesJsonInterface = compJson as DifficultiesJsonInterface;
            
            let newDifficulties: Difficulties = new Difficulties(
                difficultyInfo["id"],
                parent,
                difficultyInfo["componentName"],
                connections,
                []
            );

            let currDifficultyEntryInfo: DifficultyEntryJsonInterface;
            for (let difficultyEntryIndex: number = 0; difficultyEntryIndex < difficultyInfo["difficulties"].length; difficultyEntryIndex++) {
                currDifficultyEntryInfo = difficultyInfo["difficulties"][difficultyEntryIndex];

                let newEntry: DifficultyEntry = new DifficultyEntry(
                    newDifficulties,
                    currDifficultyEntryInfo["description"],
                    []
                )

                let currPossibleSolutionInfo: PossibleSolutionsJsonInterface;
                for (let possibleSolutionIndex: number = 0; possibleSolutionIndex < currDifficultyEntryInfo["possibleSolutions"].length; possibleSolutionIndex++) {
                    currPossibleSolutionInfo = currDifficultyEntryInfo["possibleSolutions"][possibleSolutionIndex];
                    newEntry.addPossibleSolution(new PossibleSolution(newEntry, currPossibleSolutionInfo["description"]));
                }                        

                newDifficulties.addDifficulty(newEntry);
            }

            newComp = newDifficulties;

            break;
        default: {
            throw("Unknown component type: " + compType);
        }
    }

    return newComp;
}

export function jsonToProject(idToUse: string, jsonObject: ProjectJsonInterface) {
    let newProj: Project = new Project(idToUse, "");

    if ("projectName" in jsonObject) {
        newProj.setProjectName(jsonObject["projectName"]);
    }

    if ("components" in jsonObject) {
        const componentsBlock = jsonObject["components"];

        let currComponentInfo: ProjectComponentToJsonInterface;
        let newComp: ProjectComponent;
        for (let componentIndex: number = 0; componentIndex < componentsBlock.length; componentIndex++) {
            currComponentInfo = componentsBlock[componentIndex];

            newComp = compJsonToComponent(currComponentInfo, newProj);

            IdGenerator.addGeneratedId(currComponentInfo["id"]);
            newProj.addComponent(newComp);
        }
    }

    return newProj;
}