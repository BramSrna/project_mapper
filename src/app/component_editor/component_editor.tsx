import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import ProjectComponent from "../project/project_component/project_component";
import TodoEditor from "./tiles/todo_editor";
import DocumentationSectionEditor from "./tiles/documentation_section_editor";
import ComponentDescriptionEditor from "./tiles/component_description_editor";
import RoadmapEditor from "./tiles/roadmap_editor";
import SoftwareRepoEditor from "./tiles/software_repo_editor";
import UseCasesEditor from "./tiles/use_cases_editor";
import DifficultiesEditor from "./tiles/difficulties_editor";
import Todo from "../project/project_component/components/todo/todo";
import DocumentationSection from "../project/project_component/components/documentation_section";
import ComponentDescription from "../project/project_component/components/component_description";
import Roadmap from "../project/project_component/components/roadmap/roadmap";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import Visualizer from "../visualizer/visualizer";
import { useXarrow } from "react-xarrows";
import { Rnd } from "react-rnd";

const ComponentEditor = (props: {componentToEdit: ProjectComponent}) => {
    const updateXarrow = useXarrow();
    
    const [renderViews, setRenderViews] = useState<boolean>(false);

    const nodeRef: MutableRefObject<null> = useRef(null);

    function renderComponentEditor() {
        switch (props.componentToEdit.getType()) {
            case "Todo":
                return(<TodoEditor todoComp={props.componentToEdit as Todo}/>);
            case "DocumentationSection":
                return(<DocumentationSectionEditor documentationSectionComp={props.componentToEdit as DocumentationSection}/>);
            case "ComponentDescription":
                return(<ComponentDescriptionEditor componentDescriptionComp={props.componentToEdit as ComponentDescription}/>);
            case "Roadmap":
                return(<RoadmapEditor roadmapComp={props.componentToEdit as Roadmap}/>);
            case "SoftwareRepo":
                return(<SoftwareRepoEditor softwareRepoComp={props.componentToEdit as SoftwareRepo}/>);
            case "UseCases":
                return(<UseCasesEditor useCasesComp={props.componentToEdit as UseCases}/>);
            case "Difficulties":
                return(<DifficultiesEditor difficultiesComp={props.componentToEdit as Difficulties}/>);
            default:
                throw(`Unknown component type in project editor: ${props.componentToEdit.getType()}`)
        }
    }

    function componentNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        let newName: string = event.target.value;
        props.componentToEdit.setComponentName(newName);
    }

    return (
        <div>
            <p>Editing Component: <input type="text" defaultValue={props.componentToEdit.getComponentName()} onChange={componentNameOnChangeHandler}/></p>
            
            {renderComponentEditor()}
        </div>
    );
}

export default ComponentEditor;