import Todo from "@/app/project/project_component/components/todo/todo";
import { ChangeEvent } from "react";

const TodoEditor = (props: {todoComp: Todo}) => {
    function checkboxOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.todoComp.setIsComplete(rowIndex, event.target.checked)
    }

    function itemDescriptionOnChangeHandler(event: ChangeEvent<HTMLInputElement>, rowIndex: number) {
        props.todoComp.setItemDescription(rowIndex, event.target.value);
    }

    function deleteItemOnClickHandler(rowIndex: number) {
        props.todoComp.deleteItem(rowIndex);
    }

    function addItemOnClickHandler() {
        props.todoComp.addItem();
    }

    function getFormFields() {
        let keyVal = 0;
        const itemRows = props.todoComp.getItems().map(function(currItem, rowIndex) {
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
        <div>
            <form id="Todo">
                {getFormFields()}
            </form>
        </div>
    );
}

export default TodoEditor;