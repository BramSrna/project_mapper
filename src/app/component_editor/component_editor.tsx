import ProjectComponent from "../project/project_component/project_component";
import TodoEditor from "./tiles/todo_editor";
import DocumentationSectionEditor from "./tiles/documentation_section_editor";
import ComponentDescriptionEditor from "./tiles/component_description_editor";
import SoftwareRepoEditor from "./tiles/software_repo_editor";
import UseCasesEditor from "./tiles/use_cases_editor";
import DifficultiesEditor from "./tiles/difficulties_editor";
import Todo from "../project/project_component/components/todo/todo";
import DocumentationSection from "../project/project_component/components/documentation_section";
import ComponentDescription from "../project/project_component/components/component_description";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import "./component_editor.css";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import NestedComponent, { ChildLayerJsonInterface } from "../project/project_component/components/nested_component";
import NestedComponentEditor from "./tiles/nested_component_editor";
import Project from "../project/project";
import SimulatorInterfaceEditor from "./simulator/simulator_interface_editor";
import SimulatorAppearance from "./simulator/simulator_appearance";
import { Vector3 } from "three";

const ComponentEditor = (props: {componentToEdit: ProjectComponent, changeFocus: (componentId: string) => void}) => {
    const [component, setComponent] = useState<ProjectComponent>(props.componentToEdit);
    const [editorView, setEditorView] = useState<string>("ComponentEditor");
    const [appearance, setAppearance] = useState<SimulatorAppearance>(props.componentToEdit.getSimulatorAppearance());

    useEffect(() => {
        setComponent(props.componentToEdit);
        setAppearance(props.componentToEdit.getSimulatorAppearance());
    }, [props.componentToEdit]);

    function renderComponentEditor() {
        if (editorView === "SimulatorInterface") {
            return(<SimulatorInterfaceEditor appearance={props.componentToEdit.getSimulatorAppearance()}/>);
        } else {
            switch (component.getType()) {
                case "NestedComponent":
                    return (<NestedComponentEditor nestedComponentComp={component as NestedComponent} changeFocus={props.changeFocus}/>)
                case "Todo":
                    return(<TodoEditor todoComp={component as Todo}/>);
                case "DocumentationSection":
                    return(<DocumentationSectionEditor documentationSectionComp={component as DocumentationSection}/>);
                case "ComponentDescription":
                    return(<ComponentDescriptionEditor componentDescriptionComp={component as ComponentDescription}/>);
                case "SoftwareRepo":
                    return(<SoftwareRepoEditor softwareRepoComp={component as SoftwareRepo}/>);
                case "UseCases":
                    return(<UseCasesEditor useCasesComp={component as UseCases}/>);
                case "Difficulties":
                    return(<DifficultiesEditor difficultiesComp={component as Difficulties}/>);
                default:
                    throw(`Unknown component type in project editor: ${component.getType()}`)
            }
        }
    }

    function componentTypeOnChangeHandler(newComponentType: string) {
        if (newComponentType === component.getType()) {
            return false;
        }

        let newComp: ProjectComponent = props.componentToEdit.getParent().switchComponent(props.componentToEdit, newComponentType);
        setComponent(newComp);
    }

    function renderComponentTreeSelect() {
        let rootElement: Project | ProjectComponent = props.componentToEdit;
        while (!(rootElement instanceof Project)) {
            rootElement = rootElement.getParent();
        }

        let orderedComponents: ChildLayerJsonInterface[] = rootElement.getOrderedChildComponents();

        return (
            <select onChange={(event: ChangeEvent<HTMLSelectElement>) => props.changeFocus(event.target.value)} value={props.componentToEdit.getId()}>
                <option value={rootElement.getId()}>{rootElement.getProjectName()}</option>
                {
                    orderedComponents.map(function(currChildLayerInfo: ChildLayerJsonInterface) {
                        let currComponent: ProjectComponent = currChildLayerInfo["component"];
                        let layer: number = currChildLayerInfo["layer"];
                        return <option key={currComponent.getId()} value={currComponent.getId()}>{currComponent.getComponentName()}</option>
                    })
                }
            </select>
        );
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
            <div className="sideBySideContainer componentEditorMenu">
                {renderComponentTreeSelect()}

                <p>Editing Component: <input type="text" value={component.getComponentName()} onChange={(event) => component.setComponentName(event.target.value)}/></p>

                <select value="Change Component Type" onChange={(event: ChangeEvent<HTMLSelectElement>) => componentTypeOnChangeHandler(event.target.value)}>
                    <option value="Change Component Type">Change Component Type</option>
                    <option value="NestedComponent">Nested Component</option>
                    <option value="Todo">Todo</option>
                    <option value="DocumentationSection">Documentation Section</option>
                    <option value="ComponentDescription">Component Description</option>
                    <option value="SoftwareRepo">Software Repo</option>
                    <option value="UseCases">Use Cases</option>
                    <option value="Difficulties">Difficulties</option>
                </select>

                <select onChange={(event: ChangeEvent<HTMLSelectElement>) => setEditorView(event.target.value)}>
                    <option value="ComponentEditor">Component Editor</option>
                    <option value="SimulatorInterface">Simulator Interface</option>
                </select>
            </div>
            
            <div style={{ height: "100%", display: "flex", flexDirection: "column"}}>
                {renderComponentEditor()}
            </div>
        </div>
    );
}

export default ComponentEditor;