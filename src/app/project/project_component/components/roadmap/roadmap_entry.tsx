import ProjectComponent from "../../project_component";
import Roadmap from "./roadmap";

class RoadmapEntry {
    parentComponet: Roadmap;
    id: string;
    title: string;
    isComplete: boolean;
    description: string;
    blockers: string[];

    constructor(parentComponet: ProjectComponent, id: string, title: string, isComplete: boolean, description: string, blockers: string[]) {
        this.parentComponet = parentComponet as Roadmap;
        this.id = id;
        this.title = title;
        this.isComplete = isComplete;
        this.description = description;
        this.blockers = blockers;
    }

    saveToBrowser() {
        this.parentComponet.saveToBrowser();
    }

    toJSON() {
        return {
            "id": this.id,
            "title": this.title,
            "isComplete": this.isComplete,
            "description": this.description,
            "blockers": this.blockers
        }
    }

    setTitle(newTitle: string) {
        this.title = newTitle;
        this.saveToBrowser();
    }

    getTitle() {
        return this.title;
    }

    getIsComplete() {
        return this.isComplete;
    }

    getDescription() {
        return this.description;
    }

    setDescription(newDescription: string) {
        this.description = newDescription;
        this.saveToBrowser();
    }

    setIsComplete(newIsComplete: boolean) {
        this.isComplete = newIsComplete;
        this.saveToBrowser();
    }

    getId() {
        return this.id;
    }
    
    getBlockers() {
        return this.blockers;
    }

    deleteBlocker(idToDelete: string) {
        let index: number = this.blockers.indexOf(idToDelete);
        if (index !== -1) {
            this.blockers.splice(index, 1);
            this.saveToBrowser();
            return true;
        }
        return false;
    }

    addBlocker(newId: string) {
        if (this.blockers.indexOf(newId) === -1) {
            this.blockers.push(newId);
            this.saveToBrowser();
            return true;
        }
        return false;
    }

    deleteEntry() {
        this.parentComponet.deleteEntry(this.id);
    }
}

export default RoadmapEntry;