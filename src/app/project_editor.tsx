import Project from "./project_components/project";
import { ChangeEvent, useState } from "react";
import Xarrow, {Xwrapper} from 'react-xarrows';
import TodoTile from "./tiles/todo_tile";
import Todo from "./project_components/todo";
import DocumentationSection from "./project_components/documentation_section";
import DocumentationBoxTile from "./tiles/documentation_box_tile";
import RoadmapTile from "./tiles/roadmap_tile";
import Roadmap from "./project_components/roadmap";
import SoftwareRepoTile from "./tiles/software_repo_tile";
import SoftwareRepo from "./project_components/software_repo";
import UseCases from "./project_components/use_cases";
import UseCasesTile from "./tiles/use_cases_tile";
import Difficulties from "./project_components/difficulties";
import DifficultiesTile from "./tiles/difficulties_tile";
import ComponentDescriptionTile from "./tiles/component_description_tile";
import ComponentDescription from "./project_components/component_description";

const ProjectEditor = (props: {projectToEdit: Project}) => {
    const [arrowDeleted, setArrowDelete] = useState(true);

    const components = props.projectToEdit.getComponents().map(function(currComponent, index) {
        let element: JSX.Element;
        switch (currComponent.getType()) {
            case "Todo":
                element = <TodoTile parentComponent={currComponent as Todo} key={index}/>;
                break;
            case "DocumentationSection":
                element = <DocumentationBoxTile parentComponent={currComponent as DocumentationSection} key={index}/>;
                break;
            case "ComponentDescription":
                element = <ComponentDescriptionTile parentComponent={currComponent as ComponentDescription} key={index}/>;
                break;
            case "Roadmap":
                element = <RoadmapTile parentComponent={currComponent as Roadmap} key={index}/>;
                break;
            case "SoftwareRepo":
                element = <SoftwareRepoTile parentComponent={currComponent as SoftwareRepo} key={index}/>;
                break;
            case "UseCases":
                element = <UseCasesTile parentComponent={currComponent as UseCases} key={index}/>;
                break;
            case "Difficulties":
                element = <DifficultiesTile parentComponent={currComponent as Difficulties} key={index}/>;
                break;
            default:
                throw(`Unknown component type in project editor: ${currComponent.getType()}`)
        }
        return element;
    });

    let xArrowCounter = 0;
    const connections = props.projectToEdit.getComponents().map(function(currParentComponent) {
        const currConnections = currParentComponent.getConnections().map(function(currEndTarget) {
            return (
                <div
                    key={xArrowCounter++}
                    onClick={() => {
                        currParentComponent.deleteConnection(currEndTarget);
                        setArrowDelete(!arrowDeleted);
                    }}>
                    <Xarrow start={currParentComponent.getComponentName()} end={currEndTarget}/>
                </div>
            );
        });

        return currConnections;
    });

    function projectNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.projectToEdit.setProjectName(event.target.value);
    }

    return (
        <Xwrapper>
            <p>Project Name: <input type="text" name="projectName" defaultValue={props.projectToEdit.getProjectName()} onChange={projectNameOnChangeHandler}/></p>
            {components}
            {connections}
        </Xwrapper>
    );
}

export default ProjectEditor;