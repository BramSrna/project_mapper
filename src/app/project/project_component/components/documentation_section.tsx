import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import NestedComponent from "./nested_component";

export interface DocumentationSectionJsonInterface extends ProjectComponentToJsonInterface {
    "content": string
}

class DocumentationSection extends ProjectComponent {
    content: string = "";
    type: string = "DocumentationSection";

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], content: string) {
        super(id, parent, componentName, connections);

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
                content += `echo "${lines[i]}" > "${this.componentName}.md"`;
            } else {
                content += `echo "${lines[i]}" >> "${this.componentName}.md"`;
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
}

export default DocumentationSection;