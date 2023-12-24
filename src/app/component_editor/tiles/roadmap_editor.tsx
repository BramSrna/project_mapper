import IdGenerator from "@/app/id_generator";
import Roadmap from "@/app/project/project_component/components/roadmap/roadmap";
import RoadmapEntry from "@/app/project/project_component/components/roadmap/roadmap_entry";
import { ChangeEvent, FormEvent, LegacyRef, MutableRefObject, RefObject, forwardRef, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Toggle from "react-toggle";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";

const ROADMAP_ENTRY_TILE_MIN_WIDTH = 275;
const ROADMAP_ENTRY_TILE_MIN_HEIGHT = 150;

const RoadmapEntryTile = (props: {roadmapEntry: RoadmapEntry, initialPosition: object}) => {
    const updateXarrow = useXarrow();
    const nodeRef: MutableRefObject<null> = useRef(null);

    const [stillExists, setStillExists] = useState(true);

    function deleteRoadmapEntry() {
        props.roadmapEntry.deleteEntry();
        setStillExists(false);
    }

    return (
        stillExists &&
        <Rnd
            style={{
                border: "solid 1px #ddd",
                background: "#f0f0f0",
                overflow: "hidden"
            }}
            default={{
              x: props.initialPosition["x" as keyof typeof props.initialPosition],
              y: props.initialPosition["y" as keyof typeof props.initialPosition],
              width: ROADMAP_ENTRY_TILE_MIN_WIDTH,
              height: ROADMAP_ENTRY_TILE_MIN_HEIGHT
            }}
            onDrag={updateXarrow}
            onDragStop={updateXarrow}
            id={props.roadmapEntry.getId()}
            minWidth={ROADMAP_ENTRY_TILE_MIN_WIDTH}
            minHeight={ROADMAP_ENTRY_TILE_MIN_HEIGHT}
        >
            <div>
                <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}/>
                
                <div className="dont-move-draggable">
                    <p>Title: <input type="text" defaultValue={props.roadmapEntry.getTitle()} onChange={e => props.roadmapEntry.setTitle(e.target.value)}/></p>

                    <span>Entry Complete?: <Toggle
                        defaultChecked={props.roadmapEntry.getIsComplete()}
                        icons={false}
                        onChange={e => props.roadmapEntry.setIsComplete(!props.roadmapEntry.getIsComplete())}
                    />
                    </span>

                    <p>Description:</p>
                    <textarea
                        name="endGoal"
                        rows={4}
                        cols={40}
                        defaultValue={props.roadmapEntry.getDescription()}
                        onChange={e => props.roadmapEntry.setDescription(e.target.value)}
                    />

                    <button onClick={e => deleteRoadmapEntry()}>Delete Entry</button>
                </div>
            </div>
        </Rnd>
    );
}

const RoadmapEditor = (props: {roadmapComp: Roadmap}) => {    
    const [roadmapEntries, setRoadmapEntries] = useState<RoadmapEntry[]>([]);
    const [blockers, setBlockers] = useState<string[][]>([]);
    const [roadmapEditorMenuVisible, setRoadmapEditorMenuVisible] = useState(false);

    useEffect(() => {
        setRoadmapEntries([...props.roadmapComp.getEntries()]);

        let blockerInfo: string[][] = [];
        for (var currEntry of props.roadmapComp.getEntries()) {
            for (var blockerId of currEntry.getBlockers()) {
                blockerInfo.push([blockerId, currEntry.getId()])
            }
        }
        setBlockers(blockerInfo);
    }, [props.roadmapComp]);


    function addRoadmapEntry() {
        let newEntry: RoadmapEntry = new RoadmapEntry(props.roadmapComp, IdGenerator.generateId(), "", false, "", []);
        setRoadmapEntries([
            ...roadmapEntries,
            newEntry
        ]);
        props.roadmapComp.addEntry(newEntry);
    }

    function addDependencyOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const blockerId: string = formData.get("blockerId")!.toString();
        const blockerTargetId: string = formData.get("blocketTargetId")!.toString();

        if (blockerId === blockerTargetId) {
            return false;
        }

        const entryBeingBlocked = props.roadmapComp.getEntryWithId(blockerTargetId);

        if (entryBeingBlocked !== null) {
            entryBeingBlocked.addBlocker(blockerId);
            setBlockers([
                ...blockers,
                [blockerId, blockerTargetId]
            ])
        }

        event.preventDefault();
    }

    function blockerArrowOnClickHandler(blockerId: string, blockerTargetId: string) {
        const entryBeingBlocked = props.roadmapComp.getEntryWithId(blockerTargetId);
        if (entryBeingBlocked !== null) {
            entryBeingBlocked.deleteBlocker(blockerId);
            setBlockers(blockers.filter(function(blockerInfo: string[]) {
                return !((blockerInfo[0] == blockerId) && (blockerInfo[1] == blockerTargetId))
            }))
        }
    }

    function toggleRoadmapEditorMenuVisible() {
        setRoadmapEditorMenuVisible(!roadmapEditorMenuVisible);
    }

    function getRoadmapEntries() {
        let entriesToSort: RoadmapEntry[] = [...roadmapEntries];
        let columns: RoadmapEntry[][] = [];

        while (entriesToSort.length > 0) {
            let currColumn: RoadmapEntry[] = [];

            for (var currEntry of entriesToSort) {
                let allDependenciesAdded: boolean = true;

                for (var blockerId of currEntry.getBlockers()) {
                    let blockerPresent: boolean = true;
                    for (var checkEntry of entriesToSort) {
                        if (blockerId === checkEntry.getId()) {
                            blockerPresent = false;
                        }
                    }
                    allDependenciesAdded = allDependenciesAdded && blockerPresent;
                }

                if (allDependenciesAdded) {
                    currColumn.push(currEntry);
                }
            }

            if (currColumn.length > 0) {
                columns.push(currColumn);
                for (var currEntry of currColumn) {
                    let indexToDelete = entriesToSort.indexOf(currEntry)
                    if (indexToDelete !== -1) {
                        entriesToSort.splice(indexToDelete, 1);
                    }
                }
            }
        }

        let finalObjArray: object[] = [];
        for (let columnIndex: number = 0; columnIndex < columns.length; columnIndex++) {
            for (let entryIndex: number = 0; entryIndex < columns[columnIndex].length; entryIndex++) {
                finalObjArray.push({
                    "entry": columns[columnIndex][entryIndex],
                    "position": {
                        x: columnIndex * (ROADMAP_ENTRY_TILE_MIN_WIDTH + 50),
                        y: entryIndex * (ROADMAP_ENTRY_TILE_MIN_HEIGHT + 50)
                    }
                })
            }
        }
        return finalObjArray;
    }
    
    return (
        <Xwrapper>
            <div className="projectEditorMenu">
                <button onClick={toggleRoadmapEditorMenuVisible}>Roadmap Editor Menu</button>
                {
                    roadmapEditorMenuVisible && (
                        <div>
                            <button onClick={addRoadmapEntry}>Add Roadmap Entry</button>

                            <div className="addDependencyMenu">
                                <form onSubmit={addDependencyOnSubmitHandler}>
                                    <select name="blockerId">
                                        {roadmapEntries.map((currEntry: RoadmapEntry) => <option value={currEntry.getId()} key={currEntry.getId()}>{currEntry.getTitle()}</option>)}
                                    </select>
                                    <select name="blocketTargetId">
                                        {roadmapEntries.map((currEntry: RoadmapEntry) => <option value={currEntry.getId()} key={currEntry.getId()}>{currEntry.getTitle()}</option>)}
                                    </select>
                                    <button type="submit">Add Blocker</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>

            <div onClick={e => setRoadmapEditorMenuVisible(false)}>
                {
                    getRoadmapEntries().map(function(currObj: object) {
                        let currEntry: RoadmapEntry = currObj["entry" as keyof typeof currObj];
                        let initialPosition: object = currObj["position" as keyof typeof currObj];
                        return (
                            <RoadmapEntryTile roadmapEntry={currEntry} key={currEntry.getId()} initialPosition={initialPosition}/>
                        )
                    })
                }
            </div>

            <div onClick={e => setRoadmapEditorMenuVisible(false)}>
                {
                    blockers.map(function(blockInfo: string[]) {
                        let blockerId: string = blockInfo[0];
                        let blockTargetId: string = blockInfo[1];
                        return (
                            <div
                                key={blockerId + blockTargetId}
                                onClick={e => blockerArrowOnClickHandler(blockerId, blockTargetId)}>
                                <Xarrow start={blockerId} end={blockTargetId}/>
                            </div>
                        );
                    })
                }
            </div>
        </Xwrapper>
    );
}

export default RoadmapEditor;