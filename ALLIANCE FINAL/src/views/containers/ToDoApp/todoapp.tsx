import React, {useState} from "react";
import { Size, Typography } from "../../components/Typography/Typography";
import { Buttons } from "../../components/Buttons/Buttons";

interface TodoFormProps {
    todo: string;
    addTodo: () => void;
    handleTodoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ToDoListProps {
    todoList: Array<string>;
    deleteTodo: (id: number) => void;
}

const ToDoApp = () => {
    const [todos, setTodos] = useState<Array<string>>([]);
    const [todo, setTodo] = useState<string>("");

    const addTodos = () => {
        setTodos([...todos, todo]);
        alert("To Do added");
    };

    const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTodo(event.target.value);
    }

    const deleteTodo = (id: number) => {
        const newTodoList = todos.filter((data, index) => index !== id);
        setTodos(newTodoList);
        alert("To Do Removed");
    }

    return (
        <div>
            <ToDoForm todo = {todo} addTodo={addTodos} handleTodoChange={handleTodoChange}/>
            <ToDoList todoList={todos} deleteTodo={deleteTodo}/>
        </div>
    )
}


const ToDoForm = (props: TodoFormProps) => {
    return (
        <div>
            <input name = 'toDo' value = {props.todo} onChange={props.handleTodoChange}/>
            <Buttons 
                label = {"Add"} 
                style = {{ color: "white", backgroundColor: "red", }}                
                onClick={props.addTodo}
            />            
        </div>

    )

}

const ToDoList = (props: ToDoListProps) => {
    return (
        <div>
            {props.todoList.map((data,index) => 
                <div>
                    {data}
                    <Buttons 
                        label = {"Remove"} 
                        style = {{ color: "white", backgroundColor: "green" }}                
                        onClick={() => props.deleteTodo(index)}
                    />  
                    {/* <button onClick={() => props.deleteTodo(index)}>Remove</button> */}
                </div>
            )}
        </div>
    )
}

export default ToDoApp;