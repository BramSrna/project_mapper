'use client';

import { useState } from 'react';
import Project from "./project";
import ProjectEditor from "./project_editor";

export default function Home() {
    const [currProjectDescription, setCurrProjectDescription] = useState<Project>(new Project());

    function initProjectOnClickHandler() {
        setCurrProjectDescription(new Project());
    }

    function handleProjectImport(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null) {
            console.log("Error: No file found.");
            return null;
        }

        var file: File = event.target.files[0];
        var fileReader: FileReader;
        var newDescription: Project = new Project();
        fileReader = new FileReader();
        fileReader.onloadend = function(event) {
            let target = event.target;
            if ((target !== null) && (target.result !== null)) {
                newDescription.setFromJson(target.result.toString());
            }
            setCurrProjectDescription(newDescription);
        };
        fileReader.readAsText(file);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div>
                    <button onClick={initProjectOnClickHandler}>Initialize new project...</button>
                    <input type="file" accept=".json" onChange={e => handleProjectImport(e)}/>
                </div>
                <div>
                    {(new ProjectEditor(currProjectDescription)).toHtml()}
                </div>
            </div>
        </main>
    )
}
