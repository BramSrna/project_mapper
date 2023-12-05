import ProjectComponent from "../project_components/project_component";

const Visualizer = (props: {componentToVisualize: ProjectComponent}) => {
    return (
        <div>
            <p>Visualizer</p>
            <p>Displaying Component: {props.componentToVisualize.getComponentName()}</p>
            <div>
                {props.componentToVisualize.getVisualizerContents()}
            </div>
        </div>
    );

}

export default Visualizer;