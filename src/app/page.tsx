'use client';

import { FormEvent } from "react";
import React, { useState } from 'react';
import Project from "./project";
import ProjectEditor from "./project_editor";
import Modal from 'react-modal';

Modal.setAppElement(".root");

const DropdownMenu = () => {
    const [fileDropdownVisible, setFileDropdownVisible] = useState(false);
    const [currProjectDescription, setCurrProjectDescription] = useState<Project>(new Project());
    const [initProjWizardIsOpen, setInitProjWizardIsOpen] = React.useState(false);

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
                newProj.setProjectType(projectType.toString());
            }
        }
        setCurrProjectDescription(newProj);
        closeInitProjWizard();
    }

    function initProjectOnClickHandler() {
        setInitProjWizardIsOpen(true);
    }

    function handleProjectImport(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null) {
            console.log("Error: No file found.");
            return null;
        }

        const file: File = event.target.files[0];
        const newDescription: Project = new Project();
        const fileReader = new FileReader();
        fileReader.onloadend = function(event) {
            const target = event.target;
            if ((target !== null) && (target.result !== null)) {
                newDescription.setFromJson(target.result.toString());
            }
            setCurrProjectDescription(newDescription);
        };
        fileReader.readAsText(file);
    }

    return (
        <div className="root">
            <div className="dropdown-menu">
                <button onClick={toggleFileDropdown}>File</button>
                {
                    fileDropdownVisible && (
                        <div className="dropdown-content">
                            <button onClick={initProjectOnClickHandler}>Initialize new project...</button>
                            <input type="file" accept=".json" onChange={e => handleProjectImport(e)}/>
                        </div>
                    )
                }
            </div>

            <div className="project-editor">
                {(new ProjectEditor(currProjectDescription)).toHtml()}
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

export default DropdownMenu;