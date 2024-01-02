import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import ComponentDescription from "./component_description";
import DocumentationSection from "./documentation_section";
import SoftwareRepo from "./software_repo/software_repo";
import Todo from "./todo/todo";
import UseCases from "./uses_cases/use_cases";
import Difficulties from "./difficulties/difficulties";

export interface ChildLayerJsonInterface {
    "component": ProjectComponent,
    "layer": number
}

export interface NestedComponentJsonInterface extends ProjectComponentToJsonInterface {
    "components": ProjectComponentToJsonInterface[]
}

class NestedComponent extends ProjectComponent {
    type: string = "NestedComponent";
    childComponents: ProjectComponent[];

    constructor(id: string, parent: Project | NestedComponent, componentName: string, connections: ProjectComponentConnection[], childComponents: ProjectComponent[]) {
        super(id, parent, componentName, connections);

        this.childComponents = childComponents;
        for (var currComponent of this.childComponents) {
            currComponent.setParent(this);
        }
    }

    getChildComponents() {
        return this.childComponents;
    }

    toJSON() {
        const components = [];
        for (const currComponent of this.childComponents) {
            components.push(currComponent.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "components": components
        }
        return finalJson;
    }

    getSetupFileContents() {
        let setupFileContents: string = "";
        for (const component of this.getChildComponents()) {
            const newContents = component.getSetupFileContents();
            if (newContents !== "") {
                setupFileContents += newContents + "\n";
            }
        }
        return setupFileContents;
    }

    getDeployFileContents() {
        let deployFileContents: string = "";
        for (const component of this.getChildComponents()) {
            const newContents = component.getDeployFileContents();
            if (newContents !== "") {
                deployFileContents += newContents + "\n";
            }
        }
        return deployFileContents;
    }

    getComponentWithId(componentId: string) {
        for (const currComponent of this.childComponents) {
            if (currComponent.getId() === componentId) {
                return currComponent;
            }
        }
        return null;
    }

    addComponent(newComponent: ProjectComponent) {
        if (this.childComponents.indexOf(newComponent, 0) === -1) {
            this.childComponents.push(newComponent);
            this.saveToBrowser()
            return true;
        }
        return false;
    }

    removeComponent(componentToRemove: ProjectComponent, notifyOtherComponents: boolean) {
        const index = this.childComponents.indexOf(componentToRemove, 0);
        if (index > -1) {
            this.childComponents.splice(index, 1);
        }
        if (notifyOtherComponents) {
            for (const component of this.childComponents) {
                component.notifyComponentRemoval(componentToRemove);
            }
        }
        this.saveToBrowser();
    }

    switchComponent(componentToSwitch: ProjectComponent, newType: string) {
        if (this.childComponents.indexOf(componentToSwitch) === -1) {
            return componentToSwitch;
        }

        if (componentToSwitch.getType() === newType) {
            return componentToSwitch;
        }

        let newComponent: ProjectComponent;
        switch (newType) {
            case "NestedComponent":
                newComponent = new NestedComponent(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), []);
                break;
            case "ComponentDescription":
                newComponent = new ComponentDescription(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", "");
                break;
            case "DocumentationSection":
                newComponent = new DocumentationSection(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "");
                break;
            case "SoftwareRepo":
                newComponent = new SoftwareRepo(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", []);
                break;
            case "Todo":
                newComponent = new Todo(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), []);
                break;
            case "UseCases":
                newComponent = new UseCases(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", "", []);
                break;
            case "Difficulties":
                newComponent = new Difficulties(componentToSwitch.getId(), componentToSwitch.getParent(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), []);
                break;
            default:
                throw new Error("Unknown tile type: " + newType);
        }

        this.removeComponent(componentToSwitch, false);
        this.addComponent(newComponent);

        return newComponent;
    }

    getOrderedChildComponents() {
        return this.getOrderedChildComponentsFromRoot(this, 0);
    }

    getOrderedChildComponentsFromRoot(rootElement: NestedComponent, layer: number) {
        let orderedComponents: ChildLayerJsonInterface[] = [];
        for (var currComponent of rootElement.getChildComponents()) {
            orderedComponents.push({"component": currComponent, "layer": layer});
            if (currComponent instanceof NestedComponent) {
                orderedComponents.push(...this.getOrderedChildComponentsFromRoot(currComponent, layer + 1));
            }
        }
        return orderedComponents;
    }
}

export default NestedComponent;