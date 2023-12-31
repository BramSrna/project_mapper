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
import { ChangeEvent, useEffect, useState } from "react";
import NestedComponent from "../project/project_component/components/nested_component";
import NestedComponentEditor from "./tiles/nested_component_editor";

const ComponentEditor = (props: {componentToEdit: ProjectComponent, changeFocus: (componentId: string) => void}) => {
    const [component, setComponent] = useState<ProjectComponent>(props.componentToEdit);

    useEffect(() => {
        setComponent(props.componentToEdit);
    }, [props.componentToEdit]);

    function renderComponentEditor() {
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

    function componentTypeOnChangeHandler(newComponentType: string) {
        if (newComponentType === component.getType()) {
            return false;
        }

        console.log(newComponentType);

        let newComp: ProjectComponent = component.setType(newComponentType);
        setComponent(newComp);
    }

    return (
        <div>
            <div className="sideBySideContainer componentEditorMenu">
                <button onClick={() => props.changeFocus(component.getParent().getId())}>Back To Project</button>
                <p>Editing Component: <input type="text" defaultValue={component.getComponentName()} onChange={(event) => component.setComponentName(event.target.value)}/></p>
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
            </div>
            
            <div>
                {renderComponentEditor()}
            </div>
        </div>
    );
}

export default ComponentEditor;