// import Slider from './Slider';
// import { useStore } from './zusStore';

// import React from 'react';

// export const changeWidth = (e) => {
// 	const state = useStore;
// 	const divWidth = 400;
// 	const divQty = Math.floor(e.target.value / divWidth);
// 	const divGap = e.target.value / divQty;
// 	const divPos = [];

// 	// const shelfPos = this.props.shelvesY;

// 	const { shelvesY } = state;

// 	shelvesY.forEach(() => {
// 		const result = [];
// 		let i = 0;
// 		while (i < e.target.value) {
// 			result.push(Math.floor(i));
// 			i = i + divGap;
// 		}
// 		result.push(Math.floor(e.target.value));
// 		divPos.push(result);
// 	});

// 	return { divsX: divPos, width: e.target.value };
// };

// function Controls() {
// 	const handleChange = useStore((state) => state.adjustWidth);
// 	return (
// 		<label>
// 			<Slider
// 				type="range"
// 				min={600}
// 				max={2400}
// 				step={1}
// 				onChange={handleChange}
// 				name={'width'}
// 				// value={width}
// 			/>
// 			WIDTH
// 		</label>
// 	);
// }
