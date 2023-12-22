class RoadmapEntry {
    isComplete: boolean;
    content: string;
    id: string;
    blockTargets: string[];

    constructor(id: string, isComplete: boolean, content: string, blockTargets: string[]) {
        this.id = id;
        this.isComplete = isComplete;
        this.content = content;
        this.blockTargets = blockTargets;
    }

    toJSON() {
        return {
            "id": this.id,
            "isComplete": this.isComplete,
            "content": this.content,
            "blockTargets": this.blockTargets
        }
    }

    getIsComplete() {
        return this.isComplete;
    }

    getContent() {
        return this.content;
    }

    setContent(newContent: string) {
        this.content = newContent;
    }

    setIsComplete(newIsComplete: boolean) {
        this.isComplete = newIsComplete;
    }

    getId() {
        return this.id;
    }
    
    getBlockTargets() {
        return this.blockTargets;
    }

    deleteBlockTarget(idToDelete: string) {
        let index: number = this.blockTargets.indexOf(idToDelete);
        if (index !== -1) {
            this.blockTargets.splice(index, 1);
            return true;
        }
        return false;
    }

    addBlockTarget(newId: string) {
        if (this.blockTargets.indexOf(newId) === -1) {
            this.blockTargets.push(newId);
            return true;
        }
        return false;
    }
}

export default RoadmapEntry;