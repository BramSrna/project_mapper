import { useRef, ChangeEvent, MutableRefObject } from "react";
import ProjectDescription from "../project_components/project_description";
import TileContainer from "./tile_container";

const ProjectDescriptionTile = (props: {parentComponent: ProjectDescription}) => {    
    const nodeRef: MutableRefObject<null> = useRef(null);

    function projectNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setProjectName(event.target.value);
    }

    function projectTypeOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setProjectType(event.target.value);
    }

    return (
        <TileContainer
            parentComponent={props.parentComponent}
            containerContents={
                <form ref={nodeRef} id="ProjectEditor">
                    <p>Project Name: <input type="text" name="projectName" defaultValue={props.parentComponent.getProjectName()} onChange={projectNameOnChangeHandler}/></p>
                    <p>Project Type: <input type="text" name="projectType" defaultValue={props.parentComponent.getProjectType()} onChange={projectTypeOnChangeHandler}/></p>
                </form>
            }
        />
    );
}

export default ProjectDescriptionTile;