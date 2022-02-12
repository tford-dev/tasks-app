/* eslint-disable */
import React, {useState, useEffect} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import { Redirect } from 'react-router-dom';
import Form from "./Form";

const EditTask = (props) => {
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState([]);
    const [initialState, dispatch] = useStateValue();
    const authUser = JSON.parse(initialState.authenticatedUser);
    //Global object for component
    const task = {
        id,
        title,
        description,
        time,
        userId,
        errors
    };

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

    //simple function to modify state value based on what is typed in input/textarea elements
    const change = (event, setState) => {
        const value = event.target.value;
        setState(value);
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        initialState.updateTask(task, authUser.emailAddress, authUser.password)
            .then((response) => {
                if(response === "success"){
                    console.log(`Username ${authUser.emailAddress} 
                    successfully edited: Task: ${id}`);
                    props.history.push(`/tasks/${id}`);
                } else if (response === "forbidden"){
                    props.history.push("/forbidden")
                } else {
                    setErrors([...errors, response]);
                }
            }).catch(err => {
                setErrors([...errors, err])
            })
    }

    cancel = () => {
        props.history.push(`/tasks/${props.match.params.id}`);
    }
        
    return(
        authUser ? (
            <div className="container component-container load">
            <Form 
                cancel={cancel}
                errors={errors}
                submit={submit}
                submitButtonText="Edit Task"
                elements={() => (
                    <React.Fragment>
                        <h2 className="form-header">Edit Task<i className="fas fa-edit"></i></h2>
                        {errors.map((error, i) => <p className="error" key={i}><i className="fa-solid fa-circle-xmark"></i> {error}</p>)}
                        <label htmlFor="task-title" className="form-label">Title</label>
                        <input type="text" id="task-title" name="title" onChange={(e)=>change(e, setTitle)} value={title} />

                        <label htmlFor="task-description" className="form-label">Description</label>
                        <textarea id="task-description" name="description" onChange={(e)=>change(e, setDescription)} value={description}></textarea>

                        <label htmlFor="task-time" className="form-label">Time</label>
                        <div className="task-time-container">
                            <input id="task-time" type="time" name="time" onChange={(e)=>change(e, setTime)} value={time}/>
                        </div>   
                    </React.Fragment> 
                )} 
            />
        </div>
        ) : (
            <Redirect to="/signin" />
        )
    )
}

export default EditTask;