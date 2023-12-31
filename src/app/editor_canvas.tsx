import Project from "./project/project";
import { useEffect, useState } from "react";
import ProjectEditor from "./project_editor/project_editor";
import ProjectComponent from "./project/project_component/project_component";
import ComponentEditor from "./component_editor/component_editor";

export interface EditorContextInterface {
    "focus": string
}

const EditorCanvas = (props: {projectToEdit: Project}) => {
    const [focus, setFocus] = useState(props.projectToEdit.getProjectName());

    useEffect(() => {
        reloadLocalStorage();
    }, []);

    function reloadLocalStorage() {
        const editorContext = localStorage.getItem("editorContext");
        let currFocus: string = props.projectToEdit.getProjectName();
        if (editorContext !== null) {
            let focusInfo: EditorContextInterface = JSON.parse(editorContext);
            currFocus = focusInfo["focus"];
        }
        setFocus(currFocus);
    }

    function renderCurrEditor() {
        const focusedComponent: ProjectComponent | null = props.projectToEdit.getComponentWithId(focus);
        if (focusedComponent === null) {
            return (
                <ProjectEditor projectToEdit={props.projectToEdit} changeFocus={(componentId: string) => changeFocus(componentId)}/>
            );
        } else {
            return (
                <div>
                    <ComponentEditor componentToEdit={focusedComponent} changeFocus={(projectId: string) => changeFocus(projectId)}/>
                </div>
            )
        }
    }

    function changeFocus(newFocus: string) {
        localStorage.setItem("editorContext", JSON.stringify({"focus": newFocus}));
        setFocus(newFocus);
    }

    return (
        <div>
            {renderCurrEditor()}
        </div>
    );
}

export default EditorCanvas;