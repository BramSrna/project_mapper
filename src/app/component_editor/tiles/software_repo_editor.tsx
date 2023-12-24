import Mock from "@/app/project/project_component/components/software_repo/mock";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";
import { ChangeEvent, useEffect, useState } from "react";
import Toggle from 'react-toggle'

const SoftwareRepoEditor = (props: {softwareRepoComp: SoftwareRepo}) => {
    const [mocks, setMocks] = useState<Mock[]>([]);

    useEffect(() => {
        setMocks([...props.softwareRepoComp.getMocks()]);
    }, [props.softwareRepoComp]);

    function initRepoNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.softwareRepoComp.setInitRepoName(event.target.value);
    }

    function mockInputOnChangeHandler(mock: Mock, newVal: string) {
        mock.setInput(newVal);
    }

    function mockOutputOnChangeHandler(mock: Mock, newVal: string) {
        mock.setOutput(newVal);
    }

    function deleteMockOnClickHandler(mockToDelete: Mock) {
        props.softwareRepoComp.deleteMock(mockToDelete);
        setMocks(mocks.filter(function(currMock) {
            return currMock !== mockToDelete
        }))
    }

    function addMockOnClickHandler() {
        let newMock: Mock = new Mock(props.softwareRepoComp, "", "");
        props.softwareRepoComp.addMock(newMock);
        setMocks([
            ...mocks,
            newMock
        ])
    }

    return (
        <div>
            <p>
                Init Repo Name: <input type="text" name="initRepoName" defaultValue={props.softwareRepoComp.getInitRepoName()} onChange={initRepoNameOnChangeHandler}/>
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
                                            <td><input type="text" name="mockInput" defaultValue={currMock.getInput()} onChange={e => mockInputOnChangeHandler(currMock, e.target.value)}/></td>
                                            <td><input type="text" name="mockOutput" defaultValue={currMock.getOutput()} onChange={e => mockOutputOnChangeHandler(currMock, e.target.value)}/></td>
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