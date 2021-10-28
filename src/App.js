/* eslint-disable */ 
import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Tasks from "./Components/Tasks";
import TaskDetail from "./Components/TaskDetail";
import EditTasks from "./Components/EditTask";
import Header from "./Components/Header";
import NewTasks from "./Components/NewTask";
import UserSignUp  from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import Error from './Components/UnhandledError';
import Forbidden from './Components/Forbidden';
import NotFound from './Components/NotFound';
import withContext from "./Context";
import PrivateRoute from "./PrivateRoute";

const HeaderWithContext = withContext(Header);
const TasksWithContext = withContext(Tasks);
const TaskDetailWithContext = withContext(TaskDetail);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const NewTasksWithContext = withContext(NewTasks);
const EditTasksWithContext = withContext(EditTasks);

function App(){
	return(
		<Router>
			<div>
				<HeaderWithContext />
				<Switch>
					<PrivateRoute exact path="/" component={TasksWithContext} />
					<Redirect exact from="/tasks" to="/" />
					<PrivateRoute path="/tasks/:id/edit" component={EditTasksWithContext} />
					<PrivateRoute path="/tasks/new" component={NewTasksWithContext} />
					<PrivateRoute path="/tasks/:id" component={TaskDetailWithContext} />
					<Route exact path="/signin" component={UserSignInWithContext} />
					<Route exact path="/signup" component={UserSignUpWithContext} />
					<Route exact path="/error" component={Error} />
					<Route exact path="/forbidden" component={Forbidden} />
					<Route exact path="/notfound" component={NotFound} />
					<Route exact path="/signout" component={UserSignOutWithContext} />
					<Redirect from="*" to="/error" />
				</Switch>
			</div>
		</Router>
	)
}

export default App;