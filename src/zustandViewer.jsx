import React, { useRef, useState, useEffect } from 'react';
// import create from 'zustand';
import * as THREE from 'three';
import styled from 'styled-components';
// import { useSelector, ReactReduxContext, Provider } from 'react-redux';

import { useStore, WidthControls, HeightControls, api } from './zusStore';
import shallow from 'zustand/shallow';

// import GLTFLoader from 'three-gltf-loader';
import {
	Canvas,
	useFrame,
	useThree,
	extend,
	useUpdate,
	applyProps,
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

const ControlOrbit = () => {
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
	// const state = useStore();
	// const { width, shelvesY } = state;
	// const width = useStore((state) => state.width);
	const width = useRef(api.getState((state) => state.width));
	const shelvesY = useStore((state) => state.shelvesY);

	const topIndex = shelvesY.length - 1;
	const topShelf = shelvesY[topIndex];

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
	console.log(props);
	// const { width, shelvesY, divsX } = props.state;
	const divsX = useStore((state) => state.divsX);
	const width = useStore((state) => state.width);
	const shelvesY = useStore((state) => state.shelvesY);
	const height = shelvesY[props.index + 1] - shelvesY[props.index];

	const shelfYPos = shelvesY[props.index];
	const index = props.index;
	// const pos = shelvesY[props.index];
	const verticals = divsX[props.index].map((pos, index) => {
		console.log('POS', pos);
		return (
			<Vertical
				key={'vertical' + pos + index}
				position={[pos, shelfYPos + height / 2, 0]}
				size={[18, height, 400]}
			/>
		);
	});
	return (
		<group>
			<Shelf
				key={'shelf' + shelfYPos + index}
				index={index}
				position={[width / 2, shelfYPos, 0]}
				size={[width, 18, 400]}
			/>
			{verticals}
			{/* <Verts
				key={'verts' + pos + index}
				index={index}
				state={props.state}
			/> */}
		</group>
	);
};

const Verts = ({ ...props }) => {
	console.log(props);
	const { width, shelvesY, divsX } = props.state;
	// const width = useStore((state) => state.width);
	// const divsX = useStore((state) => state.divsX);
	// const shelvesY = useStore((state) => state.shelvesY);
	const shelfYPos = shelvesY[props.index];
	console.log('hello', props.index, divsX);
	console.log(divsX);

	const height = 180;
	// if (props.index > divsX[divsX.length - 2]) {
	// 	return null;
	// } else {
	const verticals = divsX.map((pos, index) => {
		console.log('POS', pos);
		return (
			<Vertical
				key={'vertical' + pos + index}
				position={[pos, shelfYPos, 0]}
				size={[18, height, 400]}
			/>
		);
	});
	// const { scene } = useThree();
	// console.log(scene.children);

	return <group {...props}>{verticals}</group>;
	// }
};

function usePosition(source) {
	const bind = useRef();
	console.log(bind.current);
	useFrame(() => bind.current.position.set(source[0], source[1], 0));
	// console.log('pos', bind.current.position);
	return bind;
}

function useTransientData(source) {
	const bind = useRef();
	useFrame(() => applyProps(bind.current, source));
	console.log(source, bind);
	return bind;
}

const TestBox = ({ ...props }) => {
	const { position } = props;
	console.log('Box Rendered', api.getState().width);

	const width = useRef(api.getState().width);
	const height = useRef(api.getState().height);
	console.log(width, height);
	const mesh = useRef();
	console.log(width);
	useEffect(() => {
		console.log('render', width, height);
		api.subscribe(
			(value) => {
				width.current = value;
				// console.log(mesh);
				mesh.current.scale.x = value;
				// mesh.current.scale.y = value;
				//what i want to update goes in this callback. this is almost just like a nested useEffect. I cant call hooks from in here, but if I call a variable that was assigned with useStore it will triger a component re-render. I think it's no rendering because we are stuck listening inside this callback and never get to the return.
			},
			(state) => state.width
		);
		api.subscribe(
			(value) => {
				width.current = value;

				mesh.current.scale.y = value;
			},
			(state) => state.height
		);
	}, [width, height]);

	return (
		<mesh ref={mesh} position={position}>
			<boxGeometry
				attach="geometry"
				args={[1, 1, 400]}
				// you can't set these with the api.getstate
			></boxGeometry>
			<meshStandardMaterial
				attach="material"
				color="hotpink"
			></meshStandardMaterial>
		</mesh>
	);
};

export default () => {
	return (
		<Wrapper>
			<h1>Hello</h1>

			<Canvas camera={{ position: [200, 500, 1000], far: 11000 }}>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />

				<Build position={[0, 0, 0]} />

				<TestBox position={[0, 0, 0]} />

				<ControlOrbit />
			</Canvas>

			<HeightControls />
			<WidthControls />
			{/* <Slider minSize={600} maxSize={2400} /> */}
		</Wrapper>
	);
};
