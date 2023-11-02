'use client';

import { useState } from 'react';

export default function Home() {
    const [projectDescription, setProjectDescription] = useState<String>("No project imported.");

    function handleProjectImport(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files === null) {
            console.log("Error: No file found.");
            return null;
        }

        var file: File = event.target.files[0];
        var fileReader: FileReader;
        var newDescription: String = "Unable to load file.";
        fileReader = new FileReader();
        fileReader.onloadend = function(event) {
            let target = event.target;
            if ((target !== null) && (target.result !== null)) {
                newDescription = target.result.toString();
            }
            setProjectDescription(newDescription);
        };
        fileReader.readAsText(file);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <input type="file" accept=".json" onChange={e => handleProjectImport(e)}/>
                <p>Project Info: {projectDescription}</p>
            </div>
        </main>
    )
}
