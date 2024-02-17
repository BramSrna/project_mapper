import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import DifficultyEntry, { DifficultyEntryJsonInterface } from "./difficulty_entry";
import ProjectComponentConnection from "@/app/project/project_component_connection";
import NestedComponent from "../nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface DifficultiesJsonInterface extends ProjectComponentToJsonInterface {
    "difficulties": DifficultyEntryJsonInterface[]
}

class Difficulties extends ProjectComponent {
    type: string = "Difficulties";

    difficulties: DifficultyEntry[];

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, difficulties: DifficultyEntry[]) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

        this.difficulties = difficulties;
        for (const currDifficulty of this.difficulties) {
            currDifficulty.setParentComponent(this);
        }
    }

    toJSON() {
        const difficultiesAsJson: DifficultyEntryJsonInterface[] = [];
        for (const currDifficulty of this.difficulties) {
            difficultiesAsJson.push(currDifficulty.toJSON());
        }
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            "difficulties": difficultiesAsJson
        }
        return finalJson;
    }

    getDifficulties() {
        return this.difficulties;
    }

    addDifficulty(newDifficulty: DifficultyEntry) {
        if (this.difficulties.indexOf(newDifficulty) === -1) {
            this.difficulties.push(newDifficulty);
            this.saveToBrowser();
        }
    }

    deleteDifficulty(difficultyToDelete: DifficultyEntry) {
        const indexToDelete: number = this.difficulties.indexOf(difficultyToDelete);
        if (indexToDelete !== -1) {
            this.difficulties.splice(indexToDelete, 1);
            this.saveToBrowser();
        }
    }

    getSetupFileContents() {
        if (this.difficulties.length <= 0) {
            return "";
        }

        let content: string = `Write-Output "|Difficulty|Potential Solution(s)|" > "${this.componentName}.md"\n`;
        content += `Write-Output "|:---|:---|" >> "${this.componentName}.md"\n`

        let currLineContent: string;
        let solutionIndex: number;
        let currSolutionDescription: string;
        for (const currDifficulty of this.difficulties) {
            solutionIndex = 0;
            while (solutionIndex < currDifficulty.getPossibleSolutions().length) {
                currSolutionDescription = currDifficulty.getPossibleSolutions()[solutionIndex].getDescription();
                currLineContent = "|";
                if (solutionIndex === 0) {
                    currLineContent += currDifficulty.getDescription();
                }
                currLineContent += "|";
                currLineContent += currSolutionDescription;
                currLineContent += "|";
                content += `\nWrite-Output "${currLineContent}" >> "${this.componentName}.md"`;
                solutionIndex += 1;
            }
        }

        return content;
    }

    getDeployFileContents() {
        return "";
    }

    getEntryWithId(id: string) {
        for (var currEntry of this.difficulties) {
            if (currEntry.getId() === id) {
                return currEntry;
            }
        }
        return null;
    }

    toInputParagraph() {
        let paragraph: string = "";
        for (var currDifficulty of this.difficulties) {
            paragraph += currDifficulty.getDescription().trim();
            if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
                paragraph += ". ";
            }
            for (var currPossibleSolution of currDifficulty.getPossibleSolutions()) {
                paragraph += currPossibleSolution.getDescription().trim();
                if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
                    paragraph += ".";
                }
            }
        }
        return paragraph.trim();
    }

    getComponentSpecificJson() {
        const difficultiesAsJson: DifficultyEntryJsonInterface[] = [];
        for (const currDifficulty of this.difficulties) {
            difficultiesAsJson.push(currDifficulty.toJSON());
        }
        const finalJson = {
            "difficulties": difficultiesAsJson
        }
        return finalJson;
    }
}

export default Difficulties;