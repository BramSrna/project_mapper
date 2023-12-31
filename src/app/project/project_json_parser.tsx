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
    let newProj: Project = new Project(idToUse, "", []);

    console.log(jsonObject);
    if ("projectName" in jsonObject) {
        newProj.setProjectName(jsonObject["projectName"]);
    }

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
                        newProj,
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
                        newProj,
                        docSectionInfo["componentName"],
                        connections,
                        docSectionInfo["content"]
                    );
                    break;
                }
                case "SoftwareRepo": {
                    let softwareRepoInfo: SoftwareRepoJsonInterface = currComponentInfo as SoftwareRepoJsonInterface;
                    
                    let newSoftwareRepo: SoftwareRepo = new SoftwareRepo(
                        softwareRepoInfo["id"],
                        newProj,
                        softwareRepoInfo["componentName"],
                        connections,
                        softwareRepoInfo["initRepoName"],
                        []
                    );

                    let currMockInfo: MockJsonInterface;
                    for (let mockIndex: number = 0; mockIndex < softwareRepoInfo["mocks"].length; mockIndex++) {
                        currMockInfo = softwareRepoInfo["mocks"][mockIndex];
                        newSoftwareRepo.addMock(new Mock(
                            newSoftwareRepo,
                            currMockInfo["input"],
                            currMockInfo["output"]
                        ));
                    }

                    newComp = newSoftwareRepo;

                    break;
                }
                case "Todo": {
                    let todoInfo: TodoJsonInterface = currComponentInfo as TodoJsonInterface;
                    
                    let newTodo: Todo = new Todo(
                        todoInfo["id"],
                        newProj,
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
                    let useCaseInfo: UseCaseJsonInterface = currComponentInfo as UseCaseJsonInterface;
                    
                    let newUseCases: UseCases = new UseCases(
                        useCaseInfo["id"],
                        newProj,
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
                    let difficultyInfo: DifficultiesJsonInterface = currComponentInfo as DifficultiesJsonInterface;
                    
                    let newDifficulties: Difficulties = new Difficulties(
                        difficultyInfo["id"],
                        newProj,
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
            IdGenerator.addGeneratedId(currComponentInfo["id"]);
            newProj.addComponent(newComp);
        }
    }

    return newProj;
}