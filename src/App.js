import React from 'react';
import { render } from 'react-dom';
import Viewer from './Viewer';
import Width from './width';
import Height from './height';
import FiberViewer from './fiberViewer';
import ZusViewer from './zustandViewer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FormContainer from './form';
import styled from 'styled-components';
import WidthControls from './zusWidth';
import HeightControls from './zusHeight';
const initialState = {
	shelvesY: [0, 280, 560, 840, 1120],
	divsX: [
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
	],
	materialThickness: 18,
	height: '1200',
	width: '1000',
	depth: '400',
	colour: 'fuchsia',
	shelfHeights: [180, 280, 380, 480],
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
			case 'UPDATE_CONFIG':
				newState = { ...state, config: action.newConfig };
				break;
			case 'ADD_SHELF':
				newState = {
					...state,
					shelves: state.shelves.push(action.newShelf),
				};
				break;
			case 'UPDATE_HEIGHT':
				newState = { ...state, height: action.newHeight };
				break;

			case 'UPDATE_HEIGHT_ARRAY':
				console.log('UPDATE_HEIGHT_ARRAY');
				newState = {
					...state,

					shelvesY: action.newHeightArray,
					height: action.newHeight,
					divsX: action.newDivsX,
				};
				break;

			case 'UPDATE_WIDTH':
				newState = { ...state, width: action.newWidth };
				break;
			case 'UPDATE_WIDTH_ARRAY':
				newState = {
					...state,
					divsX: action.newWidthArray,
					width: action.newWidth,
				};
				break;
			case 'UPDATE_DEPTH':
				newState = { ...state, depth: action.newDepth };
				break;
			case 'UPDATE':
				newState = {
					...state,
					shelvesY: action.newHeightArray,
					divsX: action.newWidthArray,
					height: action.newHeight,
					width: action.newWidth,
				};
				break;
			case 'UPDATE_DRAWERS':
				newState = {
					...state,
					drawers: action.newDrawers,
				};
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
					{/* <FiberViewer /> */}
					<ZusViewer />
					{/* <Viewer /> */}
					{/* <FormContainer /> */}
					{/* <WidthControls />
					<HeightControls /> */}
					{/* <Width />
					<Height /> */}
				</Wrapper>
			</Provider>
		);
	}
}

export default App;
