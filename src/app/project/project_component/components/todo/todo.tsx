import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import TodoItem from "./todo_item";

class Todo extends ProjectComponent {
    type: string = "Todo";
    items: TodoItem[];

    constructor(id: string, parentProject: Project, componentName: string, connections: string[], items: object[]) {
        super(id, parentProject, componentName, connections);

        this.items = [];
        for (const currItem of items) {
            this.items.push(new TodoItem(this, currItem["description" as keyof typeof currItem], currItem["isComplete" as keyof typeof currItem]));
        }

        parentProject.addComponent(this);
    }

    getItems() {
        return this.items;
    }

    deleteItem(itemToDelete: TodoItem) {
        const indexToDelete: number = this.items.indexOf(itemToDelete);
        if (indexToDelete !== -1) {
            this.items.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    addItem(newItem: TodoItem) {
        if (this.items.indexOf(newItem) === -1) {
            this.items.push(newItem);
            this.saveToBrowser();
        }
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
            const item = this.items[i];
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