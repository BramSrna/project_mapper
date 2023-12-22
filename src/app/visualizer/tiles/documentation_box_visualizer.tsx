import DocumentationSection from "@/app/project/project_component/components/documentation_section";
import { ChangeEvent } from "react";

const DocumentationSectionVisualizer = (props: {documentationSectionComp: DocumentationSection}) => {
    let keyIndex: number = 0;
    return (
        <div>
            {props.documentationSectionComp.getContent().split("\n").map(function(currLine) {
                    return (<p key={keyIndex++}>{currLine}</p>);
            })}
        </div>
    );

}

export default DocumentationSectionVisualizer;