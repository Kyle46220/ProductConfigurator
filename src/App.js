import React from 'react';
import { render } from 'react-dom';
import Viewer from './Viewer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FormContainer from './form';
import styled from 'styled-components';
const initialState = {
	height: '',
	width: '',
	depth: '',
	colour: 'fuchsia',
	min: { x: 0, y: 0, z: 0 },
	max: { x: 0, y: 0, z: 0 },
	config: {
		shelves: [
			{
				shelfId: '',
				totalShelfQty: '',
				min: { x: 0, y: 0, z: 0 },
				max: { x: 0, y: 0, z: 0 },
				divs: [
					{
						divId: '',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 }
					},
					{
						divId: '',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 }
					}
				]
			},
			{
				shelfId: '',
				totalShelfQty: '',
				min: { x: 0, y: 0, z: 0 },
				max: { x: 0, y: 0, z: 0 },
				divs: [
					{
						divId: '',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 }
					},
					{
						divId: '',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 0, y: 0, z: 0 }
					}
				]
			}
		]
	}
};

// function getKeyByValue(object, value) {
// 	return Object.keys(object).find(key => object[key] === value);
// 	// this is somehow going to be useful for creating an action creator or reducer that can update any value in the state object. like in the reducer below, i want the hardcoded 'height' to be omething like action.myUpdatingValue.key and the value to be action.myUpdatingValue. both sides of the key/value pair come in.
// }

const Wrapper = styled.section`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;
class App extends React.Component {
	reducer(state = initialState, action) {
		let newState = {};
		switch (action.type) {
			case 'ADD_SHELF':
				newState = {
					...state,
					shelves: state.shelves.push(action.newShelf)
				};
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
			<Provider store={this.store}>
				<Wrapper className="App">
					<Viewer />
					<FormContainer />
				</Wrapper>
			</Provider>
		);
	}
}

export default App;
