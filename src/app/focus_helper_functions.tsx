import Project from "./project/project";
import NestedComponent, { ChildLayerJsonInterface } from "./project/project_component/components/nested_component";
import ProjectComponent from "./project/project_component/project_component";

export interface EditorContextsInterface {
    [key: string|number]: EditorContextInterface
}

export interface EditorContextInterface {
    "focusedIndex": number,
    "loadedFocusIds": string[]
}

export function readEditorContext(projectId: string) {    
    const editorContexts = localStorage.getItem("editorContexts");
    
    let focusInfo: EditorContextInterface = {
        "focusedIndex": 0,
        "loadedFocusIds": [projectId]
    }

    if (editorContexts !== null) {
        let parsedContexts: EditorContextsInterface = JSON.parse(editorContexts);

        if (projectId in parsedContexts) {
            focusInfo = parsedContexts[projectId];
        }
    }

    return focusInfo;
}

export function writeEditorContext(projectId: string, focusedIndexToSave: number, loadedFocusIdsToSave: string[]) {
    const editorContexts: string | null = localStorage.getItem("editorContexts");
    let contexts: EditorContextsInterface = editorContexts !== null ? JSON.parse(editorContexts) : {};

    contexts[projectId] = {
        "focusedIndex": focusedIndexToSave,
        "loadedFocusIds": loadedFocusIdsToSave
    }

    localStorage.setItem("editorContexts", JSON.stringify(contexts));
}

export function getFocusedComponent(parent: Project | NestedComponent, focusedId: string) {
    let allChildren: ChildLayerJsonInterface[] = parent.getOrderedChildComponents();
    let focusedComponent: ProjectComponent | Project = parent;
    for (var currChild of allChildren) {
        var currComponent: ProjectComponent = currChild.component;
        if (currComponent.getId() === focusedId) {
            focusedComponent = currComponent
        }
    }
    return focusedComponent;
}