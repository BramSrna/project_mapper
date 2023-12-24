import UseCaseItem from "@/app/project/project_component/components/uses_cases/use_case_item";
import UseCases from "@/app/project/project_component/components/uses_cases/use_cases";
import { ChangeEvent, useEffect, useState } from "react";

const UseCasesEditor = (props: {useCasesComp: UseCases}) => {
    const [useCases, setUseCases] = useState<UseCaseItem[]>([]);

    useEffect(() => {
        setUseCases([...props.useCasesComp.getUseCases()]);
    }, [props.useCasesComp]);

    function startOperatingWallOnChangeHandler(newStartOperatingWall: string) {
        props.useCasesComp.setStartOperatingWall(newStartOperatingWall);
    }

    function endOperatingWallOnChangeHandler(newEndOperatingWall: string) {
        props.useCasesComp.setEndOperatingWall(newEndOperatingWall);
    }

    function useCaseOnChangeHandler(useCase: UseCaseItem, newValue: string) {
        useCase.setDescription(newValue);
    }

    function deleteUseCaseOnClickHandler(useCaseToDelete: UseCaseItem) {
        props.useCasesComp.deleteUseCase(useCaseToDelete);
        setUseCases(useCases.filter(function(useCase: UseCaseItem) {
            return useCase !== useCaseToDelete
        }))
    }

    function addUseCaseOnClickHandler() {
        let newUseCase: UseCaseItem = new UseCaseItem(props.useCasesComp, "");
        props.useCasesComp.addUseCase(newUseCase);
        setUseCases([
            ...useCases,
            newUseCase
        ])
    }

    return (
        <div>
            <p>Operating Walls:</p>
            <p>Start Operating Wall: <input type="text" name="startOperatingWall" defaultValue={props.useCasesComp.getStartOperatingWall()} onChange={e => startOperatingWallOnChangeHandler(e.target.value)}/></p>
            <p>End Operating Wall: <input type="text" name="endOperatingWall" defaultValue={props.useCasesComp.getEndOperatingWall()} onChange={e => endOperatingWallOnChangeHandler(e.target.value)}/></p>
            <p>Use Cases:</p>
            {
                <div>
                    <table>
                        <tbody>
                            {
                                useCases.map(function(currUseCase) {
                                    return (
                                        <tr key={currUseCase.getId()}>
                                            <td><input type="text" defaultValue={currUseCase.getDescription()} onChange={e => useCaseOnChangeHandler(currUseCase, e.target.value)}/></td>
                                            <td><button onClick={() => deleteUseCaseOnClickHandler(currUseCase)}>Delete Use Case</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={addUseCaseOnClickHandler}>Add Use Case</button>
                </div>
            }
        </div>
    );
}

export default UseCasesEditor;