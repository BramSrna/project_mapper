import { Vector3 } from "three";
import SimulatorAppearance from "./component_editor/simulator/simulator_appearance";
import IdGenerator from "./id_generator";
import ComponentDescription from "./project/project_component/components/component_description";
import Difficulties from "./project/project_component/components/difficulties/difficulties";
import DocumentationSection from "./project/project_component/components/documentation_section";
import NestedComponent from "./project/project_component/components/nested_component";
import SoftwareRepo from "./project/project_component/components/software_repo/software_repo";
import Todo from "./project/project_component/components/todo/todo";
import UseCases from "./project/project_component/components/uses_cases/use_cases";
import ProjectComponent from "./project/project_component/project_component";
import Project from "./project/project";
import axios from "axios";
import { CommandJsonInterface } from "./terminal/command_json_interface";
import { getBuildCommandsFromResponseData } from "./terminal/command_mapper";
import { executeCommandList } from "./terminal/command_executor";

export function createBasicComponent(componentType: string, parent: Project | NestedComponent) {
    let appearance = new SimulatorAppearance(null, "Box", new Vector3(0, 0, 0), {"width": 1, "height": 1, "depth": 1});
    let newComponent: ProjectComponent;
    switch (componentType) {
        case "NestedComponent":
            newComponent = new NestedComponent(IdGenerator.generateId(), parent, "Nested Component", [], "", appearance, []);
            break;
        case "ComponentDescription":
            newComponent = new ComponentDescription(IdGenerator.generateId(), parent, "Component Description", [], "", appearance, "", "");
            break;
        case "DocumentationSection":
            newComponent = new DocumentationSection(IdGenerator.generateId(), parent, "Documentation Section", [], "", appearance, "");
            break;
        case "SoftwareRepo":
            newComponent = new SoftwareRepo(IdGenerator.generateId(), parent, "Software Repo", [], "", appearance, "", []);
            break;
        case "Todo":
            newComponent = new Todo(IdGenerator.generateId(), parent, "Todo", [], "", appearance, []);
            break;
        case "UseCases":
            newComponent = new UseCases(IdGenerator.generateId(), parent, "Use Cases", [], "", appearance, "", "", []);
            break;
        case "Difficulties":
            newComponent = new Difficulties(IdGenerator.generateId(), parent, "Difficulties", [], "", appearance, []);
            break;
        default:
            throw new Error("Unknown tile type: " + componentType);
    }
    return newComponent;
}

export async function convertComponentType(newType: string, componentToSwitch: ProjectComponent) {
    let response = await axios.post("http://localhost:5000/run_component_builder_with_type", {"componentType": newType, "inputParagraph": componentToSwitch.toInputParagraph()});

    console.log(response)
    let newComponent: ProjectComponent;
    switch (newType) {
        case "NestedComponent":
            newComponent = new NestedComponent(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), []);
            break;
        case "ComponentDescription":
            newComponent = new ComponentDescription(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), "", "");
            break;
        case "DocumentationSection":
            newComponent = new DocumentationSection(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), "");
            break;
        case "SoftwareRepo":
            newComponent = new SoftwareRepo(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), "", []);
            break;
        case "Todo":
            newComponent = new Todo(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), []);
            break;
        case "UseCases":
            newComponent = new UseCases(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), "", "", []);
            break;
        case "Difficulties":
            newComponent = new Difficulties(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), componentToSwitch.getSimulatorBehaviour(), componentToSwitch.getSimulatorAppearance(), []);
            break;
        default:
            throw new Error("Unknown tile type: " + newType);
    }
    componentToSwitch.getParent().removeComponent(componentToSwitch, false);
    componentToSwitch.getParent().addComponent(newComponent);
    let commands: CommandJsonInterface[] = [];
    commands.push({ "dependencies": [], "commandName": "CHANGE_FOCUS", "commandParams": [newComponent.getId()] });
    commands = commands.concat(getBuildCommandsFromResponseData(newType, response.data));
    let parent: Project | ProjectComponent = componentToSwitch.getParent();
    while (!(parent instanceof Project)) {
        parent = parent.getParent();
    }
    console.log(commands)
    executeCommandList(parent as Project, componentToSwitch.getParent(), commands);
    return newComponent;
}