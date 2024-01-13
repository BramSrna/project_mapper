import IdGenerator from "../id_generator";

export interface ProjectComponentConnectionJsonInterface {
    "startId": string,
    "endId": string,
    "type": string
}

class ProjectComponentConnection {
    id: string;
    startId: string;
    endId: string;
    type: string;

    constructor(startId: string, endId: string, type: string) {
        this.id = IdGenerator.generateId();
        this.startId = startId;
        this.endId = endId;
        this.type = type;
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getStartId() {
        return this.startId;
    }

    getEndId() {
        return this.endId;
    }

    toJSON() {
        return {
            "startId": this.startId,
            "endId": this.endId,
            "type": this.type
        }
    }
}

export default ProjectComponentConnection