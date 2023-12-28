import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";
import PossibleSolution from "./possible_solution";

class DifficultyEntry {
    id: string;
    parentComponent: ProjectComponent;
    description: string;
    possibleSolutions: PossibleSolution[];

    constructor(parentComponent: ProjectComponent, description: string, possibleSolutions: object[]) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.description = description;
        this.possibleSolutions = [];
        for (const currPossibleSolution of possibleSolutions) {
            this.possibleSolutions.push(new PossibleSolution(this, currPossibleSolution["description" as keyof typeof currPossibleSolution]));
        }
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
    }

    toJSON() {
        const possibleSolutionsAsJson: object[] = [];
        for (const currPossibleSolution of this.possibleSolutions) {
            possibleSolutionsAsJson.push(currPossibleSolution.toJSON());
        }
        return {
            "description": this.description,
            "possibleSolutions": possibleSolutionsAsJson
        }
    }

    deletePossibleSolution(possibleSolutionToDelete: PossibleSolution) {
        const indexToDelete: number = this.possibleSolutions.indexOf(possibleSolutionToDelete);
        if (indexToDelete !== -1) {
            this.possibleSolutions.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }
    
    addPossibleSolution(newPossibleSolution: PossibleSolution) {
        if (this.possibleSolutions.indexOf(newPossibleSolution) === -1) {
            this.possibleSolutions.push(newPossibleSolution);
            this.saveToBrowser();
        }
    }

    getDescription() {
        return this.description;
    }

    getPossibleSolutions() {
        return this.possibleSolutions;
    }

    setDescription(newDescription: string) {
        this.description = newDescription;
        this.saveToBrowser();
    }
}

export default DifficultyEntry;