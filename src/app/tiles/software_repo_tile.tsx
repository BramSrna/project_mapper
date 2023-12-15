import { ChangeEvent, useState } from "react";
import SoftwareRepo from "../project_components/software_repo";
import Toggle from 'react-toggle'
import TileContainer from "./tile_container";

const SoftwareRepoTile = (props: {parentComponent: SoftwareRepo}) => {
    const [displayInitNameTargetField, setDisplayInitNameTargetField] = useState(props.parentComponent.getCreateUsingInit());

    function cloneTargetOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setCloneTarget(event.target.value);
    }

    function initRepoNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setInitRepoName(event.target.value);
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

    function mockInputOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.parentComponent.setMockInput(rowIndex, event.target.value);
    }

    function mockOutputOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.parentComponent.setMockOutput(rowIndex, event.target.value);
    }

    function deleteMockOnClickHandler(rowIndex: number) {
        props.parentComponent.deleteMock(rowIndex);
    }

    function addMockOnClickHandler() {
        props.parentComponent.addMock();
    }

    function getMocksTable() {
        let keyVal = 0;
        return (
            <div>
                <p>Mocks</p>
                <table>
                    <thead>
                        <tr key={keyVal++}>
                            <td key={keyVal++}>Input</td>
                            <td key={keyVal++}>Output</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.parentComponent.getMocks().map(function(currMock, rowIndex) {
                            return (
                            <tr key={keyVal++}>
                                <td key={keyVal++}><input type="text" name="mockInput" defaultValue={currMock.getInput()} onChange={e => mockInputOnChangeHandler(e, rowIndex)}/></td>
                                <td key={keyVal++}><input type="text" name="mockOutput" defaultValue={currMock.getOutput()} onChange={e => mockOutputOnChangeHandler(e, rowIndex)}/></td>
                                <td key={keyVal++}><button onClick={() => deleteMockOnClickHandler(rowIndex)}>Delete Mock</button></td>
                            </tr>);
                        })}
                    </tbody>
                </table>
                <button onClick={addMockOnClickHandler}>Add Mock</button>
            </div>
        )
    }

    return (
        <TileContainer parentComponent={props.parentComponent}>
            <div>
                <label>
                    <Toggle
                        defaultChecked={displayInitNameTargetField}
                        icons={false}
                        onChange={switchDisplayedFields}
                    />
                    <span>Toggle Init Method</span>
                </label>

                <form id="SoftwareRepo">
                    {getFormFields()}
                </form>

                <form>
                    {getMocksTable()}
                </form>                    
            </div>
        </TileContainer>
    );
}

export default SoftwareRepoTile;