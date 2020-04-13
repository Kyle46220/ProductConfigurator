import Slider from './Slider';

import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

const Height = ({ ...props }) => {
	const shelvesY = useSelector((state) => state.shelvesY);
	const divsX = useSelector((state) => state.divsX);
	const height = useSelector((state) => state.height);
	const shelfHeights = [180, 280, 380];
	const dispatch = useDispatch();
	const getRandomInt = (max) => {
		return Math.floor(Math.random() * Math.floor(max));
	};

	const handleOnChangeHeight = (e) => {
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

		dispatch({
			type: 'UPDATE_HEIGHT_ARRAY',
			newHeight: constrainedHeight,
			newHeightArray: newShelvesY,
			newDivsX: newDivsX,
		});
		console.log(height, newShelvesY);

		// i wonder if I can also dispatch a gap array here too.
	};

	return (
		<label>
			<Slider
				type="range"
				min={280 + 36}
				max={2400}
				// value={this.props.height}
				step={1}
				onChange={handleOnChangeHeight}
				name={'height'}
			/>
			HEIGHT
		</label>
	);
};

export default Height;
