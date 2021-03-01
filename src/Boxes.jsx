import react from 'react';
import { useStore } from './zusStore';

// this componenent will create some invisible bounding boxes for clicking on and for drawer sizing and moving.
// they are calculated from the div and shelf positions.

const Box = (props) => {
	// this component creates a box from given input sizes with a clickable bit that will make a drawer appear.
	const mesh = useRef();

	const {
		position,
		size: [x, y, z],
	} = props;

	const handleClick = (e) => {
		console.log('hello from box click', e);
	};

	return (
		<mesh ref={mesh} position={position} onClick={handleClick}>
			<boxGeometry attach="geometry" args={[x, y, z]}></boxGeometry>
			<meshStandardMaterial
				attach="material"
				color="hotpink"
			></meshStandardMaterial>
		</mesh>
	);
};

//next i need to write a function to make positions
// 1. filter out the things I dont need.
// 2. create array of positions.

const BoxPositions = () => {
	const shelvesY = useStore((state) => state.shelvesY);
	const divsX = useStore((state) => state.divsX);
	const boxes = useStore((state) => state.boxes);

	const boxShelvesY = shelvesY
		.filter((shelf) => {
			shelf.index !== shelvesY.length - 1; // for every shelf except the last
		})
		.map((shelf, index) => {
			return shelf + Math.abs(shelf, shelvesY[index + 1]);
			// find the difference between it and the next
		});

	return <>{boxpositioner} </>;
};
