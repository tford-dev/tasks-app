/* eslint-disable */ 
import React, {useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { useStateValue } from '../ContextApi/StateProvider';

//stateless component with an anonymous function to sign user out and redirect them to "/" route
export default () => {
	const [initialState, dispatch] = useStateValue();
	useEffect(()=> initialState.signOut());
	return (
		<Redirect to="/signin" />
	);
}