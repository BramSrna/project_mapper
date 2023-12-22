import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Project from "../project/project";
import PreviewTileContainer from "./preview_tile_container";
import Visualizer from "../visualizer/visualizer";
import Xarrow, { Xwrapper } from "react-xarrows";
import ComponentDescription from "../project/project_component/components/component_description";
import DocumentationSection from "../project/project_component/components/documentation_section";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import Roadmap from "../project/project_component/components/roadmap/roadmap";
import Todo from "../project/project_component/components/todo/todo";
import UseCases from "../project/project_component/components/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import ProjectComponent from "../project/project_component/project_component";
import Connection from "../project/project_component/connection";

const ProjectEditor = (props: {projectToEdit: Project}) => {
    const [arrowDeleted, setArrowDelete] = useState<boolean>(true);
    const [components, setComponents] = useState<ProjectComponent[]>(props.projectToEdit.getComponents());
    const [connections, setConnections] = useState<Connection[]>([]);

    useEffect(() => {
        const componentsData = props.projectToEdit.getComponents();
        setComponents(componentsData);

        const connectionsData: Connection[] = [];
        for (var currComponent of components) {
            for (var connection of currComponent.getConnections()) {
                connectionsData.push(connection);
            }
        }
        setConnections(connectionsData);
    }, [props.projectToEdit]);

    function projectNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        let newName: string = event.target.value;
        props.projectToEdit.setProjectName(newName);
    }

    function addTileOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        let newComponent: ProjectComponent;
        if (formData.has("tileType")) {
            const tileType = formData.get("tileType");
            switch (tileType) {
                case "Component Description":
                    newComponent = new ComponentDescription(props.projectToEdit, "Component Description", [], {x: 0, y: 0}, "", "", "", "");
                    break;
                case "Documentation Box":
                    newComponent = new DocumentationSection(props.projectToEdit, "Documentation Section", [], {x: 0, y: 0}, "");
                    break;
                case "Software Repo":
                    newComponent = new SoftwareRepo(props.projectToEdit, "Software Repo", [], {x: 0, y: 0}, true, "", "", []);
                    break;
                case "Roadmap":
                    newComponent = new Roadmap(props.projectToEdit, "Roadmap", [], {x: 0, y: 0}, []);
                    break;
                case "Todo":
                    newComponent = new Todo(props.projectToEdit, "Todo", [], {x: 0, y: 0}, []);
                    break;
                case "UseCases":
                    newComponent = new UseCases(props.projectToEdit, "Use Cases", [], {x: 0, y: 0}, "", "", []);
                    break;
                case "Difficulties":
                    newComponent = new Difficulties(props.projectToEdit, "Difficulties", [], {x: 0, y: 0}, []);
                    break;
                default:
                    throw new Error("Unknown tile type: " + tileType);
            }

            setComponents([
                ...components,
                newComponent
            ]);
        }
        event.preventDefault();
    }

    function addConnectionOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const rootName: string = formData.get("rootSelector")!.toString();
        const targetName: string = formData.get("targetSelector")!.toString();

        if (rootName === targetName) {
            return false;
        }

        const rootComponent = props.projectToEdit.getComponentWithName(rootName);
        const targetComponent = props.projectToEdit.getComponentWithName(targetName);

        if ((rootComponent !== null) && (targetComponent !== null)) {
            let newConnection: Connection = new Connection(IdGenerator.generateId(), rootComponent, targetComponent);
            rootComponent.addConnection(newConnection);

            setConnections([
                ...connections,
                newConnection
            ]);
        }
    }

    function connectionOnClickHandler(connectionToDelete: Connection) {
        for (var component of components) {
            component.deleteConnection(connectionToDelete);
        }
        setConnections(connections.filter(function(connection) {
            return (connection.getId() !== connectionToDelete.getId());
        }));
    }

    return (
        <Xwrapper>
            <p>Editing Project: <input type="text" defaultValue={props.projectToEdit.getProjectName()} onChange={projectNameOnChangeHandler}/></p>

            <div className="tile-menu">
                <form onSubmit={addTileOnSubmitHandler}>
                    <select name="tileType">
                        <option value="Component Description">Component Description</option>
                        <option value="Documentation Box">Documentation Box</option>
                        <option value="Software Repo">Software Repo</option>
                        <option value="Roadmap">Roadmap</option>
                        <option value="Todo">Todo</option>
                        <option value="UseCases">Use Cases</option>
                        <option value="Difficulties">Difficulties</option>
                    </select>
                    <button type="submit">Add Tile</button>
                </form>
            </div>

            <div className="connectionMenu">
                <form onSubmit={addConnectionOnSubmitHandler}>
                    <select name="rootSelector">
                        {props.projectToEdit.getComponentNames().map((compName: string, index) => <option value={compName} key={index}>{compName}</option>)}
                    </select>
                    <select name="connectionType">
                        <option value="Uses">Uses</option>
                    </select>
                    <select name="targetSelector">
                        {props.projectToEdit.getComponentNames().map((compName: string, index) => <option value={compName} key={index}>{compName}</option>)}
                    </select>
                    <button type="submit">Add Connection</button>
                </form>
            </div>

            {
                components.map(function(currComponent) {
                    return (
                        <PreviewTileContainer parentComponent={currComponent} key={currComponent.getId()}>
                            <Visualizer componentToVisualize={currComponent}></Visualizer>
                        </PreviewTileContainer>
                    );
                })
            }

            {
                connections.map(function(currConnection) {
                    return (
                        <div
                            key={currConnection.getId()}
                            onClick={e => connectionOnClickHandler(currConnection)}>
                            <Xarrow start={currConnection.getStartComponent().getComponentName()} end={currConnection.getEndComponent().getComponentName()}/>
                        </div>
                    );
                })
            }
        </Xwrapper>
    );
}

export default ProjectEditor;