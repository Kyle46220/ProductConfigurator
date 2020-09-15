import React, { useRef, useEffect, Suspense } from 'react';
// import * as THREE from 'three';
import styled from 'styled-components';

import { useStore, WidthControls, HeightControls, api } from './zusStore';

import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './DrawerGLTFJSX';

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
	const mesh = useRef();

	const {
		position,
		size: [x, y, z],
	} = props;
	const adjustDrawers = useStore((state) => state.adjustDrawers);
	const drawers = useStore((state) => state.drawers);

	const handleClick = (e) => {
		const id = Date.now();
		const { x, y } = e.eventObject.position;

		const newDrawer = { id: id, pos: [x, y, 0] };

		const result = drawers;
		result.push(newDrawer);
		console.log(result);
		adjustDrawers(result);

		return newDrawer;
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
	//
	// these useStores will cause component re-render?
	const divsX = useStore((state) => state.divsX);
	const width = useStore((state) => state.width);
	const shelvesY = useStore((state) => state.shelvesY);
	const height = shelvesY[props.index + 1] - shelvesY[props.index];

	const shelfYPos = shelvesY[props.index];
	const index = props.index;

	const verticals = divsX[props.index].map((pos, index) => {
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

// I think this is the idea with the transient updating.

// docs https://github.com/react-spring/zustand/

// example https://codesandbox.io/s/peaceful-johnson-txtws?file=/src/store.js

const Build = ({ ...props }) => {
	const width = useStore((state) => state.width);
	const shelvesY = useStore((state) => state.shelvesY);
	const drawers = useStore((state) => state.drawers);
	const adjustDrawers = useStore((state) => state.adjustDrawers);

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
	const handleDrawerClick = (id) => {
		const result = drawers.filter((i) => i !== id);
		adjustDrawers(result);
	};
	const fillDrawers = drawers.map((drawer) => {
		return (
			<Model
				key={drawer.id}
				position={drawer.pos}
				// onClick={handleDrawerClick(drawer.id)}
			/>
		);
	});

	return (
		<group>
			<Suspense fallback={null}>
				<Shelf
					position={[width / 2, topShelf, 0]}
					size={[width, 18, 400]}
					key={'shelf' + topShelf + topIndex}
					index={topIndex}
				/>
				{builder}
				{fillDrawers}
			</Suspense>
		</group>
	);
};
//
const FillDrawers = () => {
	const adjustDrawers = useStore((state) => state.adjustDrawers);
	const drawers = useStore((state) => state.drawers);

	const handleDrawerClick = (id) => {
		const result = drawers.filter((i) => i !== id);
		adjustDrawers(result);
	};

	const fillDrawers = drawers.map((drawer) => {
		return (
			<Model
				key={drawer.id}
				position={drawer.pos}
				// onClick={handleDrawerClick(drawer.id)}
			/>
		);
	});
	return <>{fillDrawers}</>;
};

export default () => {
	return (
		<Wrapper>
			<h1 style={{ margin: '1rem' }}>
				Built with React-Three-Fiber and Zustand with functional
				components and hooks.
			</h1>

			<Canvas camera={{ position: [700, 1000, 2500], far: 11000 }}>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Suspense fallback={null}>
					<Build position={[0, 0, 0]} />
					{/* <FillDrawers /> */}
				</Suspense>

				<ControlOrbit />
			</Canvas>
			<div style={{ display: 'flex' }}>
				<HeightControls />
				<WidthControls />
			</div>
		</Wrapper>
	);
};
