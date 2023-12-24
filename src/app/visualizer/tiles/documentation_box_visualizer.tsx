import IdGenerator from "@/app/id_generator";
import DocumentationSection from "@/app/project/project_component/components/documentation_section";
import { useEffect, useState } from "react";

const DocumentationSectionVisualizer = (props: {documentationSectionComp: DocumentationSection}) => {
    const [lines, setLines] = useState<object[]>([]);

    useEffect(() => {
        let initLines: object[] = [];
        props.documentationSectionComp.getContent().split("\n").map(function(currLine: string) {
            initLines.push({
                "content": currLine,
                "id": IdGenerator.generateId()
            })
        })
        setLines(initLines);
    }, [props.documentationSectionComp]);

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