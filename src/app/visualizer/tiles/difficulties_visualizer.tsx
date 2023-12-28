import Difficulties from "@/app/project/project_component/components/difficulties/difficulties";
import PossibleSolution from "@/app/project/project_component/components/difficulties/possible_solution";

const DifficultiesVisualizer = (props: {difficultiesComp: Difficulties}) => {
    return (
        <table>
            <thead>
                <tr>
                    <td>Difficulty</td>
                    <td>Potential Solution(s)</td>
                </tr>
            </thead>
            <tbody>
                {
                    props.difficultiesComp.getDifficulties().map(function(currDifficulty) {
                        const numPossibleSolutions: number = currDifficulty.getPossibleSolutions().length;
                        if (numPossibleSolutions <= 0) {
                            return (
                                <tr key={currDifficulty.getId()}>
                                    <td>{currDifficulty.getDescription()}</td>
                                    <td></td>
                                </tr>
                            );
                        } else {
                            return currDifficulty.getPossibleSolutions().map(function(currPossibleSolution: PossibleSolution, solutionIndex: number) {
                                if (solutionIndex === 0) {
                                    return (
                                        <tr key={currPossibleSolution.getId()}>
                                            <td rowSpan={numPossibleSolutions}>{currDifficulty.getDescription()}</td>
                                            <td>{currPossibleSolution.getDescription()}</td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={currPossibleSolution.getId()}>
                                            <td>{currPossibleSolution.getDescription()}</td>
                                        </tr>
                                    );
                                }
                            });
                        }
                    })
                }
            </tbody>
        </table>
    );
}

export default DifficultiesVisualizer;