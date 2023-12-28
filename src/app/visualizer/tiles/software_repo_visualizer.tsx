import Mock from "@/app/project/project_component/components/software_repo/mock";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";

const SoftwareRepoVisualizer = (props: {softwareRepoComp: SoftwareRepo}) => {
    return (
        <table>
            <thead>
                <tr>
                    <td>Input</td>
                    <td>Output</td>
                </tr>
            </thead>
            <tbody>
                {props.softwareRepoComp.getMocks().map(function(currMock: Mock) {
                    return (
                        <tr key={currMock.getId()}>
                            <td>{currMock.getInput()}</td>
                            <td>{currMock.getOutput()}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default SoftwareRepoVisualizer;