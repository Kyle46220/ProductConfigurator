import { connect } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import Slider from './Slider';

function mapStateToProps(state) {
	return {
		config: state.config,
		height: state.height,
		width: state.width,
		depth: state.depth,
		materialThickness: state.materialThickness
	};
}

const FormWrap = styled.form`
	border: 5px solid fuchsia;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px;
	padding: 5px;
`;

class FormContainer extends React.Component {
	handleOnChangeHeight = e => {
		const shelfHeights = [180, 280, 380];

		const getRandomInt = max => {
			return Math.floor(Math.random() * Math.floor(max));
		};

		const { shelvesY } = this.props.config;

		const newShelfPos = [];

		let i = shelvesY[shelvesY.length - 1];

		if (e.target.value > shelvesY[shelvesY.length - 1]) {
			while (i < e.target.value) {
				const newShelf = shelfHeights[getRandomInt(2)];

				newShelfPos.push(newShelf);

				i = i + newShelf;
			}
		} else if (e.target.value < shelvesY[shelvesY.length - 1]) {
			shelvesY.pop();
		}

		let newArray = [];
		newArray.push(shelvesY);
		newArray = newArray.flat();
		newShelfPos.forEach(item => {
			const total = newArray[newArray.length - 1];

			const newTotal = total + item;

			newArray.push(newTotal);
		});

		const shelfSum = newArray[newArray.length - 1];

		const constrainedHeight = shelfSum + newArray.length * 18 + 18;

		this.props.dispatch({
			type: 'UPDATE_HEIGHT_ARRAY',
			newHeight: constrainedHeight,
			newHeightArray: newArray.flat() //you can pass multiple values through to the reducer. maybe i pass the whole state through? nah that doesn't seem to make sense as its already in redux.
		});
	};

	handleOnChangeWidth = e => {
		const divWidth = 400;
		const divQty = Math.floor(e.target.value / divWidth);
		const divGap = e.target.value / divQty;
		const divPos = [];
		const shelfPos = this.props.config.shelvesY;

		shelfPos.forEach(() => {
			const result = [];
			let i = 0;
			while (i < e.target.value) {
				result.push(Math.floor(i));
				i = i + divGap;
			}
			divPos.push(result);
		});
		console.log('shelfPos', shelfPos);
		console.log('divPos', divPos);

		this.props.dispatch({
			type: 'UPDATE_WIDTH_ARRAY',
			newHeightArray: divPos,
			newWidth: e.target.value
		});
		// this.props.dispatch({
		// 	type: 'UPDATE_WIDTH',
		// 	newWidth: e.target.value
		// 	// valueType: e.target.parent.name
		// });
	};

	render() {
		return (
			<FormWrap>
				<label>
					<Slider
						type="range"
						// min={this.props.min}
						min={280 + 36}
						// max={this.props.max}
						max={2400}
						// value={this.props.config.height}
						// step={this.props.step}
						step={1}
						// onChange={e => {
						// 	this.props.dispatch({
						// 		type: 'UPDATE_HEIGHT',
						// 		newTest: e.target.value
						// 	});
						// }}
						onChange={this.handleOnChangeHeight}
					/>
					TEST PARAM
				</label>
				<label>
					<Slider
						type="range"
						// min={this.props.min}
						min={600}
						// max={this.props.max}
						max={2400}
						value={this.props.config.width}
						// step={this.props.step}
						step={1}
						// onChange={e => {
						// 	this.props.dispatch({
						// 		type: 'UPDATE_HEIGHT',
						// 		newTest: e.target.value
						// 	});
						// }}
						onChange={this.handleOnChangeWidth}
					/>
					TEST PARAM
				</label>
			</FormWrap>
		);
	}
}

export default connect(mapStateToProps)(FormContainer);
