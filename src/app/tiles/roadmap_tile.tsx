import { ChangeEvent, useState } from "react";
import Toggle from 'react-toggle'
import TileContainer from "./tile_container";
import Roadmap from "../project_components/roadmap";

const RoadmapTile = (props: {parentComponent: Roadmap}) => {
    const [displayInternallyDefinedField, setDisplayInternallyDefinedField] = useState(props.parentComponent.getInternallyDefined());

    function roadmapLinkOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        props.parentComponent.setRoadmapLink(event.target.value);
    }

    function roadmapHeaderOnChangeHandler(event: ChangeEvent<HTMLInputElement>, index: number) {
        props.parentComponent.setRoadmapHeader(index, event.target.value)
    }

    function roadmapEntryOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) {
        props.parentComponent.setRoadmapEntry(rowIndex, columnIndex, event.target.value)
    }

    function upOnClickHandler(rowIndex: number) {
        props.parentComponent.swapRowEntries(rowIndex, rowIndex - 1);
    }

    function downOnClickHandler(rowIndex: number) {
        props.parentComponent.swapRowEntries(rowIndex, rowIndex + 1);
    }

    function deleteOnClickHandler(rowIndex: number) {
        props.parentComponent.deleteEntry(rowIndex);
    }

    function addRowOnClickHandler() {
        props.parentComponent.addEmptyEntry();
    }

    function addColumnOnClickHandler() {
        props.parentComponent.addEntryColumn();
    }

    function switchDisplayedFields() {
        props.parentComponent.setInternallyDefined(!props.parentComponent.getInternallyDefined());
        setDisplayInternallyDefinedField(!displayInternallyDefinedField);
    }

    function deleteColumnOnClickHandler(columnIndex: number) {
        props.parentComponent.deleteEntryColumn(columnIndex);
    }

    function getFormFields() {
        if (!displayInternallyDefinedField) {
            return (<p>Roadmap Link: <input type="text" name="roadmapLink" defaultValue={props.parentComponent.getLinkToRoadmap()} onChange={roadmapLinkOnChangeHandler}/></p>);
        }

        let keyVal = 0;

        const roadmapHeaders: string[] = props.parentComponent.getRoadmapHeaders();
        const colHeaders: JSX.Element[] = [];
        const deleteColumnButtons: JSX.Element[] = [];
        for (let columnIndex: number = 0; columnIndex < roadmapHeaders.length; columnIndex++) {
            colHeaders.push(<th key={keyVal++}><input type="text" name="roadmapHeader" defaultValue={roadmapHeaders[columnIndex]} onChange={e => roadmapHeaderOnChangeHandler(e, columnIndex)}/></th>);
            if (columnIndex === 0) {
                deleteColumnButtons.push(<td key={keyVal++}></td>);
            } else {
                deleteColumnButtons.push(<td key={keyVal++}><button onClick={() => deleteColumnOnClickHandler(columnIndex)}>Delete Column</button></td>);
            }
        }

        const entries: string[][] = props.parentComponent.getEntries();

        let rowVals;
        let deleteRowButton;
        let moveDownButton;
        let moveUpButton;
        const entryRows = entries.map(function(currEntry, rowIndex) {
            rowVals = currEntry.map(function(currVal, columnIndex) {
                return (<td key={keyVal++}><input type="text" name="roadmapEntry" defaultValue={currVal} onChange={e => roadmapEntryOnChangeHandler(e, rowIndex, columnIndex)}/></td>);
            })
            deleteRowButton = <td key={keyVal++}><button onClick={() => deleteOnClickHandler(rowIndex)}>Delete Row</button></td>;
            moveDownButton = <td key={keyVal++}><button onClick={() => downOnClickHandler(rowIndex)}>Down</button></td>;
            if ((rowIndex === entries.length - 1) || (entries.length === 1)) {
                moveDownButton = <td></td>
            }
            moveUpButton = <td key={keyVal++}><button onClick={() => upOnClickHandler(rowIndex)}>Up</button></td>;
            if ((rowIndex === 0) || (entries.length === 1)) {
                moveUpButton = <td></td>
            }
            return (                    
                <tr key={keyVal++}>
                    {rowVals}
                    {moveUpButton}
                    {moveDownButton}
                    {deleteRowButton}
                </tr>
            );
        });
        
        return (
            <div>
                <table>
                    <thead>
                        <tr key={keyVal++}>
                            {colHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {entryRows}
                        <tr key={keyVal++}>
                            {deleteColumnButtons}
                        </tr>
                    </tbody>
                </table>
                <button onClick={addRowOnClickHandler}>Add Row</button>
                <button onClick={addColumnOnClickHandler}>Add Column</button>
            </div>
        )
    }

    return (
        <TileContainer
            parentComponent={props.parentComponent}
            containerContents={
                <div>
                    <label>
                        <Toggle
                            defaultChecked={displayInternallyDefinedField}
                            icons={false}
                            onChange={switchDisplayedFields}
                        />
                        <span>Toggle Init Method</span>
                    </label>
                    <form id="Roadmap">
                        {getFormFields()}
                    </form>
                </div>
            }
        />
    );
}

export default RoadmapTile;