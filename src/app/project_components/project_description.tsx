import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import ProjectDescriptionTile from "../tiles/project_description_tile";
import { ReactElement } from "react";
import Project from "./project";
import { ControlPosition } from "react-draggable";

class ProjectDescription extends ProjectComponent {
    projectName: string;
    projectType: string;

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, projectName: string, projectType: string) {
        super(parentProject, componentName, connections, position);

        this.projectName = projectName;
        this.projectType = projectType;

        parentProject.addComponent(this);
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            ...this.getDisplayableContentsJson(),
            "type": "ProjectDescription"
        }
        return finalJson;
    }

    getDisplayableContentsJson() {
        const setupContents = {
            "projectName": this.projectName,
            "projectType": this.projectType
        };

        return setupContents;
    }

    getProjectName() {
        return this.projectName;
    }

    getProjectType() {
        return this.projectType;
    }

    setProjectName(newProjectName: string) {
        this.projectName = newProjectName;
        this.saveToBrowser()
    }

    setProjectType(newProjectType: string) {
        this.projectType = newProjectType;
        this.saveToBrowser()
    }

    toElement(listKey: number): ReactElement {
        return (
            <ProjectDescriptionTile
                parentComponent={this}
                key={listKey}
            />
        )
    }

    getSetupFileContents() {
        return `echo '${JSON.stringify(this.getDisplayableContentsJson())}' > "${this.componentName}.json"`;
    }

    getDeployFileContents() {
        return "";
    }

    getVisualizerContents() {
        return (
            <pre>
                {JSON.stringify(this.getDisplayableContentsJson(), null, 2)}
            </pre>
        )
    }
}

export default ProjectDescription;