import { useRef, ChangeEvent, MutableRefObject, useState, ReactElement, useEffect, FormEvent, cloneElement } from "react";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {useXarrow} from 'react-xarrows';
import ProjectComponent from "../project/project_component/project_component";
import Modal from 'react-modal';
import Visualizer from "../visualizer/visualizer";

const PreviewTileContainer = (props: {parentComponent: ProjectComponent, children: ReactElement}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    const [visualizerIsOpen, setvisualizerIsOpen] = useState(false);
    const [position, setPosition] = useState(props.parentComponent.getPosition());
    const [view, setView] = useState("ViewEditor");

    const nodeRef: MutableRefObject<null> = useRef(null);

    useEffect(() => {
        setPosition(props.parentComponent.getPosition());
    }, []);

    function closeVisualizer() {
        setvisualizerIsOpen(false);
    }

    function onStopHandler(e: DraggableEvent, data: DraggableData) {
        props.parentComponent.setPosition(data.x, data.y);
        updateXarrow();
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
                renderedElement = (<textarea key="1" name="viewSetup" value={component.getSetupFileContents()} readOnly={true}/>);
                break;
            case "ViewDeployFile":
                renderedElement = (<textarea key="2" name="viewDeploy" value={component.getDeployFileContents()} readOnly={true}/>);
                break;
            case "ViewJson":
                renderedElement = (<textarea key="3" name="viewJson" value={JSON.stringify(props.parentComponent.toJSON(), null, 2)} readOnly={true}/>);
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
            <Draggable nodeRef={nodeRef} onDrag={updateXarrow} onStop={(e, data) => onStopHandler(e, data)} defaultPosition={position} cancel=".dont-move-draggable">
                <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={props.parentComponent.getComponentName()}>
                    <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
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
                    </div>

                    <div className="dont-move-draggable">
                        {renderChildren(props.parentComponent, props.children)}
                    </div>
                </div>
            </Draggable>

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