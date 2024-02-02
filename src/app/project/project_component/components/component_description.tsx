import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import ProjectComponentConnection from "../../project_component_connection";
import NestedComponent from "./nested_component";
import SimulatorAppearance from "@/app/component_editor/simulator/simulator_appearance";

export interface ComponentDescriptionJsonInterface extends ProjectComponentToJsonInterface {
    "endGoal": string,
    "missionStatement": string
}

class ComponentDescription extends ProjectComponent {
    type: string = "ComponentDescription";

    endGoal: string;
    missionStatement: string;

    constructor(id: string, parent: NestedComponent | Project, componentName: string, connections: ProjectComponentConnection[], simulatorBehaviour: string, simulatorAppearance: SimulatorAppearance, endGoal: string, missionStatement: string) {
        super(id, parent, componentName, connections, simulatorBehaviour, simulatorAppearance);

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

    toInputParagraph() {
        let paragraph: string = "";
        paragraph += this.endGoal.trim();
        if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
            paragraph += ". ";
        }
        paragraph += this.missionStatement.trim();
        if ((paragraph.length > 0) && (paragraph[paragraph.length - 1] !== ".")) {
            paragraph += ".";
        }
        return paragraph.trim();
    }

    getComponentSpecificJson() {
        return this.getDisplayableContentsJson();
    }
}

export default ComponentDescription;