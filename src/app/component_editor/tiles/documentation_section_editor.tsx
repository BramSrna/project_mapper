import DocumentationSection from "@/app/project/project_component/components/documentation_section";

const DocumentationSectionEditor = (props: {documentationSectionComp: DocumentationSection}) => {
    return (
        <div>
            <textarea
                name="documentation"
                rows={4}
                cols={40}
                defaultValue={props.documentationSectionComp.getContent()}
                onChange={e => props.documentationSectionComp.setContent(e.target.value)}
            />
        </div>
    );

}

export default DocumentationSectionEditor;