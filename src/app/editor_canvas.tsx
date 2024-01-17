import Project from "./project/project";
import { FormEvent, ReactElement, useEffect, useState } from "react";
import ProjectEditor from "./project_editor/project_editor";
import ProjectComponent from "./project/project_component/project_component";
import ComponentEditor from "./component_editor/component_editor";
import NestedComponent, { ChildLayerJsonInterface } from "./project/project_component/components/nested_component";
import { mapRawTextToCommands } from "./terminal/command_mapper";
import { executeCommandList } from "./terminal/command_executor";
import { CommandJsonInterface } from "./terminal/command_json_interface";
import { EditorContextInterface, getFocusedComponent, readEditorContext, writeEditorContext } from "./focus_helper_functions";

const EditorCanvas = (props: {projectToEdit: Project}) => {
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [loadedFocusIds, setLoadedFocusIds] = useState<string[]>([props.projectToEdit.getId()]);

    useEffect(() => {
        reloadStorage();
    }, []);

    function reloadStorage() {
        let focusInfo: EditorContextInterface = readEditorContext(props.projectToEdit.getId());

        setFocusedIndex(focusInfo.focusedIndex);
        setLoadedFocusIds(focusInfo.loadedFocusIds);
    }

    function renderCurrEditor() {
        let focusInfo: EditorContextInterface = readEditorContext(props.projectToEdit.getId());
        let focusedComponent: ProjectComponent | Project = getFocusedComponent(props.projectToEdit, focusInfo.loadedFocusIds[focusInfo.focusedIndex]);
        
        if (focusedComponent === props.projectToEdit) {
            return (
                <ProjectEditor key={props.projectToEdit.getId()} projectToEdit={props.projectToEdit} changeFocus={(componentId: string) => changeFocus(focusInfo.focusedIndex, componentId)}/>
            );
        } else {
            return (
                <ComponentEditor componentToEdit={focusedComponent as ProjectComponent} changeFocus={(projectId: string) => changeFocus(focusInfo.focusedIndex, projectId)}/>
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

        writeEditorContext(props.projectToEdit.getId(), loadedFocusIndex, newLoadedFocusIds);
    }

    function addFocusId(newFocusId: string) {
        let newLoadedFocusIds: string[] = [...loadedFocusIds, newFocusId];
        let newFocusedIndex: number = newLoadedFocusIds.length - 1;

        setLoadedFocusIds(newLoadedFocusIds);
        setFocusedIndex(newFocusedIndex);

        writeEditorContext(props.projectToEdit.getId(), newFocusedIndex, newLoadedFocusIds);
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

        writeEditorContext(props.projectToEdit.getId(), newFocusedIndex, newLoadedFocusIds);
    }

    return (
        <div className="editorCanvasWindow">
            <div className="sideBySideContainer projectEditorMenu">
                {
                    readEditorContext(props.projectToEdit.getId()).loadedFocusIds.map(function(currFocusId: string, index: number) {
                        let focusedComponent: ProjectComponent | Project = getFocusedComponent(props.projectToEdit, currFocusId);

                        if (focusedComponent !== props.projectToEdit) {
                            focusedComponent = focusedComponent as ProjectComponent;
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