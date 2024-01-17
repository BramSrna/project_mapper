import { saveAs } from 'file-saver';
import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component/project_component";
import DocumentationSection from "./project_component/components/documentation_section";
import SoftwareRepo from './project_component/components/software_repo/software_repo';
import Todo from './project_component/components/todo/todo';
import UseCases from './project_component/components/uses_cases/use_cases';
import Difficulties from './project_component/components/difficulties/difficulties';
import ComponentDescription from './project_component/components/component_description';
import IdGenerator from '../id_generator';
import ProjectComponentConnection from './project_component_connection';
import UseCaseItem from './project_component/components/uses_cases/use_case_item';
import TodoItem from './project_component/components/todo/todo_item';
import Mock from './project_component/components/software_repo/code_sample';
import DifficultyEntry from './project_component/components/difficulties/difficulty_entry';
import PossibleSolution from './project_component/components/difficulties/possible_solution';
import NestedComponent, { ChildLayerJsonInterface } from './project_component/components/nested_component';
import SimulatorAppearance from '../component_editor/simulator/simulator_appearance';
import { Vector3 } from 'three';
import { convertComponentType } from '../helper_functions';

interface WatcherInterface {
    [key: string]: Function[]
}

export interface ProjectJsonInterface {
    "projectName": string,
    "components": ProjectComponentToJsonInterface[]
}

class Project {
    id: string;
    projectName: string;
    childComponents: ProjectComponent[];

    constructor(id: string, projectName: string) {
        this.id = id;
        this.projectName = projectName;

        this.childComponents = [];
    }

    toJSON() {
        const components = [];
        for (const currComponent of this.childComponents) {
            components.push(currComponent.toJSON());
        }

        return {
            "projectName": this.projectName,
            "components": components
        };
    }

    downloadJsonFile() {
        const file = new Blob([JSON.stringify(this.toJSON())], { type: "application/json" });
        saveAs(file, this.projectName + ".json");
    }

    downloadSetupFile() {
        let setupFileContents: string = "";
        for (const component of this.childComponents) {
            const newContents = component.getSetupFileContents();
            if (newContents !== "") {
                setupFileContents += newContents + "\n";
            }
        }
        const file = new Blob([setupFileContents], { type: "application/json" });
        saveAs(file, this.projectName + "_setup_file.ps1");
    }

    downloadDeployFile() {
        let deployFileContents: string = "";
        for (const component of this.childComponents) {
            const newContents = component.getDeployFileContents();
            if (newContents !== "") {
                deployFileContents += newContents + "\n";
            }
        }
        const file = new Blob([deployFileContents], { type: "application/json" });
        saveAs(file, this.projectName + "_deploy_file.ps1");
    }

    saveToBrowser() {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        let parsedIds: string[] = [];
        if (storedProjIds !== null) {
            parsedIds = JSON.parse(storedProjIds);
            if (parsedIds.indexOf(this.id) === -1) {
                parsedIds.push(this.id);
            }
        }
        localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
        localStorage.setItem(this.id, JSON.stringify(this.toJSON()));
    }

    getId() {
        return this.id;
    }

    setProjectName(newProjectName: string) {
        this.projectName = newProjectName;
        this.saveToBrowser();
    }

    getProjectName() {
        return this.projectName;
    }

    getChildComponents() {
        return this.childComponents;
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

    getComponentWithId(componentId: string) {
        for (const currComponent of this.childComponents) {
            if (currComponent.getId() === componentId) {
                return currComponent;
            }
        }
        return null;
    }

    switchComponent(componentToSwitch: ProjectComponent, newType: string) {
        if (this.childComponents.indexOf(componentToSwitch) === -1) {
            return componentToSwitch;
        }

        if (componentToSwitch.getType() === newType) {
            return componentToSwitch;
        }

        let newComponent: ProjectComponent = convertComponentType(newType, componentToSwitch);

        this.removeComponent(componentToSwitch, false);
        this.addComponent(newComponent);

        return newComponent;
    }

    getOrderedChildComponents() {
        return this.getOrderedChildComponentsFromRoot(this, 0);
    }

    getOrderedChildComponentsFromRoot(rootElement: NestedComponent | Project, layer: number) {
        let orderedComponents: ChildLayerJsonInterface[] = [];
        for (var currComponent of rootElement.getChildComponents()) {
            orderedComponents.push({"component": currComponent, "layer": layer});
            if (currComponent instanceof NestedComponent) {
                orderedComponents.push(...this.getOrderedChildComponentsFromRoot(currComponent, layer + 1));
            }
        }
        return orderedComponents;
    }

    getComponentWithName(name: string) {
        for (var currComponent of this.getOrderedChildComponents()) {
            if (currComponent.component.getComponentName() === name) {
                return currComponent.component;
            }
        }
        return null;
    }
}

export default Project;