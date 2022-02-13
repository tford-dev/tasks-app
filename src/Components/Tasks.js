/* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import {Link, Redirect} from 'react-router-dom';
const convertTime = require("convert-time");

const Tasks = (props) => {
    const [initialState, dispatch] = useStateValue();
    const [tasks, setTasks] = useState([]);
    const [errors, setErrors] = useState([]);
    const authUser = JSON.parse(initialState.authenticatedUser);

    //When tasks ("/") are loaded, getTasks pushes response into tasks array
    useEffect(async() => {
        if(authUser){
            await initialState.getTasks(authUser.emailAddress, authUser.password).then(
                response => setTasks(response)
            )
            .catch(error => {
                console.log('Error ' + error);
            });
        }
    }, [])

    //Function to delete task
    const del = async(taskOwnerId, taskId)=>{
        //if task owner is authenticated user, a confirmation window appears to ask user if they are certain before deleting task
        if(taskOwnerId === authUser.userId){
            if(window.confirm("Are sure you want to delete this task? Once deleted, it can not be retrieved.")){
                initialState.deleteTask(taskId, authUser.emailAddress, authUser.password)
                    .then((response) => {
                        if(response === 'success'){
                            //An alert window is triggered if user is not authorized to delete task
                            alert("Task Deleted.");
                            console.log("Task deleted");
                        } else {
                            setErrors([...errors, response.message]);
                            props.history.push("/error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        props.history.push("/error");
                    })
            }
        } else {
            alert("You are not authorized to delete this task.")
        }
    }

    const indexArr = tasks.map(task => {
        return (
            <div className="to-do-anchor load" key={task.id}>
                <h2 className="to-do-header">{task.title}</h2>
                <p className="to-do-time"><i className="far fa-clock"></i> {convertTime(task.time)}</p>
                <div className="to-do-buttons">
                    <Link className="anchor-view" to={`/tasks/${task.id}`}>View</Link>
                    <Link className="anchor-edit" to={`/tasks/${task.id}/edit`}>Edit</Link>
                    <Link className="anchor-delete" to={`/`} onClick={()=> del(task.userId, task.id)}>Delete</Link>
                </div>
            </div>
        )
    })

    return(
        
        authUser ? (
            <main>
                <div className="container component-container load">
                    {indexArr}
                    <a href="/tasks/new">
                    <div className="to-do-anchor add-task">
                        <h2 className="to-do-header add">Add New Task <i className="far fa-plus-square"></i></h2>
                    </div>
                </a>   
                </div>
            </main>
        ) : (
            <Redirect to="/signin" />
        )
    )
}

export default Tasks;