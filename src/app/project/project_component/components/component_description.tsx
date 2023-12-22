import ProjectComponent, { ProjectComponentToJsonInterface } from "../project_component";
import Project from "../../project";
import { ControlPosition } from "react-draggable";
import Connection from "../connection";

class ComponentDescription extends ProjectComponent {
    type = "ComponentDescription";

    name: string;
    componentType: string;
    endGoal: string;
    missionStatement: string;

    constructor(id: string, parentProject: Project, componentName: string, connections: Connection[], position: ControlPosition, name: string, componentType: string, endGoal: string, missionStatement: string) {
        super(id, parentProject, componentName, connections, position);

        this.name = name;
        this.componentType = componentType;
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
            "name": this.name,
            "componentType": this.componentType,
            "endGoal": this.endGoal,
            "missionStatement": this.missionStatement
        };

        return setupContents;
    }

    getName() {
        return this.name;
    }

    getComponentType() {
        return this.componentType;
    }

    setName(newname: string) {
        this.name = newname;
        this.saveToBrowser()
    }

    setComponentType(newcomponentType: string) {
        this.componentType = newcomponentType;
        this.saveToBrowser()
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