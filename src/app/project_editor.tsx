import { FormEvent } from "react";
import Project from "./project";
import { saveAs } from 'file-saver';

class ProjectEditor {
    projectToEdit: Project;

    constructor(projectToEdit: Project) {
        this.projectToEdit = projectToEdit;
    }

    saveProjectOnClickHandler = (event: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);

        let projectName = formData.get("projectName");
        let repoLink = formData.get("repoLink");
        let roadmapLink = formData.get("roadmapLink");
        let executionFileLink = formData.get("executionFileLink");

        if (projectName !== null) {
            this.projectToEdit.setProjectName(projectName.toString());
        }
        if (repoLink !== null) {
            this.projectToEdit.setRepoLink(repoLink.toString());
        }
        if (roadmapLink !== null) {
            this.projectToEdit.setRoadmapLink(roadmapLink.toString());
        }
        if (executionFileLink !== null) {
            this.projectToEdit.setExecutionFileLink(executionFileLink.toString());
        }
        
        const file = new Blob([JSON.stringify(this.projectToEdit.toJson())], { type: "application/json" });
        saveAs(file, this.projectToEdit.getProjectName() + ".json");
        
        event.preventDefault()
    }

    toHtml() {
        return (
            <form onSubmit={this.saveProjectOnClickHandler}>
                <p>Project Name: <input type="text" name="projectName" defaultValue={this.projectToEdit.getProjectName()}/></p>
                <p>Repo Link: <input type="text" name="repoLink" defaultValue={this.projectToEdit.getRepoLink()}/></p>
                <p>Roadmap Link: <input type="text" name="roadmapLink" defaultValue={this.projectToEdit.getRoadmapLink()}/></p>
                <p>Execution File Link: <input type="text" name="executionFileLink" defaultValue={this.projectToEdit.getExecutionFileLink()}/></p>
                <button type="submit">Save Project</button>
            </form>
        );
    }
}

export default ProjectEditor;