import Difficulties from "../project/project_component/components/difficulties/difficulties";
import DocumentationSection from "../project/project_component/components/documentation_section";
import ProjectComponent from "../project/project_component/project_component";
import SoftwareRepo from "../project/project_component/components/software_repo/software_repo";
import Todo from "../project/project_component/components/todo/todo";
import UseCases from "../project/project_component/components/uses_cases/use_cases";
import ComponentDescription from "../project/project_component/components/component_description";
import TodoVisualizer from "./tiles/todo_visualizer";
import DocumentationSectionVisualizer from "./tiles/documentation_section_visualizer";
import ComponentDescriptionVisualizer from "./tiles/component_description_visualizer";
import SoftwareRepoVisualizer from "./tiles/software_repo_visualizer";
import UseCasesVisualizer from "./tiles/use_cases_visualizer";
import DifficultiesVisualizer from "./tiles/difficulties_visualizer";
import NestedComponentVisualizer from "./tiles/nested_component_visualizer";
import NestedComponent from "../project/project_component/components/nested_component";

const Visualizer = (props: {componentToVisualize: ProjectComponent}) => {
    function renderComponent(component: ProjectComponent) {
        let element: JSX.Element;
        switch (component.getType()) {
            case "NestedComponent":
                element = <NestedComponentVisualizer nestedComponentComp={component as NestedComponent}/>
                break;
            case "Todo":
                element = <TodoVisualizer todoComp={component as Todo}/>
                break;
            case "DocumentationSection":
                element = <DocumentationSectionVisualizer documentationSectionComp={component as DocumentationSection}/>
                break;
            case "ComponentDescription":
                element = <ComponentDescriptionVisualizer componentDescriptionComp={component as ComponentDescription}/>
                break;
            case "SoftwareRepo":
                element = <SoftwareRepoVisualizer softwareRepoComp={component as SoftwareRepo}/>
                break;
            case "UseCases":
                element = <UseCasesVisualizer useCasesComp={component as UseCases}/>
                break;
            case "Difficulties":
                element = <DifficultiesVisualizer difficultiesComp={component as Difficulties}/>
                break;
            default:
                throw(`Unknown component type in project editor: ${component.getType()}`)
        }
        return element;
    }
    
    return (
        <div>
            <p>Visualizer</p>
            <p>Displaying Component: {props.componentToVisualize.getComponentName()}</p>
            <div>
                {renderComponent(props.componentToVisualize)}
            </div>
        </div>
    );

}

export default Visualizer;