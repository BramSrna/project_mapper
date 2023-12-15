import { saveAs } from 'file-saver';
import ProjectComponent from "./project_component";
import DocumentationSection from "./documentation_section";
import SoftwareRepo from './software_repo';
import Roadmap from './roadmap';
import Todo from './todo';
import UseCases from './use_cases';
import Difficulties from './difficulties';
import ComponentDescription from './component_description';

class Project {
    projectName: string = "";
    components: Array<ProjectComponent> = [];
    projectId: string = "";

    constructor(projectId?: string, jsonStr?: string) {
        if (typeof(projectId) === "undefined") {
            projectId = this.makeId(12);
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
                            this,
                            parsedJson[currName]["componentName"],
                            parsedJson[currName]["connections"],
                            parsedJson[currName]["position"],
                            parsedJson[currName]["internallyDefined"],
                            parsedJson[currName]["linkToRoadmap"],
                            parsedJson[currName]["roadmapHeaders"],
                            parsedJson[currName]["entries"]
                        );
                        break;
                    }
                    case "Todo": {
                        new Todo(
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

    makeId(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
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
        projJson["projectName"] = this.projectName;

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