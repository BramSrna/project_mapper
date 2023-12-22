import Todo from "@/app/project/project_component/components/todo/todo";
import { ChangeEvent } from "react";

const TodoVisualizer = (props: {todoComp: Todo}) => {
    let keyVal: number = 0;
    return (
        <div>
            <table>
                <tbody>
                    {props.todoComp.getItems().map(function(currItem) {
                        return (
                            <tr key={keyVal++}>
                                <td key={keyVal++}><input type="checkbox" checked={currItem.getIsComplete()} readOnly={true}></input></td>
                                <td key={keyVal++}>{currItem.getItemDescription()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TodoVisualizer;