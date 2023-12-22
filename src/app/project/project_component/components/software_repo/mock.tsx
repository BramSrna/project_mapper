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

export default Mock;