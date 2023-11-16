interface ProjectDetails {
    projectName: string;
    projectType: string;
    repoLink: string;
    roadmapLink: string;
    executionFileLink: string;
}

class Project {
    DEFAULT_PROJECT_NAME = "No project name stored in project";
    DEFAULT_PROJECT_TYPE = "No project type stored in project";
    DEFAULT_REPO_LINK = "No repo stored in project.";
    DEFAULT_ROADMAP_LINK = "No roadmap stored in project.";
    DEFAULT_EXECUTION_FILE_LINK = "No execution file stored in project";

    projectName: string = this.DEFAULT_PROJECT_NAME;
    projectType: string = this.DEFAULT_PROJECT_TYPE;
    repoLink: string = this.DEFAULT_REPO_LINK;
    roadmapLink: string = this.DEFAULT_ROADMAP_LINK;
    executionFileLink: string = this.DEFAULT_EXECUTION_FILE_LINK;

    constructor() {}

    setFromJson(jsonStr: string) {
        const parsedJson: ProjectDetails = JSON.parse(jsonStr);
        this.projectName = this.getStringValueFromJson(parsedJson, "projectName", this.DEFAULT_PROJECT_NAME)!;
        this.projectType = this.getStringValueFromJson(parsedJson, "projectType", this.DEFAULT_PROJECT_TYPE)!;
        this.repoLink = this.getStringValueFromJson(parsedJson, "repoLink", this.DEFAULT_REPO_LINK)!;
        this.roadmapLink = this.getStringValueFromJson(parsedJson, "roadmapLink", this.DEFAULT_ROADMAP_LINK)!;
        this.executionFileLink = this.getStringValueFromJson(parsedJson, "executionFileLink", this.DEFAULT_EXECUTION_FILE_LINK)!;
    }

    toJson() {
        return {
            "projectName": this.projectName,
            "projectType": this.projectType,
            "repoLink": this.repoLink,
            "roadmapLink": this.roadmapLink,
            "executionFileLink": this.executionFileLink
        }
    }

    getStringValueFromJson(jsonObj: ProjectDetails, key: string, defaultValue: string) {
        if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {        
            return jsonObj[key as keyof ProjectDetails];
        }
        return defaultValue;
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
    }

    setProjectType(newProjectType: string) {
        this.projectType = newProjectType;
    }

    setRepoLink(newRepoLink: string) {
        this.repoLink = newRepoLink;
    }

    setRoadmapLink(newRoadmapLink: string) {
        this.roadmapLink = newRoadmapLink;
    }

    setExecutionFileLink(newExecutionFileLink: string) {
        this.executionFileLink = newExecutionFileLink;
    }
}

export default Project;