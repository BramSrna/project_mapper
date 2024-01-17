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

        let content: string = `echo "|Difficulty|Potential Solution(s)|" > "${this.componentName}.md"\n`;
        content += `echo "|:---|:---|" >> "${this.componentName}.md"\n`

        let currLineContent: string;
        for (const currDifficulty of this.difficulties) {
            currLineContent = "|";
            currLineContent += currDifficulty.getDescription();
            currLineContent += "|";
            for (const currSolution of currDifficulty.getPossibleSolutions()) {
                currLineContent += `- ${currSolution}`;
            }
            currLineContent += "|";
            content += `\necho '${currLineContent}' >> "${this.componentName}.md"`;
        }

        return content;
    }

    getDeployFileContents() {
        return "";
    }

    getEntryByDescription(description: string) {
        for (var currEntry of this.difficulties) {
            if (currEntry.getDescription() === description) {
                return currEntry;
            }
        }
        return null;
    }
}

export default Difficulties;