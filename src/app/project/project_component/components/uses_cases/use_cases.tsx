import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import UseCaseItem, { UseCaseItemJsonInterface } from "./use_case_item";
import ProjectComponentConnection from "@/app/project/project_component_connection";
import NestedComponent from "../nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface UseCaseJsonInterface extends ProjectComponentToJsonInterface {
    "startOperatingWall": string,
    "endOperatingWall": string,
    "useCases": UseCaseItemJsonInterface[]
}

class UseCases extends ProjectComponent {
    type: string = "UseCases";

    startOperatingWall: string;
    endOperatingWall: string;
    useCases: UseCaseItem[];

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, startOperatingWall: string, endOperatingWall: string, useCases: UseCaseItem[]) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

        this.startOperatingWall = startOperatingWall;
        this.endOperatingWall = endOperatingWall;
        this.useCases = useCases;
        for (let currUseCase of this.useCases) {
            currUseCase.setParentComponent(this);
        }
    }

    toJSON(): ProjectComponentToJsonInterface {
        const useCasesAsJson: UseCaseItemJsonInterface[] = [];
        for (const currUseCase of this.useCases) {
            useCasesAsJson.push(currUseCase.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "startOperatingWall": this.startOperatingWall,
            "endOperatingWall": this.endOperatingWall,
            "useCases": useCasesAsJson
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

    deleteUseCase(useCase: UseCaseItem) {
        const indexToDelete: number = this.useCases.indexOf(useCase);
        if (indexToDelete !== -1) {
            this.useCases.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    addUseCase(newUseCase: UseCaseItem) {
        if (this.useCases.indexOf(newUseCase) === -1) {
            this.useCases.push(newUseCase);
            this.saveToBrowser();
        }
    }

    getSetupFileContents() {
        let content: string = "";
        let initialized: boolean = false;
        if ((this.startOperatingWall !== "") || (this.endOperatingWall !== "")) {
            content += `Write-Output "Operating Walls:" > "${this.componentName}.md"`;
            if (this.startOperatingWall !== "") {
                content += `Write-Output "- Start: ${this.startOperatingWall}" >> "${this.componentName}.md"`;
            }
            if (this.endOperatingWall !== "") {
                content += `Write-Output "- End: ${this.endOperatingWall}" >> "${this.componentName}.md"`;
            }
            initialized = true;
        }
        if (this.useCases.length > 0) {
            if (initialized) {
                content += `Write-Output "Use Cases:" >> "${this.componentName}.md"`
            } else {
                content += `Write-Output "Use Cases:" > "${this.componentName}.md"`
            }
            for (const currCase of this.useCases) {
                content += `Write-Output "- ${currCase}" >> "${this.componentName}.md"`;
            }
        }
        return `${content}`;
    }

    getDeployFileContents() {
        return "";
    }

    getUseCaseWithId(id: string) {
        for (var currItem of this.useCases) {
            if (currItem.getId() === id) {
                return currItem;
            }
        }
        return null;
    }

    toInputParagraph() {
        let paragraph: string = "";
        paragraph += this.startOperatingWall.trim();
        if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
            paragraph += ". ";
        }
        paragraph += this.endOperatingWall.trim();
        if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
            paragraph += ". ";
        }
        for (var currUseCase of this.useCases) {
            paragraph += currUseCase.getDescription().trim();
            if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
                paragraph += ". ";
            }
        }
        return paragraph.trim();
    }

    getComponentSpecificJson() {
        const useCasesAsJson: UseCaseItemJsonInterface[] = [];
        for (const currUseCase of this.useCases) {
            useCasesAsJson.push(currUseCase.toJSON());
        }
        const finalJson = {
            "startOperatingWall": this.startOperatingWall,
            "endOperatingWall": this.endOperatingWall,
            "useCases": useCasesAsJson
        }
        return finalJson;
    }
}

export default UseCases;