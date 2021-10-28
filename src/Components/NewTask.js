import React, { Component } from 'react';
import Form from "./Form";

class NewTask extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: "", 
            description: "",
            time: "",
            userId: null,
            errors: []
        }
    }

    render(){
        const {
            title,
            description,
            time,
            errors
        } = this.state;

        return(
            <div className="container component-container load">
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Task"
                    elements={() => (
                        <React.Fragment>
                            <h2 className="form-header">New Task <i className="far fa-list-alt"></i></h2>

                            <label htmlFor="task-title" className="form-label">Title</label>
                            <input type="text" id="task-title" name="title" onChange={this.change} placeholder={title} />

                            <label htmlFor="task-description" className="form-label">Description</label>
                            <textarea id="task-description" name="description" onChange={this.change} placeholder={description}></textarea>

                            <label htmlFor="task-time" className="form-label">Time</label>
                            <div className="task-time-container">
                                <input id="task-time" type="time" name="time" onChange={this.change} placeholder={time}/>
                            </div>
                        </React.Fragment> 
                    )} 
                />
            </div>
        )
    }

    //simple method to modify state value based on what is typed in input/textarea elements
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(this.state);

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const {
            title,
            description,
            time,
            errors
        } = this.state;

        const task = {
            title,
            description,
            time,
            errors,
            //userId is needed to get a 201 status code from api
            userId: authUser.userId
        };

        context.data.createTask(task, authUser.emailAddress, authUser.password)
            .then((response) => {
                if(response === "success"){
                    console.log(`Username ${authUser.emailAddress} 
                    successfully created: ${task}`);
                    this.props.history.push('/');
                } else if (response === "forbidden"){
                    this.props.history.push("/forbidden")
                } else {
                    this.setState({errors: [...errors, response]})
                }
            }).catch(err => {
                console.log(err);
                this.props.history.push("/error");
            })
    }

    cancel = () => {
        this.props.history.push("/");
    }
}

export default NewTask;