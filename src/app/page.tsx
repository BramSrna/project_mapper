'use client';

import React, { useState, useEffect } from 'react';
import Project from "./project/project";
import EditorCanvas from './editor_canvas';
import "./page.css"
import "./globals.css"

const Page = () => {
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);

    useEffect(() => {
        reloadLocalStorage();
    }, []);

    function reloadLocalStorage() {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        const projects: Project[] = [];
        if (storedProjIds !== null) {
            const projIds: string[] = JSON.parse(storedProjIds);

            for (const currId of projIds) {
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
        } else {
            setProjectToEdit(null);
        }

        if (projectToEditId !== null) {
            const loadedProjectInfo = localStorage.getItem(projectToEditId);
            if (loadedProjectInfo !== null) {
                const newProj: Project = new Project(projectToEditId, loadedProjectInfo);
                setProjectToEdit(newProj);
            }
        } else {
            setProjectToEdit(null);
        }
    }

    function initProjectOnClickHandler() {
        const newProj: Project = new Project();
        newProj.saveToBrowser();
        newProj.setProjectName("New Project");
        localStorage.setItem("projectToEditId", newProj.getId());
        setProjectToEdit(newProj);
        setLoadedProjects([
            ...loadedProjects,
            newProj
        ]);
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
                localStorage.setItem("projectToEditId", newProject.getId());
                setProjectToEdit(newProject);
                setLoadedProjects([
                    ...loadedProjects,
                    newProject
                ])
            }
        };
        fileReader.readAsText(file);
    }

    function switchToProject(projectId: string | null) {
        if (projectId === null) {
            localStorage.removeItem("projectToEditId")
            setProjectToEdit(null);
        } else {
            const project = localStorage.getItem(projectId);
    
            if (project !== null) {
                const newProj: Project = new Project(projectId, project);
                localStorage.setItem("projectToEditId", newProj.getId());
                setProjectToEdit(newProj);
            }
        }
    }

    function closeProject(projectId: string) {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        let parsedIds = [];
        if (storedProjIds !== null) {
            parsedIds = JSON.parse(storedProjIds);
            const index = parsedIds.indexOf(projectId.toString());
            if (index > -1) {
                parsedIds.splice(index, 1);
                localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
            }
        }
        localStorage.removeItem(projectId.toString());
        setLoadedProjects(loadedProjects.filter(function(project) {
            return (project.getId() !== projectId);
        }));

        if ((projectToEdit !== null) && (projectToEdit.getId() === projectId)) {
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

            localStorage.setItem("projectToEditId", newProj.getId());
            setProjectToEdit(newProj)
        }
    }

    function renderEditor(projectToRender: Project | null) {
        if (projectToRender === null) {
            return (
                <div className="projectInitializerContainer">
                    <p>New Project: <button onClick={initProjectOnClickHandler}>Initialize new project...</button></p>
                    <p>Load Project: <input type="file" accept=".json" onChange={handleProjectImport}/></p>
                </div>
            );
        } else {
            return (
                <div className="projectEditorContainer">
                    <EditorCanvas projectToEdit={projectToRender}></EditorCanvas>
                </div>
            );
        }
    }

    return (
        <div className="projectMapperContainer root">
            <div className="sideBySideContainer">
                {
                    loadedProjects.map(function(currProject: Project) {
                        return(
                            <div key={currProject.getId()} className="containerWithSeperators">
                                <button onClick={() => switchToProject(currProject.getId())}>{currProject.getProjectName()}</button>
                                <button onClick={() => closeProject(currProject.getId())}>X</button>
                            </div>
                        );
                    })
                }
                <div className="containerWithSeperators">
                    <button onClick={() => switchToProject(null)}>+</button>
                </div>                
            </div>
            
            <div className="editorContainer">
                {renderEditor(projectToEdit)}
            </div>
        </div>
    );
};

export default Page;
