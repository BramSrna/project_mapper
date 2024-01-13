import NestedComponent, { ChildLayerJsonInterface } from "@/app/project/project_component/components/nested_component";
import ProjectComponent from "@/app/project/project_component/project_component";
import { ReactElement } from "react";

const NestedComponentVisualizer = (props: {nestedComponentComp: NestedComponent}) => {
    return (
        <div>
            <p>Internal Components:</p>
            {
                props.nestedComponentComp.getOrderedChildComponents().map(function(currComponentInfo: ChildLayerJsonInterface) {
                    let currComponent: ProjectComponent = currComponentInfo["component"];
                    let layer: number = currComponentInfo["layer"];
                    return (
                        <pre key={currComponent.getId()}>{" ".repeat(layer * 4) + currComponent.getComponentName()}</pre>
                    )
                })
            }
        </div>
    );
}

export default NestedComponentVisualizer;