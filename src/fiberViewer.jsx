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
const Row = ({ ...props }) => {
	// const divsX = useSelector((state) => state.divsX);
	const width = useSelector((state) => state.width);
	const group = useRef();
	// const width = 1200;
	console.log('WIIIIIIDTH', width);
	const shelvesY = useSelector((state) => state.shelvesY);
	// const shelvesY = [0, 280, 560, 840, 1120];
	console.log(shelvesY);

	const shelves = shelvesY.map((pos, index) => {
		console.log('mapppped', pos);
		return (
			<Shelf key={index} position={[0, pos, 0]} size={[width, 18, 400]} />
			// <Box position={[0, pos, 0]} />
		);
	});
	console.log(shelves);

	return (
		<group {...props} ref={group}>
			{shelves}
		</group>
	);
};

const Slider = (minSize, maxSize) => {
	// const [size, setSize] = useState(initialSize);
	const dispatch = useDispatch();
	const width = useSelector((state) => state.width);

	const handleChange = (e) => {
		dispatch({ type: 'UPDATE_WIDTH', newWidth: e.target.value });
	};

	return (
		<>
			<input
				type="range"
				min={minSize}
				max={maxSize}
				value={width}
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
							<Shelf
								position={[10, 10, 10]}
								size={[2000, 18, 400]}
							/>
							<Vertical
								size={[18, 280, 400]}
								position={[1500, 280, 0]}
							/>
							<Row position={[0, 0, 0]} />
							<Controls />
						</Provider>
					</Canvas>
				)}
			</ReactReduxContext.Consumer>
			<Slider minSize={600} maxsize={2400} />
		</Wrapper>
	);
};
