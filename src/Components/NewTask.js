/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import { Redirect } from 'react-router-dom';
import Form from './Form';

// Helper function to get current time in HH:MM format
const getNowHHMM = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const NewTask = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(getNowHHMM()); // Prepopulate current time
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState([]);
  const [initialState, dispatch] = useStateValue();
  const authUser = JSON.parse(initialState.authenticatedUser);

  // Handle input changes
  const change = (event, setState) => {
    const value = event.target.value;
    setState(value);
  };

  // Submit new task
  const submit = () => {
    setUserId(authUser.userId);
    const task = {
      title,
      description,
      time,
      errors,
      userId: authUser.userId, // required for 201 response
    };

    initialState
      .createTask(task, authUser.emailAddress, authUser.password)
      .then((response) => {
        if (response === 'success') {
          console.log(`Username ${authUser.emailAddress} successfully created: ${task}`);
          props.history.push('/');
        } else if (response === 'forbidden') {
          props.history.push('/forbidden');
        } else {
          setErrors([...errors, response]);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrors([...errors, err.message]);
      });
  };

  const cancel = () => {
    props.history.push('/');
  };

  return authUser ? (
    <div className="container component-container load">
      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Create Task"
        elements={() => (
          <React.Fragment>
            <h2 className="form-header">
              New Task <i className="far fa-list-alt"></i>
            </h2>
            {errors.map((error, i) => (
              <p className="error" key={i}>
                <i className="fa-solid fa-circle-xmark"></i> {error}
              </p>
            ))}

            <label htmlFor="task-title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="task-title"
              name="title"
              value={title}
              onChange={(e) => change(e, setTitle)}
              placeholder="Enter a title"
            />

            <label htmlFor="task-description" className="form-label">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              value={description}
              onChange={(e) => change(e, setDescription)}
              placeholder="Describe the task"
            ></textarea>

            <label htmlFor="task-time" className="form-label">
              Time
            </label>
            <div className="task-time-container">
              <input
                id="task-time"
                type="time"
                name="time"
                value={time} // prepopulated current time
                onChange={(e) => change(e, setTime)}
                step="60" // optional: 1-minute precision
              />
            </div>
          </React.Fragment>
        )}
      />
    </div>
  ) : (
    <Redirect to="/signin" />
  );
};