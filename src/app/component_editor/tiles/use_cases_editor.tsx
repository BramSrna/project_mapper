import UseCases from "@/app/project/project_component/components/use_cases";
import { ChangeEvent } from "react";

const UseCasesEditor = (props: {useCasesComp: UseCases}) => {
    function startOperatingWallOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.useCasesComp.setStartOperatingWall(event.target.value);
    }

    function endOperatingWallOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.useCasesComp.setEndOperatingWall(event.target.value);
    }

    function useCaseOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.useCasesComp.setUseCase(rowIndex, event.target.value);
    }

    function deleteUseCaseOnClickHandler(rowIndex: number) {
        props.useCasesComp.deleteUseCase(rowIndex);
    }

    function addUseCaseOnClickHandler() {
        props.useCasesComp.addUseCase();
    }

    function getFormFields() {
        let keyVal = 0;
        const useCaseRows = props.useCasesComp.getUseCases().map(function(currUseCase, rowIndex) {
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
        <div>
            <form id="Todo">
                <p>Operating Walls:</p>
                <p>Start Operating Wall: <input type="text" name="startOperatingWall" defaultValue={props.useCasesComp.getStartOperatingWall()} onChange={startOperatingWallOnChangeHandler}/></p>
                <p>End Operating Wall: <input type="text" name="endOperatingWall" defaultValue={props.useCasesComp.getEndOperatingWall()} onChange={endOperatingWallOnChangeHandler}/></p>
                <p>Use Cases:</p>
                {getFormFields()}
            </form>
        </div>
    );
}

export default UseCasesEditor;