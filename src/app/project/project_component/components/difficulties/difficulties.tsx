import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import DifficultyEntry from "./difficulty_entry";

class Difficulties extends ProjectComponent {
    type: string = "Difficulties";

    difficulties: DifficultyEntry[];

    constructor(id: string, parentProject: Project, componentName: string, connections: string[], difficulties: object[]) {
        super(id, parentProject, componentName, connections);

        this.difficulties = [];
        for (const currDifficulty of difficulties) {
            const newEntry: DifficultyEntry = new DifficultyEntry(
                this,
                currDifficulty["description" as keyof typeof currDifficulty],
                currDifficulty["possibleSolutions" as keyof typeof currDifficulty]
            );
            this.difficulties.push(newEntry);
        }

        parentProject.addComponent(this);
    }

    toJSON() {
        const difficultiesAsJson: object[] = [];
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
}

export default Difficulties;