import { ReactElement } from "react";
import Project from "./project";

export interface ProjectComponentToJsonInterface {
    "componentName": string,
    "connections": Array<string>
}

abstract class ProjectComponent {
    parentProject: Project;
    componentName: string = "";
    connections: Array<string> = [];

    constructor(parentProject: Project, componentName: string, connections: Array<string>) {
        this.parentProject = parentProject;
        this.componentName = componentName;
        this.connections = connections;
    }

    abstract toElement(listKey: number) : ReactElement;
    abstract getSetupFileContents() : string;
    abstract getDeployFileContents() : string;

    toJSON() : ProjectComponentToJsonInterface {
        return {
            "componentName": this.componentName,
            "connections": this.connections
        }
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
        this.componentName = newComponentName;
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

    deleteConnection(connectionTargetName: string) {
        const index: number = this.connections.indexOf(connectionTargetName, 0)
        if (index !== -1) {
            this.connections.splice(index, 1);
            this.saveToBrowser();
        }
    }
}

export default ProjectComponent;