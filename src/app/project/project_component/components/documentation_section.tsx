import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import NestedComponent from "./nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface DocumentationSectionJsonInterface extends ProjectComponentToJsonInterface {
    "content": string
}

class DocumentationSection extends ProjectComponent {
    content: string = "";
    type: string = "DocumentationSection";

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, content: string) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

        this.content = content;
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "content": this.content
        }
        return finalJson;
    }
    
    getContent() {
        return this.content;
    }

    setContent(newContent: string) {
        this.content = newContent;
        this.saveToBrowser();
    }

    getSetupFileContents() {
        let content: string = "";
        const lines: string[] = this.content.split("\n");
        for (let i: number = 0; i < lines.length; i++) {
            if (i === 0) {
                content += `Write-Output "${lines[i]}" > "${this.componentName}.md"`;
            } else {
                content += `Write-Output "${lines[i]}" >> "${this.componentName}.md"`;
            }
            if (i < lines.length - 1) {
                content += "\n";
            }
        }
        return content;
    }

    getDeployFileContents() {
        return "";
    }

    toInputParagraph() {
        let paragraph: string = this.content.trim();
        if ((this.content.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
            paragraph += ".";
        }
        return paragraph.trim();
    }

    getComponentSpecificJson() {
        return {
            "content": this.content
        }
    }
}

export default DocumentationSection;