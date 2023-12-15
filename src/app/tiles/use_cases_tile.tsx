import { ChangeEvent } from "react";
import TileContainer from "./tile_container";
import Todo from "../project_components/todo";
import UseCases from "../project_components/use_cases";

const UseCasesTile = (props: {parentComponent: UseCases}) => {
    function startOperatingWallOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setStartOperatingWall(event.target.value);
    }

    function endOperatingWallOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setEndOperatingWall(event.target.value);
    }

    function useCaseOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.parentComponent.setUseCase(rowIndex, event.target.value);
    }

    function deleteUseCaseOnClickHandler(rowIndex: number) {
        props.parentComponent.deleteUseCase(rowIndex);
    }

    function addUseCaseOnClickHandler() {
        props.parentComponent.addUseCase();
    }

    function getFormFields() {
        let keyVal = 0;
        const useCaseRows = props.parentComponent.getUseCases().map(function(currUseCase, rowIndex) {
            return (
                <tr key={keyVal++}>
                    <td key={keyVal++}><input type="text" defaultValue={currUseCase} onChange={e => useCaseOnChangeHandler(e, rowIndex)}/></td>
                    <td key={keyVal++}><button onClick={() => deleteUseCaseOnClickHandler(rowIndex)}>Delete Use Case</button></td>
                </tr>
            )
        });
        return (
            <div>
                <table>
                    <tbody>
                        {useCaseRows}
                    </tbody>
                </table>
                <button onClick={addUseCaseOnClickHandler}>Add Use Case</button>
            </div>
        )
    }

    return (
        <TileContainer parentComponent={props.parentComponent}>
            <div>
                <form id="Todo">
                    <p>Operating Walls:</p>
                    <p>Start Operating Wall: <input type="text" name="startOperatingWall" defaultValue={props.parentComponent.getStartOperatingWall()} onChange={startOperatingWallOnChangeHandler}/></p>
                    <p>End Operating Wall: <input type="text" name="endOperatingWall" defaultValue={props.parentComponent.getEndOperatingWall()} onChange={endOperatingWallOnChangeHandler}/></p>
                    <p>Use Cases:</p>
                    {getFormFields()}
                </form>
            </div>
        </TileContainer>
    );
}

export default UseCasesTile;