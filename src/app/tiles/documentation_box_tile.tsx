import { ChangeEvent } from "react";
import DocumentationSection from "../project_components/documentation_section";
import TileContainer from "./tile_container";

const DocumentationBoxTile = (props: {parentComponent: DocumentationSection}) => {
    function documentationOnChangeHandler (event: ChangeEvent<HTMLTextAreaElement>) {
        props.parentComponent.setContent(event.target.value);
    }

    return (
        <TileContainer
            parentComponent={props.parentComponent}
            containerContents={
                <textarea
                    name="documentation"
                    rows={4}
                    cols={40}
                    defaultValue={props.parentComponent.getContent()}
                    onChange={e => documentationOnChangeHandler(e)}
                />
            }
        />
    );

}

export default DocumentationBoxTile;