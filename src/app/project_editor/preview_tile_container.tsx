import { useRef, ChangeEvent, MutableRefObject, useState, ReactElement, useEffect, FormEvent, cloneElement, SyntheticEvent, forwardRef, LegacyRef } from "react";
import {useXarrow} from 'react-xarrows';
import ProjectComponent from "../project/project_component/project_component";
import Modal from 'react-modal';
import Visualizer from "../visualizer/visualizer";
import { Resizable, ResizableBox, ResizeCallbackData } from 'react-resizable';
import { Rnd } from "react-rnd";
import { ProjectEditorConstants } from "./project_editor_constants";

const PreviewTileContainer = (props: {parentComponent: ProjectComponent, children: ReactElement, initialPosition: object}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    const [visualizerIsOpen, setvisualizerIsOpen] = useState(false);
    const [view, setView] = useState("ViewEditor");
    const [dimensions, setDimensions] = useState({width: 100, height: 100});

    const nodeRef: MutableRefObject<null> = useRef(null);

    function onResize(e: SyntheticEvent, data: ResizeCallbackData) {
        setDimensions({width: data.size.width, height: data.size.height});
    };

    function closeVisualizer() {
        setvisualizerIsOpen(false);
    }

    function componentNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setComponentName(event.target.value);
    }

    function componentActionMenuOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if (formData.has("componentActionMenu")) {
            const action = formData.get("componentActionMenu");
            switch (action) {
                case "SaveSetupFile":
                    props.parentComponent.downloadSetupFile();
                    break;
                case "SaveDeployFile":
                    props.parentComponent.downloadDeployFile();
                    break;
                case "Visualize":
                    setvisualizerIsOpen(true);
                    break;
                case "Delete":
                    props.parentComponent.removeFromProject();
                    setStillExists(false);
                    break;
                default:
                    break;
            }
        }
        event.preventDefault();
    }

    function componentViewMenuOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if (formData.has("componentViewMenu")) {
            const view = formData.get("componentViewMenu");
            if ((view !== null) && (["ViewEditor", "ViewSetupFile", "ViewDeployFile", "ViewJson"].indexOf(view.toString()) !== -1)) {
                setView(view.toString());
            } else {
                setView("ViewEditor");
            }
        }
        event.preventDefault();
    }

    function renderChildren(component: ProjectComponent, children: ReactElement) {
        let renderedElement: ReactElement;
        switch (view) {
            case "ViewSetupFile":
                renderedElement = (<textarea name="viewSetup" value={component.getSetupFileContents()} readOnly={true}/>);
                break;
            case "ViewDeployFile":
                renderedElement = (<textarea name="viewDeploy" value={component.getDeployFileContents()} readOnly={true}/>);
                break;
            case "ViewJson":
                renderedElement = (<textarea name="viewJson" value={JSON.stringify(props.parentComponent.toJSON(), null, 2)} readOnly={true}/>);
                break;
            default:
                renderedElement = (children);
                break;
        }
        return renderedElement;
    }

    return (
        stillExists &&
        <div>
            <Rnd
                style={{
                    border: "solid 1px #ddd",
                    background: "#f0f0f0",
                    overflow: "hidden"
                }}
                default={{
                  x: props.initialPosition["x" as keyof typeof props.initialPosition],
                  y: props.initialPosition["y" as keyof typeof props.initialPosition],
                  width: ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_WIDTH,
                  height: ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_HEIGHT
                }}
                onDrag={updateXarrow}
                onDragStop={updateXarrow}
                id={props.parentComponent.getId()}
                minWidth={ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_WIDTH}
                minHeight={ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_HEIGHT}
            >
                <div>
                    <input type="text" name="componentName" defaultValue={props.parentComponent.getComponentName()} onChange={componentNameOnChangeHandler}/>

                    <form onSubmit={componentViewMenuOnSubmitHandler}>
                        <select name="componentViewMenu" className="dont-move-draggable">
                            <option value="ViewEditor">View Editor</option>
                            <option value="ViewSetupFile">View Setup File</option>
                            <option value="ViewDeployFile">View Deploy File</option>
                            <option value="ViewJson">View JSON</option>
                        </select>
                        <button type="submit">Change View</button>
                    </form>

                    <form onSubmit={componentActionMenuOnSubmitHandler}>
                        <select name="componentActionMenu" className="dont-move-draggable">
                            <option value="SaveSetupFile">Save Setup File</option>
                            <option value="SaveDeployFile">Save Deploy File</option>
                            <option value="Visualize">Visualize</option>
                            <option value="Delete">Delete</option>
                        </select>
                        <button type="submit">Execute Action</button>
                    </form>

                    {renderChildren(props.parentComponent, props.children)}
                </div>
            </Rnd>

            <div className="visualizer">
                <Modal
                    style={{overlay: {zIndex: 1000}}}
                    isOpen={visualizerIsOpen}
                    onRequestClose={closeVisualizer}
                >
                    <button onClick={closeVisualizer}>Exit Visualizer</button>
                    <Visualizer componentToVisualize={props.parentComponent} />
                </Modal>
            </div>
        </div>
    );

}

export default PreviewTileContainer;