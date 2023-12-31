import Project from "../project";
import saveAs from "file-saver";
import ProjectComponentConnection, { ProjectComponentConnectionJsonInterface } from "../project_component_connection";
import NestedComponent from "./components/nested_component";

export interface ProjectComponentToJsonInterface {
    "id": string,
    "componentName": string,
    "connections": ProjectComponentConnection[],
    "type": string
}

abstract class ProjectComponent {
    id: string;
    parent: Project | NestedComponent;
    componentName: string = "";
    connections: ProjectComponentConnection[] = [];

    abstract readonly type: string;

    constructor(id: string, parent: Project | NestedComponent, componentName: string, connections: ProjectComponentConnection[]) {
        this.id = id;
        this.parent = parent;
        this.componentName = componentName;
        this.connections = connections;
    }

    abstract getSetupFileContents() : string;
    abstract getDeployFileContents() : string;

    setParent(newParent: Project | NestedComponent) {
        this.parent = newParent;
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

    downloadJsonFile() {
        const file = new Blob([JSON.stringify(this.toJSON())], { type: "application/json" });
        saveAs(file, this.componentName + ".json");
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
        this.parent.saveToBrowser();
    }

    removeFromProject() {
        this.parent.removeComponent(this, true);
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

    getParent() {
        return this.parent;
    }
}

export default ProjectComponent;