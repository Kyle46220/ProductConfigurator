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
		console.log(e);
		console.log(e.target.name);
		let heightValue;
		let WidthValue;
		const divWidth = 400;
		const divQty = Math.floor(e.target.value / divWidth);
		const divGap = e.target.value / divQty;
		const divPos = [];
		const shelfPos = this.props.config.shelvesY;
		const shelfHeights = [180, 280, 380];

		const getRandomInt = max => {
			return Math.floor(Math.random() * Math.floor(max));
		};

		const { shelvesY } = this.props.config;

		const newShelfPos = [];

		let i = shelvesY[shelvesY.length - 1];

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
			newWidthArray: divPos,
			newWidth: e.target.value
		});
		console.log('divsX', this.props.config.divsX);
		// this.props.dispatch({
		// 	type: 'UPDATE_WIDTH',
		// 	newWidth: e.target.value
		// 	// valueType: e.target.parent.name
		// });
	};
	handleOnChange = e => {
		console.log(this.props.config);
		let heightValue;
		let widthValue;
		switch (e.target.name) {
			case 'height':
				heightValue = e.target.value;
				widthValue = this.props.config.width;
				break;
			case 'width':
				heightValue = this.props.config.height;
				widthValue = e.target.value;
				break;
			default:
				heightValue = this.props.config.height;
				widthValue = this.props.config.width;
		}
		const divWidth = 400;
		const divQty = Math.floor(widthValue / divWidth);
		const divGap = widthValue / divQty;
		const divPos = [];
		const shelfPos = this.props.config.shelvesY;
		const shelfHeights = [180, 280, 380];

		const getRandomInt = max => {
			return Math.floor(Math.random() * Math.floor(max));
		};

		const { shelvesY } = this.props.config;

		const newShelfPos = [];

		let i = shelvesY[shelvesY.length - 1];

		console.log(e);
		console.log(e.target.name);
		console.log(heightValue, widthValue);

		//this is for the width

		shelfPos.forEach(() => {
			const result = [];
			let i = 0;
			while (i < widthValue) {
				result.push(Math.floor(i));
				i = i + divGap;
			}
			divPos.push(result);
		});

		// this is for the height

		if (heightValue > shelvesY[shelvesY.length - 1]) {
			while (i < heightValue) {
				const newShelf = shelfHeights[getRandomInt(2)];

				newShelfPos.push(newShelf);

				i = i + newShelf;
			}
		} else if (heightValue < shelvesY[shelvesY.length - 1]) {
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
			type: 'UPDATE',
			newHeight: constrainedHeight,
			newHeightArray: newArray.flat(),
			newWidth: widthValue,
			newWidthArray: divPos
		});

		// this.props.dispatch({
		// 	type: 'UPDATE_WIDTH_ARRAY',
		// 	newWidth: widthValue,
		// 	newWidthArray: divPos
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
						onChange={this.handleOnChange()}
						name={'height'}
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
						// value={this.props.config.width}
						// step={this.props.step}
						step={1}
						// onChange={e => {
						// 	this.props.dispatch({
						// 		type: 'UPDATE_HEIGHT',
						// 		newTest: e.target.value
						// 	});
						// }}
						onChange={this.handleOnChange()}
						name={'width'}
					/>
					TEST PARAM
				</label>
			</FormWrap>
		);
	}
}

export default connect(mapStateToProps)(FormContainer);
