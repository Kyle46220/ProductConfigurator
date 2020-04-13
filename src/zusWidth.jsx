// import Slider from './Slider';

// import React from 'react';

// // import { useDispatch, useSelector } from 'react-redux';

// const Width = () => {
// 	// const shelvesY = useSelector((state) => state.shelvesY);
// 	// const width = useSelector((state) => state.width);

// 	// const dispatch = useDispatch();

// 	const handleOnChangeWidth = (e) => {
// 		const divWidth = 400;
// 		const divQty = Math.floor(e.target.value / divWidth);
// 		const divGap = e.target.value / divQty;
// 		const divPos = [];

// 		// const shelfPos = this.props.shelvesY;

// 		// const { shelvesY } = this.props;

// 		shelvesY.forEach(() => {
// 			const result = [];
// 			let i = 0;
// 			while (i < e.target.value) {
// 				result.push(Math.floor(i));
// 				i = i + divGap;
// 			}
// 			result.push(Math.floor(e.target.value));
// 			divPos.push(result);
// 		});

// 		// dispatch({
// 		// 	type: 'UPDATE_WIDTH_ARRAY',
// 		// 	newWidthArray: divPos,
// 		// 	newWidth: e.target.value,
// 		// });
// 		console.log(width);
// 	};

// 	return (
// 		<label>
// 			<Slider
// 				type="range"
// 				min={600}
// 				max={2400}
// 				step={1}
// 				onChange={handleOnChangeWidth}
// 				name={'width'}
// 				value={width}
// 			/>
// 			WIDTH
// 		</label>
// 	);
// };

// export default Width;
