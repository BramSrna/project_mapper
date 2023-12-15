import ProjectComponent, { ProjectComponentToJsonInterface } from "./project_component";
import { ReactElement } from "react";
import Project from "./project";
import RoadmapTile from "../tiles/roadmap_tile";
import { ControlPosition } from "react-draggable";

class Roadmap extends ProjectComponent {
    type = "Roadmap";

    internallyDefined: boolean = true;
    linkToRoadmap: string = "";
    entries: string[][] = [[]];
    roadmapHeaders: string[] = [""];

    constructor(parentProject: Project, componentName: string, connections: Array<string>, position: ControlPosition, internallyDefined: boolean, linkToRoadmap: string, roadmapHeaders: [], entries: string[][]) {
        super(parentProject, componentName, connections, position);

        this.internallyDefined = internallyDefined;
        this.linkToRoadmap = linkToRoadmap;
        this.roadmapHeaders = roadmapHeaders;
        this.entries = entries;

        if (this.roadmapHeaders.length === 0) {
            this.roadmapHeaders.push("");
        }

        parentProject.addComponent(this);
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "internallyDefined": this.internallyDefined,
            "linkToRoadmap": this.linkToRoadmap,
            "roadmapHeaders": this.roadmapHeaders,
            "entries": this.entries
        }
        return finalJson;
    }

    getInternallyDefined() {
        return this.internallyDefined;
    }

    setInternallyDefined(newValue: boolean) {
        this.internallyDefined = newValue;
        this.saveToBrowser();
    }

    getLinkToRoadmap() {
        return this.linkToRoadmap;
    }

    setRoadmapLink(newRoadmapLink: string) {
        this.linkToRoadmap = newRoadmapLink;
        this.saveToBrowser();
    }

    getEntries() {
        return this.entries;
    }

    getRoadmapHeaders() {
        return this.roadmapHeaders;
    }

    setRoadmapHeader(index: number, newValue: string) {
        if (index < this.roadmapHeaders.length) {
            this.roadmapHeaders[index] = newValue;
            this.saveToBrowser();
        }
    }

    setRoadmapEntry(rowIndex: number, columnIndex: number, newValue: string) {
        if (rowIndex < this.entries.length) {
            if (columnIndex < this.entries[rowIndex].length) {
                this.entries[rowIndex][columnIndex] = newValue;
                this.saveToBrowser();
            }
        }
    }

    swapRowEntries(rowIndex1: number, rowIndex2: number) {
        if ((rowIndex1 < this.entries.length) && (rowIndex1 >= 0) && (rowIndex2 < this.entries.length) && (rowIndex2 >= 0)) {
            const temp: string[] = this.entries[rowIndex1];
            this.entries[rowIndex1] = this.entries[rowIndex2];
            this.entries[rowIndex2] = temp;
            this.saveToBrowser();
        }
    }

    deleteEntry(rowIndex: number) {
        if ((rowIndex >= 0) && (rowIndex < this.entries.length)) {
            this.entries.splice(rowIndex, 1);
            this.saveToBrowser();
        }
    }

    addEmptyEntry() {
        if (this.entries.length === 0) {    
            this.entries.push([""]);
        } else {
            const newEntry: string[] = [];
            while (newEntry.length < this.entries[0].length) {
                newEntry.push("");
            }
            this.entries.push(newEntry);
        }
        this.saveToBrowser();
    }

    addEntryColumn() {
        for (let i: number = 0; i < this.entries.length; i++) {
            this.entries[i].push("");
        }
        this.roadmapHeaders.push("");
        this.saveToBrowser();
    }

    deleteEntryColumn(columnIndex: number) {
        if (columnIndex >= 0 && this.roadmapHeaders.length > 1) {
            this.roadmapHeaders.splice(columnIndex, 1);

            for (let i: number = 0; i < this.entries.length; i++) {
                this.entries[i].splice(columnIndex, 1);
            }

            this.saveToBrowser();
        }
    }

    getSetupFileContents() {    
        if (this.internallyDefined) {
            let content: string = "";

            let currLineContent: string = "";
            for (let i: number = 0; i < this.roadmapHeaders.length; i++) {
                if (i === 0) {
                    currLineContent += "|";
                }
                currLineContent += this.roadmapHeaders[i] + "|";
            }
            content += `echo '${currLineContent}' > "${this.componentName}.md"`;

            currLineContent = "";
            for (let i: number = 0; i < this.roadmapHeaders.length; i++) {
                if (i === 0) {
                    currLineContent += "|";
                }
                currLineContent += ":---|";
            }
            content += `\necho '${currLineContent}' >> "${this.componentName}.md"`;

            for (let i: number = 0; i < this.entries.length; i++) {
                currLineContent = "";
                for (let j: number = 0; j < this.entries[i].length; j++) {
                    if (j === 0) {
                        currLineContent += "|";
                    }
                    currLineContent += this.entries[i][j] + "|";
                }
                content += `\necho '${currLineContent}' >> "${this.componentName}.md"`;
            }

            return content;
        } else {
            return `echo 'Roadmap Link: ${this.linkToRoadmap}' > "${this.componentName}.md"`;
        }
    }

    getDeployFileContents() {
        return "";
    }
}

export default Roadmap;