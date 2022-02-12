/* eslint-disable */
import React, {useState, useEffect} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import { Redirect } from 'react-router-dom';
import Form from "./Form";

const NewTask = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState([]);
    const [initialState, dispatch] = useStateValue();
    const authUser = JSON.parse(initialState.authenticatedUser);

    //simple method to modify state value based on what is typed in input/textarea elements
    const change = (event, setState) => {
        const value = event.target.value;
        setState(value);
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        const task = {
            title,
            description,
            time,
            errors,
            //userId is needed to get a 201 status code from api
            userId: authUser.userId
        };

        initialState.createTask(task, authUser.emailAddress, authUser.password)
            .then((response) => {
                if(response === "success"){
                    console.log(`Username ${authUser.emailAddress} 
                    successfully created: ${task}`);
                    props.history.push('/');
                } else if (response === "forbidden"){
                    props.history.push("/forbidden")
                } else {
                    setErrors([...errors, response])
                }
            }).catch(err => {
                setErrors([...errors, err])
            })
    }

    cancel = () => {
        props.history.push("/");
    }

    return(
        authUser ? (
            <div className="container component-container load">
            <Form 
                cancel={cancel}
                errors={errors}
                submit={submit}
                submitButtonText="Create Task"
                elements={() => (
                    <React.Fragment>
                        <h2 className="form-header">New Task <i className="far fa-list-alt"></i></h2>
                        {errors.map((error, i) => <p className="error" key={i}><i className="fa-solid fa-circle-xmark"></i> {error}</p>)}
                        <label htmlFor="task-title" className="form-label">Title</label>
                        <input type="text" id="task-title" name="title" onChange={(e)=>change(e, setTitle)} placeholder={title} />

                        <label htmlFor="task-description" className="form-label">Description</label>
                        <textarea id="task-description" name="description" onChange={(e)=>change(e, setDescription)} placeholder={description}></textarea>

                        <label htmlFor="task-time" className="form-label">Time</label>
                        <div className="task-time-container">
                            <input id="task-time" type="time" name="time" onChange={(e)=>change(e, setTime)} placeholder={time}/>
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

export default NewTask;