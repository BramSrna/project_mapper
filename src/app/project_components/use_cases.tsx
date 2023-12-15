import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import ProjectDescriptionTile from "../tiles/component_description_tile";
import { ReactElement } from "react";
import Project from "./project";
import { ControlPosition } from "react-draggable";

class UseCases extends ProjectComponent {
    type = "UseCases";

    startOperatingWall: string;
    endOperatingWall: string;
    useCases: string[];

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, startOperatingWall: string, endOperatingWall: string, useCases: string[]) {
        super(parentProject, componentName, connections, position);

        this.startOperatingWall = startOperatingWall;
        this.endOperatingWall = endOperatingWall;
        this.useCases = useCases;

        parentProject.addComponent(this);
    }

    toJSON(): ProjectComponentToJsonInterface {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "startOperatingWall": this.startOperatingWall,
            "endOperatingWall": this.endOperatingWall,
            "useCases": this.useCases
        }
        return finalJson;
    }

    getStartOperatingWall() {
        return this.startOperatingWall;
    }
    
    setStartOperatingWall(newStartOperatingWall: string) {
        this.startOperatingWall = newStartOperatingWall;
        this.saveToBrowser();
    }

    getEndOperatingWall() {
        return this.endOperatingWall;
    }
    
    setEndOperatingWall(newEndOperatingWall: string) {
        this.endOperatingWall = newEndOperatingWall;
        this.saveToBrowser();
    }

    getUseCases() {
        return this.useCases;
    }

    setUseCase(index: number, newUseCase: string) {
        if ((index >= 0) && (index < this.useCases.length)) {
            this.useCases[index] = newUseCase;
            this.saveToBrowser();
        }
    }

    deleteUseCase(index: number) {
        if ((index >= 0) && (index < this.useCases.length)) {
            this.useCases.splice(index, 1);
            this.saveToBrowser();
        }
    }

    addUseCase() {
        this.useCases.push("");
        this.saveToBrowser();
    }

    getSetupFileContents() {
        let content: string = "";
        let initialized: boolean = false;
        if ((this.startOperatingWall !== "") || (this.endOperatingWall !== "")) {
            content += `echo "Operating Walls:" > "${this.componentName}.md"`;
            if (this.startOperatingWall !== "") {
                content += `echo "- Start: ${this.startOperatingWall}" >> "${this.componentName}.md"`;
            }
            if (this.endOperatingWall !== "") {
                content += `echo "- End: ${this.endOperatingWall}" >> "${this.componentName}.md"`;
            }
            initialized = true;
        }
        if (this.useCases.length > 0) {
            if (initialized) {
                content += `echo "Use Cases:" >> "${this.componentName}.md"`
            } else {
                content += `echo "Use Cases:" > "${this.componentName}.md"`
            }
            for (let currCase of this.useCases) {
                content += `echo "- ${currCase}" >> "${this.componentName}.md"`;
            }
        }
        return `${content}`;
    }

    getDeployFileContents() {
        return "";
    }
}

export default UseCases;