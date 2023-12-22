import UseCases from "@/app/project/project_component/components/use_cases";

const UseCasesVisualizer = (props: {useCasesComp: UseCases}) => {    
    let keyVal: number = 0;
    return (
        <div>
            <p>Operating Walls:</p>
            <p>Start Operating Wall: {props.useCasesComp.getStartOperatingWall()}</p>
            <p>End Operating Wall: {props.useCasesComp.getEndOperatingWall()}</p>
            <p>Use Cases:</p>
            <table>
                <tbody>
                    {props.useCasesComp.getUseCases().map(function(currUseCase) {
                        return (
                            <tr key={keyVal++}><td key={keyVal++}>{currUseCase}</td></tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default UseCasesVisualizer;