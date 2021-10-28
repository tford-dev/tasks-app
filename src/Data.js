class Data {
    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
        const api = 'http://localhost:5000/api';
        const url = api + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        };

        if(body !== null) {
            options.body = JSON.stringify(body);
        }

        if(requiresAuth){
            const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(url, options);
    }

    //GET request to retrieve user data
    async getUser(emailAddress, password) {
        const response = await this.api(`/users`, 'GET', null, true, {emailAddress, password});
        if (response.status === 401) {
            return response.json().then(data => {
                return data.message;
            })
        } else if (response.status === 200) {
            return response.json().then(data => data)
        } else {
            throw new Error();
        }
    }

    //POST request to create user
    async createUser(user) {
        const response = await this.api('/users', 'POST', user);
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

    //GET request to retrieve all tasks for a user
    async getTasks(emailAddress, password) {
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
    async getTask(id, emailAddress, password){
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
    async createTask(obj, emailAddress, password) {
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
    async updateTask(obj, emailAddress, password) {
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
    async deleteTask(id, emailAddress, password) {
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
}

export default Data;