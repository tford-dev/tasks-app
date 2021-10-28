import React, { Component } from 'react';
import Form from "./Form";

class EditTask extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: "",
            title: "", 
            description: "",
            time: "",
            userId: null,
            errors: []
        }
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        let key = this.props.match.params.id;

        context.data.getTask(key, authUser.emailAddress, authUser.password).then( response => {
            /*If there is a response and if the task belongs to the user, the state of 
            this component will hold key-value pairs from response*/
            if(response){
                if (response.userId === authUser.userId) {
                    this.setState({
                        id: response.id,
                        title: response.title,
                        description: response.description,
                        time: response.time,
                        userId: response.userId,
                    })
                //If task does not belong to user, they are redirected to the /forbidden route
                } else {
                    this.props.history.push("/forbidden");
                }
            //If there is no response at all, the user is redirected to the /notfound route
            } else {
                this.props.history.push("/notfound");
            }
        })
        .catch(error => {
            console.log('Error ' + error);
            this.props.history.push("/error")
        });
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
                    submitButtonText="Edit Task"
                    elements={() => (
                        <React.Fragment>
                            <h2 className="form-header">Edit Task <i className="fas fa-edit"></i></h2>

                            <label htmlFor="task-title" className="form-label">Title</label>
                            <input type="text" id="task-title" name="title" onChange={this.change} value={title} />

                            <label htmlFor="task-description" className="form-label">Description</label>
                            <textarea id="task-description" name="description" onChange={this.change} value={description}></textarea>

                            <label htmlFor="task-time" className="form-label">Time</label>
                            <div className="task-time-container">
                                <input id="task-time" type="time" name="time" onChange={this.change} value={time}/>
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
            id,
            title,
            description,
            time,
            userId,
            errors
        } = this.state;

        const task = {
            id,
            title,
            description,
            time,
            //userId is needed to get a 201 status code from api
            userId,
            errors
        };

        context.data.updateTask(task, authUser.emailAddress, authUser.password)
            .then((response) => {
                if(response === "success"){
                    console.log(`Username ${authUser.emailAddress} 
                    successfully edited: Task: ${id}`);
                    this.props.history.push(`/tasks/${id}`);
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

export default EditTask;