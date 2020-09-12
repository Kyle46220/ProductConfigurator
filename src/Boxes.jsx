import react from 'react';
import { useStore } from './zusStore';

// this componenent will create some invisible bounding boxes for clicking on and for drawer sizing and moving.
// they are calculated from the div and shelf positions.

const Box = (props) => {
  // this component creates a box from given input sizes with a clickable bit that will 
	const mesh = useRef();

	const {
		position,
		size: [x, y, z],
  } = props;
  
	// const state = useStore(state);
	

	const handleClick = (e) => {
		const id = Date.now();
		const { x, y } = e.object.position;

		const newDrawer = { id: id, pos: [x, y, 0] };
		
		console.log('newDrawer', newDrawer)

	

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
