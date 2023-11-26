import { useRef, ChangeEvent, MutableRefObject, useState } from "react";
import Draggable from 'react-draggable';
import ProjectDescription from "../project_components/project_description";
import {useXarrow} from 'react-xarrows';

const ProjectDescriptionTile = (props: {parentComponent: ProjectDescription}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    
    const nodeRef: MutableRefObject<null> = useRef(null);

    function projectNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setProjectName(event.target.value);
    }

    function projectTypeOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setProjectType(event.target.value);
    }

    function repoLinkOnChangeHandler (event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setRepoLink(event.target.value);
    }

    function roadmapLinkOnChangeHandler (event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setRoadmapLink(event.target.value);
    }

    function executionFileLinkOnChangeHandler (event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setExecutionFileLink(event.target.value);
    }

    function deleteSectionHandler() {
        props.parentComponent.removeFromProject();
        setStillExists(false);
    }

    return (
        stillExists &&
        <Draggable nodeRef={nodeRef} onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={props.parentComponent.getComponentName()}>
                <div ref={nodeRef} className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                    {props.parentComponent.getComponentName()}
                    <button onClick={deleteSectionHandler}>Delete</button>
                </div>
                <form ref={nodeRef} id="ProjectEditor">
                    <p>Project Name: <input type="text" name="projectName" defaultValue={props.parentComponent.getProjectName()} onChange={projectNameOnChangeHandler}/></p>
                    <p>Project Type: <input type="text" name="projectType" defaultValue={props.parentComponent.getProjectType()} onChange={projectTypeOnChangeHandler}/></p>
                    <p>Repo Link: <input type="text" name="repoLink" defaultValue={props.parentComponent.getRepoLink()} onChange={repoLinkOnChangeHandler}/></p>
                    <p>Roadmap Link: <input type="text" name="roadmapLink" defaultValue={props.parentComponent.getRoadmapLink()} onChange={roadmapLinkOnChangeHandler}/></p>
                    <p>Execution File Link: <input type="text" name="executionFileLink" defaultValue={props.parentComponent.getExecutionFileLink()} onChange={executionFileLinkOnChangeHandler}/></p>
                </form>
            </div>
        </Draggable>
    );
}

export default ProjectDescriptionTile;