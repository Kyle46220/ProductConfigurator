import create from 'zustand';
import { changeWidth } from './zusWidth';

import React from 'react';

import Slider from './Slider';

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

const [useStore] = create((set) => ({
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

	divsX: [
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
	],
}));

const getEventValue = (e) => {
	return e.target.value;
};

const [useStoreCounter] = create((set) => ({
	count: 1,
	inc: () => set((state) => ({ count: state.count + 1 })),
	dec: () => set((state) => ({ count: state.count - 1 })),
}));

export function Counter() {
	const { count, inc, dec } = useStoreCounter();

	return (
		<div class="counter">
			<span>{count}</span>
			<button onClick={inc}>up</button>
			<button onClick={dec}>down</button>
		</div>
	);
}

export function WidthControls() {
	const widthDisplay = useStore((state) => state.width);
	const newWidth = useStore((state) => state.adjustWidth);
	const handleChange = (e) => {
		newWidth(e.target.value);
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
				value={widthDisplay}
			/>
			<h1>WIDTH:{widthDisplay}</h1>
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
