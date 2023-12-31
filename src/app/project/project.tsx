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
import Mock from './project_component/components/software_repo/mock';
import DifficultyEntry from './project_component/components/difficulties/difficulty_entry';
import PossibleSolution from './project_component/components/difficulties/possible_solution';

export interface ProjectJsonInterface {
    "projectName": string,
    "components": ProjectComponentToJsonInterface[]
}

class Project {
    projectName: string = "";
    components: Array<ProjectComponent> = [];
    id: string;

    constructor(id: string, projectName: string, components: ProjectComponent[]) {
        this.id = id;
        this.projectName = projectName;
        this.components = components;

        for (const currComponent of this.components) {
            currComponent.setParentProject(this);
        }
    }

    toJSON() {
        const components = [];
        for (const currComponent of this.components) {
            components.push(currComponent.toJSON());
        }
        return {
            "components": components,
            "projectName": this.projectName
        };
    }

    downloadProjectAsJson() {
        const file = new Blob([JSON.stringify(this.toJSON())], { type: "application/json" });
        saveAs(file, this.projectName + ".json");
    }

    downloadSetupFile() {
        let setupFileContents: string = "";
        for (const component of this.components) {
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
        for (const component of this.components) {
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
        }

        if (parsedIds.indexOf(this.id) === -1) {
            parsedIds.push(this.id);
            localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
        }

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

    getComponents() {
        return this.components;
    }

    addComponent(newComponent: ProjectComponent) {
        if (this.components.indexOf(newComponent, 0) === -1) {
            this.components.push(newComponent);
            this.saveToBrowser()
            return true;
        }
        return false;
    }

    removeComponent(componentToRemove: ProjectComponent, notifyOtherComponents: boolean) {
        const index = this.components.indexOf(componentToRemove, 0);
        if (index > -1) {
            this.components.splice(index, 1);
        }
        if (notifyOtherComponents) {
            for (const component of this.components) {
                component.notifyComponentRemoval(componentToRemove);
            }
        }
        this.saveToBrowser();
    }

    switchComponent(componentToSwitch: ProjectComponent, newType: string) {
        if (componentToSwitch.getType() === newType) {
            return componentToSwitch;
        }

        let newComponent: ProjectComponent;
        switch (newType) {
            case "ComponentDescription":
                newComponent = new ComponentDescription(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", "");
                break;
            case "DocumentationSection":
                newComponent = new DocumentationSection(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "");
                break;
            case "SoftwareRepo":
                newComponent = new SoftwareRepo(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", []);
                break;
            case "Todo":
                newComponent = new Todo(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), []);
                break;
            case "UseCases":
                newComponent = new UseCases(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), "", "", []);
                break;
            case "Difficulties":
                newComponent = new Difficulties(componentToSwitch.getId(), componentToSwitch.getParentProject(), componentToSwitch.getComponentName(), componentToSwitch.getConnections(), []);
                break;
            default:
                throw new Error("Unknown tile type: " + newType);
        }

        this.removeComponent(componentToSwitch, false);
        this.addComponent(newComponent);

        return newComponent;
    }

    getComponentWithId(componentId: string) {
        for (const currComponent of this.components) {
            if (currComponent.getId() === componentId) {
                return currComponent;
            }
        }
        return null;
    }
}

export default Project;