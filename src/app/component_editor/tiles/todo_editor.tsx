import Todo from "@/app/project/project_component/components/todo/todo";
import TodoItem from "@/app/project/project_component/components/todo/todo_item";
import { ChangeEvent, useEffect, useState } from "react";

const TodoEditor = (props: {todoComp: Todo}) => {
    const [items, setItems] = useState<TodoItem[]>([]);

    useEffect(() => {
        setItems([...props.todoComp.getItems()]);
    }, [props.todoComp]);

    function isCompleteOnChangeHandler(item: TodoItem, checked: boolean) {
        item.setIsComplete(checked);
    }

    function itemDescriptionOnChangeHandler(item: TodoItem, newDescription: string) {
        item.setItemDescription(newDescription);
    }

    function deleteItemOnClickHandler(itemToDelete: TodoItem) {
        props.todoComp.deleteItem(itemToDelete);
        setItems(items.filter(function(currItem: TodoItem) {
            return currItem !== itemToDelete;
        }));
    }

    function addItemOnClickHandler() {
        let newItem: TodoItem = new TodoItem(props.todoComp, "", false);
        props.todoComp.addItem(newItem);
        setItems([
            ...items,
            newItem
        ]);
    }

    return (
        <div>
            <table>
                <tbody>
                    {
                        items.map(function(currItem: TodoItem) {
                            return (
                                <tr key={currItem.getId()}>
                                    <td><input type="checkbox" defaultChecked={currItem.getIsComplete()} onChange={e => isCompleteOnChangeHandler(currItem, e.target.checked)}></input></td>
                                    <td><input type="text" defaultValue={currItem.getItemDescription()} onChange={e => itemDescriptionOnChangeHandler(currItem, e.target.value)}/></td>
                                    <td><button onClick={() => deleteItemOnClickHandler(currItem)}>Delete Item</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button onClick={addItemOnClickHandler}>Add Item</button>
        </div>
    );
}

export default TodoEditor;