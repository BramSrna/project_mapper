import Difficulties from "../project_components/difficulties";
import DocumentationSection from "../project_components/documentation_section";
import ProjectComponent from "../project_components/project_component";
import Roadmap from "../project_components/roadmap";
import SoftwareRepo from "../project_components/software_repo";
import Todo from "../project_components/todo";
import UseCases from "../project_components/use_cases";
import ComponentDescription from "../project_components/component_description";

const Visualizer = (props: {componentToVisualize: ProjectComponent}) => {
    function renderTodo(component: Todo) {
        let keyVal = 0;
        const itemRows = component.getItems().map(function(currItem) {
            return (
                <tr key={keyVal++}>
                    <td key={keyVal++}><input type="checkbox" checked={currItem.getIsComplete()} readOnly={true}></input></td>
                    <td key={keyVal++}>{currItem.getItemDescription()}</td>
                </tr>
            )
        });
        return (<div><table><tbody>{itemRows}</tbody></table></div>);
    }

    function renderDocumentationSection(component: DocumentationSection) {
        let keyIndex = 0;
        const lines = component.getContent().split("\n").map(function(currLine) {
            return (<p key={keyIndex++}>{currLine}</p>);
        })
        return (<div>{lines}</div>);
    }

    function renderComponentDescription(component: ComponentDescription) {
        return (<pre>{JSON.stringify(component.getDisplayableContentsJson(), null, 2)}</pre>);
    }

    function renderRoadmap(component: Roadmap) {
        if (!component.getInternallyDefined()) {
            return (<p>{component.getLinkToRoadmap()}</p>);
        }
        
        let keyVal = 0;
        const tableHeaders = component.getRoadmapHeaders().map(function(currHeader) {
            return (<th key={keyVal++}>{currHeader}</th>);
        });
        const tableRows = component.getEntries().map(function(currEntry) {
            const rowVals = currEntry.map(function(currVal) {
                return (<td key={keyVal++}>{currVal}</td>);
            })
            return (
                <tr key={keyVal++}>
                    {rowVals}
                </tr>
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        {tableHeaders}
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }

    function renderSoftwareRepo(component: SoftwareRepo) {
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
                    {component.getMocks().map(function(currMock) {
                        return (
                        <tr key={keyVal++}>
                            <td key={keyVal++}>{currMock.getInput()}</td>
                            <td key={keyVal++}>{currMock.getOutput()}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        )
    }

    function renderUseCases(component: UseCases) {
        let keyVal = 0;
        const useCaseRows = component.getUseCases().map(function(currUseCase) {
            return (
                <tr key={keyVal++}><td key={keyVal++}>{currUseCase}</td></tr>
            )
        });

        return (
            <div>
                <p>Operating Walls:</p>
                <p>Start Operating Wall: {component.getStartOperatingWall()}</p>
                <p>End Operating Wall: {component.getEndOperatingWall()}</p>
                <p>Use Cases:</p>
                <table>
                    <tbody>
                        {useCaseRows}
                    </tbody>
                </table>
            </div>
        )
    }

    function renderDifficulties(component: Difficulties) {
        let keyVal: number = 0;
        const difficultyRows = component.getDifficulties().map(function(currDifficulty, difficultyIndex) {
            let numPossibleSolutions: number = currDifficulty.getPossibleSolutions().length;
            if (numPossibleSolutions <= 0) {
                return (
                    <tbody key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++}>{currDifficulty.getDescription()}</td> 
                            <td key={keyVal++}></td> {/* Empty cell for possible solution */}
                        </tr>
                    </tbody>
                );
            } else {
                let additionalRows: JSX.Element[] = [];
                let possibleSolutions: string[] = currDifficulty.getPossibleSolutions();
                for (let i: number = 1; i < possibleSolutions.length; i++) {
                    additionalRows.push(
                        <tr key={keyVal++}>
                            <td key={keyVal++}>{possibleSolutions[i]}</td>
                        </tr>
                    );
                }
                return (
                    <tbody key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++} rowSpan={numPossibleSolutions}>{currDifficulty.getDescription()}</td>
                            <td key={keyVal++}>{possibleSolutions[0]}</td>
                        </tr>
                        {additionalRows}
                    </tbody>
                );
            }
        });

        return (            
            <div>
                <table>
                    <thead key={keyVal++}>
                        <tr key={keyVal++}>
                            <td key={keyVal++}>Difficulty</td>
                            <td key={keyVal++}>Potential Solution(s)</td>
                        </tr>
                    </thead>
                    {difficultyRows}
                </table>
            </div>
        );
    }

    function renderComponent(component: ProjectComponent) {
        let element: JSX.Element;
        switch (component.getType()) {
            case "Todo":
                element = renderTodo(component as Todo);
                break;
            case "DocumentationSection":
                element = renderDocumentationSection(component as DocumentationSection);
                break;
            case "ComponentDescription":
                element = renderComponentDescription(component as ComponentDescription);
                break;
            case "Roadmap":
                element = renderRoadmap(component as Roadmap);
                break;
            case "SoftwareRepo":
                element = renderSoftwareRepo(component as SoftwareRepo);
                break;
            case "UseCases":
                element = renderUseCases(component as UseCases);
                break;
            case "Difficulties":
                element = renderDifficulties(component as Difficulties);
                break;
            default:
                throw(`Unknown component type in project editor: ${component.getType()}`)
        }
        return element;
    }
    
    return (
        <div>
            <p>Visualizer</p>
            <p>Displaying Component: {props.componentToVisualize.getComponentName()}</p>
            <div>
                {renderComponent(props.componentToVisualize)}
            </div>
        </div>
    );

}

export default Visualizer;