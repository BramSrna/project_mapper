import Project from "../project";
import saveAs from "file-saver";
import ProjectComponentConnection, { ProjectComponentConnectionJsonInterface } from "../project_component_connection";

export interface ProjectComponentToJsonInterface {
    "id": string,
    "componentName": string,
    "connections": ProjectComponentConnection[],
    "type": string
}

abstract class ProjectComponent {
    id: string;
    parentProject: Project | null;
    componentName: string = "";
    connections: ProjectComponentConnection[] = [];

    abstract readonly type: string;

    constructor(id: string, parentProject: Project | null, componentName: string, connections: ProjectComponentConnection[]) {
        this.id = id;
        this.parentProject = parentProject;
        this.componentName = componentName;
        this.connections = connections;
    }

    abstract getSetupFileContents() : string;
    abstract getDeployFileContents() : string;

    setParentProject(newParentProject: Project) {
        this.parentProject = newParentProject;
    }

    setType(newType: string) {
        if (newType === this.type) {
            return this;
        }
        
        if (this.parentProject !== null) {
            return this.parentProject.switchComponent(this, newType);
        }
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    toJSON() : ProjectComponentToJsonInterface {
        const connectionsAsJson: ProjectComponentConnectionJsonInterface[] = [];
        for (const currConnection of this.connections) {
            connectionsAsJson.push(currConnection.toJSON());
        }
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
        if (this.parentProject !== null) {
            this.parentProject.saveToBrowser();
        }
    }

    removeFromProject() {
        if (this.parentProject !== null) {
            this.parentProject.removeComponent(this, true);
        }
    }

    setComponentName(newComponentName: string) {
        this.componentName = newComponentName;
        this.saveToBrowser();
    }

    addConnection(newConnection: ProjectComponentConnection) {
        if (this.connections.indexOf(newConnection) === -1) {
            this.connections.push(newConnection);
            this.saveToBrowser();
        }
    }

    notifyComponentRemoval(removedComponent: ProjectComponent) {
        let connectionsToDelete: ProjectComponentConnection[] = [];
        for (let currConnection of this.connections) {
            if ((currConnection.getStartId() === removedComponent.getId()) || (currConnection.getEndId() === removedComponent.getId())) {
                connectionsToDelete.push(currConnection);
            }
        }
        for (let currConnection of connectionsToDelete) {
            this.deleteConnection(currConnection);
        }
    }

    deleteConnection(connectionToDelete: ProjectComponentConnection) {
        const index: number = this.connections.indexOf(connectionToDelete);
        if (index !== -1) {
            this.connections.splice(index, 1);
            this.saveToBrowser();
        }
    }

    getParentProject() {
        return this.parentProject;
    }
}

export default ProjectComponent;