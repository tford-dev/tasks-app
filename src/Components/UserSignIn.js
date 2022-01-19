import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
    state = {
        emailAddress: '',
        password: '',
        errors: [],
    }
  
    render() {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        //What user types into input boxes becomes is set to the corresponding state key using this.change on line 54
        const {
            emailAddress,
            password,
            errors,
        } = this.state;

        if(authUser){
            return(
                <Redirect to="/" />
            )
        } else {
            return (
                <div className="container component-container load">
                    <Form 
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Sign In"
                        elements={() => (
                            <React.Fragment>
                                <h2 className="form-header">Sign In <i className="fas fa-sign-in-alt"></i></h2>
                                <label htmlFor="email" className="form-label">Email Address</label>
                                    <input 
                                        id="email" 
                                        name="emailAddress" 
                                        type="email" 
                                        onChange={this.change} 
                                        placeholder={emailAddress}
                                    />
                                <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        id="password" 
                                        name="password"
                                        type="password" 
                                        onChange={this.change} 
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

    //simple method to modify state value based on what is typed in input/textarea elements
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        const {context} = this.props;

        // {from} returns user to privateRoute that user tried to access after being authenticated or previous page before requesting to sign in
        const {from} = this.props.location.state || {from: {pathname: this.props.history.goBack()}};
        const {emailAddress, password, errors} = this.state;

        //signIn method is grabbed from actions object that is nested in value variable in ../Context.js
            context.actions.signIn(emailAddress, password)
                .then((user) => {
                    //If user does not exist, this.state.errors is pushed an error message that will be rendered to user
                    if(user === null){
                        this.setState(()=>{
                            return {errors: [...errors, "Sign-In was unsuccessful."]}
                        })
                    //If sign in is successful, user is redirected to previous page or private route
                    } else {
                        this.props.history.push(from);
                        if(window.location.pathname === "/error"){
                            this.props.history.push("/");
                        }
                        console.log(`${emailAddress} is now signed in!`);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState(()=>{
                        return {errors: [...errors, "Sign-In was unsuccessful. Please make sure your input is valid data."]}
                    })
                })
    }

    cancel = () => {
        this.props.history.push('/signup');
    }
}