import Difficulties from "@/app/project/project_component/components/difficulties/difficulties";
import DifficultyEntry from "@/app/project/project_component/components/difficulties/difficulty_entry";
import PossibleSolution from "@/app/project/project_component/components/difficulties/possible_solution";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Position, Rnd } from "react-rnd";
import { useXarrow } from "react-xarrows";
import "./component_editor_tiles.css";

const DIFFICULTY_ENTRY_MIN_WIDTH: number = 275;
const DIFFICULTY_ENTRY_MIN_HEIGHT: number = 150;

const PossibleSolutionBlock = (props: {difficulty: DifficultyEntry}) => {
    const [possibleSolutions, setPossibleSolutions] = useState<PossibleSolution[]>([]);

    useEffect(() => {
        setPossibleSolutions([...props.difficulty.getPossibleSolutions()]);
    }, [props.difficulty]);

    function deletePossibleSolutionOnClickHandler(possibleSolutionToDelete: PossibleSolution) {
        props.difficulty.deletePossibleSolution(possibleSolutionToDelete);
        setPossibleSolutions(possibleSolutions.filter(function(currPossibleSolution: PossibleSolution) {
            return (currPossibleSolution !== possibleSolutionToDelete);
        }))
    }

    function addPossibleSolutionOnClickHandler() {
        const newPossibleSolution: PossibleSolution = new PossibleSolution(props.difficulty, "");
        props.difficulty.addPossibleSolution(newPossibleSolution);
        setPossibleSolutions([
            ...possibleSolutions,
            newPossibleSolution
        ])
    }
    
    return (
        <div>
            {
                props.difficulty.getPossibleSolutions().map(function(currPossibleSolution: PossibleSolution) {
                    return (
                        <div key={currPossibleSolution.getId()}>
                            <textarea
                                name="documentation"
                                rows={4}
                                cols={40}
                                defaultValue={currPossibleSolution.getDescription()}
                                onChange={e => currPossibleSolution.setDescription(e.target.value)}
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
    let difficultiesEditorWindowRef = useRef<HTMLInputElement>(null);

    const updateXarrow = useXarrow();
    const [difficulties, setDifficulties] = useState<DifficultyEntry[]>([]);
    const [difficultiesEditorWindowHeight, setDifficultiesEditorWindowHeight] = useState<number>(1080);
    const [difficultiesEditorWindowWidth, setDifficultiesEditorWindowWidth] = useState<number>(1920);

    useEffect(() => {
        setDifficulties([...props.difficultiesComp.getDifficulties()]);

        if ((difficultiesEditorWindowRef !== null) && (difficultiesEditorWindowRef.current !== null)) {
            setDifficultiesEditorWindowHeight(difficultiesEditorWindowRef.current.offsetHeight);
            setDifficultiesEditorWindowWidth(difficultiesEditorWindowRef.current.offsetWidth);
        }
    }, [props.difficultiesComp]);

    function addDifficulty() {
        const newDifficulty: DifficultyEntry = new DifficultyEntry(props.difficultiesComp, "", []);
        props.difficultiesComp.addDifficulty(newDifficulty);
        setDifficulties([
            ...difficulties,
            newDifficulty
        ]);
    }

    function deleteDifficultyOnClickHandler(difficultyToDelete: DifficultyEntry) {
        props.difficultiesComp.deleteDifficulty(difficultyToDelete);
        setDifficulties(difficulties.filter(function(currDifficulty: DifficultyEntry) {
            return (currDifficulty !== difficultyToDelete);
        }))
    }

    function getDispSquareDim() {
        let dispSquareDim: number = 1;
        while (dispSquareDim ** 2 < difficulties.length) {
            dispSquareDim += 1;
        }
        return dispSquareDim;
    }

    return (
        <div className="projectEditorContainer">
            <div className="sideBySideContainer projectEditorMenu">
                <button onClick={addDifficulty}>Add Difficulty</button>
            </div>
            
            <div className="difficultiesEditorWindow" ref={difficultiesEditorWindowRef}>
                {
                    difficulties.map(function(currDifficulty: DifficultyEntry, index: number) {
                        const colIndex: number = index % getDispSquareDim();
                        const rowIndex: number = Math.floor(index / getDispSquareDim());

                        let xPos: number = (colIndex * (DIFFICULTY_ENTRY_MIN_WIDTH + 50)) % difficultiesEditorWindowWidth;
                        if ((xPos + DIFFICULTY_ENTRY_MIN_WIDTH) > difficultiesEditorWindowWidth) {
                            xPos -= xPos + DIFFICULTY_ENTRY_MIN_WIDTH - difficultiesEditorWindowWidth;
                        }

                        let yPos: number = (rowIndex * (DIFFICULTY_ENTRY_MIN_HEIGHT + 50)) % difficultiesEditorWindowHeight;
                        if ((yPos + DIFFICULTY_ENTRY_MIN_HEIGHT) > difficultiesEditorWindowHeight) {
                            yPos -= yPos + DIFFICULTY_ENTRY_MIN_HEIGHT - difficultiesEditorWindowHeight;
                        }

                        const initialPosition: Position = {
                            x: xPos,
                            y: yPos
                        };
                        
                        return (
                            <Rnd
                                style={{
                                    border: "solid 1px #ddd",
                                    background: "#f0f0f0",
                                    overflow: "hidden"
                                }}
                                default={{
                                    x: initialPosition["x"],
                                    y: initialPosition["y"],
                                    width: DIFFICULTY_ENTRY_MIN_WIDTH,
                                    height: DIFFICULTY_ENTRY_MIN_HEIGHT
                                }}
                                onDrag={updateXarrow}
                                onDragStop={updateXarrow}
                                id={currDifficulty.getDescription() + index}
                                minWidth={DIFFICULTY_ENTRY_MIN_WIDTH}
                                minHeight={DIFFICULTY_ENTRY_MIN_HEIGHT}
                                key={currDifficulty.getId()}
                                bounds=".difficultiesEditorWindow"
                                dragHandleClassName={"handle"}
                            >
                                <div>
                                    <div className="sideBySideContainer handleContainer">
                                        <div className="handle"/>
                                        <button onClick={() => deleteDifficultyOnClickHandler(currDifficulty)}>X</button>
                                    </div>
                    
                                    <div className="dont-move-draggable">
                                        <textarea
                                            name="documentation"
                                            rows={4}
                                            cols={40}
                                            defaultValue={currDifficulty.getDescription()}
                                            onChange={e => currDifficulty.setDescription(e.target.value)}
                                        />
                    
                                        <PossibleSolutionBlock difficulty={currDifficulty}></PossibleSolutionBlock>
                                    </div>
                                </div>
                            </Rnd>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default DifficultiesEditor;