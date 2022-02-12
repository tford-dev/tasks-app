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