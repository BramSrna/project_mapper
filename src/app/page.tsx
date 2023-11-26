'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Project from "./project_components/project";
import Modal from 'react-modal';
import ProjectEditor from "./project_editor";
import ProjectDescription from './project_components/project_description';
import DocumentationSection from './project_components/documentation_section';
import SoftwareRepo from './project_components/software_repo';

Modal.setAppElement(".root");

const Page = () => {
    const [fileDropdownVisible, setFileDropdownVisible] = useState(false);
    const [initProjWizardIsOpen, setInitProjWizardIsOpen] = useState(false);
    const [loadedProject, setLoadedProject] = useState(new Project());

    useEffect(() => {
        const savedProject = localStorage.getItem("loadedProject");

        if (savedProject !== null) {
            const newProj: Project = new Project(savedProject);
            setLoadedProject(newProj);
        }
      }, []);

    function closeInitProjWizard() {
        setInitProjWizardIsOpen(false);
    }

    function toggleFileDropdown() {
        setFileDropdownVisible(!fileDropdownVisible);
    }

    function initWizardOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const newProj: Project = new Project();
        if (formData.has("projectType")) {
            const projectType = formData.get("projectType");
            if ((projectType !== null) && (projectType !== "None")) {
                new ProjectDescription(newProj, "Project Description", [], "", projectType.toString(), "", "", "");
            }
        }
        newProj.saveToBrowser();
        setLoadedProject(newProj);
        closeInitProjWizard();
    }

    function initProjectOnClickHandler() {
        setInitProjWizardIsOpen(true);
    }

    function handleProjectImport(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null) {
            throw new Error("Error: No file found.");
        }

        const file: File = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = function(event) {
            const target = event.target;
            if ((target !== null) && (target.result !== null)) {
                const newProject: Project = new Project(target.result.toString());
                newProject.saveToBrowser();
                setLoadedProject(newProject);
            }
        };
        fileReader.readAsText(file);
    }

    function addTileOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if (formData.has("tileType")) {
            const tileType = formData.get("tileType");
            switch (tileType) {
                case "Project Description":
                    new ProjectDescription(loadedProject, "Project Description", [], "", "", "", "", "");
                    break;
                case "Documentation Box":
                    new DocumentationSection(loadedProject, "Documentation Section", [], "");
                    break;
                case "Software Repo":
                    // SoftwareRepo will be used to test implementation feature (i.e. Users clicks on repo component, open modal, can hit "implement")
                    new SoftwareRepo(loadedProject, "Software Repo", [], true, "", "");
                    break;
                default:
                    throw new Error("Unknown tile type: " + tileType);
            }
        }
    }
    
    function saveProjectOnClickHandler() {
        loadedProject.downloadProjectAsJson();
    }

    function saveExecutionFileOnClickHandler() {
        loadedProject.downloadExecutionFile();
    }

    function addDependencyOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const rootName: string = formData.get("rootSelector")!.toString();
        const targetName: string = formData.get("targetSelector")!.toString();

        if (rootName === targetName) {
            return false;
        }

        const rootComponent = loadedProject.getComponentWithName(rootName);
        const targetComponent = loadedProject.getComponentWithName(targetName);

        if ((rootComponent !== null) && (targetComponent !== null)) {
            rootComponent.addConnection(targetComponent);
        }
    }

    return (
        <div className="root">
            <div className="dropdown-menu">
                <button onClick={toggleFileDropdown}>File</button>
                {
                    fileDropdownVisible && (
                        <div className="dropdown-content">
                            <button onClick={initProjectOnClickHandler}>Initialize new project...</button>
                            <input type="file" accept=".json" onChange={handleProjectImport}/>
                            <button onClick={saveProjectOnClickHandler}>Save Project</button>
                            <button onClick={saveExecutionFileOnClickHandler}>Save Execution File</button>
                        </div>
                    )
                }
            </div>

            <div className="tile-menu">
                <form onSubmit={addTileOnSubmitHandler}>
                    <select name="tileType">
                        <option value="Project Description">Project Description</option>
                        <option value="Documentation Box">Documentation Box</option>
                        <option value="Software Repo">Software Repo</option>
                    </select>
                    <button type="submit">Add Tile</button>
                </form>
            </div>

            <div className="dependency-menu">
                <form onSubmit={addDependencyOnSubmitHandler}>
                    <select name="rootSelector">
                        {loadedProject.getComponentNames().map((compName: string, index) => <option value={compName} key={index}>{compName}</option>)}
                    </select>
                    <select name="connectionType">
                        <option value="Uses">Uses</option>
                    </select>
                    <select name="targetSelector">
                        {loadedProject.getComponentNames().map((compName: string, index) => <option value={compName} key={index}>{compName}</option>)}
                    </select>
                    <button type="submit">Add Dependency</button>
                </form>
            </div>

            <div>
                <ProjectEditor projectToEdit={loadedProject}></ProjectEditor>
            </div>

            <div className="init-proj-wizard">
                <Modal
                    isOpen={initProjWizardIsOpen}
                    onRequestClose={closeInitProjWizard}
                >
                    <div>Project Initialization Wizard</div>
                    <form onSubmit={initWizardOnSubmitHandler}>
                        <select name="projectType" id="template">
                            <option value="None">None</option>
                            <option value="Website">Website</option>
                        </select>
                        <button type="submit">Close Wizard And Go To Editor</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Page;