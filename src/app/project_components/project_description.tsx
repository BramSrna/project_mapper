import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import ProjectDescriptionTile from "../tiles/project_description_tile";
import { ReactElement } from "react";
import Project from "./project";

class ProjectDescription extends ProjectComponent {
    projectName: string;
    projectType: string;
    repoLink: string;
    roadmapLink: string;
    executionFileLink: string;

    constructor(parentProject: Project, componentName: string, connections: Array<string>, projectName: string, projectType: string, repoLink: string, roadmapLink: string, executionFileLink: string) {
        super(parentProject, componentName, connections);

        this.projectName = projectName;
        this.projectType = projectType;
        this.repoLink = repoLink;
        this.roadmapLink = roadmapLink;
        this.executionFileLink = executionFileLink;

        parentProject.addComponent(this);
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "type": "ProjectDescription",
            "projectName": this.projectName,
            "projectType": this.projectType,
            "repoLink": this.repoLink,
            "roadmapLink": this.roadmapLink,
            "executionFileLink": this.executionFileLink
        }
        return finalJson;
    }

    getProjectName() {
        return this.projectName;
    }

    getProjectType() {
        return this.projectType;
    }

    getRepoLink() {
        return this.repoLink;
    }

    getRoadmapLink() {
        return this.roadmapLink;
    }

    getExecutionFileLink() {
        return this.executionFileLink;
    }

    setProjectName(newProjectName: string) {
        this.projectName = newProjectName;
        this.saveToBrowser()
    }

    setProjectType(newProjectType: string) {
        this.projectType = newProjectType;
        this.saveToBrowser()
    }

    setRepoLink(newRepoLink: string) {
        this.repoLink = newRepoLink;
        this.saveToBrowser()
    }

    setRoadmapLink(newRoadmapLink: string) {
        this.roadmapLink = newRoadmapLink;
        this.saveToBrowser()
    }

    setExecutionFileLink(newExecutionFileLink: string) {
        this.executionFileLink = newExecutionFileLink;
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

    getExecutionFileContents() {
        return "";
    }
}

export default ProjectDescription;