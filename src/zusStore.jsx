import create from 'zustand';
// import { changeWidth } from './zusWidth';

import React from 'react';

import Slider from './Slider';
import getWidth from './zusWidth';
import getHeight from './zusHeight';

export const [useStore, api] = create((set) => ({
	height: 900,
	width: 900,
	depth: 400,
	config: [
		{ y: 0, x: [0, 300, 600, 900] },
		{ y: 300, x: [0, 300, 600, 900] },
		{ y: 600, x: [0, 300, 600, 900] },
	],
	divsX: [
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
	],

	shelvesY: [0, 280, 560, 840, 1120],

	shelfHeights: [180, 280, 380],

	adjustHeight: (e) =>
		set((state) => {
			return { height: e };
		}),

	adjustWidth: (e) =>
		set((state) => {
			return { width: e };
		}),

	changeShelvesY: (e) =>
		set((state) => {
			return { shelvesY: e };
		}),

	changeDivsX: (e) =>
		set((state) => {
			return { divsX: e };
		}),
}));

export function WidthControls() {
	// const width = useStore((state) => state.width);
	// const shelvesY = useStore((state) => state.shelvesY);
	// const newWidth = useStore((state) => state.adjustWidth);
	// const newDivsX = useStore((state) => state.changeDivsX);
	const state = useStore();
	const {
		shelvesY,
		divsX,
		width,
		adjustWidth: newWidth,
		changeDivsX: newDivsX,
	} = state;
	// console.log(state);

	const handleChange = (e) => {
		const result = getWidth(width, shelvesY);
		newWidth(e.target.value);
		newDivsX(result);
	};

	return (
		<label>
			<Slider
				type="range"
				min={600}
				max={2400}
				step={1}
				onChange={handleChange}
				name={'width'}
				value={width}
			/>
			<h1>WIDTH:{width}</h1>
		</label>
	);
}

export function HeightControls() {
	const newHeight = useStore((state) => state.adjustHeight);
	const newDivsX = useStore((state) => state.changeDivsX);
	const newShelvesY = useStore((state) => state.changeShelvesY);
	const height = useStore((state) => state.height);
	const shelfHeights = useStore((state) => state.shelfHeights);
	const shelvesY = useStore((state) => state.shelvesY);
	const divsX = useStore((state) => state.divsX);
	// const {
	// 	height,
	// 	adjustHeight: newHeight,
	// 	changeDivsX: newDivsX,
	// 	changeShelvesY: newShelvesY,
	// } = state;
	// const value = height;

	const handleChange = (e) => {
		const state = {
			divsX,
			shelvesY,
			shelfHeights,
		};
		const result = getHeight(state, e.target.value);
		// console.log(result);
		const { shelvesY: resultShelvesY, divsX: resultDivsX, height } = result;
		newHeight(height);
		newDivsX(resultDivsX);
		newShelvesY(resultShelvesY);
	};
	return (
		<label>
			<Slider
				type="range"
				min={600}
				max={2400}
				step={1}
				onChange={handleChange}
				name={'height'}
				value={height}
			/>
			<h1>HEIGHT:{height}</h1>
		</label>
	);
}
