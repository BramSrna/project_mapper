import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";
import SoftwareRepo from "./software_repo";

export interface MockJsonInterface {
    "input": string,
    "output": string
}

class Mock {
    parentComponent: SoftwareRepo | null;
    input: string;
    output: string;
    id: string;

    constructor(parentComponent: SoftwareRepo | null, input: string, output: string) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.input = input;
        this.output = output;
    }

    setParentComponent(newParentComponent: SoftwareRepo) {
        this.parentComponent = newParentComponent;
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        if (this.parentComponent !== null) {
            this.parentComponent.saveToBrowser();
        }
    }

    getInput() {
        return this.input;
    }

    getOutput() {
        return this.output;
    }

    setInput(newInputValue: string) {
        this.input = newInputValue;
        this.saveToBrowser();
    }

    setOutput(newOutputValue: string) {
        this.output = newOutputValue;
        this.saveToBrowser();
    }

    toJSON() {
        return {
            "input": this.input,
            "output": this.output
        }
    }
}

export default Mock;