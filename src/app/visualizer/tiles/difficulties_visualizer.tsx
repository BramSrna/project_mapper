import Difficulties from "@/app/project/project_component/components/difficulties/difficulties";

const DifficultiesVisualizer = (props: {difficultiesComp: Difficulties}) => {
    let keyVal: number = 0;
    return (
        <div>
            <table>
                <thead key={keyVal++}>
                    <tr key={keyVal++}>
                        <td key={keyVal++}>Difficulty</td>
                        <td key={keyVal++}>Potential Solution(s)</td>
                    </tr>
                </thead>
                {props.difficultiesComp.getDifficulties().map(function(currDifficulty, difficultyIndex) {
                    let numPossibleSolutions: number = currDifficulty.getPossibleSolutions().length;
                    if (numPossibleSolutions <= 0) {
                        return (
                            <tbody key={keyVal++}>
                                <tr key={keyVal++}>
                                    <td key={keyVal++}>{currDifficulty.getDescription()}</td> 
                                    <td key={keyVal++}></td> {/* Empty cell for possible solution */}
                                </tr>
                            </tbody>
                        );
                    } else {
                        let additionalRows: JSX.Element[] = [];
                        let possibleSolutions: string[] = currDifficulty.getPossibleSolutions();
                        for (let i: number = 1; i < possibleSolutions.length; i++) {
                            additionalRows.push(
                                <tr key={keyVal++}>
                                    <td key={keyVal++}>{possibleSolutions[i]}</td>
                                </tr>
                            );
                        }
                        return (
                            <tbody key={keyVal++}>
                                <tr key={keyVal++}>
                                    <td key={keyVal++} rowSpan={numPossibleSolutions}>{currDifficulty.getDescription()}</td>
                                    <td key={keyVal++}>{possibleSolutions[0]}</td>
                                </tr>
                                {additionalRows}
                            </tbody>
                        );
                    }
                })}
            </table>
        </div>
    );
}

export default DifficultiesVisualizer;