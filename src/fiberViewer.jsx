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
	const width = useSelector((state) => state.width);

	const shelvesY = useSelector((state) => state.shelvesY);

	const shelves = shelvesY.map((pos, index) => {
		console.log('index', index);
		return (
			<>
				<Shelf
					key={pos + index}
					position={[width / 2, pos, 0]}
					size={[width, 18, 400]}
				/>
				<Verts key={index} index={index} />
			</>
		);
	});

	return <group {...props}>{shelves}</group>;
};

const Verts = ({ ...props }) => {
	// const width = useSelector((state) => state.width);
	console.log(props.key);
	const divsX = useSelector((state) => state.divsX[props.index]);
	const shelvesY = useSelector((state) => state.shelvesY);
	const shelfYPos = shelvesY[props.index];
	if (props.index === shelvesY.length) {
		return;
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
							<Row position={[0, 0, 0]} />
							<Controls />
						</Provider>
					</Canvas>
				)}
			</ReactReduxContext.Consumer>
			<Slider minSize={600} maxSize={2400} />
		</Wrapper>
	);
};
