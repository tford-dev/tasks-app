import Cookies from "js-cookie";

//General API function for requests to server
const api = (path, method='GET', body=null, requiresAuth=false, credentials=null) => {
    const api = 'https://tasks-by-tforddev-api.herokuapp.com/api';
    const url = api + path;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    };

    if(body !== null){
        options.body = JSON.stringify(body)
    }

    if(requiresAuth){
        const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
        options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
}

//GET request to retrieve user data
export const getUser = async(emailAddress, password) => {
    const response = await api(`/users`, 'GET', null, true, {emailAddress, password});
    if (response.status === 401) {
        return response.json().then(data => {
            console.log(response);
            console.log(data.message)
            //return data.message;
            throw new Error("Sign-in was unsuccessful, please enter valid data.");
        })
    } else if (response.status === 200) {
        console.log(response);
        return response.json().then(data => data)
    } else {
        throw new Error();
    }
}

//POST request to create user
const createUser = async(user) => {
    const response = await api('/users', 'POST', user);
    if (response.status === 201) {
        return [];
    }
    else if (response.status === 400) {
        return response.json().then(data => {
            return data.message;
        });
    }
    else {
        throw new Error();
    }
}

const signIn = async (emailAddress, password) => {
    const user = await UserRequests.getUser(emailAddress, password);
    if(user !== null){
        user.password = password;
        initialState.authenticatedUser = user;
    //Sets authenticated user in cookies for 7 daYS
    Cookies.set("authenticatedUser", JSON.stringify(user), {expires: 7});
    }
    //return user --old code
    return window.location.reload();
} 

const signOut = () => {
    Cookies.remove("authenticatedUser");
    initialState.authenticatedUser = null;
}

//GET request to retrieve all tasks for a user
const getTasks = async (emailAddress, password) =>{
    const response = await this.api('/tasks', 'GET', null, true, {emailAddress, password});
    if(response.status === 200) {
        return response.json().then(data => data);
    } else if (response.status === 400) {
        return response.json().then(data => {
            return data.errors;
        });
    } else {
        throw new Error();
    }
}

//GET request to retrieve an individual task
const getTask = async (id, emailAddress, password) => {
    const response = await this.api(`/tasks/${id}`, 'GET', null, true, {emailAddress, password});
    if(response.status === 200) {
        return response.json().then(data => data);
    } else if (response.status === 400) {
        return response.json().then(data => {
            return data.errors;
        });
    } else {
        throw new Error();
    }
}

//POST request to create a task
const createTask = async (obj, emailAddress, password) => {
    const response = await this.api(`/tasks`, 'POST', obj, true, {emailAddress, password});
    if(obj.title.length > 0 && obj.description.length > 0){
        if (response.status === 201) {
            return "success";
        } else if (response.status === 401 || 403) {
            return "forbidden";
        }
    } else if (response.status === 400) {
        return response.json().then(data => {
            return data.errors;
        })
    } else {
        throw new Error();
    }
}

//PUT request to edit/update a course
const updateTask = async(obj, emailAddress, password) => {
    const response = await this.api(`/tasks/${obj.id}`, 'PUT', obj, true, {emailAddress, password});
    if(obj.title.length > 0 && obj.description.length > 0){
        if (response.status === 204) {
            return "success";
        } else if (response.status === 401 || 403) {
            return "forbidden";
        }
    } else if (response.status === 400) {
        return response.json().then(data => {
            return data.errors;
        })
    } else {
        throw new Error();
    }
}

//DELETE request to delete a course from the database
const deleteTask = async (id, emailAddress, password) => {
    const response = await this.api(`/tasks/${id}`, 'DELETE', null, true, {emailAddress, password});
    if(response.status === 204){
        return "success";
    } else if (response.status === 403 ) {
        console.log(response.message);
        return "forbidden";
    } else {
        throw new Error();
    }
}

export const initialState = {
    authenticatedUser: Cookies.get("authenticatedUser") || null,
    getUser: getUser,
    createUser: createUser,
    signIn: signIn,
    signOut: signOut,
    getTasks: getTasks,
    getTask: getTask,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'SET_USER': 
            return {
                ...state,
                authenticatedUser: action.authenticatedUser,
            };
        default:
            return state;
    }
}