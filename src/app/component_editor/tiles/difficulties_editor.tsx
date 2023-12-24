import Difficulties from "@/app/project/project_component/components/difficulties/difficulties";
import DifficultyEntry from "@/app/project/project_component/components/difficulties/difficulty_entry";
import PossibleSolution from "@/app/project/project_component/components/difficulties/possible_solution";
import { ChangeEvent, LegacyRef, MutableRefObject, forwardRef, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useXarrow } from "react-xarrows";

const DIFFICULTY_ENTRY_MIN_WIDTH: number = 275;
const DIFFICULTY_ENTRY_MIN_HEIGHT: number = 150;

const PossibleSolutionBlock = (props: {difficulty: DifficultyEntry}) => {
    const [possibleSolutions, setPossibleSolutions] = useState<PossibleSolution[]>([]);

    useEffect(() => {
        setPossibleSolutions([...props.difficulty.getPossibleSolutions()]);
    }, [props.difficulty]);

    function posssibleSolutionOnChangeHandler(possibleSolution: PossibleSolution, newDescription: string) {
        possibleSolution.setDescription(newDescription);
    }

    function deletePossibleSolutionOnClickHandler(possibleSolutionToDelete: PossibleSolution) {
        props.difficulty.deletePossibleSolution(possibleSolutionToDelete);
        setPossibleSolutions(possibleSolutions.filter(function(currPossibleSolution: PossibleSolution) {
            return (currPossibleSolution !== possibleSolutionToDelete);
        }))
    }

    function addPossibleSolutionOnClickHandler() {
        let newPossibleSolution: PossibleSolution = new PossibleSolution(props.difficulty, "");
        props.difficulty.addPossibleSolution(newPossibleSolution);
        setPossibleSolutions([
            ...possibleSolutions,
            newPossibleSolution
        ])
    }
    
    return (
        <div>
            {
                possibleSolutions.map(function(currPossibleSolution: PossibleSolution) {
                    return (
                        <div key={currPossibleSolution.getId()}>
                            <textarea
                                name="documentation"
                                rows={4}
                                cols={40}
                                defaultValue={currPossibleSolution.getDescription()}
                                onChange={e => posssibleSolutionOnChangeHandler(currPossibleSolution, e.target.value)}
                            />
                            <button onClick={() => deletePossibleSolutionOnClickHandler(currPossibleSolution)}>Delete Possible Solution</button>
                        </div>
                    )
                })
            }
            <button onClick={() => addPossibleSolutionOnClickHandler()}>Add Possible Solution</button>
        </div>
    )
}

const DifficultiesEditor = (props: {difficultiesComp: Difficulties}) => {
    const updateXarrow = useXarrow();
    const [difficulties, setDifficulties] = useState<DifficultyEntry[]>([]);

    const nodeRef: MutableRefObject<null> = useRef(null);

    useEffect(() => {
        setDifficulties([...props.difficultiesComp.getDifficulties()]);
    }, [props.difficultiesComp]);

    function addDifficulty() {
        let newDifficulty: DifficultyEntry = new DifficultyEntry(props.difficultiesComp, "", []);
        props.difficultiesComp.addDifficulty(newDifficulty);
        setDifficulties([
            ...difficulties,
            newDifficulty
        ]);
    }

    function difficultyDescriptionOnChangeHandler(difficultyEntry: DifficultyEntry, newDescription: string) {
        difficultyEntry.setDescription(newDescription);
    }

    function deleteDifficultyOnClickHandler(difficultyToDelete: DifficultyEntry) {
        props.difficultiesComp.deleteDifficulty(difficultyToDelete);
        setDifficulties(difficulties.filter(function(currDifficulty: DifficultyEntry) {
            return (currDifficulty !== difficultyToDelete);
        }))
    }

    let dispSquareDim: number = 1;
    while (dispSquareDim ** 2 < difficulties.length) {
        dispSquareDim += 1;
    }

    return (
        <div>
            {
                difficulties.map(function(currDifficulty: DifficultyEntry, index: number) {
                    let rowIndex: number = Math.floor(index / dispSquareDim);
                    let colIndex: number = index % dispSquareDim;

                    let initialPosition: object = {
                        x: colIndex * (DIFFICULTY_ENTRY_MIN_WIDTH + 50),
                        y: rowIndex * (DIFFICULTY_ENTRY_MIN_HEIGHT + 50)
                    };
                    console.log(initialPosition)
                    return (
                        <Rnd
                            style={{
                                border: "solid 1px #ddd",
                                background: "#f0f0f0",
                                overflow: "hidden"
                            }}
                            default={{
                              x: initialPosition["x" as keyof typeof initialPosition],
                              y: initialPosition["y" as keyof typeof initialPosition],
                              width: DIFFICULTY_ENTRY_MIN_WIDTH,
                              height: DIFFICULTY_ENTRY_MIN_HEIGHT
                            }}
                            onDrag={updateXarrow}
                            onDragStop={updateXarrow}
                            id={currDifficulty.getDescription() + index}
                            minWidth={DIFFICULTY_ENTRY_MIN_WIDTH}
                            minHeight={DIFFICULTY_ENTRY_MIN_HEIGHT}
                            key={currDifficulty.getId()}
                        >
                            <div>
                                <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}>
                                    <button onClick={() => deleteDifficultyOnClickHandler(currDifficulty)}>Delete Difficulty</button>
                                </div>
                
                                <div className="dont-move-draggable">
                                    <textarea
                                        name="documentation"
                                        rows={4}
                                        cols={40}
                                        defaultValue={currDifficulty.getDescription()}
                                        onChange={e => difficultyDescriptionOnChangeHandler(currDifficulty, e.target.value)}
                                    />
                
                                    <PossibleSolutionBlock difficulty={currDifficulty}></PossibleSolutionBlock>
                                </div>
                            </div>
                        </Rnd>
                    )
                })
            }
            <button onClick={addDifficulty}>Add Difficulty</button>
        </div>
    );
}

export default DifficultiesEditor;