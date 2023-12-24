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
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import ProjectComponent from "../project/project_component/project_component";
import IdGenerator from "../id_generator";
import { ProjectEditorConstants } from "./project_editor_constants";

const ProjectEditor = (props: {projectToEdit: Project}) => {
    const [components, setComponents] = useState<ProjectComponent[]>([]);
    const [connections, setConnections] = useState<string[][]>([]);
    const [projectEditorMenuVisible, setProjectEditorMenuVisible] = useState<boolean>(false);

    useEffect(() => {
        const componentsData = [...props.projectToEdit.getComponents()];
        setComponents(componentsData);

        const connectionsData: string[][] = [];
        for (var currComponent of props.projectToEdit.getComponents()) {
            for (var endComponentId of currComponent.getConnections()) {
                connectionsData.push([currComponent.getId(), endComponentId]);
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
                    newComponent = new ComponentDescription(IdGenerator.generateId(), props.projectToEdit, "Component Description", [], "", "", "", "");
                    break;
                case "Documentation Box":
                    newComponent = new DocumentationSection(IdGenerator.generateId(), props.projectToEdit, "Documentation Section", [], "");
                    break;
                case "Software Repo":
                    newComponent = new SoftwareRepo(IdGenerator.generateId(), props.projectToEdit, "Software Repo", [], "", []);
                    break;
                case "Roadmap":
                    newComponent = new Roadmap(IdGenerator.generateId(), props.projectToEdit, "Roadmap", [], []);
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
        const startId: string = formData.get("startId")!.toString();
        const endId: string = formData.get("endId")!.toString();

        if (startId === endId) {
            return false;
        }

        const startComponent = props.projectToEdit.getComponentWithId(startId);
        const endComponent = props.projectToEdit.getComponentWithId(endId);

        if ((startComponent !== null) && (endComponent !== null)) {
            startComponent.addConnection(endComponent.getId());

            setConnections([
                ...connections,
                [startId, endId]
            ]);
        }
        event.preventDefault();
    }

    function connectionOnClickHandler(startId: string, endId: string) {
        let ownerComp: ProjectComponent | null = props.projectToEdit.getComponentWithId(startId);
        if (ownerComp !== null) {
            ownerComp.deleteConnection(endId);
        }

        setConnections(connections.filter(function(connection) {
            return !((connection[0] === startId) && (connection[1] === endId));
        }));
    }

    function toggleProjectEditorMenuVisible() {
        setProjectEditorMenuVisible(!projectEditorMenuVisible);
    }

    function getProjectComponentsWithStartPosition() {
        let entriesToSort: ProjectComponent[] = [...components];
        let columns: ProjectComponent[][] = [];

        while (entriesToSort.length > 0) {
            let currColumn: ProjectComponent[] = [];

            for (var currEntry of entriesToSort) {
                let allConnectionsAdded: boolean = true;

                for (var connectionId of currEntry.getConnections()) {
                    let connectionsPresent: boolean = true;
                    for (var checkEntry of entriesToSort) {
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
                for (var currEntry of currColumn) {
                    let indexToDelete = entriesToSort.indexOf(currEntry)
                    if (indexToDelete !== -1) {
                        entriesToSort.splice(indexToDelete, 1);
                    }
                }
            }
        }

        columns = columns.reverse();

        let finalObjArray: object[] = [];
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

    return (
        <Xwrapper>
            <p>Editing Project: <input type="text" defaultValue={props.projectToEdit.getProjectName()} onChange={projectNameOnChangeHandler}/></p>

            <div className="projectEditorMenu">
                <button onClick={toggleProjectEditorMenuVisible}>Project Editor Menu</button>
                {
                    projectEditorMenuVisible && (
                        <div>
                            <div className="tile-menu">
                                <form onSubmit={addTileOnSubmitHandler}>
                                    <select name="tileType">
                                        <option value="Component Description">Component Description</option>
                                        <option value="Documentation Box">Documentation Section</option>
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
                                    <select name="startId">
                                        {props.projectToEdit.getComponents().map((component: ProjectComponent, index) => <option value={component.getId()} key={component.getId()}>{component.getComponentName()}</option>)}
                                    </select>
                                    <select name="connectionType">
                                        <option value="Uses">Uses</option>
                                    </select>
                                    <select name="endId">
                                        {props.projectToEdit.getComponents().map((component: ProjectComponent, index) => <option value={component.getId()} key={component.getId()}>{component.getComponentName()}</option>)}
                                    </select>
                                    <button type="submit">Add Connection</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>

            <div onClick={e => (setProjectEditorMenuVisible(false))}>
                {
                    getProjectComponentsWithStartPosition().map(function(currObj: object) {
                        let currComponent: ProjectComponent = currObj["component" as keyof typeof currObj] as ProjectComponent;
                        let currPos: object = currObj["position" as keyof typeof currObj] as object;
                        return (
                            <PreviewTileContainer
                                parentComponent={currComponent}
                                key={currComponent.getId()}
                                initialPosition={currPos}
                            >
                                <Visualizer componentToVisualize={currComponent}></Visualizer>
                            </PreviewTileContainer>
                        );
                    })
                }

                {
                    connections.map(function(currConnection) {
                        return (
                            <div
                                key={currConnection[0] + currConnection[1]}
                                onClick={e => connectionOnClickHandler(currConnection[0], currConnection[1])}>
                                <Xarrow start={currConnection[0]} end={currConnection[1]}/>
                            </div>
                        );
                    })
                }
            </div>
        </Xwrapper>
    );
}

export default ProjectEditor;