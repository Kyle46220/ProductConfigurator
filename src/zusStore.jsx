import create from 'zustand';
import { changeWidth } from './zusWidth';

import React from 'react';

import Slider from './Slider';
import getWidth from './zusWidth';

// const [useStore] = create(set => ({
//   count: 0,
//   increase: () => set(state => ({ count: state.count + 1 })),
//   reset: () => set({ count: 0 })
// }))

// function Counter() {
//   const count = useStore(state => state.count)
//   return <h1>{count}</h1>
// }

// function Controls() {
//   const increase = useStore(state => state.increase)
//   return <button onClick={increase}>up</button>
// }

export const [useStore] = create((set) => ({
	height: 900,
	width: 900,
	depth: 400,
	config: [
		{ shelf: 0, divs: [0, 300, 600, 900] },
		{ shelf: 300, divs: [0, 300, 600, 900] },
		{ shelf: 600, divs: [0, 300, 600, 900] },
	],

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

	divsX: [
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
	],

	shelvesY: [0, 280, 560, 840, 1120],
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
	console.log(shelvesY, divsX, width);
	const handleChange = (e) => {
		const result = getWidth(e.target.value, shelvesY);
		newWidth(e.target.value);
		newDivsX(result);
		console.log(result, shelvesY);
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
	const value = useStore((state) => state.height);
	const newValue = useStore((state) => state.adjustHeight);
	const handleChange = (e) => {
		newValue(e.target.value);
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
				value={value}
			/>
			<h1>HEIGHT:{value}</h1>
		</label>
	);
}
