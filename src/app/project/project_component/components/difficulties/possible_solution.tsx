import IdGenerator from "@/app/id_generator";
import DifficultyEntry from "./difficulty_entry";

export interface PossibleSolutionsJsonInterface {
    "description": string
}

class PossibleSolution {
    id: string;
    parentComponent: DifficultyEntry | null;
    description: string;

    constructor(parentComponent: DifficultyEntry | null, description: string) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.description = description;
    }

    setParentComponent(newParentComponent: DifficultyEntry) {
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

    toJSON() {
        return {
            "description": this.description
        }
    }

    setDescription(newDescription: string) {
        this.description = newDescription;
        this.saveToBrowser();
    }

    getDescription() {
        return this.description;
    }
}

export default PossibleSolution;