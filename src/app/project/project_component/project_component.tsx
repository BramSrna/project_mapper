import Project from "../project";
import saveAs from "file-saver";

export interface ProjectComponentToJsonInterface {
    "id": string,
    "componentName": string,
    "connections": string[],
    "type": string
}

abstract class ProjectComponent {
    id: string;
    parentProject: Project;
    componentName: string = "";
    connections: string[] = [];

    abstract readonly type: string;

    constructor(id: string, parentProject: Project, componentName: string, connections: string[]) {
        this.id = id;
        this.parentProject = parentProject;
        this.componentName = componentName;
        this.connections = connections;
    }

    abstract getSetupFileContents() : string;
    abstract getDeployFileContents() : string;

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    toJSON() : ProjectComponentToJsonInterface {
        return {
            "id": this.id,
            "componentName": this.componentName,
            "connections": this.connections,
            "type": this.type
        }
    }

    downloadSetupFile() {
        const file = new Blob([this.getSetupFileContents()], { type: "application/json" });
        saveAs(file, this.componentName + "_setup_file.ps1");
    }

    downloadDeployFile() {
        const file = new Blob([this.getDeployFileContents()], { type: "application/json" });
        saveAs(file, this.componentName + "_deploy_file.ps1");
    }

    getConnections() {
        return this.connections;
    }

    getComponentName() {
        return this.componentName;
    }

    saveToBrowser() {
        this.parentProject.saveToBrowser();
    }

    removeFromProject() {
        this.parentProject.removeComponent(this);
    }

    setComponentName(newComponentName: string) {
        const originalName: string = this.componentName;
        this.componentName = newComponentName;
        this.saveToBrowser();
    }

    addConnection(newId: string) {
        if (this.connections.indexOf(newId) === -1) {
            this.connections.push(newId);
            this.saveToBrowser();
        }
    }

    notifyComponentRemoval(removedComponent: ProjectComponent) {
        this.deleteConnection(removedComponent.getId());
    }

    deleteConnection(idToDelete: string) {
        const index: number = this.connections.indexOf(idToDelete);
        if (index !== -1) {
            this.connections.splice(index, 1);
            this.saveToBrowser();
        }
    }
}

export default ProjectComponent;