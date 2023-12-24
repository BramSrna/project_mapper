import ComponentDescription from "@/app/project/project_component/components/component_description";
import { ChangeEvent, MutableRefObject, useRef } from "react";

const ComponentDescriptionEditor = (props: {componentDescriptionComp: ComponentDescription}) => {    
    const nodeRef: MutableRefObject<null> = useRef(null);

    function endGoalOnChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        props.componentDescriptionComp.setEndGoal(event.target.value);
    }

    function missionStatementOnChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        props.componentDescriptionComp.setMissionStatement(event.target.value);
    }

    return (
        <form ref={nodeRef} id="ComponentDescriptionTile">
            <p>End Goal:
                <textarea
                    name="endGoal"
                    rows={4}
                    cols={40}
                    defaultValue={props.componentDescriptionComp.getEndGoal()}
                    onChange={endGoalOnChangeHandler}
                />
            </p>
            <p> Mission statement:
                <textarea
                    name="missionStatement"
                    rows={4}
                    cols={40}
                    defaultValue={props.componentDescriptionComp.getMissionStatement()}
                    onChange={missionStatementOnChangeHandler}
                />
            </p>
        </form>
    );
}

export default ComponentDescriptionEditor;