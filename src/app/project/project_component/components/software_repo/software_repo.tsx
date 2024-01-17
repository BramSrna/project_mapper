import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import CodeSample, { CodeSamplesJsonInterface } from "./code_sample";
import ProjectComponentConnection from "@/app/project/project_component_connection";
import NestedComponent from "../nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface SoftwareRepoJsonInterface extends ProjectComponentToJsonInterface {
    "initRepoName": string,
    "codeSamples": CodeSamplesJsonInterface[]
}

class SoftwareRepo extends ProjectComponent {
    type: string = "SoftwareRepo";

    initRepoName: string;
    codeSamples: CodeSample[];

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, initRepoName: string, codeSamples: CodeSample[]) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

        this.initRepoName = initRepoName;
        this.codeSamples = codeSamples;
        for (const currCodeSample of codeSamples) {
            currCodeSample.setParentComponent(this);
        }
    }

    toJSON() {
        const codeSamplesAsJson: CodeSamplesJsonInterface[] = [];
        for (const currSample of this.codeSamples) {
            codeSamplesAsJson.push(currSample.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "initRepoName": this.initRepoName,
            "codeSamples": codeSamplesAsJson
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

    getCodeSamples() {
        return this.codeSamples;
    }

    deleteCodeSample(codeSampleToDelete: CodeSample) {
        const indexToDelete: number = this.codeSamples.indexOf(codeSampleToDelete);
        if (indexToDelete !== -1) {
            this.codeSamples.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    addCodeSample(newCodeSample: CodeSample) {
        if (this.codeSamples.indexOf(newCodeSample) === -1) {
            this.codeSamples.push(newCodeSample);
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

    getCodeSampleWithTitle(title: string) {
        for (var currSample of this.codeSamples) {
            if (currSample.getTitle() === title) {
                return currSample;
            }
        }
        return null;
    }
}

export default SoftwareRepo;