import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import RoadmapEntry from "./roadmap_entry";

class Roadmap extends ProjectComponent {
    type: string = "Roadmap";

    entries: RoadmapEntry[];

    constructor(id: string, parentProject: Project, componentName: string, connections: string[], initEntries: object[]) {
        super(id, parentProject, componentName, connections);
        
        this.entries = [];
        for (const currEntry of initEntries) {
            let newEntry = new RoadmapEntry(
                this,
                currEntry["id" as keyof typeof currEntry],
                currEntry["title" as keyof typeof currEntry],
                currEntry["isComplete" as keyof typeof currEntry],
                currEntry["description" as keyof typeof currEntry],
                currEntry["blockers" as keyof typeof currEntry]
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
}

export default Roadmap;