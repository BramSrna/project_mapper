import DocumentationSection from "@/app/project/project_component/components/documentation_section";
import { ChangeEvent } from "react";

const DocumentationSectionEditor = (props: {documentationSectionComp: DocumentationSection}) => {
    function documentationOnChangeHandler (event: ChangeEvent<HTMLTextAreaElement>) {
        props.documentationSectionComp.setContent(event.target.value);
    }

    return (
        <div>
            <textarea
                name="documentation"
                rows={4}
                cols={40}
                defaultValue={props.documentationSectionComp.getContent()}
                onChange={e => documentationOnChangeHandler(e)}
            />
        </div>
    );

}

export default DocumentationSectionEditor;