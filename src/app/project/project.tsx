import { saveAs } from 'file-saver';
import ProjectComponent from "./project_component/project_component";
import DocumentationSection from "./project_component/components/documentation_section";
import SoftwareRepo from './project_component/components/software_repo/software_repo';
import Roadmap from './project_component/components/roadmap/roadmap';
import Todo from './project_component/components/todo/todo';
import UseCases from './project_component/components/uses_cases/use_cases';
import Difficulties from './project_component/components/difficulties/difficulties';
import ComponentDescription from './project_component/components/component_description';
import IdGenerator from '../id_generator';

class Project {
    projectName: string = "";
    components: Array<ProjectComponent> = [];
    id: string;

    constructor(id?: string, jsonStr?: string) {
        if (typeof(id) === "undefined") {
            id = IdGenerator.generateId();
        } else {
            IdGenerator.addGeneratedId(id);
        }
        this.id = id;

        if (typeof(jsonStr) === "undefined") {
            jsonStr = "{}";
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedJson: any = JSON.parse(jsonStr);
        if ("projectName" in parsedJson) {
            this.projectName = parsedJson["projectName"];
            this.saveToBrowser();
        }
        if ("components" in parsedJson) {
            const componentsBlock = parsedJson["components"];
            for (const currCompInfo of componentsBlock) {
                const compType = currCompInfo["type"];
                switch(compType) {
                    case "ComponentDescription": {
                        new ComponentDescription(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["endGoal"],
                            currCompInfo["missionStatement"]
                        );
                        break;
                    }
                    case "DocumentationSection": {
                        new DocumentationSection(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["content"]
                        );
                        break;
                    }
                    case "SoftwareRepo": {
                        new SoftwareRepo(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["initRepoName"],
                            currCompInfo["mocks"]
                        );
                        break;
                    }
                    case "Roadmap": {
                        new Roadmap(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["entries"]
                        );
                        break;
                    }
                    case "Todo": {
                        new Todo(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["items"]
                        );
                        break;
                    }
                    case "UseCases":
                        new UseCases(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["startOperatingWall"],
                            currCompInfo["endOperatingWall"],
                            currCompInfo["useCases"]
                        );
                        break;
                    case "Difficulties":
                        new Difficulties(
                            currCompInfo["id"],
                            this,
                            currCompInfo["componentName"],
                            currCompInfo["connections"],
                            currCompInfo["difficulties"]
                        );
                        break;
                    default: {
                        throw("Unknown component type: " + compType);
                    }
                }
                IdGenerator.addGeneratedId(currCompInfo["id"]);
            }
        }
    }

    toJSON() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        let projJson: object = this.toJSON();

        localStorage.setItem(this.id, JSON.stringify(projJson));
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