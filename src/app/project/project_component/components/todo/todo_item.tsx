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

export default TodoItem;