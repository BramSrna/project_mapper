import { saveAs } from 'file-saver';
import ProjectComponent from "./project_component/project_component";
import DocumentationSection from "./project_component/components/documentation_section";
import SoftwareRepo from './project_component/components/software_repo/software_repo';
import Roadmap from './project_component/components/roadmap/roadmap';
import Todo from './project_component/components/todo/todo';
import UseCases from './project_component/components/use_cases';
import Difficulties from './project_component/components/difficulties/difficulties';
import ComponentDescription from './project_component/components/component_description';
import IdGenerator from '../id_generator';

class Project {
    projectName: string = "";
    components: Array<ProjectComponent> = [];
    projectId: string;

    constructor(projectId?: string, jsonStr?: string) {
        if (typeof(projectId) === "undefined") {
            projectId = IdGenerator.generateId();
        } else {
            IdGenerator.addGeneratedId(projectId);
        }
        this.projectId = projectId;

        if (typeof(jsonStr) === "undefined") {
            jsonStr = "{}";
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedJson: any = JSON.parse(jsonStr);
        const componentNames = Object.keys(parsedJson);
        for (const currName of componentNames) {
            if (currName === "projectName") {
                this.projectName = parsedJson["projectName"];
                this.saveToBrowser();
            } else {
                const compType = parsedJson[currName]["type"];
                switch(compType) {
                    case "ComponentDescription": {
                        new ComponentDescription(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["name"],
                            parsedJson[currName]["componentType"],
                            parsedJson[currName]["endGoal"],
                            parsedJson[currName]["missionStatement"]
                        );
                        break;
                    }
                    case "DocumentationSection": {
                        new DocumentationSection(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["content"]
                        );
                        break;
                    }
                    case "SoftwareRepo": {
                        new SoftwareRepo(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["createUsingInit"],
                            parsedJson[currName]["cloneTarget"],
                            parsedJson[currName]["initRepoName"],
                            parsedJson[currName]["mocks"]
                        );
                        break;
                    }
                    case "Roadmap": {
                        new Roadmap(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["entries"]
                        );
                        break;
                    }
                    case "Todo": {
                        new Todo(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["items"]
                        );
                        break;
                    }
                    case "UseCases":
                        new UseCases(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["startOperatingWall"],
                            parsedJson[currName]["endOperatingWall"],
                            parsedJson[currName]["useCases"]
                        );
                        break;
                    case "Difficulties":
                        new Difficulties(
                            parsedJson[currName]["id"],
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["difficulties"]
                        );
                        break;
                    default: {
                        throw("Unknown component name: " + currName);
                    }
                }
            }
        }
    }

    toJSON() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const initialJson: any = {};
        for (const currComponent of this.components) {
            initialJson[currComponent.getComponentName()] = currComponent.toJSON();
        }
        return initialJson;
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

        if (parsedIds.indexOf(this.projectId) === -1) {
            parsedIds.push(this.projectId);
            localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
        }

        let projJson: object = this.toJSON();
        projJson = {
            ...projJson,
            "projectName": this.projectName
        };

        localStorage.setItem(this.projectId, JSON.stringify(projJson));
    }

    getProjectId() {
        return this.projectId;
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

    getComponentNames() {
        const componentNames: Array<string> = [];
        for (const component of this.components) {
            componentNames.push(component.getComponentName());
        }
        return componentNames;
    }

    addComponent(newComponent: ProjectComponent) {
        if (this.components.indexOf(newComponent, 0) !== -1) {
            return false;
        }

        let suffix = 2;
        const originalName = newComponent.getComponentName();
        while (this.getComponentNames().indexOf(newComponent.getComponentName(), 0) !== -1) {
            newComponent.setComponentName(originalName + " " + suffix.toString());
            suffix += 1;
        }

        this.components.push(newComponent);
        this.saveToBrowser()
        return true;
    }

    notifyComponentNameChange(originalComponentName: string, newComponentName: string) {
        for (const component of this.components) {
            component.notifyComponentNameChange(originalComponentName, newComponentName);
        }
        this.saveToBrowser();
    }

    removeComponent(componentToRemove: ProjectComponent) {
        const index = this.components.indexOf(componentToRemove, 0);
        if (index > -1) {
            this.components.splice(index, 1);
        }
        for (const component of this.components) {
            component.notifyComponentRemoval(componentToRemove);
        }
        this.saveToBrowser();
    }

    getComponentWithName(componentName: string) {
        for (const currComponent of this.components) {
            if (currComponent.getComponentName() === componentName) {
                return currComponent;
            }
        }
        return null;
    }
}

export default Project;