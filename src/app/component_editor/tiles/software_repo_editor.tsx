import Mock from "@/app/project/project_component/components/software_repo/mock";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";
import { useEffect, useState } from "react";

const SoftwareRepoEditor = (props: {softwareRepoComp: SoftwareRepo}) => {
    const [mocks, setMocks] = useState<Mock[]>([]);

    useEffect(() => {
        setMocks([...props.softwareRepoComp.getMocks()]);
    }, [props.softwareRepoComp]);

    function deleteMockOnClickHandler(mockToDelete: Mock) {
        props.softwareRepoComp.deleteMock(mockToDelete);
        setMocks(mocks.filter(function(currMock) {
            return currMock !== mockToDelete
        }))
    }

    function addMockOnClickHandler() {
        const newMock: Mock = new Mock(props.softwareRepoComp, "", "");
        props.softwareRepoComp.addMock(newMock);
        setMocks([
            ...mocks,
            newMock
        ])
    }

    return (
        <div>
            <p>
                Init Repo Name: <input type="text" name="initRepoName" defaultValue={props.softwareRepoComp.getInitRepoName()} onChange={e => props.softwareRepoComp.setInitRepoName(e.target.value)}/>
            </p>

            {
                <div>
                    <p>Mocks</p>
                    <table>
                        <thead>
                            <tr>
                                <td>Input</td>
                                <td>Output</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mocks.map(function(currMock: Mock) {
                                    return (
                                        <tr key={currMock.getId()}>
                                            <td><input type="text" name="mockInput" defaultValue={currMock.getInput()} onChange={e => currMock.setInput(e.target.value)}/></td>
                                            <td><input type="text" name="mockOutput" defaultValue={currMock.getOutput()} onChange={e => currMock.setOutput(e.target.value)}/></td>
                                            <td><button onClick={() => deleteMockOnClickHandler(currMock)}>Delete Mock</button></td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={addMockOnClickHandler}>Add Mock</button>
                </div>
            }                  
        </div>
    );
}

export default SoftwareRepoEditor;