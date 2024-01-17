import { Vector3 } from "three";
import SimulatorAppearance, { BoxSizeInterface, SphereSizeInterface } from "../component_editor/simulator/simulator_appearance";
import { EditorContextInterface, getFocusedComponent, readEditorContext, writeEditorContext } from "../focus_helper_functions";
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
import { CommandJsonInterface } from "./command_json_interface";

function executeCommand(parentProject: Project, focusId: string, command: CommandJsonInterface) {
    let commandName: string = command.commandName;
    let params: string[] = command.commandParams;

    let focus = getFocusedComponent(parentProject, focusId);

    switch (commandName) {
        case "SET_NAME":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else {
                if (focus instanceof Project) {
                    focus.setProjectName(params[0]);
                } else {
                    focus.setComponentName(params[0]);
                }
            }
            break;
        case "ADD_COMPONENT":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!((focus instanceof Project) || (focus instanceof NestedComponent))) {
                return(`ADD_COMPONENT requires the focus to be an instance of Project or NestedComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let newComponent: ProjectComponent = createBasicComponent(params[0], focus);
                focus.addComponent(newComponent)
            }
            break;
        case "ADD_CONNECTION":
            if (params.length !== 3) {
                return(`Expected 3 parameters, received ${params.length}`);
            } else if (!((focus instanceof Project) || (focus instanceof NestedComponent))) {
                return(`ADD_CONNECTION requires the focus to be an instance of Project or NestedComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let rootComponent: ProjectComponent | null = focus.getComponentWithName(params[1]);
                if (rootComponent === null) {
                    return(`Could not find component with name ${params[1]}`);
                }
                let targetComponent: ProjectComponent | null = focus.getComponentWithName(params[2]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${params[2]}`);
                }
                let connection: ProjectComponentConnection = new ProjectComponentConnection(rootComponent.getId(), targetComponent.getId(), params[0]);
                rootComponent.addConnection(connection);
            }
            break;
        case "DELETE_COMPONENT":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!((focus instanceof Project) || (focus instanceof NestedComponent))) {
                return(`DELETE_COMPONENT requires the focus to be an instance of Project or NestedComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let targetComponent: ProjectComponent | null = focus.getComponentWithName(params[0]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${params[0]}`);
                }
                targetComponent.removeFromProject();
            }
            break;
        case "DELETE_CONNECTION":
            if (params.length !== 3) {
                return(`Expected 3 parameters, received ${params.length}`);
            } else if (!((focus instanceof Project) || (focus instanceof NestedComponent))) {
                return(`DELETE_CONNECTION requires the focus to be an instance of Project or NestedComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let rootComponent: ProjectComponent | null = focus.getComponentWithName(params[1]);
                if (rootComponent === null) {
                    return(`Could not find component with name ${params[1]}`);
                }
                let targetComponent: ProjectComponent | null = focus.getComponentWithName(params[2]);
                if (targetComponent === null) {
                    return(`Could not find component with name ${params[2]}`);
                }
                let connection: ProjectComponentConnection | null = rootComponent.getConnection(targetComponent, params[0]);
                if (connection === null) {
                    return(`Could not find connection from ${rootComponent.getComponentName()} to ${targetComponent.getComponentName()} with type ${params[0]}`)
                }
                rootComponent.deleteConnection(connection);
            }
            break;
        case "CHANGE_FOCUS":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else {
                let newFocusComponent: ProjectComponent | null = parentProject.getComponentWithName(params[0]);
                let newFocusId: string;
                if (newFocusComponent === null) {
                    if (params[0] !== parentProject.getProjectName()) {
                        return(`Could not find component with name ${params[0]}`);
                    } else {
                        newFocusId = parentProject.getId();
                    }
                } else {
                    newFocusId = newFocusComponent.getId();
                }

                let currEditorContext: EditorContextInterface = readEditorContext(parentProject.getId());
                let focusedIndex: number = currEditorContext.focusedIndex;
                let loadedFocusIds: string[] = currEditorContext.loadedFocusIds;
                loadedFocusIds[focusedIndex] = newFocusId;
                writeEditorContext(parentProject.getId(), focusedIndex, loadedFocusIds);
            }
            break;
        case "CHANGE_COMPONENT_TYPE":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (focus instanceof Project) {
                return(`CHANGE_COMPONENT_TYPE requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                focus.getParent().switchComponent(focus, params[0]);
            }
            break;
        case "SET_END_GOAL":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ComponentDescription)) {
                return(`SET_END_GOAL requires the focus be an instance of ComponentDescription. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as ComponentDescription).setEndGoal(params[0]);
            }
            break;
        case "SET_MISSION_STATEMENT":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ComponentDescription)) {
                return(`SET_MISSION_STATEMENT requires the focus be an instance of ComponentDescription. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as ComponentDescription).setMissionStatement(params[0]);
            }
            break;
        case "ADD_ITEM":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Todo)) {
                return(`ADD_ITEM requires the focus be an instance of Todo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let newItem = new TodoItem(focus as Todo, params[0], params[1] === "true");
                (focus as Todo).addItem(newItem);
            }
            break;
        case "SET_ITEM_STATUS":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Todo)) {
                return(`SET_ITEM_STATUS requires the focus be an instance of Todo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let item: TodoItem | null = (focus as Todo).getItemWithDescription(params[0])
                if (item === null) {
                    return(`Could not find item with description ${params[0]}`);
                }
                item.setIsComplete(params[1] === "true");
            }
            break;
        case "SET_ITEM_DESCRIPTION":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Todo)) {
                return(`SET_ITEM_DESCRIPTION requires the focus be an instance of Todo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let item: TodoItem | null = (focus as Todo).getItemWithDescription(params[0])
                if (item === null) {
                    return(`Could not find item with description ${params[0]}`);
                }
                item.setItemDescription(params[1]);
            }
            break;
        case "DELETE_ITEM":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof Todo)) {
                return(`DELETE_ITEM requires the focus be an instance of Todo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let item: TodoItem | null = (focus as Todo).getItemWithDescription(params[0])
                if (item === null) {
                    return(`Could not find item with description ${params[0]}`);
                }
                (focus as Todo).deleteItem(item);
            }
            break;
        case "SET_CONTENT":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof DocumentationSection)) {
                return(`SET_CONTENT requires the focus be an instance of DocumentationSection. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as DocumentationSection).setContent(params[0]);
            }
            break;
        case "SET_INIT_REPO_NAME":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`SET_INIT_REPO_NAME requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as SoftwareRepo).setInitRepoName(params[0]);
            }
            break;
        case "ADD_CODE_SAMPLE":
            if (params.length !== 3) {
                return(`Expected 3 parameters, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`ADD_CODE_SAMPLE requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let sample: CodeSample = new CodeSample(focus as SoftwareRepo, params[0], params[1], params[2]);
                (focus as SoftwareRepo).addCodeSample(sample);
            }
            break;
        case "CHANGE_CODE_SAMPLE_TITLE":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`CHANGE_CODE_SAMPLE_TITLE requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let sample: CodeSample | null = (focus as SoftwareRepo).getCodeSampleWithTitle(params[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${params[0]}`)
                }
                sample.setTitle(params[1]);
            }
            break;
        case "SET_LANGUAGE":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`SET_LANGUAGE requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let sample: CodeSample | null = (focus as SoftwareRepo).getCodeSampleWithTitle(params[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${params[0]}`)
                }
                sample.setLanguage(params[1]);
            }
            break;
        case "SET_CODE_BLOCK":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`SET_CODE_BLOCK requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let sample: CodeSample | null = (focus as SoftwareRepo).getCodeSampleWithTitle(params[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${params[0]}`)
                }
                sample.setCodeBlock(params[1]);
            }
            break;
        case "DELETE_CODE_SAMPLE":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof SoftwareRepo)) {
                return(`DELETE_CODE_SAMPLE requires the focus be an instance of SoftwareRepo. Focus is instance of ${focus.constructor.name}`);
            } else {
                let sample: CodeSample | null = (focus as SoftwareRepo).getCodeSampleWithTitle(params[0]);
                if (sample === null) {
                    return(`Could not find code sample with title ${params[0]}`)
                }
                (focus as SoftwareRepo).deleteCodeSample(sample);
            }
            break;
        case "SET_START_OPERATING_WALL":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof UseCases)) {
                return(`SET_START_OPERATING_WALL requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as UseCases).setStartOperatingWall(params[0]);
            }
            break;
        case "SET_END_OPERATING_WALL":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof UseCases)) {
                return(`SET_END_OPERATING_WALL requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                (focus as UseCases).setEndOperatingWall(params[0]);
            }
            break;
        case "ADD_USE_CASE":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof UseCases)) {
                return(`ADD_USE_CASE requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let newItem: UseCaseItem = new UseCaseItem((focus as UseCases), params[0]);
                (focus as UseCases).addUseCase(newItem);
            }
            break;
        case "SET_USE_CASE_DESCRIPTION":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof UseCases)) {
                return(`SET_USE_CASE_DESCRIPTION requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let item: UseCaseItem | null = (focus as UseCases).getUseCaseByDescription(params[0]);
                if (item === null) {
                    return(`Could not find item with description ${item}`)
                }
                item.setDescription(params[1]);
            }
            break;
        case "DELETE_USE_CASE":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof UseCases)) {
                return(`DELETE_USE_CASE requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let newItem: UseCaseItem | null = (focus as UseCases).getUseCaseByDescription(params[0]);
                if (newItem === null) {
                    return(`Could not find item with description ${newItem}`)
                }
                (focus as UseCases).deleteUseCase(newItem);
            }
            break;
        case "ADD_DIFFICULTY":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`ADD_DIFFICULTY requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry = new DifficultyEntry(focus as Difficulties, params[0], []);
                (focus as Difficulties).addDifficulty(entry);
            }
            break;
        case "SET_DIFFICULTY":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`SET_DIFFICULTY requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (focus as Difficulties).getEntryByDescription(params[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${params[0]}`);
                }
                entry.setDescription(params[1]);
            }
            break;
        case "ADD_POSSIBLE_SOLUTION":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`ADD_POSSIBLE_SOLUTION requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (focus as Difficulties).getEntryByDescription(params[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${params[0]}`);
                }
                let solution: PossibleSolution = new PossibleSolution(entry, params[1]);
                entry.addPossibleSolution(solution);
            }
            break;
        case "SET_POSSIBLE_SOLUTION":
            if (params.length !== 3) {
                return(`Expected 3 parameters, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`SET_POSSIBLE_SOLUTION requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (focus as Difficulties).getEntryByDescription(params[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${params[0]}`);
                }
                let solution: PossibleSolution | null = (entry as DifficultyEntry).getPossibleSolutionWithDescription(params[1]);
                if (solution === null) {
                    return(`Could not find possible solution with description ${params[1]}`);
                }
                solution.setDescription(params[2]);
            }
            break;
        case "DELETE_POSSIBLE_SOLUTION":
            if (params.length !== 2) {
                return(`Expected 2 parameters, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`DELETE_POSSIBLE_SOLUTION requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (focus as Difficulties).getEntryByDescription(params[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${params[0]}`);
                }
                let solution: PossibleSolution | null = (entry as DifficultyEntry).getPossibleSolutionWithDescription(params[1]);
                if (solution === null) {
                    return(`Could not find possible solution with description ${params[1]}`);
                }
                entry.deletePossibleSolution(solution);
            }
            break;
        case "DELETE_DIFFICULTY":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof Difficulties)) {
                return(`DELETE_DIFFICULTY requires the focus be an instance of UseCases. Focus is instance of ${focus.constructor.name}`);
            } else {
                let entry: DifficultyEntry | null = (focus as Difficulties).getEntryByDescription(params[0]);
                if (entry === null) {
                    return(`Could not find entry with description ${params[0]}`);
                }
                (focus as Difficulties).deleteDifficulty(entry);
            }
            break;
        case "SET_SHAPE":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_SHAPE requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                appearance.setShape(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_X_POSITION":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_X_POSITION requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.x = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_Y_POSITION":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_Y_POSITION requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.y = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_Z_POSITION":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_Z_POSITION requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let position: Vector3 = appearance.getPosition();
                position.z = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_WIDTH":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_WIDTH requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else if (focus.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_WIDTH requires the shape to be a Box. The current shape is ${focus.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.width = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_HEIGHT":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_HEIGHT requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else if (focus.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_HEIGHT requires the shape to be a Box. The current shape is ${focus.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.height = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_DEPTH":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_DEPTH requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else if (focus.getSimulatorAppearance().getShape() !== "Box") {
                return(`SET_DEPTH requires the shape to be a Box. The current shape is ${focus.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let size: BoxSizeInterface = appearance.getSize() as BoxSizeInterface;
                size.depth = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        case "SET_RADIUS":
            if (params.length !== 1) {
                return(`Expected 1 parameter, received ${params.length}`);
            } else if (!(focus instanceof ProjectComponent)) {
                return(`SET_RADIUS requires the focus be an instance of ProjectComponent. Focus is instance of ${focus.constructor.name}`);
            } else if (focus.getSimulatorAppearance().getShape() !== "Sphere") {
                return(`SET_RADIUS requires the shape to be a Sphere. The current shape is ${focus.getSimulatorAppearance().getShape()}`);
            } else {
                let appearance: SimulatorAppearance = focus.getSimulatorAppearance();
                let size: SphereSizeInterface = appearance.getSize() as SphereSizeInterface;
                size.radius = parseInt(params[0]);
                let newAppearance: SimulatorAppearance = new SimulatorAppearance(focus, appearance.getShape(), appearance.getPosition(), appearance.getSize());
                focus.setSimulatorAppearance(newAppearance);
            }
            break;
        default:
            return(`Unknown command ${commandName}`);
    }
    return null;
}

export function executeCommandList(parentProject: Project, focusId: string, commandList: CommandJsonInterface[]) {
    let check: string | null = null;
    let lineCounter: number = 0;
    for (var currCommand of commandList) {
        check = executeCommand(parentProject, focusId, currCommand);
        if (check !== null) {
            return(`Error on line ${lineCounter}: ${check}. Terminating execution.`);
        }
        lineCounter += 1;
    }
    return null;
}