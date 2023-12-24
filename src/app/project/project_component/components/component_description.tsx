import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";

class ComponentDescription extends ProjectComponent {
    type: string = "ComponentDescription";

    endGoal: string;
    missionStatement: string;

    constructor(id: string, parentProject: Project, componentName: string, connections: string[], endGoal: string, missionStatement: string) {
        super(id, parentProject, componentName, connections);

        this.endGoal = endGoal;
        this.missionStatement = missionStatement;

        parentProject.addComponent(this);
    }

    toJSON() {
        const initialJson: ProjectComponentToJsonInterface = super.toJSON();
        const finalJson = {
            ...initialJson,
            ...this.getDisplayableContentsJson()
        }
        return finalJson;
    }

    getDisplayableContentsJson() {
        const setupContents = {
            "endGoal": this.endGoal,
            "missionStatement": this.missionStatement
        };

        return setupContents;
    }

    getSetupFileContents() {
        return `echo '${JSON.stringify(this.getDisplayableContentsJson())}' > "${this.componentName}.json"`;
    }

    getDeployFileContents() {
        return "";
    }

    getEndGoal() {
        return this.endGoal;
    }

    setEndGoal(newEndGoal: string) {
        this.endGoal = newEndGoal;
        this.saveToBrowser()
    }

    getMissionStatement() {
        return this.missionStatement;
    }

    setMissionStatement(newMissionStatement: string) {
        this.missionStatement = newMissionStatement;
        this.saveToBrowser()
    }
}

export default ComponentDescription;