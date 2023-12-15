import { ChangeEvent, useState } from "react";
import Toggle from 'react-toggle'
import TileContainer from "./tile_container";
import Roadmap from "../project_components/roadmap";
import Difficulties from "../project_components/difficulties";

const DifficultiesTile = (props: {parentComponent: Difficulties}) => {
    function addDifficulty() {
        props.parentComponent.addDifficulty();
    }

    function difficultyDescriptionOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.parentComponent.setDifficultyDescription(rowIndex, event.target.value);
    }

    function possibleSolutionOnChangeHandler(event: ChangeEvent<HTMLInputElement>, difficultyIndex: number, possibleSolutionIndex: number) {
        props.parentComponent.setPossibleSolution(difficultyIndex, possibleSolutionIndex, event.target.value);
    }

    function deleteDifficultyOnClickHandler(index: number) {
        props.parentComponent.deleteDifficulty(index);
    }

    function addPossibleSolutionOnClickHandler(index: number) {
        props.parentComponent.addPossibleSolution(index);
    }

    function deletePossibleSolutionOnClickHandler(difficultyIndex: number, possibleSolutionIndex: number) {
        props.parentComponent.deletePossibleSolution(difficultyIndex, possibleSolutionIndex);
    }

    function getTableBody() {
        let keyVal: number = 0;
        const difficultyRows = props.parentComponent.getDifficulties().map(function(currDifficulty, difficultyIndex) {
            let numPossibleSolutions: number = currDifficulty.getPossibleSolutions().length;
            if (numPossibleSolutions <= 0) {
                return (
                    <tbody key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++}><input type="text" defaultValue={currDifficulty.getDescription()} onChange={e => difficultyDescriptionOnChangeHandler(e, difficultyIndex)}/></td> 
                            <td key={keyVal++}></td> {/* Empty cell for possible solution */}
                            <td key={keyVal++}></td> {/* Empty cell for delete possible solution button */}
                            <td key={keyVal++}><button onClick={() => addPossibleSolutionOnClickHandler(difficultyIndex)}>Add Possible Solution</button></td>
                            <td key={keyVal++}><button onClick={() => deleteDifficultyOnClickHandler(difficultyIndex)}>Delete Difficulty</button></td>
                        </tr>
                    </tbody>
                );
            } else {
                let additionalRows: JSX.Element[] = [];
                let possibleSolutions: string[] = currDifficulty.getPossibleSolutions();
                for (let i: number = 1; i < possibleSolutions.length; i++) {
                    additionalRows.push(
                        <tr key={keyVal++}>
                            <td key={keyVal++}><input type="text" defaultValue={possibleSolutions[i]} onChange={e => possibleSolutionOnChangeHandler(e, difficultyIndex, i)}/></td>
                            <td key={keyVal++}><button onClick={() => deletePossibleSolutionOnClickHandler(difficultyIndex, i)}>Delete Possible Solution</button></td>
                        </tr>
                    );
                }
                return (
                    <tbody key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++} rowSpan={numPossibleSolutions}><input type="text" defaultValue={currDifficulty.getDescription()} onChange={e => difficultyDescriptionOnChangeHandler(e, difficultyIndex)}/></td>
                            <td key={keyVal++}><input type="text" defaultValue={possibleSolutions[0]} onChange={e => possibleSolutionOnChangeHandler(e, difficultyIndex, 0)}/></td>
                            <td key={keyVal++}><button onClick={() => deletePossibleSolutionOnClickHandler(difficultyIndex, 0)}>Delete Possible Solution</button></td>
                            <td key={keyVal++} rowSpan={numPossibleSolutions}><button onClick={() => addPossibleSolutionOnClickHandler(difficultyIndex)}>Add Possible Solution</button></td>
                            <td key={keyVal++} rowSpan={numPossibleSolutions}><button onClick={() => deleteDifficultyOnClickHandler(difficultyIndex)}>Delete Difficulty</button></td>
                        </tr>
                        {additionalRows}
                    </tbody>
                );
            }
        });
        return (
            <form>
                <table>
                    <thead key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++}>Difficulty</td>
                            <td key={keyVal++}>Potential Solution(s)</td>
                        </tr>
                    </thead>
                    {difficultyRows}
                </table>
                <button onClick={addDifficulty}>Add Difficulty</button>
            </form>
        );
    }

    return (
        <TileContainer parentComponent={props.parentComponent}>
            <div>
                {getTableBody()}
            </div>
        </TileContainer>
    );
}

export default DifficultiesTile;