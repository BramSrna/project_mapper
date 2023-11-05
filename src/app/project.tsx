class Project {
    DEFAULT_PROJECT_NAME = "No project name stored in project";
    DEFAULT_REPO_LINK = "No repo stored in project.";
    DEFAULT_ROADMAP_LINK = "No roadmap stored in project.";
    DEFAULT_EXECUTION_FILE_LINK = "No execution file stored in project";

    projectName: string = this.DEFAULT_PROJECT_NAME;
    repoLink: string = this.DEFAULT_REPO_LINK;
    roadmapLink: string = this.DEFAULT_ROADMAP_LINK;
    executionFileLink: string = this.DEFAULT_EXECUTION_FILE_LINK;

    constructor() {}

    setFromJson(jsonStr: string) {
        let parsedJson = JSON.parse(jsonStr);
        this.projectName = this.getValueFromJson(parsedJson, "projectName", this.DEFAULT_PROJECT_NAME)!;
        this.repoLink = this.getValueFromJson(parsedJson, "repoLink", this.DEFAULT_REPO_LINK)!;
        this.roadmapLink = this.getValueFromJson(parsedJson, "roadmapLink", this.DEFAULT_ROADMAP_LINK)!;
        this.executionFileLink = this.getValueFromJson(parsedJson, "executionFileLink", this.DEFAULT_EXECUTION_FILE_LINK)!;
    }

    toJson() {
        return {
            "projectName": this.projectName,
            "repoLink": this.repoLink,
            "roadmapLink": this.roadmapLink
        }
    }

    getValueFromJson(jsonObj: any, key: string, defaultValue: any) {
        if (jsonObj.hasOwnProperty(key)) {
            return jsonObj[key];
        }
        return defaultValue;
    }

    getProjectName() {
        return this.projectName;
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