import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";
import Todo from "./todo";

export interface TodoItemJsonInterface {
    "description": string,
    "isComplete": boolean
}

class TodoItem {
    parentComponent: Todo;
    itemDescription: string;
    isComplete: boolean;
    id: string;

    constructor(parentComponent: Todo, itemDescription: string, isComplete: boolean) {
        this.id = IdGenerator.generateId();
        this.parentComponent = parentComponent;
        this.itemDescription = itemDescription;
        this.isComplete = isComplete;
    }

    setParentComponent(newParentComponent: Todo) {
        this.parentComponent = newParentComponent;
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
    }

    toJSON() {
        return {
            "description": this.itemDescription,
            "isComplete": this.isComplete
        }
    }

    getIsComplete() {
        return this.isComplete;
    }

    getItemDescription() {
        return this.itemDescription;
    }

    setItemDescription(newDescription: string) {
        this.itemDescription = newDescription;
        this.saveToBrowser();
    }

    setIsComplete(newValue: boolean) {
        this.isComplete = newValue;
        this.saveToBrowser();
    }
}

export default TodoItem;