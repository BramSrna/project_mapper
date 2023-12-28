import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";

class DocumentationSection extends ProjectComponent {
    content: string = "";
    type: string = "DocumentationSection";

    constructor(id: string, parentProject: Project, componentName: string, connections: Array<string>, content: string) {
        super(id, parentProject, componentName, connections);

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