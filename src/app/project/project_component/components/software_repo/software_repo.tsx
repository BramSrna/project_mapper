import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import Mock from "./mock";

class SoftwareRepo extends ProjectComponent {
    type: string = "SoftwareRepo";

    initRepoName: string;
    mocks: Mock[];

    constructor(id: string, parentProject: Project, componentName: string, connections: string[], initRepoName: string, mocks: object[]) {
        super(id, parentProject, componentName, connections);

        this.initRepoName = initRepoName;
        this.mocks = [];
        for (const currMock of mocks) {
            this.mocks.push(new Mock(this, currMock["input" as keyof typeof currMock], currMock["output" as keyof typeof currMock]));
        }

        parentProject.addComponent(this);
    }

    toJSON() {
        const mocksAsJson: object[] = [];
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
        let indexToDelete: number = this.mocks.indexOf(mockToDelete);
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