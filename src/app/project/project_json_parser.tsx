import IdGenerator from "../id_generator";
import Project, { ProjectJsonInterface } from "./project";
import ComponentDescription, { ComponentDescriptionJsonInterface } from "./project_component/components/component_description";
import Difficulties, { DifficultiesJsonInterface } from "./project_component/components/difficulties/difficulties";
import DifficultyEntry, { DifficultyEntryJsonInterface } from "./project_component/components/difficulties/difficulty_entry";
import PossibleSolution, { PossibleSolutionsJsonInterface } from "./project_component/components/difficulties/possible_solution";
import DocumentationSection, { DocumentationSectionJsonInterface } from "./project_component/components/documentation_section";
import NestedComponent, { NestedComponentJsonInterface } from "./project_component/components/nested_component";
import Mock, { MockJsonInterface } from "./project_component/components/software_repo/mock";
import SoftwareRepo, { SoftwareRepoJsonInterface } from "./project_component/components/software_repo/software_repo";
import Todo, { TodoJsonInterface } from "./project_component/components/todo/todo";
import TodoItem, { TodoItemJsonInterface } from "./project_component/components/todo/todo_item";
import UseCaseItem, { UseCaseItemJsonInterface } from "./project_component/components/uses_cases/use_case_item";
import UseCases, { UseCaseJsonInterface } from "./project_component/components/uses_cases/use_cases";
import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component/project_component";
import ProjectComponentConnection, { ProjectComponentConnectionJsonInterface } from "./project_component_connection";

export function jsonToProject(idToUse: string, jsonObject: ProjectJsonInterface) {
    console.log(jsonObject);
    let projectName: string = "";
    if ("projectName" in jsonObject) {
        projectName = jsonObject["projectName"];
    }

    let components: ProjectComponent[] = [];
    if ("components" in jsonObject) {
        const componentsBlock = jsonObject["components"];

        let currComponentInfo: ProjectComponentToJsonInterface;
        for (let componentIndex: number = 0; componentIndex < componentsBlock.length; componentIndex++) {
            currComponentInfo = componentsBlock[componentIndex];

            let connections: ProjectComponentConnection[] = [];
            let currConnection: ProjectComponentConnectionJsonInterface;
            for (let connectionIndex: number = 0; connectionIndex < currComponentInfo["connections"].length; connectionIndex++) {
                currConnection = currComponentInfo["connections"][connectionIndex];
                connections.push(new ProjectComponentConnection(
                    currConnection["startId"],
                    currConnection["endId"],
                    currConnection["type"]
                ));
            }

            let newComp: ProjectComponent;
            const compType = currComponentInfo["type"];
            switch(compType) {
                case "NestedComponent": {
                    let nestedCompInfo: NestedComponentJsonInterface = currComponentInfo as NestedComponentJsonInterface;
                    newComp = new NestedComponent(
                        nestedCompInfo["id"],
                        null,
                        nestedCompInfo["componentName"],
                        connections
                    );
                    break;
                }
                case "ComponentDescription": {
                    let compDescInfo: ComponentDescriptionJsonInterface = currComponentInfo as ComponentDescriptionJsonInterface;
                    newComp = new ComponentDescription(
                        compDescInfo["id"],
                        null,
                        compDescInfo["componentName"],
                        connections,
                        compDescInfo["endGoal"],
                        compDescInfo["missionStatement"]
                    );
                    break;
                }
                case "DocumentationSection": {
                    let docSectionInfo: DocumentationSectionJsonInterface = currComponentInfo as DocumentationSectionJsonInterface;
                    newComp = new DocumentationSection(
                        docSectionInfo["id"],
                        null,
                        docSectionInfo["componentName"],
                        connections,
                        docSectionInfo["content"]
                    );
                    break;
                }
                case "SoftwareRepo": {
                    let softwareRepoInfo: SoftwareRepoJsonInterface = currComponentInfo as SoftwareRepoJsonInterface;

                    let mocks: Mock[] = [];
                    let currMockInfo: MockJsonInterface;
                    for (let mockIndex: number = 0; mockIndex < softwareRepoInfo["mocks"].length; mockIndex++) {
                        currMockInfo = softwareRepoInfo["mocks"][mockIndex];
                        mocks.push(new Mock(
                            null,
                            currMockInfo["input"],
                            currMockInfo["output"]
                        ));
                    }

                    newComp = new SoftwareRepo(
                        softwareRepoInfo["id"],
                        null,
                        softwareRepoInfo["componentName"],
                        connections,
                        softwareRepoInfo["initRepoName"],
                        mocks
                    );
                    break;
                }
                case "Todo": {
                    let todoInfo: TodoJsonInterface = currComponentInfo as TodoJsonInterface;

                    let items: TodoItem[] = [];
                    let currTodoItemInfo: TodoItemJsonInterface;
                    for (let todoItemIndex: number = 0; todoItemIndex < todoInfo["items"].length; todoItemIndex++) {
                        currTodoItemInfo = todoInfo["items"][todoItemIndex];
                        items.push(new TodoItem(
                            null,
                            currTodoItemInfo["description"],
                            currTodoItemInfo["isComplete"]
                        ));
                    }

                    newComp = new Todo(
                        todoInfo["id"],
                        null,
                        todoInfo["componentName"],
                        connections,
                        items
                    );
                    break;
                }
                case "UseCases":
                    let useCaseInfo: UseCaseJsonInterface = currComponentInfo as UseCaseJsonInterface;

                    let useCases: UseCaseItem[] = [];
                    let currUseCaseItemInfo: UseCaseItemJsonInterface;
                    for (let useCaseItemIndex: number = 0; useCaseItemIndex < useCaseInfo["useCases"].length; useCaseItemIndex++) {
                        currUseCaseItemInfo = useCaseInfo["useCases"][useCaseItemIndex];
                        useCases.push(new UseCaseItem(
                            null,
                            currUseCaseItemInfo["description"]
                        ));
                    }

                    newComp = new UseCases(
                        useCaseInfo["id"],
                        null,
                        useCaseInfo["componentName"],
                        connections,
                        useCaseInfo["startOperatingWall"],
                        useCaseInfo["endOperatingWall"],
                        useCases
                    );
                    break;
                case "Difficulties":
                    let difficultyInfo: DifficultiesJsonInterface = currComponentInfo as DifficultiesJsonInterface;

                    let difficulties: DifficultyEntry[] = [];
                    let currDifficultyEntryInfo: DifficultyEntryJsonInterface;
                    for (let difficultyEntryIndex: number = 0; difficultyEntryIndex < difficultyInfo["difficulties"].length; difficultyEntryIndex++) {
                        currDifficultyEntryInfo = difficultyInfo["difficulties"][difficultyEntryIndex];

                        let possibleSolutions: PossibleSolution[] = []

                        let currPossibleSolutionInfo: PossibleSolutionsJsonInterface;
                        for (let possibleSolutionIndex: number = 0; possibleSolutionIndex < currDifficultyEntryInfo["possibleSolutions"].length; possibleSolutionIndex++) {
                            currPossibleSolutionInfo = currDifficultyEntryInfo["possibleSolutions"][possibleSolutionIndex];
                            possibleSolutions.push(new PossibleSolution(null, currPossibleSolutionInfo["description"]));
                        }
                        
                        let newEntry: DifficultyEntry = new DifficultyEntry(
                            null,
                            currDifficultyEntryInfo["description"],
                            possibleSolutions
                        )

                        difficulties.push(newEntry);
                    }

                    newComp = new Difficulties(
                        difficultyInfo["id"],
                        null,
                        difficultyInfo["componentName"],
                        connections,
                        difficulties
                    );
                    break;
                default: {
                    throw("Unknown component type: " + compType);
                }
            }
            IdGenerator.addGeneratedId(currComponentInfo["id"]);
            components.push(newComp);
        }
    }

    return new Project(idToUse, projectName, components);
}