import { useRef, ChangeEvent, MutableRefObject, useState, ReactElement, useEffect, FormEvent } from "react";
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {useXarrow} from 'react-xarrows';
import ProjectComponent from "../project_components/project_component";
import Modal from 'react-modal';
import Visualizer from "../visualizer/visualizer";

const TileContainer = (props: {parentComponent: ProjectComponent, containerContents: ReactElement}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    const [visualizerIsOpen, setvisualizerIsOpen] = useState(false);
    const [position, setPosition] = useState(props.parentComponent.getPosition());

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

    function componentActionMenuOnChangeHandler(event: FormEvent<HTMLFormElement>) {
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

    return (
        stillExists &&
        <div>
            <Draggable nodeRef={nodeRef} onDrag={updateXarrow} onStop={(e, data) => onStopHandler(e, data)} defaultPosition={position} cancel=".dont-move-draggable">
                <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={props.parentComponent.getComponentName()}>
                    <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                        <input type="text" name="componentName" defaultValue={props.parentComponent.getComponentName()} onChange={componentNameOnChangeHandler}/>

                        <form onSubmit={componentActionMenuOnChangeHandler}>
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
                        {props.containerContents}
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

export default TileContainer;