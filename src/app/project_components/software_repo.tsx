import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import Project from "./project";
import SoftwareRepoTile from "../tiles/software_repo_tile";

class SoftwareRepo extends ProjectComponent {
    createUsingInit: boolean = true;
    cloneTarget: string = "";
    initRepoName: string = "";

    constructor(parentProject: Project, componentName: string, connections: Array<string>, createUsingInit: boolean, cloneTarget: string, initRepoName: string) {
        super(parentProject, componentName, connections);

        this.createUsingInit = createUsingInit;
        this.cloneTarget = cloneTarget;
        this.initRepoName = initRepoName;

        parentProject.addComponent(this);
    }

    toElement(listKey: number): ReactElement {
        return (
            <SoftwareRepoTile
                parentComponent={this}
                key={listKey}
            />
        )
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "type": "SoftwareRepo",
            "createUsingInit": this.createUsingInit,
            "cloneTarget": this.cloneTarget,
            "initRepoName": this.initRepoName
        }
        return finalJson;
    }

    getCloneTarget() {
        return this.cloneTarget
    }

    setCloneTarget(newCloneTarget: string) {
        this.cloneTarget = newCloneTarget;
        this.saveToBrowser()
    }

    getInitRepoName() {
        return this.initRepoName;
    }

    setInitRepoName(newInitRepoName: string) {
        this.initRepoName = newInitRepoName;
        this.saveToBrowser();
    }

    getCreateUsingInit() {
        return this.createUsingInit;
    }

    setCreateUsingInit(newVal: boolean) {
        this.createUsingInit = newVal;
        this.saveToBrowser();
    }

    getExecutionFileContents() {
        if (this.createUsingInit) {
            return `mkdir ${this.initRepoName} \ncd ${this.initRepoName}\ngit init\ncd ..`;
        } else {
            return `git clone ${this.cloneTarget}`;
        }
    }
}

export default SoftwareRepo;