import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import DocumentationBoxTile from "../tiles/documentation_box_tile";
import Project from "./project";
import { ControlPosition } from "react-draggable";

class DocumentationSection extends ProjectComponent {
    content = "";

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, content: string) {
        super(parentProject, componentName, connections, position);

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

    getSetupFileContents() {
        return `echo "${this.content}" > "${this.componentName}.txt"`;
    }

    getDeployFileContents() {
        return "";
    }

    getVisualizerContents() {
        console.log(this.content)
        let keyIndex = 0;
        const lines = this.content.split("\n").map(function(currLine) {
            return (<p key={keyIndex++}>{currLine}</p>);
        })
        return (
            <div>
                {lines}
            </div>
        )
    }
}

export default DocumentationSection;