import Roadmap from "@/app/project/project_component/components/roadmap/roadmap";
import RoadmapEntry from "@/app/project/project_component/components/roadmap/roadmap_entry";

const RoadmapVisualizer = (props: {roadmapComp: Roadmap}) => {
    function getRoadmapEntries() {
        let unorderedEntryList: RoadmapEntry[] = props.roadmapComp.getEntries();
        let orderedEntryList: RoadmapEntry[] = [];

        while (orderedEntryList.length < unorderedEntryList.length) {
            for (var currEntry of unorderedEntryList) {
                if (orderedEntryList.indexOf(currEntry) === -1) {
                    let allDependenciesAdded: boolean = true;
    
                    for (var blockerId of currEntry.getBlockers()) {
                        let blockerPresent: boolean = false;
                        for (var checkEntry of orderedEntryList) {
                            if (blockerId === checkEntry.getId()) {
                                blockerPresent = true;
                            }
                        }
                        allDependenciesAdded = allDependenciesAdded && blockerPresent;
                    }

                    if (allDependenciesAdded) {
                        orderedEntryList.push(currEntry);
                    }
                }

            }
        }

        return orderedEntryList;
    }
    
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Is Complete?</td>
                        <td>Description</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        getRoadmapEntries().map(function(currEntry: RoadmapEntry) {
                            return (
                                <tr key={currEntry.getId()}>
                                    <td>{currEntry.getTitle()}</td>
                                    <td>{currEntry.getIsComplete() ? "true": "false"}</td>
                                    <td>{currEntry.getDescription()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default RoadmapVisualizer;