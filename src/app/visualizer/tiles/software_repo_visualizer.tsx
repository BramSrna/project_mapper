import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";

const SoftwareRepoVisualizer = (props: {softwareRepoComp: SoftwareRepo}) => {
    let keyVal: number = 0;
    return (
        <table>
            <thead>
                <tr key={keyVal++}>
                    <td key={keyVal++}>Input</td>
                    <td key={keyVal++}>Output</td>
                </tr>
            </thead>
            <tbody>
                {props.softwareRepoComp.getMocks().map(function(currMock) {
                    return (
                        <tr key={keyVal++}>
                            <td key={keyVal++}>{currMock.getInput()}</td>
                            <td key={keyVal++}>{currMock.getOutput()}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default SoftwareRepoVisualizer;