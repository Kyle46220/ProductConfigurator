import React, { useRef, useState, useEffect } from 'react';
// import create from 'zustand';
import * as THREE from 'three';
import styled from 'styled-components';
import { useSelector, ReactReduxContext, Provider } from 'react-redux';
import ZusHeight from './zusHeight';
import ZusWidth from './zusWidth';
import { useStore, WidthControls, Counter, HeightControls } from './zusStore';

import GLTFLoader from 'three-gltf-loader';
import {
	Canvas,
	useFrame,
	useThree,
	extend,
	useUpdate,
} from 'react-three-fiber';

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
			// autoRotate
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

	// const ref = useUpdate(() => {}, [position, x, y, z]);
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

const BoxBuilder = (props) => {
	return null;
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
	const topIndex = shelvesY.length - 1;
	const topShelf = shelvesY[topIndex];

	console.log(shelvesY.slice(0, -1));

	const builder = shelvesY.slice(0, -1).map((pos, index) => {
		return (
			<Row
				position={[0, pos, 0]}
				index={index}
				key={'row' + pos + index}
			/>
		);
	});

	return (
		<group>
			<Shelf
				position={[width / 2, topShelf, 0]}
				size={[width, 18, 400]}
				key={'shelf' + topShelf + topIndex}
				index={topIndex}
			/>
			{builder}
		</group>
	);
};

// there's something here about how things are rendered. height changes only show up when width slider is used. Width works fine, because width is defined every change inside the row component. the shelf array is also definined inside this component. i had this problem in the impoerative code as well. what did i do to solve it? is it perhaps how in viewer.jsx i had the position shelf function that ran after the logic that decides whether to remove or add. It may be this separation of positioning and creating differently?
//though fiber seems to update the width fine. why is this?

// it looks like it just re-renders from within the conditional if else
// like it just stays there and doesn't go all the way back to the start of the component and loops through the return of each cnoditional part as long as its there.
// i'm quitting for the night bu i think its going to be somehitng to do with how the divs a renderseed every fram but the shelves areent'

// the difference is adjusting the items that are already there vs creating/deleting new ones. I need to make it so that all shapes are loaded on every frame.

const Row = ({ ...props }) => {
	const width = useSelector((state) => state.width);
	const shelvesY = useSelector((state) => state.shelvesY);

	// const width = props.width;

	// const shelvesY = props.shelvesY;

	const index = props.index;
	const pos = shelvesY[props.index];

	return (
		<group>
			<Shelf
				key={'shelf' + pos + index}
				index={index}
				position={[width / 2, pos, 0]}
				size={[width, 18, 400]}
			/>

			<Verts key={'verts' + pos + index} index={index} />
		</group>
	);
};

const Shelves = ({ ...props }) => {
	const width = useSelector((state) => state.width);
	const shelvesY = useSelector((state) => state.shelvesY);
	if (props.index === shelvesY.length) {
		return null;
	} else {
		const shelves = shelvesY.map((pos, index) => {
			console.log(pos);
			return (
				<Shelf
					key={'shelf' + pos + index}
					position={[0, pos, 0]}
					size={[width, 18, 400]}
				/>
			);
		});

		return <group {...props}>{shelves}</group>;
	}
};

const Verts = ({ ...props }) => {
	console.log('divs pos', props.index);
	const divsX = useSelector((state) => state.divsX[props.index]);
	const shelvesY = useSelector((state) => state.shelvesY);
	const shelfYPos = shelvesY[props.index];
	console.log('shelvesY, divsX', shelfYPos, divsX);

	const height = 180;

	const verticals = divsX.map((pos, index) => {
		return (
			<Vertical
				key={'vertical' + pos + index}
				position={[pos, shelfYPos, 0]}
				size={[18, height, 400]}
			/>
		);
	});

	return <group {...props}>{verticals}</group>;
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

							<Build position={[0, 0, 0]} />

							<BoxBuilder />
							<Controls />
						</Provider>
					</Canvas>
				)}
			</ReactReduxContext.Consumer>
			{/* <Slider minSize={600} maxSize={2400} /> */}
			<WidthControls />
			<HeightControls />
			<Counter />
		</Wrapper>
	);
};
