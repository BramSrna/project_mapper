import { useRef, ChangeEvent, MutableRefObject } from "react";
import ProjectDescription from "../project_components/component_description";
import TileContainer from "./tile_container";
import ComponentDescription from "../project_components/component_description";

const ComponentDescriptionTile = (props: {parentComponent: ComponentDescription}) => {    
    const nodeRef: MutableRefObject<null> = useRef(null);

    function nameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setName(event.target.value);
    }

    function componentTypeOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setComponentType(event.target.value);
    }

    function endGoalOnChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        props.parentComponent.setEndGoal(event.target.value);
    }

    function missionStatementOnChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        props.parentComponent.setMissionStatement(event.target.value);
    }

    return (
        <TileContainer parentComponent={props.parentComponent}>
            <form ref={nodeRef} id="ComponentDescriptionTile">
                <p>Component Name: <input type="text" name="componentName" defaultValue={props.parentComponent.getName()} onChange={nameOnChangeHandler}/></p>
                <p>Component Type: <input type="text" name="componentType" defaultValue={props.parentComponent.getComponentType()} onChange={componentTypeOnChangeHandler}/></p>
                <p>End Goal:
                    <textarea
                        name="endGoal"
                        key = "4"
                        rows={4}
                        cols={40}
                        defaultValue={props.parentComponent.getEndGoal()}
                        onChange={endGoalOnChangeHandler}
                    />
                </p>
                <p> Mission statement:
                    <textarea
                        name="missionStatement"
                        key = "4"
                        rows={4}
                        cols={40}
                        defaultValue={props.parentComponent.getMissionStatement()}
                        onChange={missionStatementOnChangeHandler}
                    />
                </p>
            </form>
        </TileContainer>
    );
}

export default ComponentDescriptionTile;