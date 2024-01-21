'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Project from "./project/project";
import EditorCanvas from './editor_canvas';
import "./page.css"
import "./globals.css"
import { jsonToProject } from './project/project_json_parser';
import IdGenerator from './id_generator';
import { DraggableData, Position, Rnd } from 'react-rnd';
import { CommandJsonInterface } from './terminal/command_json_interface';
import { mapRawTextToCommands } from './terminal/command_mapper';
import { executeCommandList } from './terminal/command_executor';
import { DraggableEvent } from 'react-draggable';
import { parse } from 'path';
import NestedComponent, { ChildLayerJsonInterface } from './project/project_component/components/nested_component';
import ProjectComponent from './project/project_component/project_component';
import { EditorContextInterface, getFocusedComponent, readEditorContext } from './focus_helper_functions';

const TERMINAL_MIN_WIDTH: number = 300;
const TERMINAL_MIN_HEIGHT: number = 200;

interface SizeInterface {
    "width": number,
    "height": number
}

const Page = () => {
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);

    const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
    const [terminalStatus, setTerminalStatus] = useState<string>("Click 'Submit' to execute the terminal actions.");
    const [terminalPosition, setTerminalPosition] = useState<Position>({x: 0, y: 0});
    const [terminalSize, setTerminalSize] = useState<SizeInterface>({"width": TERMINAL_MIN_WIDTH, "height": TERMINAL_MIN_HEIGHT});
    const [terminalText, setTerminalText] = useState<string>("");

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
                    const newProj: Project = jsonToProject(currId, JSON.parse(project));
                    projects.push(newProj);
                }
            }
        }
        setLoadedProjects(projects);

        let projectToEditId = localStorage.getItem("projectToEditId");
        if ((projectToEditId === null) && (storedProjIds !== null) && (storedProjIds.length > 0)) {
            projectToEditId === storedProjIds[0];
        }

        if (projectToEditId !== null) {
            for (const currProj of projects) {
                if (currProj.getId() === projectToEditId) {
                    setProjectToEdit(currProj);
                }
            }
        } else {
            setProjectToEdit(null);
        }
    }

    function initProjectOnClickHandler() {
        const newProj: Project = new Project(IdGenerator.generateId(), "New Project");
        newProj.saveToBrowser();
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
                const newProject: Project = jsonToProject(IdGenerator.generateId(), JSON.parse(target.result.toString()));
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
            setTerminalOpen(false);
            localStorage.removeItem("projectToEditId")
            setProjectToEdit(null);
        } else {
            for (var currProject of loadedProjects) {
                if (currProject.getId() === projectId) {
                    localStorage.setItem("projectToEditId", currProject.getId());
                    setProjectToEdit(currProject);
                }
            }
        }
    }

    function closeProject(projectId: string) {
        const storedProjIds = localStorage.getItem("loadedProjectIds");
        let parsedIds: string[] = [];
        if (storedProjIds !== null) {
            parsedIds = JSON.parse(storedProjIds);
            const index = parsedIds.indexOf(projectId.toString());
            if (index > -1) {
                parsedIds.splice(index, 1);
            }
        }
        localStorage.setItem("loadedProjectIds", JSON.stringify(parsedIds));
        localStorage.removeItem(projectId.toString());
        let newLoadedProjects: Project[] = loadedProjects.filter(function(project) {
            return (project.getId() !== projectId);
        })
        setLoadedProjects(newLoadedProjects);

        if ((projectToEdit !== null) && (projectToEdit.getId() === projectId) ) {
            let newProjectId: string | null = null;
            if (parsedIds.length > 0) {
                newProjectId = parsedIds[0];
            }
            switchToProject(newProjectId);
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
                <EditorCanvas projectToEdit={projectToRender} key={projectToRender.getId()}/>
            );
        }
    }

    function inputTerminalOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        if (projectToEdit === null) {
            setTerminalStatus("Error: A project must be open for the terminal to be used.");
            event.preventDefault();
            return false;
        }

        const formData: FormData = new FormData(event.currentTarget);
        if ((formData.has("inputTerminal")) && (formData.get("inputTerminal") !== null)) {
            let focusInfo: EditorContextInterface = readEditorContext(projectToEdit.getId());
            let focusedComponent: ProjectComponent | Project | null = getFocusedComponent(projectToEdit, focusInfo.loadedFocusIds[focusInfo.focusedIndex]);

            let commandList: CommandJsonInterface[] = mapRawTextToCommands(focusedComponent, formData.get("inputTerminal")!.toString());
            
            let check: string | null = executeCommandList(projectToEdit, focusedComponent, commandList);
            if (check !== null) {
                setTerminalStatus(check)
                event.preventDefault();
            } else {
                setTerminalStatus("Finished Execution.");
                setTerminalText("");
                event.preventDefault();
                const form = event.target as HTMLFormElement;
                form.reset();
            }
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
                {(projectToEdit !== null) &&
                    <div className="containerWithSeperators">
                        <button onClick={() => setTerminalOpen(true)}>Open Terminal</button>
                    </div>
                }
            </div>

            {
                terminalOpen &&                
                <Rnd
                    className="previewTileContainer"
                    style = {{zIndex: 100}}
                    default={{
                        x: terminalPosition.x,
                        y: terminalPosition.y,
                        width: terminalSize.width,
                        height: terminalSize.height
                    }}
                    minWidth={TERMINAL_MIN_WIDTH}
                    minHeight={TERMINAL_MIN_HEIGHT}
                    onDrag={(event: DraggableEvent, data: DraggableData) => setTerminalPosition({x: data.x, y: data.y})}
                    onResize={(e, direction, elementRef) => setTerminalSize({width: elementRef.offsetWidth, height: elementRef.offsetHeight})}
                    dragHandleClassName={"handle"}
                    bounds=".projectMapperContainer"
                >
                    <div className="sideBySideContainer handleContainer">
                        <div className="handle"/>
                        <button onClick={() => setTerminalOpen(false)}>X</button>
                    </div>

                    <form onSubmit={inputTerminalOnSubmitHandler}>
                        <textarea
                            style={{ width: terminalSize.width - 6, height: terminalSize.height - 110, padding: 0, resize: "none" }}
                            name="inputTerminal"
                            rows={4}
                            cols={40}
                            value={terminalText}
                            onChange={(event) => setTerminalText(event.target.value)}
                        />
                        <p>{terminalStatus}</p>
                        <button type="submit" style={{ width: terminalSize.width - 6 }}>Submit</button>
                    </form>
                </Rnd>
            }
            
            <div className="editorContainer">
                {renderEditor(projectToEdit)}
            </div>
        </div>
    );
};

export default Page;
