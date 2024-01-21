import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import TodoItem, { TodoItemJsonInterface } from "./todo_item";
import ProjectComponentConnection from "@/app/project/project_component_connection";
import NestedComponent from "../nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface TodoJsonInterface extends ProjectComponentToJsonInterface {
    "items": TodoItemJsonInterface[]
}

class Todo extends ProjectComponent {
    type: string = "Todo";
    items: TodoItem[];

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, items: TodoItem[]) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

        this.items = items;
        for (const currItem of this.items) {
            currItem.setParentComponent(this);
        }
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
        const itemsAsJson: TodoItemJsonInterface[] = [];
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

    getItemWithId(id: string) {
        for (var currItem of this.items) {
            if (currItem.getId() === id) {
                return currItem;
            }
        }
        return null;
    }
}

export default Todo;