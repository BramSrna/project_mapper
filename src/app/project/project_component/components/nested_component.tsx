import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import ComponentDescription from "./component_description";
import DocumentationSection from "./documentation_section";
import SoftwareRepo from "./software_repo/software_repo";
import Todo from "./todo/todo";
import UseCases from "./uses_cases/use_cases";
import Difficulties from "./difficulties/difficulties";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";
import { convertComponentType } from "@/app/helper_functions";

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

    constructor(id: string, parent: Project | NestedComponent, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, childComponents: ProjectComponent[]) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

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

    getComponentWithName(name: string) {
        for (var currComponent of this.childComponents) {
            if (currComponent.getComponentName() === name) {
                return currComponent;
            }
        }
        return null;
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

    async switchComponent(componentToSwitch: ProjectComponent, newType: string) {
        if (this.childComponents.indexOf(componentToSwitch) === -1) {
            return componentToSwitch;
        }

        if (componentToSwitch.getType() === newType) {
            return componentToSwitch;
        }

        let newComponent: ProjectComponent = await convertComponentType(newType, componentToSwitch);

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

    toInputParagraph() {
        let paragraph: string = "";
        for (var currComponent of this.childComponents) {
            paragraph += currComponent.toInputParagraph().trim();
            if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
                paragraph += ". ";
            }
        }
        return paragraph.trim();
    }

    getComponentSpecificJson() {
        const components = [];
        for (const currComponent of this.childComponents) {
            components.push(currComponent.toJSON());
        }
        const finalJson = {
            "components": components
        }
        return finalJson;
    }
}

export default NestedComponent;