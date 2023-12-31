import IdGenerator from "@/app/id_generator";
import UseCases from "./use_cases";

export interface UseCaseItemJsonInterface {
    "description": string
}

class UseCaseItem {
    parentComponet: UseCases | null;
    description: string;
    id: string;

    constructor(parentComponet: UseCases | null, description: string) {
        this.id = IdGenerator.generateId();
        this.parentComponet = parentComponet;
        this.description = description;
    }

    setParentComponent(newParentComponent: UseCases) {
        this.parentComponet = newParentComponent;
    }

    saveToBrowser() {
        if (this.parentComponet !== null) {
            this.parentComponet.saveToBrowser();
        }
    }

    toJSON() {
        return {
            "description": this.description
        }
    }

    setDescription(newValue: string) {
        this.description = newValue;
        this.saveToBrowser();
    }

    getDescription() {
        return this.description;
    }

    getId() {
        return this.id;
    }
}

export default UseCaseItem;