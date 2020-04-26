// import Slider from './Slider';
// import { useStore } from './zusStore';

// import React from 'react';
// this will have to be rewritten so that hook rules are not broken. Will have to pass shelvesY down as props to all no functional react components.
export default (width, shelvesY) => {
	// const shelvesY = useStore((state) => state.shelvesY);
	// const { shelvesY } = state;
	const divWidth = 400;
	const divQty = Math.floor(width / divWidth);
	const divGap = width / divQty;
	const divPos = [];
	// console.log(divsX);
	// const shelfPos = this.props.shelvesY;

	shelvesY.forEach(() => {
		const result = [];
		let i = 0;
		while (i < width) {
			result.push(Math.floor(i));
			i = i + divGap;
		}
		result.push(Math.floor(width));
		divPos.push(result);
	});

	return divPos;
};
