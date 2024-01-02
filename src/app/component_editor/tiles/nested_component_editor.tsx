import IdGenerator from "@/app/id_generator";
import ComponentDescription from "@/app/project/project_component/components/component_description";
import Difficulties from "@/app/project/project_component/components/difficulties/difficulties";
import DocumentationSection from "@/app/project/project_component/components/documentation_section";
import NestedComponent from "@/app/project/project_component/components/nested_component";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";
import Todo from "@/app/project/project_component/components/todo/todo";
import UseCases from "@/app/project/project_component/components/uses_cases/use_cases";
import ProjectComponent from "@/app/project/project_component/project_component";
import ProjectComponentConnection from "@/app/project/project_component_connection";
import PreviewTileContainer from "@/app/project_editor/preview_tile_container";
import { ComponentPositionInterface } from "@/app/project_editor/project_editor";
import { ProjectEditorConstants } from "@/app/project_editor/project_editor_constants";
import { FormEvent, useEffect, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import { Position } from "react-rnd";
import Xarrow, { Xwrapper } from "react-xarrows";
import Modal from 'react-modal';

const NestedComponentEditor = (props: {nestedComponentComp: NestedComponent, changeFocus: (componentId: string) => void}) => {
    const [components, setComponents] = useState<ProjectComponent[]>([]);
    const [connections, setConnections] = useState<ProjectComponentConnection[]>([]);
    const [view, setView] = useState<string>("Roadmap");
    
    const { show } = useContextMenu();

    let prevClickedComponent: ProjectComponent | null = null;

    useEffect(() => {
        const componentsData = [...props.nestedComponentComp.getChildComponents()];
        setComponents(componentsData);

        const connectionsData: ProjectComponentConnection[] = [];
        for (const currComponent of props.nestedComponentComp.getChildComponents()) {
            for (const currConnection of currComponent.getConnections()) {
                if (currConnection.getType() === view) {
                    connectionsData.push(currConnection);
                }
            }
        }
        setConnections(connectionsData);
    }, [props.nestedComponentComp]);

    function addTileOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
        const componentType: string = event.target.value;
        let newComponent: ProjectComponent;
        switch (componentType) {
            case "Add Component":
                return false;
            case "NestedComponent":
                newComponent = new NestedComponent(IdGenerator.generateId(), props.nestedComponentComp, "Nested Component", [], []);
                break;
            case "ComponentDescription":
                newComponent = new ComponentDescription(IdGenerator.generateId(), props.nestedComponentComp, "Component Description", [], "", "");
                break;
            case "DocumentationSection":
                newComponent = new DocumentationSection(IdGenerator.generateId(), props.nestedComponentComp, "Documentation Section", [], "");
                break;
            case "SoftwareRepo":
                newComponent = new SoftwareRepo(IdGenerator.generateId(), props.nestedComponentComp, "Software Repo", [], "", []);
                break;
            case "Todo":
                newComponent = new Todo(IdGenerator.generateId(), props.nestedComponentComp, "Todo", [], []);
                break;
            case "UseCases":
                newComponent = new UseCases(IdGenerator.generateId(), props.nestedComponentComp, "Use Cases", [], "", "", []);
                break;
            case "Difficulties":
                newComponent = new Difficulties(IdGenerator.generateId(), props.nestedComponentComp, "Difficulties", [], []);
                break;
            default:
                throw new Error("Unknown tile type: " + componentType);
        }

        props.nestedComponentComp.addComponent(newComponent);

        setComponents([
            ...components,
            newComponent
        ]);
    }

    function deleteConnectionOnClickHandler(connectionToDelete: ProjectComponentConnection) {
        const ownerComp: ProjectComponent | null = props.nestedComponentComp.getComponentWithId(connectionToDelete.getStartId());
        if (ownerComp !== null) {
            ownerComp.deleteConnection(connectionToDelete);
        }

        setConnections(connections.filter(function(connection) {
            return connection !== connectionToDelete;
        }));
    }

    function getProjectComponentsWithStartPosition() {
        const entriesToSort: ProjectComponent[] = [...components];
        let columns: ProjectComponent[][] = [];

        while (entriesToSort.length > 0) {
            const currColumn: ProjectComponent[] = [];

            for (const currEntry of entriesToSort) {
                let allConnectionsAdded: boolean = true;

                for (const currConnection of currEntry.getConnections()) {
                    if (currConnection.getType() == view) {
                        let connectionsPresent: boolean = true;
                        for (const checkEntry of entriesToSort) {
                            if (currConnection.getEndId() === checkEntry.getId()) {
                                connectionsPresent = false;
                            }
                        }
                        allConnectionsAdded = allConnectionsAdded && connectionsPresent;
                    }
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

        const finalObjArray: ComponentPositionInterface[] = [];
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
                let newConnection: ProjectComponentConnection = new ProjectComponentConnection(prevClickedComponent.getId(), clickedComponent.getId(), view);

                for (var currConnection of connections) {
                    if ((currConnection.getStartId() == newConnection.getStartId()) && (currConnection.getEndId() == newConnection.getEndId())) {
                        return false;
                    }
                    if ((currConnection.getStartId() == newConnection.getEndId()) && (currConnection.getEndId() == newConnection.getStartId())) {
                        return false;
                    }
                }

                prevClickedComponent.addConnection(newConnection);

                setConnections([
                    ...connections,
                    newConnection
                ]);       
            }
        }
    }

    function viewOnChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
        const newView: string = event.target.value;
        const connectionsData: ProjectComponentConnection[] = [];
        for (const currComponent of props.nestedComponentComp.getChildComponents()) {
            for (const currConnection of currComponent.getConnections()) {
                if (currConnection.getType() === newView) {
                    connectionsData.push(currConnection);
                }
            }
        }
        setConnections(connectionsData);
        setView(newView);
    }

    return (
        <div className="projectEditorContainer">
            <div className="sideBySideContainer projectEditorMenu">
                <select onChange={addTileOnChangeHandler} value={"Add Component"}>
                    <option value="Add Component">Add Component</option>
                    <option value="NestedComponent">Nested Component</option>
                    <option value="ComponentDescription">Component Description</option>
                    <option value="DocumentationSection">Documentation Section</option>
                    <option value="SoftwareRepo">Software Repo</option>
                    <option value="Todo">Todo</option>
                    <option value="UseCases">Use Cases</option>
                    <option value="Difficulties">Difficulties</option>
                </select>

                <select onChange={viewOnChangeHandler}>
                    <option value="Roadmap">Roadmap</option>
                    <option value="Use Case Flow">Use Case Flow</option>
                </select>
            </div>

            <div className="projectEditorWindow">
                <Xwrapper>
                    {
                        getProjectComponentsWithStartPosition().map(function(currObj: ComponentPositionInterface) {
                            const currComponent: ProjectComponent = currObj["component"];
                            const currPos: Position = currObj["position"];
                            return (
                                <PreviewTileContainer parentComponent={currComponent} initialPosition={currPos} key={currComponent.getId()} changeFocus={props.changeFocus} connectionAdderOnClickHandler={connectionAdderOnClickHandler}/>
                            );
                        })
                    }

                    {
                        connections.map(function(currConnection: ProjectComponentConnection) {
                            return (
                                <div key={currConnection.getId()}>
                                    <div onContextMenu={(event) => show({ id: currConnection.getId(), event: event })}>
                                        <Xarrow key={currConnection.getId()} start={currConnection.getStartId()} end={currConnection.getEndId()}/>
                                    </div>

                                    <Menu id={currConnection.getId()}>
                                        <Item id="delete" onClick={() => deleteConnectionOnClickHandler(currConnection)}>Delete</Item>
                                    </Menu>
                                </div>
                            );
                        })
                    }
                </Xwrapper>
            </div>
        </div>
    );
}

export default NestedComponentEditor;