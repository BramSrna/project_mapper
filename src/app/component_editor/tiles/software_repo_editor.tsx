import CodeSample from "@/app/project/project_component/components/software_repo/code_sample";
import Mock from "@/app/project/project_component/components/software_repo/code_sample";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";
import { useEffect, useState } from "react";
import { Position, Rnd } from "react-rnd";
import { useXarrow } from "react-xarrows";
import Editor from "@monaco-editor/react";
import "./component_editor_tiles.css";

const CODE_SAMPLE_MIN_WIDTH: number = 275;
const CODE_SAMPLE_MIN_HEIGHT: number = 150;

const SoftwareRepoEditor = (props: {softwareRepoComp: SoftwareRepo}) => {
    const [codeSamples, setCodeSamples] = useState<Mock[]>([]);
    
    const updateXarrow = useXarrow();

    const supportedLanguages: string[] = [
        "TypeScript",
        "JavaScript",
        "CSS",
        "LESS",
        "SCSS",
        "JSON",
        "HTML",
        "XML",
        "PHP",
        "C#",
        "C++",
        "Razor",
        "Markdown",
        "Diff",
        "Java",
        "VB",
        "CoffeeScript",
        "Handlebars",
        "Batch",
        "Pug",
        "F#",
        "Lua",
        "Powershell",
        "Python",
        "Ruby",
        "SASS",
        "R",
        "Objective-C"
    ];
    supportedLanguages.sort();

    useEffect(() => {
        setCodeSamples([...props.softwareRepoComp.getCodeSamples()]);
    }, [props.softwareRepoComp]);

    function deleteCodeSampleOnClickHandler(codeSampleToDelete: CodeSample) {
        props.softwareRepoComp.deleteCodeSample(codeSampleToDelete);
        setCodeSamples(codeSamples.filter(function(currCodeSample: CodeSample) {
            return currCodeSample !== codeSampleToDelete
        }))
    }

    function addCodeSampleOnClickHandler() {
        const newCodeSample: CodeSample = new CodeSample(props.softwareRepoComp, "", "", "");
        props.softwareRepoComp.addCodeSample(newCodeSample);
        setCodeSamples([
            ...codeSamples,
            newCodeSample
        ])
    }

    function codeBlockOnChangeHandler(codeSample: CodeSample, value: string | undefined) {
        if (value !== undefined) {
            codeSample.setCodeBlock(value);
        }
    }

    let dispSquareDim: number = 1;
    while (dispSquareDim ** 2 < props.softwareRepoComp.getCodeSamples().length) {
        dispSquareDim += 1;
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="sideBySideContainer projectEditorMenu">
                <p>Init Repo Name: <input type="text" name="initRepoName" defaultValue={props.softwareRepoComp.getInitRepoName()} onChange={e => props.softwareRepoComp.setInitRepoName(e.target.value)}/></p>
                <button onClick={addCodeSampleOnClickHandler}>Add Code Sample</button>
            </div>

            <div style={{flexGrow: 1}} className="difficultiesEditorWindow">
                {
                    props.softwareRepoComp.getCodeSamples().map(function(currCodeSample: CodeSample, index: number) {
                        const rowIndex: number = Math.floor(index / dispSquareDim);
                        const colIndex: number = index % dispSquareDim;

                        const initialPosition: Position = {
                            x: colIndex * (CODE_SAMPLE_MIN_WIDTH + 50),
                            y: rowIndex * (CODE_SAMPLE_MIN_HEIGHT + 50)
                        };
                        
                        return (
                            <Rnd
                                style={{
                                    border: "solid 1px #ddd",
                                    background: "#f0f0f0",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                default={{
                                    x: initialPosition["x"],
                                    y: initialPosition["y"],
                                    width: CODE_SAMPLE_MIN_WIDTH,
                                    height: CODE_SAMPLE_MIN_HEIGHT
                                }}
                                onDrag={updateXarrow}
                                onDragStop={updateXarrow}
                                id={currCodeSample.getId()}
                                minWidth={CODE_SAMPLE_MIN_WIDTH}
                                minHeight={CODE_SAMPLE_MIN_HEIGHT}
                                key={currCodeSample.getId()}
                                bounds=".difficultiesEditorWindow"
                                dragHandleClassName={"handle"}
                            >
                                <div className="sideBySideContainer handleContainer">
                                    <div className="handle"/>
                                    <button onClick={() => deleteCodeSampleOnClickHandler(currCodeSample)}>X</button>
                                </div>
                
                                <div className="dont-move-draggable" style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
                                    <p>Title: <input type="text" defaultValue={currCodeSample.getTitle()} onChange={e => currCodeSample.setTitle(e.target.value)}/></p>
                                    <p>Language: <select defaultValue={currCodeSample.getLanguage()} onChange={e => currCodeSample.setLanguage(e.target.value)}>
                                        {
                                            supportedLanguages.map(function(currLanguage: string) {
                                                return <option value={currLanguage} key={currLanguage}>{currLanguage}</option>
                                            })
                                        }
                                    </select></p>
                                    <div style={{flexGrow: 1}}>
                                        <Editor
                                            height="100%"
                                            language={currCodeSample.getLanguage()}
                                            value={currCodeSample.getCodeBlock()}
                                            onChange={(value: string | undefined) => codeBlockOnChangeHandler(currCodeSample, value)}
                                        />
                                    </div>
                                </div>
                            </Rnd>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default SoftwareRepoEditor;