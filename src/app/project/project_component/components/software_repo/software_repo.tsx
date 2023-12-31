import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import Mock, { MockJsonInterface } from "./mock";
import ProjectComponentConnection from "@/app/project/project_component_connection";

export interface SoftwareRepoJsonInterface extends ProjectComponentToJsonInterface {
    "initRepoName": string,
    "mocks": MockJsonInterface[]
}

class SoftwareRepo extends ProjectComponent {
    type: string = "SoftwareRepo";

    initRepoName: string;
    mocks: Mock[];

    constructor(id: string, parentProject: Project | null, componentName: string, connections: ProjectComponentConnection[], initRepoName: string, mocks: Mock[]) {
        super(id, parentProject, componentName, connections);

        this.initRepoName = initRepoName;
        this.mocks = mocks;
        for (const currMock of mocks) {
            currMock.setParentComponent(this);
        }
    }

    toJSON() {
        const mocksAsJson: MockJsonInterface[] = [];
        for (const currItem of this.mocks) {
            mocksAsJson.push(currItem.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "initRepoName": this.initRepoName,
            "mocks": mocksAsJson
        }
        return finalJson;
    }

    getInitRepoName() {
        return this.initRepoName;
    }

    setInitRepoName(newInitRepoName: string) {
        this.initRepoName = newInitRepoName;
        this.saveToBrowser();
    }

    getMocks() {
        return this.mocks;
    }

    deleteMock(mockToDelete: Mock) {
        const indexToDelete: number = this.mocks.indexOf(mockToDelete);
        if (indexToDelete !== -1) {
            this.mocks.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    addMock(newMock: Mock) {
        if (this.mocks.indexOf(newMock) === -1) {
            this.mocks.push(newMock);
            this.saveToBrowser();
        }
    }

    getSetupFileContents() {
        if (this.initRepoName === "") {
            return "";
        } else {
            return `mkdir ${this.initRepoName} \ncd ${this.initRepoName}\ngit init\ncd ..`;
        }
    }

    getDeployFileContents() {
        let contents: string = "";
        let folderName: string = "";
        if (this.initRepoName === "") {
            return "";
        }
        contents += `mkdir ${this.initRepoName} \ncd ${this.initRepoName}\ngit init\ncd ..`;
        folderName = this.initRepoName;
        contents += `\ncd ${folderName}\n.\\startup.ps1`;
        return contents;
    }
}

export default SoftwareRepo;