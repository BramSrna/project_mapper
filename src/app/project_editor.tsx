import Project from "./project_components/project";
import { useState } from "react";
import Xarrow, {Xwrapper} from 'react-xarrows';

const ProjectEditor = (props: {projectToEdit: Project}) => {
    const [arrowDeleted, setArrowDelete] = useState(true);

    const components = props.projectToEdit.getComponents().map(function(currParentComponent, index) {
        return currParentComponent.toElement(index);
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

    return (
        <Xwrapper>
            {components}
            {connections}
        </Xwrapper>
    );
}

export default ProjectEditor;