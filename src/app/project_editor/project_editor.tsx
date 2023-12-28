import { FormEvent, useEffect, useState } from "react";
import Project from "../project/project";
import PreviewTileContainer from "./preview_tile_container";
import Xarrow, { Xwrapper } from "react-xarrows";
import ComponentDescription from "../project/project_component/components/component_description";
import DocumentationSection from "../project/project_component/components/documentation_section";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import Todo from "../project/project_component/components/todo/todo";
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import ProjectComponent from "../project/project_component/project_component";
import IdGenerator from "../id_generator";
import { ProjectEditorConstants } from "./project_editor_constants";
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import Modal from 'react-modal';
import "../globals.css";
import "./project_editor.css";

Modal.setAppElement(".root");

const ProjectEditor = (props: {projectToEdit: Project, changeFocus: (componentId: string) => void}) => {
    const [components, setComponents] = useState<ProjectComponent[]>([]);
    const [connections, setConnections] = useState<string[][]>([]);
    const { show } = useContextMenu();
    const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);

    let prevClickedComponent: ProjectComponent | null = null;

    useEffect(() => {
        const componentsData = [...props.projectToEdit.getComponents()];
        setComponents(componentsData);

        const connectionsData: string[][] = [];
        for (const currComponent of props.projectToEdit.getComponents()) {
            for (const endComponentId of currComponent.getConnections()) {
                connectionsData.push([currComponent.getId(), endComponentId]);
            }
        }
        setConnections(connectionsData);
    }, [props.projectToEdit]);

    function addTileOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
        const componentType: string = event.target.value;
        let newComponent: ProjectComponent;
        switch (componentType) {
            case "Add Component":
                return false;
            case "Component Description":
                newComponent = new ComponentDescription(IdGenerator.generateId(), props.projectToEdit, "Component Description", [], "", "");
                break;
            case "Documentation Box":
                newComponent = new DocumentationSection(IdGenerator.generateId(), props.projectToEdit, "Documentation Section", [], "");
                break;
            case "Software Repo":
                newComponent = new SoftwareRepo(IdGenerator.generateId(), props.projectToEdit, "Software Repo", [], "", []);
                break;
            case "Todo":
                newComponent = new Todo(IdGenerator.generateId(), props.projectToEdit, "Todo", [], []);
                break;
            case "UseCases":
                newComponent = new UseCases(IdGenerator.generateId(), props.projectToEdit, "Use Cases", [], "", "", []);
                break;
            case "Difficulties":
                newComponent = new Difficulties(IdGenerator.generateId(), props.projectToEdit, "Difficulties", [], []);
                break;
            default:
                throw new Error("Unknown tile type: " + componentType);
        }

        setComponents([
            ...components,
            newComponent
        ]);
    }

    function connectionOnClickHandler(startId: string, endId: string) {
        const ownerComp: ProjectComponent | null = props.projectToEdit.getComponentWithId(startId);
        if (ownerComp !== null) {
            ownerComp.deleteConnection(endId);
        }

        setConnections(connections.filter(function(connection) {
            return !((connection[0] === startId) && (connection[1] === endId));
        }));
    }

    function getProjectComponentsWithStartPosition() {
        const entriesToSort: ProjectComponent[] = [...components];
        let columns: ProjectComponent[][] = [];

        while (entriesToSort.length > 0) {
            const currColumn: ProjectComponent[] = [];

            for (const currEntry of entriesToSort) {
                let allConnectionsAdded: boolean = true;

                for (const connectionId of currEntry.getConnections()) {
                    let connectionsPresent: boolean = true;
                    for (const checkEntry of entriesToSort) {
                        if (connectionId === checkEntry.getId()) {
                            connectionsPresent = false;
                        }
                    }
                    allConnectionsAdded = allConnectionsAdded && connectionsPresent;
                }

                if (allConnectionsAdded) {
                    currColumn.push(currEntry);
                }
            }

            if (currColumn.length > 0) {
                columns.push(currColumn);
                for (const currEntry of currColumn) {
                    const indexToDelete = entriesToSort.indexOf(currEntry)
                    if (indexToDelete !== -1) {
                        entriesToSort.splice(indexToDelete, 1);
                    }
                }
            }
        }

        columns = columns.reverse();

        const finalObjArray: object[] = [];
        for (let columnIndex: number = 0; columnIndex < columns.length; columnIndex++) {
            for (let componentIndex: number = 0; componentIndex < columns[columnIndex].length; componentIndex++) {
                finalObjArray.push({
                    "component": columns[columnIndex][componentIndex],
                    "position": {
                        x: columnIndex * (ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_WIDTH + 50),
                        y: componentIndex * (ProjectEditorConstants.PROJECT_TILE_CONTAINER_MIN_HEIGHT + 50)
                    }
                })
            }
        }
        return finalObjArray;
    }

    function connectionAdderOnClickHandler(clickedComponent: ProjectComponent) {
        if (prevClickedComponent === null) {
            prevClickedComponent = clickedComponent;
        } else {
            if (prevClickedComponent !== clickedComponent) {
                prevClickedComponent.addConnection(clickedComponent.getId());
        
                setConnections([
                    ...connections,
                    [prevClickedComponent.getId(), clickedComponent.getId()]
                ]);
            }
        }
    }

    function saveProjectOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        if ((formData.has("Save Project")) && (formData.get("Save Project"))) {
            props.projectToEdit.downloadProjectAsJson();
        }
        if ((formData.has("Save Setup File")) && (formData.get("Save Setup File"))) {
            props.projectToEdit.downloadSetupFile();
        }
        if ((formData.has("Save Deploy File")) && (formData.get("Save Deploy File"))) {
            props.projectToEdit.downloadDeployFile();
        }
        setSaveModalVisible(false);
        event.preventDefault();
    }

    return (
        <div className="projectEditorContainer">
            <div className="sideBySideContainer projectEditorMenu">
                <p>Editing Project: <input type="text" defaultValue={props.projectToEdit.getProjectName()} onChange={(e)=> props.projectToEdit.setProjectName(e.target.value)} key={props.projectToEdit.getId()}/></p>
                
                <select onChange={addTileOnChangeHandler} value={"Add Component"}>
                    <option value="Add Component">Add Component</option>
                    <option value="Component Description">Component Description</option>
                    <option value="Documentation Box">Documentation Section</option>
                    <option value="Software Repo">Software Repo</option>
                    <option value="Todo">Todo</option>
                    <option value="UseCases">Use Cases</option>
                    <option value="Difficulties">Difficulties</option>
                </select>

                <select value={"Change Planner View"}>
                    <option value="Change Planner View">Change Planner View</option>
                    <option value="Roadmap View">Roadmap View</option>
                </select>
                
                <button onClick={() => setSaveModalVisible(true)}>Save</button>
            </div>

            <div className="projectEditorWindow">
                <Xwrapper>
                    {
                        getProjectComponentsWithStartPosition().map(function(currObj: object) {
                            const currComponent: ProjectComponent = currObj["component" as keyof typeof currObj] as ProjectComponent;
                            const currPos: object = currObj["position" as keyof typeof currObj] as object;
                            return (
                                <PreviewTileContainer parentComponent={currComponent} initialPosition={currPos} key={currComponent.getId()} changeFocus={props.changeFocus} connectionAdderOnClickHandler={connectionAdderOnClickHandler}/>
                            );
                        })
                    }

                    {
                        connections.map(function(currConnection) {
                            return (
                                <div key={currConnection[0] + currConnection[1]}>
                                    <div onContextMenu={(event) => show({ id: currConnection[0] + currConnection[1], event: event })}>
                                        <Xarrow start={currConnection[0]} end={currConnection[1]}/>
                                    </div>

                                    <Menu id={currConnection[0] + currConnection[1]}>
                                        <Item id="delete" onClick={() => connectionOnClickHandler(currConnection[0], currConnection[1])}>Delete</Item>
                                    </Menu>
                                </div>
                            );
                        })
                    }
                </Xwrapper>
            </div>

            <Modal
                isOpen={saveModalVisible}
                onRequestClose={() => setSaveModalVisible(false)}
            >
                <div className="sideBySideContainer">
                    <p>Save Project Wizard</p>
                    <button onClick={() => setSaveModalVisible(false)}>Close Without Saving</button>
                </div>                    
                <form onSubmit={saveProjectOnSubmitHandler}>
                    <p><input value="Save Project" type="checkbox" defaultChecked={true} name="Save Project"/>Project</p>
                    <p><input value="Save Setup File" type="checkbox" name="Save Setup File"/>Setup File</p>
                    <p><input value="Save Deploy File" type="checkbox" name="Save Deploy File"/>Deploy File</p>
                    <button type="submit">Save</button>
                </form>
            </Modal>
        </div>
    );
}

export default ProjectEditor;