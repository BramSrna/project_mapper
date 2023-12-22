import Roadmap from "@/app/project/project_component/components/roadmap/roadmap";
import RoadmapEntry from "@/app/project/project_component/components/roadmap/roadmap_entry";
import { ChangeEvent, FormEvent, LegacyRef, MutableRefObject, RefObject, forwardRef, useRef, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";
import Toggle from "react-toggle";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";

const RoadmapEditor = (props: {roadmapComp: Roadmap}) => {
    const updateXarrow = useXarrow();
    
    const [roadmapEntries, setRoadmapEntries] = useState<RoadmapEntry[]>(props.roadmapComp.getEntries());
    const [arrowDeleted, setArrowDelete] = useState(true);

    const nodeRef = useRef(null);

    let positions: any = {};

    function getConnections() {
        let xArrowCounter = 0;
        const connections = roadmapEntries.map(function(currEntry: RoadmapEntry) {
            const currConnections = currEntry.getBlockTargets().map(function(blockTargetId: string) {
                return (
                    <div
                        key={xArrowCounter++}
                        onClick={() => {
                            props.roadmapComp.deleteBlockTarget(currEntry, blockTargetId);
                            setArrowDelete(!arrowDeleted);
                        }}>
                        <Xarrow start={currEntry.getId()} end={blockTargetId}/>
                    </div>
                );
            });
    
            return currConnections;
        });
        return connections;
    }

    function addRoadmapEntry() {
        let newEntry: RoadmapEntry = new RoadmapEntry(Date.now().toString(36) + Math.random().toString(36).substr(2), false, "", []);
        setRoadmapEntries([
            ...roadmapEntries,
            newEntry
        ]);
        props.roadmapComp.addEntry(newEntry);
    }

    function deleteRoadmapEntry(entryIdToDelete: string) {
        props.roadmapComp.deleteEntry(entryIdToDelete);
        setRoadmapEntries(roadmapEntries.filter(function(entry) {
            return (entry.getId() !== entryIdToDelete);
        }));
    }

    function addDependencyOnSubmitHandler(event: FormEvent<HTMLFormElement>) {
        const formData: FormData = new FormData(event.currentTarget);
        const rootId: string = formData.get("rootSelector")!.toString();
        const targetId: string = formData.get("targetSelector")!.toString();

        if (rootId === targetId) {
            return false;
        }

        const rootComponent = props.roadmapComp.getEntryWithId(rootId);
        const targetComponent = props.roadmapComp.getEntryWithId(targetId);

        if ((rootComponent !== null) && (targetComponent !== null)) {
            props.roadmapComp.addBlockTarget(rootId, targetId);
        }
    }

    function onStopHandler(data: DraggableData, entry: RoadmapEntry) {
        positions[entry.getId()] = {x: data.x, y: data.y};
        updateXarrow();
    }
    
    return (
        <Xwrapper>
            <button onClick={addRoadmapEntry}>Add Roadmap Entry</button>

            <div className="addDependencyMenu">
                <form onSubmit={addDependencyOnSubmitHandler}>
                    <select name="rootSelector">
                        {roadmapEntries.map((currEntry: RoadmapEntry, index: number) => <option value={currEntry.getId()} key={index}>{currEntry.getContent()}</option>)}
                    </select>
                    <select name="connectionType">
                        <option value="Uses">Blocks</option>
                    </select>
                    <select name="targetSelector">
                        {roadmapEntries.map((currEntry: RoadmapEntry, index: number) => <option value={currEntry.getId()} key={index}>{currEntry.getContent()}</option>)}
                    </select>
                    <button type="submit">Add Blocker</button>
                </form>
            </div>

            <div>
                {
                    roadmapEntries.map(function(currEntry, index) {
                        const DraggableContents = forwardRef(function (props, ref: LegacyRef<HTMLDivElement>) {
                            return (
                                <div {...props} ref={ref}>
                                    <div style={{ position: 'absolute', zIndex: 1000, background: "#f56c42" }} id={`roadmap_tile_${index}`}>
                                        <div className="handle" style={{ cursor: 'move', padding: '10px', background: '#ddd', border: '1px solid #999', borderRadius: '4px' }}/>
                                        
                                        <div className="dont-move-draggable">
                                            <span>Entry Complete?:
                                                <Toggle
                                                    defaultChecked={currEntry.getIsComplete()}
                                                    icons={false}
                                                    onChange={e => currEntry.setIsComplete(!currEntry.getIsComplete())}
                                                />
                                            </span>
                        
                                            <p>Content:
                                                <textarea
                                                    name="endGoal"
                                                    key = "4"
                                                    rows={4}
                                                    cols={40}
                                                    defaultValue={currEntry.getContent()}
                                                    onChange={e => currEntry.setContent(e.target.value)}
                                                />
                                            </p>
                        
                                            <button onClick={e => deleteRoadmapEntry(currEntry.getId())}>Delete Entry</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        });

                        return (
                            <Draggable nodeRef={nodeRef} cancel=".dont-move-draggable" key={currEntry.getId()} onDrag={updateXarrow} onStop={(e, data) => onStopHandler(data, currEntry)}>
                                <DraggableContents ref={nodeRef} />
                            </Draggable>
                        )
                    })
                }
            </div>

            <div>
                {getConnections()}
            </div>
        </Xwrapper>
    );
}

export default RoadmapEditor;