import { connect } from 'react-redux';
import React from 'react';
// import { render } from 'react-dom';
import styled from 'styled-components';
import Slider from './Slider';

function mapStateToProps(state) {
	return {
		config: state.config,
		height: state.height,
		width: state.width,
		depth: state.depth,
		materialThickness: state.materialThickness,
		shelvesY: state.shelvesY,
		divsX: state.divsX,
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
	// componentDidMount() {
	// 	const shelvesY = useSelector((state) => state.shelvesY);
	// 	const divsX = useSelector((state) => state.divsX);

	// 	const dispatch = useDispatch();
	// }

	handleOnChangeHeight = (e) => {
		// console.log(this.props.height);
		const shelfHeights = [180, 280, 380];

		const getRandomInt = (max) => {
			return Math.floor(Math.random() * Math.floor(max));
		};
		// const shelvesY = useSelector((state) => state.shelvesY);
		// const divsX = useSelector((state) => state.divsX);

		// const dispatch = useDispatch();

		const { shelvesY, divsX } = this.props;

		const newDivsX = divsX;

		const slider = e.target.value;

		let highestShelf = shelvesY[shelvesY.length - 1];

		const nextShelfGap = shelfHeights[getRandomInt(3)];

		const nextShelf = highestShelf + nextShelfGap;

		const newShelvesY = shelvesY;

		if (slider > highestShelf && slider < nextShelf) {
			return null;
		} else if (slider > nextShelf) {
			newShelvesY.push(nextShelf);
			const newDivRow = newDivsX[newDivsX.length - 1]; //copy last row
			newDivsX.push(newDivRow);
		} else {
			shelvesY.pop();
			divsX.pop();
		}

		const shelfSum = newShelvesY[newShelvesY.length - 1];

		const constrainedHeight = shelfSum + newShelvesY.length * 18 + 18;

		this.props.dispatch({
			type: 'UPDATE_HEIGHT_ARRAY',
			newHeight: constrainedHeight,
			newHeightArray: newShelvesY,
			newDivsX: newDivsX,
		});

		// i wonder if I can also dispatch a gap array here too.
	};

	handleOnChangeWidth = (e) => {
		const divWidth = 400;
		const divQty = Math.floor(e.target.value / divWidth);
		const divGap = e.target.value / divQty;
		const divPos = [];

		// const shelvesY = useSelector((state) => state.shelvesY);
		// const divsX = useSelector((state) => state.divsX);

		// const dispatch = useDispatch();
		// const shelfPos = this.props.shelvesY;

		const { shelvesY } = this.props;

		shelvesY.forEach(() => {
			const result = [];
			let i = 0;
			while (i < e.target.value) {
				result.push(Math.floor(i));
				i = i + divGap;
			}
			result.push(Math.floor(e.target.value));
			divPos.push(result);
		});

		this.props.dispatch({
			type: 'UPDATE_WIDTH_ARRAY',
			newWidthArray: divPos,
			newWidth: e.target.value,
		});
	};

	handleOnChange = (e) => {
		console.log(this.props);
		console.log(e.target.name);
		const { height, width, shelvesY } = this.props;
		let heightValue = height;
		let widthValue = width;
		console.log('hello', height, width);

		switch (e.target.name) {
			case 'height':
				heightValue = e.target.value;
				widthValue = width;
				console.log(
					'inside height case',
					heightValue,
					widthValue,
					width
				);
				break;
			case 'width':
				heightValue = height;
				widthValue = e.target.value;
				break;
			default:
				heightValue = this.props.height;
				widthValue = this.props.width;
		}
		// if (e.target.name === 'height') {
		// 	heightValue = e.target.value;
		// } else {
		// 	widthValue = e.target.value;
		// }

		const divWidth = 400;
		const divQty = Math.floor(widthValue / divWidth);
		const divGap = widthValue / divQty;
		const divPos = [];
		const shelfPos = this.props.shelvesY;
		const shelfHeights = [180, 280, 380];

		const getRandomInt = (max) => {
			return Math.floor(Math.random() * Math.floor(max));
		};

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
		//I have to put a thing in here that adds and extra row to the divsX array
		let newArray = [];
		newArray.push(shelvesY);
		newArray = newArray.flat();
		newShelfPos.forEach((item) => {
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
			newWidthArray: divPos,
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
						min={280 + 36}
						max={2400}
						// value={this.props.height}
						step={1}
						onChange={this.handleOnChangeHeight}
						name={'height'}
					/>
					HEIGHT
				</label>
				<label>
					<Slider
						type="range"
						min={600}
						max={2400}
						step={1}
						onChange={this.handleOnChangeWidth}
						name={'width'}
					/>
					WIDTH
				</label>
			</FormWrap>
		);
	}
}

export default connect(mapStateToProps)(FormContainer);
