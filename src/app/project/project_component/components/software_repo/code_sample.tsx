import IdGenerator from "@/app/id_generator";
import ProjectComponent from "../../project_component";
import SoftwareRepo from "./software_repo";

export interface CodeSamplesJsonInterface {
    "title": string,
    "language": string,
    "codeBlock": string
}

class CodeSample {
    id: string;

    parentComponent: SoftwareRepo;
    title: string;
    language: string;
    codeBlock: string;

    constructor(parentComponent: SoftwareRepo, title: string, language: string, codeBlock: string) {
        this.id = IdGenerator.generateId();

        this.parentComponent = parentComponent;
        this.title = title;
        this.language = language;
        this.codeBlock = codeBlock;
    }

    getTitle() {
        return this.title;
    }

    setTitle(newTitle: string) {
        this.title = newTitle;
        this.saveToBrowser();
    }

    setParentComponent(newParentComponent: SoftwareRepo) {
        this.parentComponent = newParentComponent;
        this.saveToBrowser();
    }

    getId() {
        return this.id;
    }

    saveToBrowser() {
        this.parentComponent.saveToBrowser();
    }

    getCodeBlock() {
        return this.codeBlock;
    }

    setCodeBlock(newCodeBlock: string) {
        this.codeBlock = newCodeBlock;
        this.saveToBrowser();
    }

    getLanguage() {
        return this.language;
    }

    setLanguage(newLanguage: string) {
        this.language = newLanguage;
        this.saveToBrowser();
    }

    toJSON(): CodeSamplesJsonInterface {
        return {
            "title": this.title,
            "language": this.language,
            "codeBlock": this.codeBlock
        }
    }
}

export default CodeSample;