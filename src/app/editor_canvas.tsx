import Project from "./project/project";
import { ReactElement, useEffect, useState } from "react";
import ProjectEditor from "./project_editor/project_editor";
import ProjectComponent from "./project/project_component/project_component";
import ComponentEditor from "./component_editor/component_editor";
import NestedComponent from "./project/project_component/components/nested_component";

export interface EditorContextsInterface {
    [key: string|number]: EditorContextInterface
}

export interface EditorContextInterface {
    "focusedIndex": number,
    "loadedFocusIds": string[]
}

const EditorCanvas = (props: {projectToEdit: Project}) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [loadedFocusIds, setLoadedFocusIds] = useState<string[]>([props.projectToEdit.getId()]);

    useEffect(() => {
        reloadLocalStorage();
    }, []);

    function saveContext(focusedIndexToSave: number, loadedFocusIdsToSave: string[]) {
        const editorContexts: string | null = localStorage.getItem("editorContexts");
        let contexts: EditorContextsInterface = editorContexts !== null ? JSON.parse(editorContexts) : {};

        contexts[props.projectToEdit.getId()] = {
            "focusedIndex": focusedIndexToSave,
            "loadedFocusIds": loadedFocusIdsToSave
        }

        localStorage.setItem("editorContexts", JSON.stringify(contexts));
    }

    function reloadLocalStorage() {
        const editorContexts = localStorage.getItem("editorContexts");
        
        let savedFocusedIndex: number = 0;
        let savedLoadedFocusIds: string[] = [props.projectToEdit.getId()];

        if (editorContexts !== null) {
            let parsedContexts: EditorContextsInterface = JSON.parse(editorContexts);

            if (props.projectToEdit.getId() in parsedContexts) {
                let focusInfo: EditorContextInterface = parsedContexts[props.projectToEdit.getId()];
                savedFocusedIndex = focusInfo["focusedIndex"];
                savedLoadedFocusIds = focusInfo["loadedFocusIds"];
            }
        }

        setFocusedIndex(savedFocusedIndex);
        setLoadedFocusIds(savedLoadedFocusIds);
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
            if (currComponent.getId() === loadedFocusIds[focusedIndex]) {
                focusedComponent = currComponent
            }
        }
        
        if (focusedComponent === null) {
            return (
                <ProjectEditor projectToEdit={props.projectToEdit} changeFocus={(componentId: string) => changeFocus(focusedIndex, componentId)}/>
            );
        } else {
            return (
                <div>
                    <ComponentEditor componentToEdit={focusedComponent} changeFocus={(projectId: string) => changeFocus(focusedIndex, projectId)}/>
                </div>
            )
        }
    }

    function changeFocus(loadedFocusIndex: number, newFocus: string) {
        let newLoadedFocusIds: string[] = loadedFocusIds.map(function(currFocusId: string, index: number) {
            if (index === loadedFocusIndex) {
                return newFocus;
            } else {
                return currFocusId;
            }
        });

        setLoadedFocusIds(newLoadedFocusIds);
        setFocusedIndex(loadedFocusIndex);

        saveContext(loadedFocusIndex, newLoadedFocusIds);
    }

    function addFocusId(newFocusId: string) {
        let newLoadedFocusIds: string[] = [...loadedFocusIds, newFocusId];
        let newFocusedIndex: number = newLoadedFocusIds.length - 1;

        setLoadedFocusIds(newLoadedFocusIds);
        setFocusedIndex(newFocusedIndex);

        saveContext(newFocusedIndex, newLoadedFocusIds);
    }

    function removeFocusId(indexToRemove: number) {
        if (indexToRemove <= 0) {
            return null;
        }

        let newLoadedFocusIds: string[] = loadedFocusIds.filter(function(currFocusId: string, currIndex: number) {
            if (currIndex !== indexToRemove) {
                return currFocusId;
            }
        });
        let newFocusedIndex: number = focusedIndex - 1;
        if (newFocusedIndex < 0) {
            newFocusedIndex = 0;
        }

        setLoadedFocusIds(newLoadedFocusIds);
        setFocusedIndex(newFocusedIndex);

        saveContext(newFocusedIndex, newLoadedFocusIds);
    }

    return (
        <div>
            <div className="sideBySideContainer projectEditorMenu">
                {
                    loadedFocusIds.map(function(currFocusId: string, index: number) {
                        let allComponents: ProjectComponent[] = getOrderedChildComponents(props.projectToEdit);
                        let focusedComponent: ProjectComponent | null = null;
                        for (var currComponent of allComponents) {
                            if (currComponent.getId() === currFocusId) {
                                focusedComponent = currComponent
                            }
                        }

                        if (focusedComponent !== null) {
                            return (
                                <div className="containerWithSeperators" key={focusedComponent!.getId() + index}>
                                    <button onClick={() => changeFocus(index, focusedComponent!.getId())}>{focusedComponent.getComponentName()}</button>
                                    {(index > 0) && <button onClick={() => removeFocusId(index)}>X</button>}
                                </div>
                            );
                        }

                        return (
                            <div className="containerWithSeperators" key={props.projectToEdit.getId() + index}>
                                <button onClick={() => changeFocus(index, props.projectToEdit.getId())}>{props.projectToEdit.getProjectName()}</button>
                                {(index > 0) && <button onClick={() => removeFocusId(index)}>X</button>}
                            </div>
                        );
                    })
                }
                <div className="containerWithSeperators">
                    <button onClick={() => addFocusId(props.projectToEdit.getId())}>+</button>
                </div>
            </div>

            {renderCurrEditor()}
        </div>
    );
}

export default EditorCanvas;