import ComponentDescription from "@/app/project/project_component/components/component_description";
import { MutableRefObject, useRef } from "react";

const ComponentDescriptionEditor = (props: {componentDescriptionComp: ComponentDescription}) => {    
    const nodeRef: MutableRefObject<null> = useRef(null);

    return (
        <form ref={nodeRef} id="ComponentDescriptionTile">
            <p>End Goal:
                <textarea
                    name="endGoal"
                    rows={4}
                    cols={40}
                    defaultValue={props.componentDescriptionComp.getEndGoal()}
                    onChange={(event) => props.componentDescriptionComp.setEndGoal(event.target.value)}
                />
            </p>
            <p> Mission statement:
                <textarea
                    name="missionStatement"
                    rows={4}
                    cols={40}
                    defaultValue={props.componentDescriptionComp.getMissionStatement()}
                    onChange={(event) => props.componentDescriptionComp.setMissionStatement(event.target.value)}
                />
            </p>
        </form>
    );
}

export default ComponentDescriptionEditor;