import CodeSample from "@/app/project/project_component/components/software_repo/code_sample";
import Mock from "@/app/project/project_component/components/software_repo/code_sample";
import SoftwareRepo from "@/app/project/project_component/components/software_repo/software_repo";

const SoftwareRepoVisualizer = (props: {softwareRepoComp: SoftwareRepo}) => {
    return (
        <div>
            <p>Init Repo: {props.softwareRepoComp.getInitRepoName()}</p>
            <p>Code Samples: </p>
                {
                    props.softwareRepoComp.getCodeSamples().map(function(currCodeSample: CodeSample) {
                        return (
                            <p key={currCodeSample.getId()}>- Title: {currCodeSample.getTitle()}</p>
                        );
                    })
                }
        </div>
    );
}

export default SoftwareRepoVisualizer;