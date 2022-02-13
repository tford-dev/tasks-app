/* eslint-disable */
import React, {useState, useEffect} from 'react';
import { useStateValue } from '../ContextApi/StateProvider';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Form from './Form';

const SignUp = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [initialState, dispatch] = useStateValue();
    const authUser = initialState.authenticatedUser;

    useEffect(()=> {
        dispatch({
            type: "SET_NAV",
            navState: 2,
        })
    }, []);

    //simple method to modify state value based on what is typed in input/textarea elements
    const change = (event, setState) => {
        const value = event.target.value;
        setState(value);
    }

    //Submit method takes required keys from state and sends the values to api 
    const submit = async() => {
        const user = {firstName, lastName, emailAddress, password};

        //createUser method takes credentials from context api and course variable to execute request 
        await initialState.createUser(user)
            .then(err => {
                if(err.length){
                    console.log(err)
                    setErrors([...errors, err])
                    console.log(errors)
                } else {
                    initialState.signIn(emailAddress, password)
                        .then(() => {
                            <Redirect to="/home" />
                        })
                    console.log(`${emailAddress} is successfully signed up and authorized!`);
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const cancel = () => {
        props.history.push('/signin');
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
                    submitButtonText="Sign Up"
                    elements={() => (
                        <React.Fragment>
                            <h2 className="form-header">Sign Up <i className="fas fa-user-plus"></i></h2>
                            {errors.map((error, i) => <p className="error" key={i}><i className="fa-solid fa-circle-xmark"></i> {error}</p>)}
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                onChange={(e)=> change(e, setFirstName)} 
                                placeholder={firstName}/>
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName" 
                                name="lastName" 
                                type="text" 
                                onChange={(e) => change(e, setLastName)} 
                                placeholder={lastName}/>
                            <label htmlFor="emailAddress" className="form-label">Email Address</label>
                            <input 
                                id="emailAddress" 
                                name="emailAddress" 
                                type="email"
                                onChange={(e) => change(e, setEmailAddress)} 
                                placeholder={emailAddress}/>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                id="password" 
                                name="password"
                                type="password"
                                onChange={(e) => change(e, setPassword)} 
                                placeholder={password} 
                            />
                            <p className="form-label sign-prompt">
                            Already have a user account? <Link to="/signin" className="sign-link">Click here</Link> to sign in!
                            </p>                
                        </React.Fragment>
                )} />
            </div>
            );
    }
}

export default SignUp;