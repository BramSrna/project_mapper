import DocumentationSection from "@/app/project/project_component/components/documentation_section";

const DocumentationSectionVisualizer = (props: {documentationSectionComp: DocumentationSection}) => {
    return (
        <textarea
            name="documentation"
            rows={4}
            cols={40}
            value={props.documentationSectionComp.getContent()}
            readOnly={true}
        />
    );
}

export default DocumentationSectionVisualizer;