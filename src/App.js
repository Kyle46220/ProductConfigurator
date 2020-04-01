import React from 'react';
import { render } from 'react-dom';
import Viewer from './Viewer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FormContainer from './form';
import styled from 'styled-components';
const initialState = {
	materialThickness: 18,
	height: '1200',
	width: '1000',
	depth: '400',
	colour: 'fuchsia',
	shelfHeights: [180, 280, 380, 480],
	min: { x: 0, y: -600, z: 0 },
	max: { x: 500, y: 600, z: 400 },
	config: {
		shelvesY: [0, 280, 560, 840, 1120],
		divsX: [
			[0, 300, 600, 900],
			[0, 300, 600, 900],
			[0, 300, 600, 900],
			[0, 300, 600, 900],
			[0, 300, 600, 900]
		],
		divHeights: [280, 280, 280, 280],
		shelves: [
			{
				id: '0',
				totalShelfQty: '',
				height: '280',
				min: { x: 0, y: 0, z: 0 },
				max: { x: -982, y: 600, z: 400 },
				divs: [
					{
						id: '0',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 100, y: 100, z: 100 }
					},
					{
						id: '1',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 200, y: 200, z: 200 },
						max: { x: 400, y: 400, z: 400 }
					},
					{
						id: '2',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 200, y: 200, z: 200 },
						max: { x: 600, y: 600, z: 600 }
					},
					{
						id: '3',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 200, y: 200, z: 200 },
						max: { x: 800, y: 800, z: 800 }
					}
				]
			},
			{
				id: '1',
				totalShelfQty: '',
				height: '550',
				min: { x: 0, y: 380, z: 0 },
				max: { x: 0, y: -200, z: 618 },
				divs: [
					{
						id: '0',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 325, y: 325, z: 325 }
					},
					{
						id: '1',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 499, y: 499, z: 499 }
					},
					{
						id: '2',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 570, y: 570, z: 570 }
					},
					{
						id: '3',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 650, y: 650, z: 650 }
					}
				]
			},
			{
				id: '2',
				totalShelfQty: '',
				height: '550',
				min: { x: 0, y: 760, z: 0 },
				max: { x: 0, y: -200, z: 618 },
				divs: [
					{
						id: '0',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 325, y: 325, z: 325 }
					},
					{
						id: '1',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 499, y: 499, z: 499 }
					},
					{
						id: '2',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 570, y: 570, z: 570 }
					},
					{
						id: '3',
						totalDivQty: '',
						cupboard: false,
						drawer: false,
						min: { x: 0, y: 0, z: 0 },
						max: { x: 650, y: 650, z: 650 }
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
			case 'UPDATE_CONFIG':
				newState = { ...state, config: action.newConfig };
				break;
			case 'ADD_SHELF':
				newState = {
					...state,
					shelves: state.shelves.push(action.newShelf)
				};
				break;
			case 'UPDATE_HEIGHT':
				console.log(action.whatever); // you can pass as many things through here in the action as you want.
				newState = { ...state, height: action.newHeight };
				break;
			case 'UPDATE_WIDTH':
				newState = { ...state, width: action.newWidth };
				break;
			case 'UPDATE_WIDTH_ARRAY':
				newState = { ...state, config: { divsX: action.newArray } };
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
