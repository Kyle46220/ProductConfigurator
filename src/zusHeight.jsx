export default ({ ...props }, e) => {
	const { shelvesY, divsX, shelfHeights } = props;

	let newShelvesY = shelvesY;
	const getRandomInt = (max) => {
		return Math.floor(Math.random() * Math.floor(max));
	};

	let newDivsX = divsX;

	const slider = e;

	const nextShelfGap = shelfHeights[getRandomInt(3)];

	const addShelf = (array, value) => {
		array.push(array[array.length - 1] + value);
	};

	const addDividers = (array, value) => {
		array.push(array[array.length - 1]);
	};

	const predicate = (x) => {
		return x < slider;
	};

	while (newShelvesY[newShelvesY.length - 1] < slider) {
		addShelf(newShelvesY, nextShelfGap);
		addDividers(newDivsX, newDivsX[newDivsX.length - 1]);
	}
	newShelvesY = newShelvesY.filter(predicate);

	newDivsX = newDivsX.slice(0, newShelvesY.length);

	const shelfSum = newShelvesY[newShelvesY.length - 1];

	const constrainedHeight = shelfSum + newShelvesY.length * 18 + 18;

	return {
		shelvesY: newShelvesY,
		height: constrainedHeight,
		divsX: newDivsX,
	};

	// i wonder if I can also dispatch a gap array here too.
};
