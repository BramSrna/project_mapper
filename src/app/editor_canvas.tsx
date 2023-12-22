import Project from "./project/project";
import { FormEvent, useEffect, useState } from "react";
import ProjectEditor from "./project_editor/project_editor";
import ProjectComponent from "./project/project_component/project_component";
import ComponentEditor from "./component_editor/component_editor";

const EditorCanvas = (props: {projectToEdit: Project}) => {
    const [editorCanvasDropdownVisible, setEditorCanvasDropdownVisible] = useState(false);
    const [focus, setFocus] = useState(props.projectToEdit.getProjectName());

    useEffect(() => {
        reloadLocalStorage();
    }, []);

    function reloadLocalStorage() {
        const editorContext = localStorage.getItem("editorContext");
        let focusInfo: any;
        if (editorContext !== null) {
            focusInfo = JSON.parse(editorContext);
            setFocus(focusInfo["focus"]);
        }
    }

    function renderCurrEditor() {
        let focusedComponent: ProjectComponent | null = props.projectToEdit.getComponentWithName(focus);
        if (focusedComponent === null) {
            return <ProjectEditor projectToEdit={props.projectToEdit}/>
        } else {
            return <ComponentEditor componentToEdit={focusedComponent}/>
        }
    }

    function changeFocusOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const newFocus: string = formData.get("newFocus")!.toString();
        localStorage.setItem("editorContext", JSON.stringify({"focus": newFocus}));
        setFocus(newFocus);
        setEditorCanvasDropdownVisible(false);
        event.preventDefault();
    }

    function toggleEditorCanvasMenuDropdownVisible() {
        let newVal: boolean = !editorCanvasDropdownVisible;
        if (newVal) {
            reloadLocalStorage();
        }
        setEditorCanvasDropdownVisible(newVal);
    }

    return (
        <div>
            <div className="editorCanvasMenu">
                <button onClick={toggleEditorCanvasMenuDropdownVisible}>Editor Canvas Menu</button>
                {
                    editorCanvasDropdownVisible && (
                        <form onSubmit={changeFocusOnSubmitHandler}>
                            <select name="newFocus" defaultValue={focus}>
                                {[props.projectToEdit.getProjectName(), ...props.projectToEdit.getComponentNames()].map((compName: string, index: number) => <option value={compName} key={index}>{compName}</option>)}
                            </select>
                            <button type="submit">Change Focus</button>
                        </form>
                    )
                }
            </div>

            <div onClick={e => setEditorCanvasDropdownVisible(false)}>
                {renderCurrEditor()}
            </div>
        </div>
    );
}

export default EditorCanvas;