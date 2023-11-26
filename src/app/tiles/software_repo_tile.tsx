import { useRef, ChangeEvent, MutableRefObject, useState } from "react";
import Draggable from 'react-draggable';
import {useXarrow} from 'react-xarrows';
import SoftwareRepo from "../project_components/software_repo";
import Toggle from 'react-toggle'

const SoftwareRepoTile = (props: {parentComponent: SoftwareRepo}) => {
    const updateXarrow = useXarrow();

    const [stillExists, setStillExists] = useState(true);
    const [displayInitNameTargetField, setDisplayInitNameTargetField] = useState(props.parentComponent.getCreateUsingInit())
    
    const nodeRef: MutableRefObject<null> = useRef(null);

    function cloneTargetOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setCloneTarget(event.target.value);
    }

    function initRepoNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setInitRepoName(event.target.value);
    }

    function deleteSectionHandler() {
        props.parentComponent.removeFromProject();
        setStillExists(false);
    }

    function switchDisplayedFields() {
        props.parentComponent.setCreateUsingInit(!props.parentComponent.getCreateUsingInit());
        setDisplayInitNameTargetField(!displayInitNameTargetField);
    }

    function getFormFields() {
        if (displayInitNameTargetField) {
            return (<p>Init Repo Name: <input type="text" name="initRepoName" defaultValue={props.parentComponent.getInitRepoName()} onChange={initRepoNameOnChangeHandler}/></p>);
        }
        return (<p>Clone Repo Target: <input type="text" name="cloneRepoTarget" defaultValue={props.parentComponent.getCloneTarget()} onChange={cloneTargetOnChangeHandler}/></p>);
    }

    return (
        stillExists &&
        <Draggable nodeRef={nodeRef} onDrag={updateXarrow} onStop={updateXarrow}>
            <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} ref={nodeRef} id={props.parentComponent.getComponentName()}>
                <div ref={nodeRef} className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                    {props.parentComponent.getComponentName()}
                    <button onClick={deleteSectionHandler}>Delete</button>
                </div>
                <label>
                    <Toggle
                        defaultChecked={displayInitNameTargetField}
                        icons={false}
                        onChange={switchDisplayedFields}
                    />
                    <span>Toggle Init Method</span>
                </label>
                <form ref={nodeRef} id="SoftwareRepo">
                    {getFormFields()}
                </form>
            </div>
        </Draggable>
    );
}

export default SoftwareRepoTile;