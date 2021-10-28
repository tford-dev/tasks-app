/* eslint-disable */ 
import React from 'react'

export default (props) => {
	const {
		cancel,
		errors,
		submit,
		submitButtonText,
		elements,
	} = props;

	function handleSubmit(event) {
		event.preventDefault();
		submit();
	}

	function handleCancel(event) {
		event.preventDefault();
		cancel();
	}

  return (
		<div>
				<form onSubmit={handleSubmit}>
					<div className="container sign-form">
						<ErrorsDisplay errors={errors} />
						{elements()}
							<div className="form-button-container">
								<input className="form-submit" type="submit" value={submitButtonText} />
								<button className="form-cancel" onClick={handleCancel}>Cancel</button>
							</div>
					</div>
				</form>
		</div>
  );
}

//function to display errors when invalid/empty values are in submitted in a required input
function ErrorsDisplay({ errors }) {
    let errorsDisplay = null;
        if (errors.length) {
            errorsDisplay = (
                <div className="error">
                    <h3>Validation errors</h3>
                        <div>
                            <ul>
								{/*Loops through errors from required inputs*/}
                                {errors.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </div>
                </div>
        );
	errors.length = 0;
}
  return errorsDisplay;
}
