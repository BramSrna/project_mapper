import { MutableRefObject, useRef } from "react";
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
import UseCases from "../project/project_component/components/use_cases";
import Difficulties from "../project/project_component/components/difficulties/difficulties";
import Draggable from "react-draggable";
import Visualizer from "../visualizer/visualizer";

const ComponentEditor = (props: {componentToEdit: ProjectComponent}) => {
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

    return (
        <div>
            <Draggable nodeRef={nodeRef} cancel=".dont-move-draggable">
                <div style={{ position: 'absolute', top: "0%", left: "50%", zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={`${props.componentToEdit.getComponentName()}_visualizer`}>
                    <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                        <p>Visualizer: {props.componentToEdit.getComponentName()}</p>
                    </div>

                    <div className="dont-move-draggable">
                        <Visualizer componentToVisualize={props.componentToEdit}></Visualizer>
                    </div>
                </div>
            </Draggable>

            <Draggable nodeRef={nodeRef} cancel=".dont-move-draggable">
                <div style={{ position: 'absolute', top: "33%", left: "50%", zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={`${props.componentToEdit.getComponentName()}_setup_file`}>
                    <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                        <p>Setup File: {props.componentToEdit.getComponentName()}</p>
                    </div>

                    <div className="dont-move-draggable">
                        <textarea key="1" name="viewSetup" value={props.componentToEdit.getSetupFileContents()} readOnly={true}/>
                    </div>
                </div>
            </Draggable>
            
            <Draggable nodeRef={nodeRef} cancel=".dont-move-draggable">
                <div style={{ position: 'absolute', top: "66%", left: "50%", zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={`${props.componentToEdit.getComponentName()}_deploy_file`}>
                    <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                        <p>Deploy File: {props.componentToEdit.getComponentName()}</p>
                    </div>

                    <div className="dont-move-draggable">
                        <textarea key="2" name="viewDeploy" value={props.componentToEdit.getDeployFileContents()} readOnly={true}/>
                    </div>
                </div>
            </Draggable>
            
            {renderComponentEditor()}
        </div>
    );
}

export default ComponentEditor;