'use client';

import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import Project from "./project/project";
import Modal from 'react-modal';
import ComponentDescription from './project/project_component/components/component_description';
import EditorCanvas from './editor_canvas';

// Modal.setAppElement(".root");

const Page = () => {
    const [mainMenuDropdownVisible, setMainMenuDropdownVisible] = useState(false);
    const [initProjWizardIsOpen, setInitProjWizardIsOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project>(new Project());
    const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);

    useEffect(() => {
        reloadLocalStorage();
    }, []);

    function reloadLocalStorage() {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        let projects: Project[] = [];
        if (storedProjIds !== null) {
            let projIds: string[] = JSON.parse(storedProjIds);

            for (var currId of projIds) {
                const project = localStorage.getItem(currId);
        
                if (project !== null) {
                    const newProj: Project = new Project(currId, project);
                    projects.push(newProj);
                }
            }
        }
        setLoadedProjects(projects);

        const projectToEditId = localStorage.getItem("projectToEditId");
        if ((projectToEditId === null) && (storedProjIds !== null) && (storedProjIds.length > 0)) {
            projectToEditId === storedProjIds[0];
        }

        if (projectToEditId !== null) {
            const loadedProjectInfo = localStorage.getItem(projectToEditId);
            if (loadedProjectInfo !== null) {
                const newProj: Project = new Project(projectToEditId, loadedProjectInfo);
                setProjectToEdit(newProj);
            }
        } else {
            projectToEdit.setProjectName("New Project");
            localStorage.setItem("projectToEditId", projectToEdit.getProjectId())
        }
    }

    function closeInitProjWizard() {
        setInitProjWizardIsOpen(false);
    }

    function toggleMainMenuDropdown() {
        let newVal: boolean = !mainMenuDropdownVisible;
        if (newVal) {
            reloadLocalStorage();
        }
        setMainMenuDropdownVisible(newVal);
    }

    function initWizardOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const newProj: Project = new Project();
        if (formData.has("projectType")) {
            const projectType = formData.get("projectType");
            if ((projectType !== null) && (projectType !== "None")) {
                new ComponentDescription(newProj, "Component Description", [], {x: 0, y: 0}, "", projectType.toString(), "", "");
            }
        }
        newProj.saveToBrowser();
        newProj.setProjectName("New Project");
        localStorage.setItem("projectToEditId", newProj.getProjectId());
        setProjectToEdit(newProj);
        setLoadedProjects([
            ...loadedProjects,
            newProj
        ]);
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
                const newProject: Project = new Project(undefined, target.result.toString());
                newProject.saveToBrowser();
                localStorage.setItem("projectToEditId", newProject.getProjectId());
                setProjectToEdit(newProject);
                setLoadedProjects([
                    ...loadedProjects,
                    newProject
                ])
            }
        };
        fileReader.readAsText(file);
    }
    
    function saveProjectOnClickHandler() {
        projectToEdit.downloadProjectAsJson();
    }

    function saveSetupFileOnClickHandler() {
        projectToEdit.downloadSetupFile();
    }

    function saveDeployFileOnClickHandler() {
        projectToEdit.downloadDeployFile();
    }

    function changeLoadedProjectMenuOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if (formData.has("action")) {
            const action = formData.get("action");
            switch (action) {
                case "Load Project": {
                    let newProj: Project = new Project(undefined, "{}");
                    if (formData.has("projectId")) {
                        const projId = formData.get("projectId");
            
                        if (projId !== null){
                            const project = localStorage.getItem(projId.toString());
                    
                            if (project !== null) {
                                newProj = new Project(projId.toString(), project);
                            }
                        }
                    }
                    localStorage.setItem("projectToEditId", newProj.getProjectId());
                    setProjectToEdit(newProj)
                    break;
                }
                case "Close Project": {
                    if (formData.has("projectId")) {
                        const projId = formData.get("projectId");
            
                        if (projId !== null) {
                            let storedProjIds = localStorage.getItem("loadedProjectIds");
                            let parsedIds = [];
                            if (storedProjIds !== null) {
                                parsedIds = JSON.parse(storedProjIds);
                                let index = parsedIds.indexOf(projId.toString());
                                if (index > -1) {
                                    parsedIds.splice(index, 1);
                                    localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
                                }
                            }
                            localStorage.removeItem(projId.toString());
                            setLoadedProjects(loadedProjects.filter(function(project) {
                                return (project.getProjectId() !== projId);
                            }));

                            if (projectToEdit.getProjectId() === projId) {
                                let newProj: Project = new Project(undefined, "{}");

                                if (parsedIds.length > 0) {
                                    const project = localStorage.getItem(parsedIds[0].toString());
                            
                                    if (project !== null) {
                                        newProj = new Project(parsedIds[0].toString(), project);
                                    }
                                } else {
                                    newProj.setProjectName("New Project");
                                    setLoadedProjects([
                                        ...loadedProjects,
                                        newProj
                                    ]);
                                }

                                localStorage.setItem("projectToEditId", newProj.getProjectId());
                                setProjectToEdit(newProj)
                            }
                        }
                    }
                    break;
                }
                default: {
                    throw (`unknown action ${action}`);
                }
            }
        }
        event.preventDefault();
    }

    return (
        <div
            className="project-mapper-container"
            style={{
                height: "100vh"
            }}
        >
            <div className="dropdown-menu">
                <button onClick={toggleMainMenuDropdown}>Main Menu</button>
                {
                    mainMenuDropdownVisible && (
                        <div className="dropdown-content">
                            <div className="loaded-projects-menu">
                                <form onSubmit={changeLoadedProjectMenuOnSubmitHandler}>
                                    <select name="projectId" defaultValue={projectToEdit.getProjectId()}>
                                        {
                                            loadedProjects.map(function(currProject: Project) {
                                                return(
                                                    <option
                                                        key={currProject.getProjectId()}
                                                        value={currProject.getProjectId()}
                                                    >
                                                        {currProject.getProjectName()}
                                                    </option>
                                                );
                                            })
                                        }
                                    </select>
                                    <select name="action">
                                        <option value="Load Project">Load Project</option>
                                        <option value="Close Project">Close Project</option>
                                    </select>
                                    <button type="submit">Execute Action</button>
                                </form>
                            </div>

                            <div className="dropdown-content">
                                <button onClick={initProjectOnClickHandler}>Initialize new project...</button>
                                <input type="file" accept=".json" onChange={handleProjectImport}/>
                                <button onClick={saveProjectOnClickHandler}>Save Project</button>
                                <button onClick={saveSetupFileOnClickHandler}>Save Setup File</button>
                                <button onClick={saveDeployFileOnClickHandler}>Save Deploy File</button>
                            </div>
                        </div>
                    )
                }
            </div>

            <div
                className="project-editor-container"
                style={{
                    height: "80vh"
                }}
                onClick={e => setMainMenuDropdownVisible(false)}
            >
                <EditorCanvas projectToEdit={projectToEdit}></EditorCanvas>
            </div>

            <div className="init-proj-wizard" onClick={e => setMainMenuDropdownVisible(false)}>
                <Modal
                    style={{overlay: {zIndex: 1000}}}
                    isOpen={initProjWizardIsOpen}
                    onRequestClose={closeInitProjWizard}
                >
                    <div>Project Initialization Wizard</div>
                    <form onSubmit={initWizardOnSubmitHandler}>
                        <select name="projectType" id="template">
                            <option value="None">None</option>
                            <option value="Website">Website</option>
                            <option value="Robotics">Robotics</option>
                        </select>
                        <button type="submit">Close Wizard And Go To Editor</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Page;
