import create from 'zustand';

export const [useStore] = create((set) => ({
	height: 900,
	width: 900,
	depth: 400,
	config: [
		{ shelf: 0, divs: [0, 300, 600, 900] },
		{ shelf: 300, divs: [0, 300, 600, 900] },
		{ shelf: 600, divs: [0, 300, 600, 900] },
	],
	adjustHeight: set(ZusHeight),
	adjustWidth: set(ZusWidth),
	shelvesY: [0, 280, 560, 840, 1120],
	divsX: [
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
		[0, 300, 600, 900],
	],
}));
