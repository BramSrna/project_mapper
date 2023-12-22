class DifficultyEntry {
    description: string = "";
    possibleSolutions: string[] = [];

    constructor(description: string, possibleSolutions: string[]) {
        this.description = description;
        this.possibleSolutions = possibleSolutions;
    }

    toJSON() {
        return {
            "description": this.description,
            "possibleSolutions": this.possibleSolutions
        }
    }

    deletePossibleSolution(index: number) {
        if ((index >= 0) || (index < this.possibleSolutions.length)) {
            this.possibleSolutions.splice(index, 1);
        }
    }
    
    addPossibleSolution(solution: string) {
        this.possibleSolutions.push(solution);
    }

    getDescription() {
        return this.description;
    }

    getPossibleSolutions() {
        return this.possibleSolutions;
    }

    setDescription(newDescription: string) {
        this.description = newDescription;
    }

    setPossibleSolution(possibleSolutionIndex: number, newPossibleSolution: string){
        if ((possibleSolutionIndex >= 0) || (possibleSolutionIndex < this.possibleSolutions.length)) {
            this.possibleSolutions[possibleSolutionIndex] = newPossibleSolution;
        }
    }
}

export default DifficultyEntry;