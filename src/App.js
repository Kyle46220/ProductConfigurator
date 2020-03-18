import React from 'react';
import { render } from 'react-dom';
import Viewer from './Viewer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FormContainer from './form';
const initialState = {};

// function getKeyByValue(object, value) {
// 	return Object.keys(object).find(key => object[key] === value);
// 	// this is somehow going to be useful for creating an action creator or reducer that can update any value in the state object. like in the reducer below, i want the hardcoded 'height' to be omething like action.myUpdatingValue.key and the value to be action.myUpdatingValue. both sides of the key/value pair come in.
// }
class App extends React.Component {
	reducer(state = initialState, action) {
		let newState = {};
		switch (action.type) {
			case 'UPDATE_HEIGHT':
				console.log(action.whatever); // you can pass as many things through here in the action as you want.
				newState = { ...state, height: action.newHeight };
				break;
			case 'UPDATE_WIDTH':
				newState = { ...state, width: action.newValue };
				break;
			case 'UPDATE_DEPTH':
				newState = { ...state, depth: action.newDepth };
				break;

			default:
				newState = { ...state };
		}
		return newState;
	}
	store = createStore(this.reducer);

	render() {
		return (
			<div className="App">
				<Provider store={this.store}>
					<Viewer />
					<FormContainer></FormContainer>
				</Provider>
			</div>
		);
	}
}

export default App;
