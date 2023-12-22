import ComponentDescription from "@/app/project/project_component/components/component_description";

const ComponentDescriptionVisualizer = (props: {componentDescriptionComp: ComponentDescription}) => {
    return (
        <pre>
            {JSON.stringify(props.componentDescriptionComp.getDisplayableContentsJson(), null, 2)}
        </pre>
    );
}

export default ComponentDescriptionVisualizer;