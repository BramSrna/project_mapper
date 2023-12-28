import UseCaseItem from "@/app/project/project_component/components/uses_cases/use_case_item";
import UseCases from "@/app/project/project_component/components/uses_cases/use_cases";

const UseCasesVisualizer = (props: {useCasesComp: UseCases}) => {
    return (
        <div>
            <p>Operating Walls:</p>
            <p>Start Operating Wall: {props.useCasesComp.getStartOperatingWall()}</p>
            <p>End Operating Wall: {props.useCasesComp.getEndOperatingWall()}</p>
            <p>Use Cases:</p>
            <table>
                <tbody>
                    {props.useCasesComp.getUseCases().map(function(currUseCase: UseCaseItem) {
                        return (
                            <tr key={currUseCase.getId()}><td>{currUseCase.getDescription()}</td></tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default UseCasesVisualizer;