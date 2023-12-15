import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import Project from "./project";
import { ControlPosition } from "react-draggable";
import TodoTile from "../tiles/todo_tile";

class TodoItem {
    itemDescription: string = "";
    isComplete: boolean = false;

    constructor(itemDescription: string, isComplete: boolean) {
        this.itemDescription = itemDescription;
        this.isComplete = isComplete;
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
    }

    setIsComplete(newValue: boolean) {
        this.isComplete = newValue;
    }
}

class Todo extends ProjectComponent {
    type = "Todo";
    items: TodoItem[] = [];

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, items: object[]) {
        super(parentProject, componentName, connections, position);

        this.items = [];
        for (const currItem of items) {
            this.items.push(new TodoItem(currItem["description" as keyof typeof currItem], currItem["isComplete" as keyof typeof currItem]));
        }

        parentProject.addComponent(this);
    }

    getItems() {
        return this.items;
    }

    setItemDescription(index: number, newDescription: string) {
        if ((index >= 0) && (index < this.items.length)) {
            this.items[index].setItemDescription(newDescription);
            this.saveToBrowser();
        }
    }

    setIsComplete(index: number, newStatus: boolean) {
        if ((index >= 0) && (index < this.items.length)) {
            this.items[index].setIsComplete(newStatus);
            this.saveToBrowser();
        }
    }

    deleteItem(index: number) {
        if ((index >= 0) && (index < this.items.length)) {
            this.items.splice(index, 1);
            this.saveToBrowser();
        }
    }

    addItem() {
        this.items.push(new TodoItem("", false));
        this.saveToBrowser();
    }

    toJSON() {
        const itemsAsJson: object[] = [];
        for (const currItem of this.items) {
            itemsAsJson.push(currItem.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "items": itemsAsJson
        }
        return finalJson;
    }

    getSetupFileContents() {
        let content: string = "";
        for (let i: number = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item.getIsComplete()) {
                content += `- ${item.getItemDescription()}`;
            } else {
                content += `- ~~${item.getItemDescription()}~~`;
            }
            if (i < this.items.length - 1) {
                content += "\n";
            }
        }
        return `echo "${content}" > "${this.componentName}.md"`;
    }

    getDeployFileContents() {
        return "";
    }
}

export default Todo;