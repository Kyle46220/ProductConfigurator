import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { useStore, WidthControls, HeightControls, api } from './zusStore';
import shallow from 'zustand/shallow';

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
	flex-direction: column;
	margin: 3em;
`;

const ControlOrbit = () => {
	const orbitRef = useRef();
	const { camera, gl } = useThree();

	useFrame(() => {
		//this runs every animation loop
		orbitRef.current.update();
	});

	return <orbitControls args={[camera, gl.domElement]} ref={orbitRef} />;
};

const Shelf = (props) => {
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
	// const width = useRef(api.getState((state) => state.width));
	const width = useStore((state) => state.width);
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
	// these useStores will cause component re-render.
	const divsX = useStore((state) => state.divsX);
	const width = useStore((state) => state.width);
	const shelvesY = useStore((state) => state.shelvesY);
	const height = shelvesY[props.index + 1] - shelvesY[props.index];

	const shelfYPos = shelvesY[props.index];
	const index = props.index;

	console.log(
		'DIVSX',
		'height:',
		divsX.length,
		'width:',
		divsX[0].length,
		divsX,
		'shelvesY:',
		shelvesY
	);
	const verticals = divsX[props.index].map((pos, index) => {
		console.log('POS', pos, index);
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
		</group>
	);
};
const ShelvesOnly = ({ ...props }) => {
	// these useStores will cause update re-render. we only want a re-render when another shelf is added?
	const divsX = useStore((state) => state.divsX);
	const shelvesY = useStore((state) => state.shelvesY);
	const height = shelvesY[props.index + 1] - shelvesY[props.index];
	const width = useRef(api.getState().width);
	const shelfYPos = shelvesY[props.index];
	const index = props.index;
	const pos = shelvesY[props.index];
	const mesh = useRef();
	const shelves = shelvesY.map((pos, index) => {
		return (
			<Shelf
				ref={mesh}
				key={'shelf' + pos + index}
				index={index}
				position={[width / 2, pos, 0]}
				size={[width, 18, 400]}
			/>
		);
	});

	useEffect(() => {
		api.subscribe(
			(value) => {
				width.current = value;

				mesh.current.scale.x = value;
			},
			(state) => state.height
		);
	}, [width]);

	return <group>{shelves}</group>;
};

const Verts = ({ ...props }) => {
	const { width, shelvesY, divsX } = props.state;

	const shelfYPos = shelvesY[props.index];

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
	// }
};

function usePosition(source) {
	const bind = useRef();

	useFrame(() => bind.current.position.set(source[0], source[1], 0));

	return bind;
}

function useTransientData(source) {
	const bind = useRef();
	useFrame(() => applyProps(bind.current, source));

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

				mesh.current.scale.x = value;

				//what i want to update goes in this callback. this is almost just like a nested useEffect. I cant call hooks from in here, but if I call a variable that was assigned with useStore it will triger a component re-render. I think it's no rendering because we are stuck listening inside this callback and never get to the return.
			},
			(state) => state.width
		);
		api.subscribe(
			(value) => {
				height.current = value;

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
			<h1 style={{ margin: '1rem' }}>
				Built with React-Three-Fiber and Zustand with funcitonal
				components and hooks.
			</h1>

			<Canvas camera={{ position: [700, 1000, 2500], far: 11000 }}>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />

				<Build position={[0, 0, 0]} />
				{/* <Row position={[0, 0, 0]} index={1} /> */}
				{/* <ShelvesOnly /> */}
				{/* <TestBox position={[0, 0, 0]} /> */}
				<ControlOrbit />
			</Canvas>
			<div style={{ display: 'flex' }}>
				<HeightControls />
				<WidthControls />
			</div>
		</Wrapper>
	);
};
