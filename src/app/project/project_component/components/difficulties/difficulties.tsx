import ProjectComponent, { ProjectComponentToJsonInterface } from "../../project_component";
import Project from "../../../project";
import { ControlPosition } from "react-draggable";
import DifficultyEntry from "./difficulty_entry";
import Connection from "../../connection";

class Difficulties extends ProjectComponent {
    type = "Difficulties";

    difficulties: DifficultyEntry[] = [];

    constructor(id: string, parentProject: Project, componentName: string, connections: Connection[], position: ControlPosition, difficulties: object[]) {
        super(id, parentProject, componentName, connections, position);

        this.difficulties = [];
        for (const currDifficulty of difficulties) {
            this.difficulties.push(new DifficultyEntry(currDifficulty["description" as keyof typeof currDifficulty], currDifficulty["possibleSolutions" as keyof typeof currDifficulty]));
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

    deletePossibleSolution(difficultyIndex: number, possibleSolutionIndex: number) {
        if ((difficultyIndex >= 0) || (difficultyIndex < this.difficulties.length)) {
            this.difficulties[difficultyIndex].deletePossibleSolution(possibleSolutionIndex);
            this.saveToBrowser();
        }
    }

    setDifficultyDescription(index: number, newDescription: string) {
        if ((index >= 0) || (index < this.difficulties.length)) {
            this.difficulties[index].setDescription(newDescription);
            this.saveToBrowser();
        }
    }

    setPossibleSolution(difficultyIndex: number, possibleSolutionIndex: number, newPossibleSolution: string) {
        if ((difficultyIndex >= 0) || (difficultyIndex < this.difficulties.length)) {
            this.difficulties[difficultyIndex].setPossibleSolution(possibleSolutionIndex, newPossibleSolution);
            this.saveToBrowser();
        }
    }

    addDifficulty() {
        this.difficulties.push(new DifficultyEntry("", []));
        this.saveToBrowser();
    }

    deleteDifficulty(index: number) {
        if ((index >= 0) || (index < this.difficulties.length)) {
            this.difficulties.splice(index, 1);
            this.saveToBrowser();
        }
    }

    addPossibleSolution(index: number) {
        if ((index >= 0) || (index < this.difficulties.length)) {
            this.difficulties[index].addPossibleSolution("");
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
        for (var currDifficulty of this.difficulties) {
            currLineContent = "|";
            currLineContent += currDifficulty.getDescription();
            currLineContent += "|";
            for (var currSolution of currDifficulty.getPossibleSolutions()) {
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