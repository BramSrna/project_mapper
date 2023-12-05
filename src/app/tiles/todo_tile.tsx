import { ChangeEvent } from "react";
import TileContainer from "./tile_container";
import Todo from "../project_components/todo";

const TodoTile = (props: {parentComponent: Todo}) => {
    function checkboxOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        console.log(event.target.checked)
        props.parentComponent.setIsComplete(rowIndex, event.target.checked)
    }

    function itemDescriptionOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.parentComponent.setItemDescription(rowIndex, event.target.value);
    }

    function deleteItemOnClickHandler(rowIndex: number) {
        props.parentComponent.deleteItem(rowIndex);
    }

    function addItemOnClickHandler() {
        props.parentComponent.addItem();
    }

    function getFormFields() {
        let keyVal = 0;
        const itemRows = props.parentComponent.getItems().map(function(currItem, rowIndex) {
            return (
                <tr key={keyVal++}>
                    <td key={keyVal++}><input type="checkbox" defaultChecked={currItem.getIsComplete()} onChange={e => checkboxOnChangeHandler(e, rowIndex)}></input></td>
                    <td key={keyVal++}><input type="text" defaultValue={currItem.getItemDescription()} onChange={e => itemDescriptionOnChangeHandler(e, rowIndex)}/></td>
                    <td key={keyVal++}><button onClick={() => deleteItemOnClickHandler(rowIndex)}>Delete Item</button></td>
                </tr>
            )
        });
        return (
            <div>
                <table>
                    <tbody>
                        {itemRows}
                    </tbody>
                </table>
                <button onClick={addItemOnClickHandler}>Add Item</button>
            </div>
        )
    }

    return (
        <TileContainer
            parentComponent={props.parentComponent}
            containerContents={
                <div>
                    <form id="Todo">
                        {getFormFields()}
                    </form>
                </div>
            }
        />
    );
}

export default TodoTile;