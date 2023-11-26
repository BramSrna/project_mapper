import { useRef, ChangeEvent, MutableRefObject, useState } from "react";
import Draggable from 'react-draggable';
import DocumentationSection from "../project_components/documentation_section";
import {useXarrow} from 'react-xarrows';

const DocumentationBoxTile = (props: {parentComponent: DocumentationSection}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);

    const nodeRef: MutableRefObject<null> = useRef(null);

    function documentationOnChangeHandler (event: ChangeEvent<HTMLTextAreaElement>) {
        props.parentComponent.setContent(event.target.value);
    }

    function deleteSectionHandler() {
        props.parentComponent.removeFromProject();
        setStillExists(false);
    }

    return (
        stillExists &&
        <Draggable nodeRef={nodeRef} onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={props.parentComponent.getComponentName()}>
                <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                    {props.parentComponent.getComponentName()}
                    <button onClick={deleteSectionHandler}>Delete</button>
                </div>
                <textarea
                    name="documentation"
                    rows={4}
                    cols={40}
                    defaultValue={props.parentComponent.getContent()}
                    onChange={e => documentationOnChangeHandler(e)}
                />
            </div>
        </Draggable>
    );

}

export default DocumentationBoxTile;