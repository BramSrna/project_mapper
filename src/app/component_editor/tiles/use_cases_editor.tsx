import UseCaseItem from "@/app/project/project_component/components/uses_cases/use_case_item";
import UseCases from "@/app/project/project_component/components/uses_cases/use_cases";
import { useEffect, useState } from "react";

const UseCasesEditor = (props: {useCasesComp: UseCases}) => {
    const [useCases, setUseCases] = useState<UseCaseItem[]>([]);

    useEffect(() => {
        setUseCases([...props.useCasesComp.getUseCases()]);
    }, [props.useCasesComp]);

    function deleteUseCaseOnClickHandler(useCaseToDelete: UseCaseItem) {
        props.useCasesComp.deleteUseCase(useCaseToDelete);
        setUseCases(useCases.filter(function(useCase: UseCaseItem) {
            return useCase !== useCaseToDelete
        }))
    }

    function addUseCaseOnClickHandler() {
        const newUseCase: UseCaseItem = new UseCaseItem(props.useCasesComp, "");
        props.useCasesComp.addUseCase(newUseCase);
        setUseCases([
            ...useCases,
            newUseCase
        ])
    }

    return (
        <div>
            <p>Operating Walls:</p>
            <p>Start Operating Wall: <textarea defaultValue={props.useCasesComp.getStartOperatingWall()} onChange={e => props.useCasesComp.setStartOperatingWall(e.target.value)}/></p>
            <p>End Operating Wall: <textarea defaultValue={props.useCasesComp.getEndOperatingWall()} onChange={e => props.useCasesComp.setEndOperatingWall(e.target.value)}/></p>
            <p>Use Cases:</p>
            {
                <div>
                    <table>
                        <tbody>
                            {
                                props.useCasesComp.getUseCases().map(function(currUseCase) {
                                    return (
                                        <tr key={currUseCase.getId()}>
                                            <td><input type="text" defaultValue={currUseCase.getDescription()} onChange={e => currUseCase.setDescription(e.target.value)}/></td>
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