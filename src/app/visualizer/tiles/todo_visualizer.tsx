import Todo from "@/app/project/project_component/components/todo/todo";
import TodoItem from "@/app/project/project_component/components/todo/todo_item";

const TodoVisualizer = (props: {todoComp: Todo}) => {
    return (
        <table>
            <tbody>
                {props.todoComp.getItems().map(function(currItem: TodoItem) {
                    return (
                        <tr key={currItem.getId()}>
                            <td><input type="checkbox" checked={currItem.getIsComplete()} readOnly={true}></input></td>
                            <td>{currItem.getItemDescription()}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}

export default TodoVisualizer;