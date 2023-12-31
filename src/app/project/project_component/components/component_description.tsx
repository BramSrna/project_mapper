import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import NestedComponent from "./nested_component";

export interface ComponentDescriptionJsonInterface extends ProjectComponentToJsonInterface {
    "endGoal": string,
    "missionStatement": string
}

class ComponentDescription extends ProjectComponent {
    type: string = "ComponentDescription";

    endGoal: string;
    missionStatement: string;

    constructor(id: string, parent: NestedComponent, componentName: string, connections: ProjectComponentConnection[], endGoal: string, missionStatement: string) {
        super(id, parent, componentName, connections);

        this.endGoal = endGoal;
        this.missionStatement = missionStatement;
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