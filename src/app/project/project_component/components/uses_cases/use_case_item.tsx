import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";

class UseCaseItem {
    parentComponet: ProjectComponent;
    description: string;
    id: string;

    constructor(parentComponet: ProjectComponent, description: string) {
        this.id = IdGenerator.generateId();
        this.parentComponet = parentComponet;
        this.description = description;
    }

    saveToBrowser() {
        this.parentComponet.saveToBrowser();
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