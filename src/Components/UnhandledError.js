import React from 'react'; 

//Stateless component that is rendered when there is an error outside of invalid credentials or non-existent data in database
export const Error = () => {
    return(
        <div className="container component-container">
            <h2>Error</h2>
            <p>Sorry! We just encountered an unexpected error.</p>
        </div>
    )
}