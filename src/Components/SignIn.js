/* eslint-disable */ 
import React, {useState} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Form from './Form';

const SignIn = (props) => {
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [initialState, dispatch] = useStateValue();
    const authUser = initialState.authenticatedUser;

    //simple method to modify state value based on what is typed in input/textarea elements
    const change = (event, setState) => {
        const value = event.target.value;
        setState(value);
    }

    //Submit method takes required keys from state and sends the values to api 
    const submit = async() => {
        await initialState.signIn(emailAddress, password)
            .then((user) => {
                //If user does not exist, errors is pushed an error message that will be rendered to user
                if(user === null){
                    setErrors([...errors, "Sign-In was unsuccessful."])
                } else {
                    if(window.location.pathname === "/error"){
                        props.history.push("/home");
                    }
                    dispatch({
                        type: "SET_USER",
                        authenticatedUser: user,
                    })
                    console.log(`${emailAddress} is now signed in!`);
                }
            })
            .catch( err => {
                console.log(err.message);
                setErrors([...errors, err.message]);
            })
    }

    const cancel = () => {
        props.history.push('/signup');
    }

    if(authUser){
        return(
            <Redirect to="/" />
        )
    } else {
        return (
            <div className="container component-container load">
                <Form 
                    cancel={cancel}
                    errors={errors}
                    submit={submit}
                    submitButtonText="Sign In"
                    elements={() => (
                        <React.Fragment>
                            <h2 className="form-header">Sign In <i className="fas fa-sign-in-alt"></i></h2>
                            {errors.map((error, i) => <p className="error" key={i}><i className="fa-solid fa-circle-xmark"></i> {error}</p>)}
                            <label htmlFor="email" className="form-label">Email Address</label>
                                <input 
                                    id="email" 
                                    name="emailAddress" 
                                    type="email" 
                                    onChange={(e)=> change(e, setEmailAddress)} 
                                    placeholder={emailAddress}
                                />
                            <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password" 
                                    name="password"
                                    type="password" 
                                    onChange={(e)=> change(e, setPassword)} 
                                    placeholder={password} 
                                />
                            <p className="form-label sign-prompt">
                            Don't have a user account? <Link to="/signup" className="sign-link">Click here</Link> to sign up!
                            </p>                
                        </React.Fragment>
                )} />
            </div>
        );
    }
}

export default SignIn