handleOptionChange = e => {
	this.props.dispatch({
		type: 'UPDATE_COLOUR',
		newColour: e.target.value
	});
};

handleChange = prop => {
	this.props.dispatch({
		type: 'UPDATE_CONFIG',
		newConfig: prop || prop.target.value
	});
};

// trying to make a universal updater.
