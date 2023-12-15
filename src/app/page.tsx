'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Project from "./project_components/project";
import Modal from 'react-modal';
import ProjectEditor from "./project_editor";
import DocumentationSection from './project_components/documentation_section';
import SoftwareRepo from './project_components/software_repo';
import Roadmap from './project_components/roadmap';
import Todo from './project_components/todo';
import UseCases from './project_components/use_cases';
import Difficulties from './project_components/difficulties';
import ComponentDescription from './project_components/component_description';
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";

// Modal.setAppElement(".root");

const Page = () => {
    const [fileDropdownVisible, setFileDropdownVisible] = useState(false);
    const [initProjWizardIsOpen, setInitProjWizardIsOpen] = useState(false);
    const [loadedProject, setLoadedProject] = useState<Project>(new Project());
    const [loadedProjectIds, setLoadedProjectIds] = useState<string[]>([]);

    useEffect(() => {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        let projIds: string[] = [];
        if (storedProjIds !== null) {
            projIds = JSON.parse(storedProjIds);
        }
        setLoadedProjectIds(projIds);

        const loadedProjectId = localStorage.getItem("loadedProjectId");
        if ((loadedProjectId === null) && (storedProjIds !== null) && (storedProjIds.length > 0)) {
            loadedProjectId === storedProjIds[0];
        }

        if (loadedProjectId !== null) {
            const loadedProjectInfo = localStorage.getItem(loadedProjectId);
            if (loadedProjectInfo !== null) {
                const newProj: Project = new Project(loadedProjectId, loadedProjectInfo);
                setLoadedProject(newProj);
            }
        } else {
            loadedProject.setProjectName("New Project");
            localStorage.setItem("loadedProjectId", loadedProject.getProjectId())
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
                new ComponentDescription(newProj, "Component Description", [], {x: 0, y: 0}, "", projectType.toString(), "", "");
            }
        }
        newProj.saveToBrowser();
        localStorage.setItem("loadedProjectId", newProj.getProjectId());
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
                const newProject: Project = new Project(undefined, target.result.toString());
                newProject.saveToBrowser();
                localStorage.setItem("loadedProjectId", newProject.getProjectId());
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
                case "Component Description":
                    new ComponentDescription(loadedProject, "Component Description", [], {x: 0, y: 0}, "", "", "", "");
                    break;
                case "Documentation Box":
                    new DocumentationSection(loadedProject, "Documentation Section", [], {x: 0, y: 0}, "");
                    break;
                case "Software Repo":
                    new SoftwareRepo(loadedProject, "Software Repo", [], {x: 0, y: 0}, true, "", "", []);
                    break;
                case "Roadmap":
                    new Roadmap(loadedProject, "Roadmap", [], {x: 0, y: 0}, true, "", [], []);
                    break;
                case "Todo":
                    new Todo(loadedProject, "Todo", [], {x: 0, y: 0}, []);
                    break;
                case "UseCases":
                    new UseCases(loadedProject, "Use Cases", [], {x: 0, y: 0}, "", "", []);
                    break;
                case "Difficulties":
                    new Difficulties(loadedProject, "Difficulties", [], {x: 0, y: 0}, []);
                    break;
                default:
                    throw new Error("Unknown tile type: " + tileType);
            }
        }
    }
    
    function saveProjectOnClickHandler() {
        loadedProject.downloadProjectAsJson();
    }

    function saveSetupFileOnClickHandler() {
        loadedProject.downloadSetupFile();
    }

    function saveDeployFileOnClickHandler() {
        loadedProject.downloadDeployFile();
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

    function getLoadedProjectNames() {
        let keyVal: number = 0;
        let options = [];
        for (var currId of loadedProjectIds) {
            const project = localStorage.getItem(currId);
    
            if (project !== null) {
                const newProj: Project = new Project(currId, project);
                let element = <option key={keyVal++} value={currId}>{newProj.getProjectName()}</option>
                if (currId === loadedProject.getProjectId()) {
                    options.unshift(element);
                } else {
                    options.push(element);
                }
            }
        }
        return options;
    }

    function changeLoadedProjectMenu(event: FormEvent<HTMLFormElement>) {
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
                    localStorage.setItem("loadedProjectId", newProj.getProjectId());
                    setLoadedProject(newProj)
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

                            if (loadedProject.getProjectId() === projId) {
                                let newProj: Project = new Project(undefined, "{}");

                                if (parsedIds.length > 0) {
                                    const project = localStorage.getItem(parsedIds[0].toString());
                            
                                    if (project !== null) {
                                        newProj = new Project(parsedIds[0].toString(), project);
                                    }
                                } else {
                                    newProj.setProjectName("New Project");
                                }

                                localStorage.setItem("loadedProjectId", newProj.getProjectId());
                                setLoadedProject(newProj)
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
    }

    return (
        <div className="root">
            <div className="loaded-projects-menu">
                <form onSubmit={changeLoadedProjectMenu}>
                    <select name="projectId">
                        {getLoadedProjectNames()}
                    </select>
                    <select name="action">
                        <option value="Load Project">Load Project</option>
                        <option value="Close Project">Close Project</option>
                    </select>
                    <button type="submit">Execute Action</button>
                </form>
            </div>

            <div className="dropdown-menu">
                <button onClick={toggleFileDropdown}>File</button>
                {
                    fileDropdownVisible && (
                        <div className="dropdown-content">
                            <button onClick={initProjectOnClickHandler}>Initialize new project...</button>
                            <input type="file" accept=".json" onChange={handleProjectImport}/>
                            <button onClick={saveProjectOnClickHandler}>Save Project</button>
                            <button onClick={saveSetupFileOnClickHandler}>Save Setup File</button>
                            <button onClick={saveDeployFileOnClickHandler}>Save Deploy File</button>
                        </div>
                    )
                }
            </div>

            <div className="tile-menu">
                <form onSubmit={addTileOnSubmitHandler}>
                    <select name="tileType">
                        <option value="Component Description">Component Description</option>
                        <option value="Documentation Box">Documentation Box</option>
                        <option value="Software Repo">Software Repo</option>
                        <option value="Roadmap">Roadmap</option>
                        <option value="Todo">Todo</option>
                        <option value="UseCases">Use Cases</option>
                        <option value="Difficulties">Difficulties</option>
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

            <div className="App">
                <div className="App-header">
                    <Canvas>
                        <OrbitControls />
                        <ambientLight intensity ={0.5} />
                        <spotLight position={[10, 15,10]} angle={0.3} />
                        <mesh>
                            <boxGeometry attach ="geometry" />
                            <meshLambertMaterial attach="material" color="hotpink" />
                        </mesh>
                    </Canvas>
                </div>
            </div>
        </div>
    );
};

export default Page;