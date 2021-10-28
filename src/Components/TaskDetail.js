import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const convertTime = require("convert-time");

//import NotFound from './NotFound';
//import ReactMarkdown from 'react-markdown'

class TaskDetail extends Component {
    constructor(props){
        super(props);
        this.del = this.del.bind(this);
        this.state = {
            id: "",
            title: "",
            description: "",
            time: "",
            userId: null,
            createdAt: ""
        }
    }

    componentDidMount() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        let key = this.props.match.params.id

        context.data.getTask(key, authUser.emailAddress, authUser.password).then(
            response => this.setState({
                id: response.id,
                title: response.title,
                description: response.description,
                time: response.time,
                userId: response.userId,
                createdAt: response.createdAt
            })
        )
        .catch(error => {
            console.log('Error ' + error);
            this.props.history.push("/error")
        });
    }

    render(){
        const {
            id,
            title,
            description,
            time,
            createdAt
        } = this.state;

        const dateFormat = (rawDate) => {
            let date = rawDate.slice(0, 10)
            let cleaned = ('' + date).replace(/\D/g, '')
            let match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/)
            if (match) {
                return `${match[2]}/${match[3]}/${match[1]}`
            }   
            return date;
        }

        return(
            <div className="container component-container load">
                <div className="to-do-anchor">
                    <div className="task-detail-container">
                        <h2 className="to-do-header">{title}</h2>
                            <p>Time Uploaded: {dateFormat(createdAt)}</p>
                            <p>Time Scheduled: {convertTime(time)}</p>
                            <p className="description">Description: {description}</p>
                            <div className="to-do-buttons">
                                <Link className="anchor-edit" to={`/tasks/${id}/edit`}>Edit</Link>
                                <Link className="anchor-delete" onClick={this.del} to={`/tasks/${id}`}>Delete</Link>
                                <Link className="anchor-view" to={`/tasks`}>Home</Link>
                            </div>
                    </div>
                </div>
            </div>
        )
    }

    //Method to delete task
    del(){
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const {
            id,
            userId,
        } = this.state;

        //if task owner is authenticated user, a confirmation window appears to ask user if they are certain before deleting task
        if(userId === authUser.userId){
            if(window.confirm("Are sure you want to delete this task? Once deleted, it can not be retrieved.")){
                context.data.deleteTask(id, authUser.emailAddress, authUser.password)
                    .then((response) => {
                        if(response === 'success'){
                            this.props.history.push(`/`);
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

export default TaskDetail;