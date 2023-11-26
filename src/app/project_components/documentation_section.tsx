import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import DocumentationBoxTile from "../tiles/documentation_box_tile";
import Project from "./project";

class DocumentationSection extends ProjectComponent {
    content = "";

    constructor(parentProject: Project, componentName: string, connections: Array<string>, content: string) {
        super(parentProject, componentName, connections);

        this.content = content;

        parentProject.addComponent(this);
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "type": "DocumentationSection",
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

    toElement(listKey: number): ReactElement {
        return (
            <DocumentationBoxTile
                parentComponent={this}
                key={listKey}
            />
        )
    }

    getExecutionFileContents() {
        return "";
    }
}

export default DocumentationSection;