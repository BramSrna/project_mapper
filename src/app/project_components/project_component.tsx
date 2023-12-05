import { ReactElement } from "react";
import Project from "./project";
import { ControlPosition } from "react-draggable";
import saveAs from "file-saver";

export interface ProjectComponentToJsonInterface {
    "componentName": string,
    "connections": Array<string>,
    "position": ControlPosition
}

abstract class ProjectComponent {
    parentProject: Project;
    componentName: string = "";
    connections: Array<string> = [];
    position: ControlPosition = {x: 0, y: 0};

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition) {
        this.parentProject = parentProject;
        this.componentName = componentName;
        this.connections = connections;
        if (position.x < 0) {
            position.x = 0;
        }
        if (position.y < 0) {
            position.y = 0;
        }
        this.position = position;
    }

    abstract toElement(listKey: number) : ReactElement;
    abstract getSetupFileContents() : string;
    abstract getDeployFileContents() : string;
    abstract getVisualizerContents() : ReactElement;

    toJSON() : ProjectComponentToJsonInterface {
        return {
            "componentName": this.componentName,
            "connections": this.connections,
            "position": this.position
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
        this.parentProject.notifyComponentNameChange(originalName, newComponentName);
        this.saveToBrowser();
    }

    addConnection(targetComponent: ProjectComponent) {
        if (this.connections.indexOf(targetComponent.getComponentName(), 0) === -1) {
            this.connections.push(targetComponent.getComponentName());
            this.saveToBrowser();
        }
    }

    notifyComponentRemoval(removedComponent: ProjectComponent) {
        this.deleteConnection(removedComponent.getComponentName());
    }

    notifyComponentNameChange(originalName: string, newName: string) {
        const index: number = this.connections.indexOf(originalName, 0);
        if (index !== -1) {
            this.connections[index] = newName;
            this.saveToBrowser();
        }
    }

    deleteConnection(connectionTargetName: string) {
        const index: number = this.connections.indexOf(connectionTargetName, 0);
        if (index !== -1) {
            this.connections.splice(index, 1);
            this.saveToBrowser();
        }
    }

    getPosition() {
        return this.position;
    }

    setPosition(newXPos: number, newYPos: number) {
        this.position = {x: newXPos, y: newYPos};
        this.saveToBrowser();
    }
}

export default ProjectComponent;