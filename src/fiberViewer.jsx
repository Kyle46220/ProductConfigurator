import React, { useRef, useState } from 'react';

import * as THREE from 'three';
import styled from 'styled-components';
import {
	useSelector,
	ReactReduxContext,
	Provider,
	useDispatch,
} from 'react-redux';

import GLTFLoader from 'three-gltf-loader';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BoxGeometry } from 'three';

extend({ OrbitControls });

const Wrapper = styled.section`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Controls = () => {
	const orbitRef = useRef();
	const { camera, gl } = useThree();

	useFrame(() => {
		//this runs every animation loop
		orbitRef.current.update();
	});

	return (
		<orbitControls
			autoRotate
			// maxPolarAngle={Math.PI / 3}
			// minPolarAngle={Math.PI / 3}
			args={[camera, gl.domElement]}
			ref={orbitRef}
		/>
	);
};

const Shelf = (props) => {
	const {
		position,
		size: [x, y, z],
	} = props;
	console.log(props);
	const shelvesY = useSelector((state) => state.shelvesY);
	if (props.index === shelvesY.length - 1) {
		return null;
	} else {
		return (
			<mesh position={position}>
				<boxGeometry attach="geometry" args={[x, y, z]}></boxGeometry>
				<meshStandardMaterial
					attach="material"
					color="hotpink"
				></meshStandardMaterial>
			</mesh>
		);
	}
};
const Box = (props) => {
	// console.log(props.position);
	// const {
	// 	position,
	// 	size: [x, y, z],
	// } = props;
	return (
		<mesh position={props.position}>
			<boxGeometry attach="geometry" args={[100, 100, 100]}></boxGeometry>
			<meshStandardMaterial
				attach="material"
				color="hotpink"
			></meshStandardMaterial>
		</mesh>
	);
};

const Vertical = (props) => {
	const {
		position,
		size: [x, y, z],
	} = props;

	return (
		<mesh position={position}>
			<boxGeometry attach="geometry" args={[x, y, z]}></boxGeometry>
			<meshStandardMaterial
				attach="material"
				color="hotpink"
			></meshStandardMaterial>
		</mesh>
	);
};

const Build = ({ ...props }) => {
	const width = useSelector((state) => state.width);

	const shelvesY = useSelector((state) => state.shelvesY);

	return (
		<group {...props}>
			<Row position={[0, 0, 0]} shelvesY={shelvesY} width={width} />
		</group>
	);
};

// there's something here about how things are rendered. height changes only show up when width slider is used. Width works fine, because width is defined every change inside the row component. the shelf array is also definined inside this component. i had this problem in the impoerative code as well. what did i do to solve it? is it perhaps how in viewer.jsx i had the position shelf function that ran after the logic that decides whether to remove or add. It may be this separation of positioning and creating differently?
//though fiber seems to update the width fine. why is this?

// it looks like it just re-renders from within the conditional if else
// like it just stays there and doesn't go all the way back to the start of the component and loops through the return of each cnoditional part as long as its there.
// i'm quitting for the night bu i think its going to be somehitng to do with how the divs a renderseed every fram but the shelves areent'

const Row = ({ ...props }) => {
	// const width = useSelector((state) => state.width);
	const width = props.width;

	const shelvesY = props.shelvesY;
	console.log('shelvesY', shelvesY);

	const shelves = shelvesY.map((pos, index) => {
		console.log('index', index);
		// if (props.index === shelvesY.length - 1) {
		// 	const topPos = shelvesY[props.index];

		// 	return (
		// 		// <Shelf
		// 		// 	key={topPos + props.index}
		// 		// 	index={index}
		// 		// 	position={(width / 2, topPos, 0)}
		// 		// 	size={[width, 18, 400]}
		// 		// />
		// 		null
		// 	);
		// } else {
		console.log('if', index);
		return (
			<>
				<Shelves key={pos + index} />

				<Verts key={index} index={index} />
			</>
		);
		// }
	});

	return <group {...props}>{shelves}</group>;
};

const Shelves = ({ ...props }) => {
	const width = useSelector((state) => state.width);
	const shelvesY = useSelector((state) => state.shelvesY);
	if (props.index === shelvesY.length) {
		return null;
	} else {
		// const height = shelvesY[props.key +1] - shelvesY[props.key];
		const height = 180;

		const shelves = shelvesY.map((pos, index) => {
			return (
				<Shelf
					key={pos + index}
					position={[width / 2, pos, 0]}
					size={[width, 18, 400]}
				/>
			);
		});

		return <group {...props}>{shelves}</group>;
	}
};

const Verts = ({ ...props }) => {
	// const width = useSelector((state) => state.width);
	console.log('divs pos', props.index);
	const divsX = useSelector((state) => state.divsX[props.index]);
	const shelvesY = useSelector((state) => state.shelvesY);
	const shelfYPos = shelvesY[props.index];
	console.log('H E L L O', shelfYPos, divsX);
	if (props.index === shelvesY.length) {
		return null;
	} else {
		// const height = shelvesY[props.key +1] - shelvesY[props.key];
		const height = 180;

		const verticals = divsX.map((pos, index) => {
			return (
				<Vertical
					key={pos + index}
					position={[pos, shelfYPos, 0]}
					size={[18, height, 400]}
				/>
			);
		});

		return <group {...props}>{verticals}</group>;
	}
};

const Slider = (props) => {
	const dispatch = useDispatch();
	const width = useSelector((state) => state.width);
	const { minSize, maxSize } = props;

	const handleChange = (e) => {
		dispatch({ type: 'UPDATE_WIDTH_ARRAY', newWidth: e.target.value });
	};

	return (
		<>
			<input
				type="range"
				min={minSize}
				max={maxSize}
				value={width}
				step={1}
				onChange={handleChange}
			/>
			SLIDER
		</>
	);
};
export default () => {
	return (
		<Wrapper>
			<h1>Hello</h1>
			<ReactReduxContext.Consumer>
				{({ store }) => (
					<Canvas camera={{ position: [200, 500, 1000], far: 11000 }}>
						<Provider store={store}>
							<ambientLight />
							<pointLight position={[10, 10, 10]} />
							{/* <Shelf
								position={[10, 10, 10]}
								size={[2000, 18, 400]}
							/>
							<Vertical
								size={[18, 280, 400]}
								position={[1500, 280, 0]}
							/> */}
							<Build position={[0, 0, 0]} />
							<Controls />
						</Provider>
					</Canvas>
				)}
			</ReactReduxContext.Consumer>
			{/* <Slider minSize={600} maxSize={2400} /> */}
		</Wrapper>
	);
};
