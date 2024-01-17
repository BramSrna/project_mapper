import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";
import PossibleSolution, { PossibleSolutionsJsonInterface } from "./possible_solution";
import Difficulties from "./difficulties";

export interface DifficultyEntryJsonInterface {
    "description": string,
    "possibleSolutions": PossibleSolutionsJsonInterface[]
}

class DifficultyEntry {
    id: string;
    parentComponent: Difficulties;
    description: string;
    possibleSolutions: PossibleSolution[];

    constructor(parentComponent: Difficulties, description: string, possibleSolutions: PossibleSolution[]) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.description = description;
        this.possibleSolutions = possibleSolutions;
        for (const currPossibleSolution of this.possibleSolutions) {
            currPossibleSolution.setParentComponent(this);
        }
    }

    setParentComponent(newParentComponent: Difficulties) {
        this.parentComponent = newParentComponent;
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
    }

    toJSON() {
        const possibleSolutionsAsJson: PossibleSolutionsJsonInterface[] = [];
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

    getPossibleSolutionWithDescription(description: string) {
        for (var currSolution of this.possibleSolutions) {
            if (currSolution.getDescription() === description) {
                return currSolution;
            }
        }
        return null;
    }
}

export default DifficultyEntry;