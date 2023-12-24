import IdGenerator from "@/app/id_generator";
import DifficultyEntry from "./difficulty_entry";

class PossibleSolution {
    id: string;
    parentComponent: DifficultyEntry;
    description: string;

    constructor(parentComponent: DifficultyEntry, description: string) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.description = description;
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
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