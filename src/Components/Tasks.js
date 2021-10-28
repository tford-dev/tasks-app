import React, { Component } from 'react';
import {Link} from 'react-router-dom';
const convertTime = require("convert-time");

class Tasks extends Component {
    constructor(props){
        super(props);
        this.del = this.del.bind(this);
        this.state = {
            tasks: []
        }
    }

    //When tasks ("/") are loaded, getTasks pushes response into this.state.tasks array
    componentDidMount() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        context.data.getTasks(authUser.emailAddress, authUser.password).then(
            response => this.setState({tasks: response})
        )
        .catch(error => {
            console.log('Error ' + error);
        });
    }
        
    render(){
        const indexArr = this.state.tasks.map(task => {
            return (<div className="to-do-anchor load" key={task.id}>
                    <h2 className="to-do-header">{task.title}</h2>
                    <p className="to-do-time"><i className="far fa-clock"></i> {convertTime(task.time)}</p>
                    <div className="to-do-buttons">
                        <Link className="anchor-view" to={`/tasks/${task.id}`}>View</Link>
                        <Link className="anchor-edit" to={`/tasks/${task.id}/edit`}>Edit</Link>
                        <button className="anchor-delete" onClick={()=> this.del(task.userId, task.id)}>Delete</button>
                    </div>
                </div>
            )
        })
        return(
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
        )
    }

    //Method to delete task
    del(taskOwnerId, taskId){
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        // const {
        //     id,
        //     userId,
        // } = this.state;

        //if task owner is authenticated user, a confirmation window appears to ask user if they are certain before deleting task
        if(taskOwnerId === authUser.userId){
            if(window.confirm("Are sure you want to delete this task? Once deleted, it can not be retrieved.")){
                context.data.deleteTask(taskId, authUser.emailAddress, authUser.password)
                    .then((response) => {
                        if(response === 'success'){
                            window.location.reload();
                            //An alert window is triggered if user is not authorized to delete task
                            alert("Task Deleted.");
                            console.log("Task deleted");
                        } else {
                            this.setState(() => { 
                                return {
                                    errors: response.message
                                }   
                            });
                            this.props.history.push("/error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/error");
                    })
            }
        } else {
            alert("You are not authorized to delete this task.")
        }
    }
}

export default Tasks;