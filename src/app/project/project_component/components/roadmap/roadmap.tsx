import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import { ControlPosition } from "react-draggable";
import RoadmapEntry from "./roadmap_entry";
import Connection from "../../connection";

class Roadmap extends ProjectComponent {
    type = "Roadmap";

    entries: RoadmapEntry[] = [];

    constructor(id: string, parentProject: Project, componentName: string, connections: Connection[], position: ControlPosition, initEntries: object[]) {
        super(id, parentProject, componentName, connections, position);
        
        this.entries = [];
        for (const currEntry of initEntries) {
            let newEntry = new RoadmapEntry(
                currEntry["id" as keyof typeof currEntry],
                currEntry["isComplete" as keyof typeof currEntry],
                currEntry["content" as keyof typeof currEntry],
                currEntry["blockTargets" as keyof typeof currEntry]
            );
            this.entries.push(newEntry);
        }

        parentProject.addComponent(this);
    }

    toJSON() {
        const entriesAsJson: object[] = [];
        for (const currEntry of this.entries) {
            entriesAsJson.push(currEntry.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "entries": entriesAsJson
        }
        return finalJson;
    }

    getSetupFileContents() {    
        return "";
    }

    getDeployFileContents() {
        return "";
    }

    getNextComponent() {
        for (var entry of this.entries) {
            if (!entry.getIsComplete()) {
                return entry;
            }
        }

        return null;
    }

    getEntries() {
        return this.entries;
    }

    addEntry(newEntry: RoadmapEntry) {
        let checkIndex: number = this.entries.indexOf(newEntry); 
        if (checkIndex === -1) {
            this.entries.push(newEntry);
            this.saveToBrowser();
            return newEntry;
        } else {
            return this.entries[checkIndex];
        }
    }

    deleteEntry(entryIdToDelete: string) {
        let indexToDelete: number = -1;
        for (let i: number = 0; i < this.entries.length; i++) {
            if (this.entries[i].getId() === entryIdToDelete) {
                indexToDelete = i;
            }
        }
        if (indexToDelete !== -1) {
            this.entries.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    getEntryWithId(id: string) {
        for (var roadmapEntry of this.entries) {
            if (roadmapEntry.getId() === id) {
                return roadmapEntry;
            }
        }
        return null;
    }

    deleteBlockTarget(blocker: RoadmapEntry, blockTargetId: string) {
        let index: number = this.entries.indexOf(blocker);
        if (index !== -1) {
            let targetDeleted: boolean = this.entries[index].deleteBlockTarget(blockTargetId);
            if (targetDeleted) {
                this.saveToBrowser();
            }
        }
    }

    addBlockTarget(blockerId: string, blockTargetId: string) {
        for (var currEntry of this.entries) {
            if (currEntry.getId() === blockerId) {
                let addedTarget: boolean = currEntry.addBlockTarget(blockTargetId);
                if (addedTarget) {
                    this.saveToBrowser();
                }
                return null;
            }
        }
    }
}

export default Roadmap;