import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";

class Mock {
    parentComponent: ProjectComponent;
    input: string;
    output: string;
    id: string;

    constructor(parentComponent: ProjectComponent, input: string, output: string) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.input = input;
        this.output = output;
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
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