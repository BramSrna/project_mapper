import { Vector3 } from "three";
import SimulatorAppearance, { BoxSizeInterface, SphereSizeInterface } from "../component_editor/simulator/simulator_appearance";
import { EditorContextInterface, readEditorContext, writeEditorContext } from "../focus_helper_functions";
import { createBasicComponent } from "../helper_functions";
import Project from "../project/project";
import ComponentDescription from "../project/project_component/components/component_description";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import DifficultyEntry from "../project/project_component/components/difficulties/difficulty_entry";
import PossibleSolution from "../project/project_component/components/difficulties/possible_solution";
import DocumentationSection from "../project/project_component/components/documentation_section";
import NestedComponent from "../project/project_component/components/nested_component";
import CodeSample from "../project/project_component/components/software_repo/code_sample";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import Todo from "../project/project_component/components/todo/todo";
import TodoItem from "../project/project_component/components/todo/todo_item";
import UseCaseItem from "../project/project_component/components/uses_cases/use_case_item";
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import ProjectComponent from "../project/project_component/project_component";
import ProjectComponentConnection from "../project/project_component_connection";
import { CommandJsonInterface, CommandParamFuncResolverInterface } from "./command_json_interface";

export function executeCommand(parentProject: Project, executionContext: Project | ProjectComponent, commandName: string, commandParams: string[]) {
    switch (commandName) {
        case "SET_NAME":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else {
                if (executionContext instanceof Project) {
                    executionContext.setProjectName(commandParams[0]);
                } else {
                    executionContext.setComponentName(commandParams[0]);
                }
                return executionContext;
            }
        case "ADD_COMPONENT":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!((executionContext instanceof Project) || (executionContext instanceof NestedComponent))) {
                return(`ADD_COMPONENT requires the executionContext to be an instance of Project or NestedComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let newComponent: ProjectComponent = createBasicComponent(commandParams[0], executionContext);
                executionContext.addComponent(newComponent)
                return newComponent;
            }
        case "ADD_CONNECTION":
            if (commandParams.length !== 3) {
                return(`Expected 3 parameters, received ${commandParams.length}`);
            } else if (!((executionContext instanceof Project) || (executionContext instanceof NestedComponent))) {
                return(`ADD_CONNECTION requires the executionContext to be an instance of Project or NestedComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let rootComponent: ProjectComponent | null = executionContext.getComponentWithId(commandParams[1]);
                if (rootComponent === null) {
                    return(`Could not find component with name ${commandParams[1]}`);
                }
                let targetComponent: ProjectComponent | null = executionContext.getComponentWithId(commandParams[2]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${commandParams[2]}`);
                }
                let connection: ProjectComponentConnection = new ProjectComponentConnection(rootComponent.getId(), targetComponent.getId(), commandParams[0]);
                rootComponent.addConnection(connection);
                return connection;
            }
        case "DELETE_COMPONENT":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!((executionContext instanceof Project) || (executionContext instanceof NestedComponent))) {
                return(`DELETE_COMPONENT requires the executionContext to be an instance of Project or NestedComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let targetComponent: ProjectComponent | null = executionContext.getComponentWithId(commandParams[0]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${commandParams[0]}`);
                }
                targetComponent.removeFromProject();
                return targetComponent;
            }
        case "DELETE_CONNECTION":
            if (commandParams.length !== 3) {
                return(`Expected 3 parameters, received ${commandParams.length}`);
            } else if (!((executionContext instanceof Project) || (executionContext instanceof NestedComponent))) {
                return(`DELETE_CONNECTION requires the executionContext to be an instance of Project or NestedComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let rootComponent: ProjectComponent | null = executionContext.getComponentWithId(commandParams[1]);
                if (rootComponent === null) {
                    return(`Could not find component with name ${commandParams[1]}`);
                }
                let targetComponent: ProjectComponent | null = executionContext.getComponentWithId(commandParams[2]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${commandParams[2]}`);
                }
                let connection: ProjectComponentConnection | null = rootComponent.getConnection(targetComponent, commandParams[0]);
                if (connection === null) {
                    return(`Could not find connection from ${rootComponent.getComponentName()} to ${targetComponent.getComponentName()} with type ${commandParams[0]}`)
                }
                rootComponent.deleteConnection(connection);
                return connection;
            }
        case "CHANGE_FOCUS":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else {
                let newFocusedComponent: ProjectComponent | Project | null = parentProject.getComponentWithId(commandParams[0]);
                let newFocusedId: string;
                if (newFocusedComponent === null) {
                    if (commandParams[0] !== parentProject.getId()) {
                        return(`Could not find component with name ${commandParams[0]}`);
                    } else {
                        newFocusedId = parentProject.getId();
                    }
                    newFocusedComponent = parentProject;
                } else {
                    newFocusedId = newFocusedComponent.getId();
                }

                let currEditorContext: EditorContextInterface = readEditorContext(parentProject.getId());
                let focusedIndex: number = currEditorContext.focusedIndex;
                let loadedFocusIds: string[] = currEditorContext.loadedFocusIds;
                loadedFocusIds[focusedIndex] = newFocusedId;
                writeEditorContext(parentProject.getId(), focusedIndex, loadedFocusIds);
                return newFocusedComponent;
            }
        case "CHANGE_COMPONENT_TYPE":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (executionContext instanceof Project) {
                return(`CHANGE_COMPONENT_TYPE requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                executionContext.getParent().switchComponent(executionContext, commandParams[0]);
                return executionContext;
            }
        case "SET_END_GOAL":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ComponentDescription)) {
                return(`SET_END_GOAL requires the executionContext be an instance of ComponentDescription. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as ComponentDescription).setEndGoal(commandParams[0]);
                return executionContext;
            }
        case "SET_MISSION_STATEMENT":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ComponentDescription)) {
                return(`SET_MISSION_STATEMENT requires the executionContext be an instance of ComponentDescription. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as ComponentDescription).setMissionStatement(commandParams[0]);
                return executionContext;
            }
        case "ADD_ITEM":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Todo)) {
                return(`ADD_ITEM requires the executionContext be an instance of Todo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let newItem = new TodoItem(executionContext as Todo, commandParams[0], commandParams[1] === "true");
                (executionContext as Todo).addItem(newItem);
                return newItem;
            }
        case "SET_ITEM_STATUS":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Todo)) {
                return(`SET_ITEM_STATUS requires the executionContext be an instance of Todo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let item: TodoItem | null = (executionContext as Todo).getItemWithId(commandParams[0])
                if (item === null) {
                    return(`Could not find item with description ${commandParams[0]}`);
                }
                item.setIsComplete(commandParams[1] === "true");
                return item;
            }
        case "SET_ITEM_DESCRIPTION":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Todo)) {
                return(`SET_ITEM_DESCRIPTION requires the executionContext be an instance of Todo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let item: TodoItem | null = (executionContext as Todo).getItemWithId(commandParams[0])
                if (item === null) {
                    return(`Could not find item with description ${commandParams[0]}`);
                }
                item.setItemDescription(commandParams[1]);
                return item;
            }
        case "DELETE_ITEM":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Todo)) {
                return(`DELETE_ITEM requires the executionContext be an instance of Todo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let item: TodoItem | null = (executionContext as Todo).getItemWithId(commandParams[0])
                if (item === null) {
                    return(`Could not find item with description ${commandParams[0]}`);
                }
                (executionContext as Todo).deleteItem(item);
                return item;
            }
        case "SET_CONTENT":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof DocumentationSection)) {
                return(`SET_CONTENT requires the executionContext be an instance of DocumentationSection. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as DocumentationSection).setContent(commandParams[0]);
                return executionContext;
            }
        case "SET_INIT_REPO_NAME":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`SET_INIT_REPO_NAME requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as SoftwareRepo).setInitRepoName(commandParams[0]);
                return executionContext;
            }
        case "ADD_CODE_SAMPLE":
            if (commandParams.length !== 3) {
                return(`Expected 3 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`ADD_CODE_SAMPLE requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let sample: CodeSample = new CodeSample(executionContext as SoftwareRepo, commandParams[0], commandParams[1], commandParams[2]);
                (executionContext as SoftwareRepo).addCodeSample(sample);
                return sample;
            }
        case "CHANGE_CODE_SAMPLE_TITLE":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`CHANGE_CODE_SAMPLE_TITLE requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let sample: CodeSample | null = (executionContext as SoftwareRepo).getCodeSampleWithId(commandParams[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${commandParams[0]}`)
                }
                sample.setTitle(commandParams[1]);
                return sample;
            }
        case "SET_LANGUAGE":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`SET_LANGUAGE requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let sample: CodeSample | null = (executionContext as SoftwareRepo).getCodeSampleWithId(commandParams[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${commandParams[0]}`)
                }
                sample.setLanguage(commandParams[1]);
                return sample;
            }
        case "SET_CODE_BLOCK":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`SET_CODE_BLOCK requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let sample: CodeSample | null = (executionContext as SoftwareRepo).getCodeSampleWithId(commandParams[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${commandParams[0]}`)
                }
                sample.setCodeBlock(commandParams[1]);
                return sample;
            }
        case "DELETE_CODE_SAMPLE":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof SoftwareRepo)) {
                return(`DELETE_CODE_SAMPLE requires the executionContext be an instance of SoftwareRepo. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let sample: CodeSample | null = (executionContext as SoftwareRepo).getCodeSampleWithId(commandParams[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${commandParams[0]}`)
                }
                (executionContext as SoftwareRepo).deleteCodeSample(sample);
                return sample;
            }
        case "SET_START_OPERATING_WALL":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof UseCases)) {
                return(`SET_START_OPERATING_WALL requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as UseCases).setStartOperatingWall(commandParams[0]);
                return executionContext;
            }
        case "SET_END_OPERATING_WALL":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof UseCases)) {
                return(`SET_END_OPERATING_WALL requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                (executionContext as UseCases).setEndOperatingWall(commandParams[0]);
                return executionContext;
            }
        case "ADD_USE_CASE":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof UseCases)) {
                return(`ADD_USE_CASE requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let newItem: UseCaseItem = new UseCaseItem((executionContext as UseCases), commandParams[0]);
                (executionContext as UseCases).addUseCase(newItem);
                return newItem;
            }
        case "SET_USE_CASE_DESCRIPTION":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof UseCases)) {
                return(`SET_USE_CASE_DESCRIPTION requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let item: UseCaseItem | null = (executionContext as UseCases).getUseCaseWithId(commandParams[0]);
                if (item === null) {
                    return(`Could not find item with description ${item}`)
                }
                item.setDescription(commandParams[1]);
                return item;
            }
        case "DELETE_USE_CASE":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof UseCases)) {
                return(`DELETE_USE_CASE requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let newItem: UseCaseItem | null = (executionContext as UseCases).getUseCaseWithId(commandParams[0]);
                if (newItem === null) {
                    return(`Could not find item with description ${newItem}`)
                }
                (executionContext as UseCases).deleteUseCase(newItem);
                return newItem;
            }
        case "ADD_DIFFICULTY":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`ADD_DIFFICULTY requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry = new DifficultyEntry(executionContext as Difficulties, commandParams[0], []);
                (executionContext as Difficulties).addDifficulty(entry);
                return entry;
            }
        case "SET_DIFFICULTY":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`SET_DIFFICULTY requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (executionContext as Difficulties).getEntryWithId(commandParams[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${commandParams[0]}`);
                }
                entry.setDescription(commandParams[1]);
                return entry;
            }
        case "ADD_POSSIBLE_SOLUTION":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`ADD_POSSIBLE_SOLUTION requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (executionContext as Difficulties).getEntryWithId(commandParams[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${commandParams[0]}`);
                }
                let solution: PossibleSolution = new PossibleSolution(entry, commandParams[1]);
                entry.addPossibleSolution(solution);
                return solution;
            }
        case "SET_POSSIBLE_SOLUTION":
            if (commandParams.length !== 3) {
                return(`Expected 3 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`SET_POSSIBLE_SOLUTION requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (executionContext as Difficulties).getEntryWithId(commandParams[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${commandParams[0]}`);
                }
                let solution: PossibleSolution | null = (entry as DifficultyEntry).getPossibleSolutionWithId(commandParams[1]);
                if (solution === null) {
                    return(`Could not find possible solution with description ${commandParams[1]}`);
                }
                solution.setDescription(commandParams[2]);
                return solution;
            }
        case "DELETE_POSSIBLE_SOLUTION":
            if (commandParams.length !== 2) {
                return(`Expected 2 parameters, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`DELETE_POSSIBLE_SOLUTION requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (executionContext as Difficulties).getEntryWithId(commandParams[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${commandParams[0]}`);
                }
                let solution: PossibleSolution | null = (entry as DifficultyEntry).getPossibleSolutionWithId(commandParams[1]);
                if (solution === null) {
                    return(`Could not find possible solution with description ${commandParams[1]}`);
                }
                entry.deletePossibleSolution(solution);
                return solution;
            }
        case "DELETE_DIFFICULTY":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof Difficulties)) {
                return(`DELETE_DIFFICULTY requires the executionContext be an instance of UseCases. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (executionContext as Difficulties).getEntryWithId(commandParams[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${commandParams[0]}`);
                }
                (executionContext as Difficulties).deleteDifficulty(entry);
                return entry;
            }
        case "SET_SHAPE":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_SHAPE requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                appearance.setShape(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_X_POSITION":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_X_POSITION requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.x = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_Y_POSITION":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_Y_POSITION requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.y = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_Z_POSITION":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_Z_POSITION requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.z = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_WIDTH":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_WIDTH requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else if (executionContext.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_WIDTH requires the shape to be a Box. The current shape is ${executionContext.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.width = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_HEIGHT":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_HEIGHT requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else if (executionContext.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_HEIGHT requires the shape to be a Box. The current shape is ${executionContext.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.height = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_DEPTH":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_DEPTH requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else if (executionContext.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_DEPTH requires the shape to be a Box. The current shape is ${executionContext.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.depth = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        case "SET_RADIUS":
            if (commandParams.length !== 1) {
                return(`Expected 1 parameter, received ${commandParams.length}`);
            } else if (!(executionContext instanceof ProjectComponent)) {
                return(`SET_RADIUS requires the executionContext be an instance of ProjectComponent. Execution context is instance of ${executionContext.constructor.name}`);
            } else if (executionContext.getSimulatorAppearance().getShape() !== "Sphere") {
                return(`SET_RADIUS requires the shape to be a Sphere. The current shape is ${executionContext.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = executionContext.getSimulatorAppearance();
                let size: SphereSizeInterface = appearance.getSize() as SphereSizeInterface;
                size.radius = parseInt(commandParams[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(executionContext, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                executionContext.setSimulatorAppearance(newAppearance);
                return newAppearance;
            }
        default:
            return(`Unknown command ${commandName}`);
    }
}

export function executeCommandList(parentProject: Project, executionContext: Project | ProjectComponent, commandList: CommandJsonInterface[]) {
    let currReturnVal: string | Project | ProjectComponent | SimulatorAppearance | ProjectComponentConnection | TodoItem | CodeSample | UseCaseItem | DifficultyEntry | PossibleSolution;
    let lineCounter: number = 0;
    let returnVals: object[] = [];
    for (var currCommand of commandList) {
        let paramList: string[] = [];
        for (var currParam of currCommand.commandParams) {
            if (typeof currParam === 'string' || currParam instanceof String) {
                paramList.push(currParam.toString());
            } else {
                let dependencyInd: number = currParam.dependencyInd;
                let resolverFunc: Function = currParam.resolverFunc;
                paramList.push(resolverFunc(returnVals[dependencyInd]));
            }
        }
        currReturnVal = executeCommand(parentProject, executionContext, currCommand.commandName, paramList);
        if (typeof currReturnVal === 'string' || currReturnVal instanceof String) {
            return(`Error on line ${lineCounter}: ${currReturnVal}. Terminating execution.`);
        }
        returnVals.push(currReturnVal);
        if (currCommand.commandName === "CHANGE_FOCUS") {
            executionContext = currReturnVal as Project | ProjectComponent;
        }
        lineCounter += 1;
    }
    return null;
}