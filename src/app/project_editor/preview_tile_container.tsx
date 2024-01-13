import { useState, ReactElement, FormEvent } from "react";
import {useXarrow} from 'react-xarrows';
import ProjectComponent from "../project/project_component/project_component";
import Modal from 'react-modal';
import Visualizer from "../visualizer/visualizer";
import { Position, Rnd } from "react-rnd";
import { ProjectEditorConstants } from "./project_editor_constants";
import "./project_editor.css"

const PreviewTileContainer = (props: {parentComponent: ProjectComponent, initialPosition: Position, changeFocus: (componentId: string) => void, connectionAdderOnClickHandler: (clickedComponent: ProjectComponent) => void}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    const [view, setView] = useState("Visualizer");
    const [connectionAdderVisible, setConnectionAdderVisible] = useState<boolean>(false);
    const [size, setSize] = useState({width: ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_WIDTH, height: ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_HEIGHT});
    const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);

    function renderInternalComponents() {
        let renderedElement: ReactElement;
        switch (view) {
            case "Setup File":
                renderedElement = (<div><textarea name="viewSetup" value={props.parentComponent.getSetupFileContents()} readOnly={true}/></div>);
                break;
            case "Deploy File":
                renderedElement = (<div><textarea name="viewDeploy" value={props.parentComponent.getDeployFileContents()} readOnly={true}/></div>);
                break;
            case "Json":
                renderedElement = (<div><textarea name="viewJson" value={JSON.stringify(props.parentComponent.toJSON(), null, 2)} readOnly={true}/></div>);
                break;
            default:
                renderedElement = (<Visualizer componentToVisualize={props.parentComponent}></Visualizer>);
                break;
        }
        return renderedElement;
    }

    function saveComponentOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if ((formData.has("Save Setup File")) && (formData.get("Save Setup File"))) {
            props.parentComponent.downloadSetupFile();
        }
        if ((formData.has("Save Deploy File")) && (formData.get("Save Deploy File"))) {
            props.parentComponent.downloadDeployFile();
        }
        setSaveModalVisible(false);
        event.preventDefault();
    }

    function deleteComponent() {
        props.parentComponent.removeFromProject();
        setStillExists(false);
    }

    function rndOnClickHandler(event: React.MouseEvent<HTMLElement>) {
        if (event.detail === 2) {
            props.changeFocus(props.parentComponent.getId())
        }
    }

    return (
        stillExists &&
        <Rnd
            className="previewTileContainer"
            default={{
                x: props.initialPosition["x"],
                y: props.initialPosition["y"],
                width: size.width,
                height: size.height
            }}
            onDrag={updateXarrow}
            onDragStop={updateXarrow}
            id={props.parentComponent.getId()}
            minWidth={ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_WIDTH}
            minHeight={ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_HEIGHT}
            onClick={rndOnClickHandler}
            onMouseEnter={() => setConnectionAdderVisible(true)}
            onMouseLeave={() => setConnectionAdderVisible(false)}
            dragHandleClassName={"handle"}
            onResize={(e, direction, elementRef) => setSize({width: elementRef.offsetWidth, height: elementRef.offsetHeight})}
            bounds=".projectEditorWindow"
        >
            <div className="connectionAdder" style={{ left: 0, top: size.height / 2, display: connectionAdderVisible ? "inline" : "none" }} onClick={() => props.connectionAdderOnClickHandler(props.parentComponent)}/>
            <div className="connectionAdder" style={{ left: size.width * 0.5, top: 0, display: connectionAdderVisible ? "inline" : "none" }} onClick={() => props.connectionAdderOnClickHandler(props.parentComponent)}/>
            <div className="connectionAdder" style={{ left: size.width * 0.5, top: size.height - 11, display: connectionAdderVisible ? "inline" : "none" }} onClick={() => props.connectionAdderOnClickHandler(props.parentComponent)}/>
            <div className="connectionAdder" style={{ left: size.width - 11, top: size.height / 2, display: connectionAdderVisible ? "inline" : "none" }} onClick={() => props.connectionAdderOnClickHandler(props.parentComponent)}/>

            <div className="sideBySideContainer handleContainer">
                <div className="handle"/>
                <button onClick={deleteComponent}>X</button>
            </div>

            <input type="text" defaultValue={props.parentComponent.getComponentName()} onChange={e => props.parentComponent.setComponentName(e.target.value)}/>

            <select value="Change View" onChange={(event) => event.target.value === "Change View" ? setView("Visualizer") : setView(event.target.value)}>
                <option value="Change View">Change View</option>
                <option value="Visualizer">Visualizer</option>
                <option value="Setup File">Setup File</option>
                <option value="Deploy File">Deploy File</option>
                <option value="Json">JSON</option>
            </select>

            <button onClick={() => setSaveModalVisible(true)}>Save</button>

            {renderInternalComponents()}

            <Modal
                isOpen={saveModalVisible}
                onRequestClose={() => setSaveModalVisible(false)}
            >
                <div className="sideBySideContainer">
                    <p>Save Component Wizard</p>
                    <button onClick={() => setSaveModalVisible(false)}>Close Without Saving</button>
                </div>                    
                <form onSubmit={saveComponentOnSubmitHandler}>
                    <p><input value="Save Setup File" type="checkbox" name="Save Setup File"/>Setup File</p>
                    <p><input value="Save Deploy File" type="checkbox" name="Save Deploy File"/>Deploy File</p>
                    <button type="submit">Save</button>
                </form>
            </Modal>
        </Rnd>
    );

}

export default PreviewTileContainer;