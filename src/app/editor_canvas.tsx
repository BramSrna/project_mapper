import Project from "./project/project";
import { useEffect, useState } from "react";
import ProjectEditor from "./project_editor/project_editor";
import ProjectComponent from "./project/project_component/project_component";
import ComponentEditor from "./component_editor/component_editor";
import NestedComponent from "./project/project_component/components/nested_component";

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

    function getOrderedChildComponents(rootElement: Project | NestedComponent) {
        let orderedComponents: ProjectComponent[] = [];
        for (var currComponent of rootElement.getChildComponents()) {
            orderedComponents.push(currComponent);
            if (currComponent instanceof NestedComponent) {
                orderedComponents.push(...getOrderedChildComponents(currComponent));
            }
        }
        return orderedComponents;
    }

    function renderCurrEditor() {
        let allComponents: ProjectComponent[] = getOrderedChildComponents(props.projectToEdit);
        let focusedComponent: ProjectComponent | null = null;
        for (var currComponent of allComponents) {
            if (currComponent.getId() === focus) {
                focusedComponent = currComponent
            }
        }
        
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