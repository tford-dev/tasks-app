/* eslint-disable */ 
import React, {useEffect, useState} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import {Link, Redirect} from 'react-router-dom';
const convertTime = require("convert-time");

const TaskDetail = (props) => {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [userId, setUserId] = useState(null);
    const [createdAt, setCreatedAt] = useState("");
    const [errors, setErrors] = useState([]);
    const [initialState, dispatch] = useStateValue();
    const authUser = JSON.parse(initialState.authenticatedUser);

    useEffect(()=> {
        let key = props.match.params.id;
        initialState.getTask(key, authUser.emailAddress, authUser.password).then(response => {
            /*If there is a response and if the task belongs to the user, the state of 
            this component will hold key-value pairs from response*/
            if(response){
                if (response.userId === authUser.userId) {
                    setId(response.id);
                    setTitle(response.title);
                    setDescription(response.description);
                    setTime(response.time);
                    setUserId(response.userId);
                //If task does not belong to user, they are redirected to the /forbidden route
                } else {
                    props.history.push("/forbidden");
                }
            //If there is no response at all, the user is redirected to the /notfound route
            } else {
                props.history.push("/notfound");
            }
        })
        .catch(error => {
            console.log('Error ' + error);
            props.history.push("/error")
        });
    }, []);

    const dateFormat = (rawDate) => {
        let date = rawDate.slice(0, 10)
        let cleaned = ('' + date).replace(/\D/g, '')
        let match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/)
        if (match) {
            return `${match[2]}/${match[3]}/${match[1]}`
        }   
        return date;
    }

    //Function to delete task
    const del = () =>{
        //if task owner is authenticated user, a confirmation window appears to ask user if they are certain before deleting task
        if(userId === authUser.userId){
            if(window.confirm("Are sure you want to delete this task? Once deleted, it can not be retrieved.")){
                initialState.deleteTask(id, authUser.emailAddress, authUser.password)
                    .then((response) => {
                        if(response === 'success'){
                            props.history.push(`/`);
                            //An alert window is triggered if user is not authorized to delete task
                            alert("Task Deleted.");
                            console.log("Task deleted");
                        } else {
                            ()=> setErrors([...errors, response.message])
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

    return(
        authUser ? (
            <div className="container component-container load">
            <div className="to-do-anchor">
                <div className="task-detail-container">
                    <h2 className="to-do-header">{title}</h2>
                        <p>Date Uploaded: {dateFormat(createdAt)}</p>
                        <p>Time Scheduled: {convertTime(time)}</p>
                        <p className="description">Description: {description}</p>
                        <div className="to-do-buttons">
                            <Link className="anchor-edit" to={`/tasks/${id}/edit`}>Edit</Link>
                            <Link className="anchor-delete" onClick={del} to={`/tasks/${id}`}>Delete</Link>
                            <Link className="anchor-view" to={`/tasks`}>Home</Link>
                        </div>
                </div>
            </div>
        </div>
        ) : (
            <Redirect to="/signin" />
        )
    )
}

export default TaskDetail;