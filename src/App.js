/* eslint-disable */ 
import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import { Tasks } from "./Components/Tasks";
import { TaskDetail } from "./Components/TaskDetail";
import { EditTask } from "./Components/EditTask";
import { Header } from "./Components/Header";
import { NewTask } from "./Components/NewTask";
import { SignUp } from './Components/SignUp';
import { SignIn } from './Components/SignIn';
import UserSignOut from './Components/UserSignOut';
import { Error } from './Components/UnhandledError';
import { Forbidden } from './Components/Forbidden';
import { NotFound } from './Components/NotFound';

function App(){
	return(
		<Router>
			<div>
				<Header />
				<Switch>
					<Route exact path="/" component={Tasks} />
					<Redirect exact from="/tasks" to="/" />
					<Route path="/tasks/:id/edit" component={EditTask} />
					<Route path="/tasks/new" component={NewTask} />
					<Route path="/tasks/:id" component={TaskDetail} />
					<Route exact path="/signin" component={SignIn} />
					<Route exact path="/signup" component={SignUp} />
					<Route exact path="/error" component={Error} />
					<Route exact path="/forbidden" component={Forbidden} />
					<Route exact path="/notfound" component={NotFound} />
					<Route exact path="/signout" component={UserSignOut} />
					<Redirect from="*" to="/error" />
				</Switch>
			</div>
		</Router>
	)
}

export default App;