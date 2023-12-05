import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import Project from "./project";
import SoftwareRepoTile from "../tiles/software_repo_tile";
import { ControlPosition } from "react-draggable";

class Mock {
    input: string = "";
    output: string = "";

    constructor(input: string, output: string) {
        this.input = input;
        this.output = output;
    }

    getInput() {
        return this.input;
    }

    getOutput() {
        return this.output;
    }

    setInput(newInputValue: string) {
        this.input = newInputValue;
    }

    setOutput(newOutputValue: string) {
        this.output = newOutputValue;
    }

    toJSON() {
        return {
            "input": this.input,
            "output": this.output
        }
    }
}

class SoftwareRepo extends ProjectComponent {
    createUsingInit: boolean = true;
    cloneTarget: string = "";
    initRepoName: string = "";
    mocks: Mock[] = [];

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, createUsingInit: boolean, cloneTarget: string, initRepoName: string, mocks: object[]) {
        super(parentProject, componentName, connections, position);

        this.createUsingInit = createUsingInit;
        this.cloneTarget = cloneTarget;
        this.initRepoName = initRepoName;
        this.mocks = [];
        console.log(mocks);
        for (const currMock of mocks) {
            this.mocks.push(new Mock(currMock["input" as keyof typeof currMock], currMock["output" as keyof typeof currMock]));
        }

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
        const mocksAsJson: object[] = [];
        for (const currItem of this.mocks) {
            mocksAsJson.push(currItem.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "type": "SoftwareRepo",
            "createUsingInit": this.createUsingInit,
            "cloneTarget": this.cloneTarget,
            "initRepoName": this.initRepoName,
            "mocks": mocksAsJson
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

    getMocks() {
        return this.mocks;
    }

    setMockInput(index: number, newValue: string) {
        if ((index >= 0) && (index < this.mocks.length)) {
            this.mocks[index].setInput(newValue);
            this.saveToBrowser();
        }
    }

    setMockOutput(index: number, newValue: string) {
        if ((index >= 0) && (index < this.mocks.length)) {
            this.mocks[index].setOutput(newValue);
            this.saveToBrowser();
        }
    }

    deleteMock(index: number) {
        if ((index >= 0) && (index < this.mocks.length)) {
            this.mocks.splice(index, 1);
            this.saveToBrowser();
        }
    }

    addMock() {
        this.mocks.push(new Mock("", ""));
        this.saveToBrowser();
    }

    getSetupFileContents() {
        if (this.createUsingInit) {
            return `mkdir ${this.initRepoName} \ncd ${this.initRepoName}\ngit init\ncd ..`;
        } else {
            return `git clone ${this.cloneTarget}`;
        }
    }

    getDeployFileContents() {
        let contents: string = "";
        let folderName: string = "";
        if (this.createUsingInit) {
            contents += `mkdir ${this.initRepoName} \ncd ${this.initRepoName}\ngit init\ncd ..`;
            folderName = this.initRepoName;
        } else {
            contents += `git clone ${this.cloneTarget}`;
            const cloneTargetParts: string[] = this.cloneTarget.split("/")
            folderName = cloneTargetParts[cloneTargetParts.length - 1].replace(".git", "");
        }
        contents += `\ncd ${folderName}\n.\\startup.ps1`;
        return contents;
    }

    getVisualizerContents() {
        let keyVal: number = 0;
        return (            
            <table>
                <thead>
                    <tr key={keyVal++}>
                        <td key={keyVal++}>Input</td>
                        <td key={keyVal++}>Output</td>
                    </tr>
                </thead>
                <tbody>
                    {this.mocks.map(function(currMock) {
                        return (
                        <tr key={keyVal++}>
                            <td key={keyVal++}>{currMock.getInput()}</td>
                            <td key={keyVal++}>{currMock.getOutput()}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        )
    }
}

export default SoftwareRepo;