import { saveAs } from 'file-saver';
import ProjectDescription from "./project_description";
import ProjectComponent from "./project_component";
import DocumentationSection from "./documentation_section";
import SoftwareRepo from './software_repo';
import Roadmap from './roadmap';
import Todo from './todo';

class Project {
    projectName: string = "project";
    components: Array<ProjectComponent> = [];

    constructor(jsonStr?: string) {
        if (typeof(jsonStr) === "undefined") {
            jsonStr = "{}";
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedJson: any = JSON.parse(jsonStr);
        const componentNames = Object.keys(parsedJson);
        for (const currName of componentNames) {
            const compType = parsedJson[currName]["type"];
            switch(compType) {
                case "ProjectDescription": {
                    const newProjectDescription: ProjectDescription = new ProjectDescription(
                        this,
                        parsedJson[currName]["componentName"],
                        parsedJson[currName]["connections"],
                        parsedJson[currName]["position"],
                        parsedJson[currName]["projectName"],
                        parsedJson[currName]["projectType"]
                    );
                    this.projectName = newProjectDescription.getProjectName();
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
                default: {
                    throw("Unknown component name: " + currName);
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
        localStorage.setItem("loadedProject", JSON.stringify(this));
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