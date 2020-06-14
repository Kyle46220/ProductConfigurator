// this is the logic that calculates the position of the vertical shelf dividers based on the overall cabinet width

export default (width, shelvesY) => {
	const divWidth = 400;
	const divQty = Math.floor(width / divWidth);
	const divGap = width / divQty;
	const divPos = [];

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
