import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import DocumentationBoxTile from "../tiles/documentation_box_tile";
import Project from "./project";
import { ControlPosition } from "react-draggable";

class DocumentationSection extends ProjectComponent {
    content = "";
    type = "DocumentationSection";

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, content: string) {
        super(parentProject, componentName, connections, position);

        this.content = content;

        parentProject.addComponent(this);
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
        let lines: string[] = this.content.split("\n");
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