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
import NestedComponent from './project_component/components/nested_component';

export interface ProjectJsonInterface {
    "projectName": string,
    "components": ProjectComponentToJsonInterface[]
}

class Project {
    id: string;
    projectName: string;
    rootComponent: NestedComponent;

    constructor(id: string, projectName: string) {
        this.id = id;
        this.projectName = projectName;

        this.rootComponent = new NestedComponent(IdGenerator.generateId(), this, "Root", [], []);
    }

    toJSON() {
        return {
            "projectName": this.projectName,
            "components": this.rootComponent.toJSON()
        };
    }

    downloadJsonFile() {
        const file = new Blob([JSON.stringify(this.toJSON())], { type: "application/json" });
        saveAs(file, this.projectName + ".json");
    }

    downloadSetupFile() {
        let setupFileContents: string = this.rootComponent.getSetupFileContents()
        const file = new Blob([setupFileContents], { type: "application/json" });
        saveAs(file, this.projectName + "_setup_file.ps1");
    }

    downloadDeployFile() {
        let deployFileContents: string = this.rootComponent.getDeployFileContents()
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
}

export default Project;