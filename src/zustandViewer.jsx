import React, { useRef, useEffect, Suspense } from 'react';
// import * as THREE from 'three';
import styled from 'styled-components';

import { useStore, WidthControls, HeightControls, api } from './zusStore';

import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './DrawerGLTFJSX';
// import { TestBox } from './testbox';

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
	const state = useStore();
	const { height, adjustDrawers, drawers, addDrawer } = state;

	const handleClick = (e) => {
		const id = Date.now();
		const { x, y } = e.object.position;

		const newDrawer = { id: id, pos: [x, y, 0] };
		// const result = drawers;
		// const newDrawers = result.push(newDrawer);
		//
		// adjustDrawers(newDrawers);
		// drawers.push(newDrawer);
		addDrawer(newDrawer);

		// adjustDrawers(result);
		// newDrawer([x, y, 0]);
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
const ShelvesOnly = ({ ...props }) => {
	// these useStores will cause update re-render. we only want a re-render when another shelf is added?
	// const divsX = useStore((state) => state.divsX);
	const shelvesY = useStore((state) => state.shelvesY);
	// const height = shelvesY[props.index + 1] - shelvesY[props.index];
	const width = useRef(api.getState().width);
	// const shelfYPos = shelvesY[props.index];
	// const index = props.index;
	// const pos = shelvesY[props.index];
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

	// I think this is the idea with the transient updating.

	// docs https://github.com/react-spring/zustand/

	// example https://codesandbox.io/s/peaceful-johnson-txtws?file=/src/store.js

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

// const Verts = ({ ...props }) => {
// 	const { width, shelvesY, divsX } = props.state;

// 	const shelfYPos = shelvesY[props.index];

// 	const height = 180;

// 	const verticals = divsX.map((pos, index) => {
// 		return (
// 			<Vertical
// 				key={'vertical' + pos + index}
// 				position={[pos, shelfYPos, 0]}
// 				size={[18, height, 400]}
// 			/>
// 		);
// 	});

// 	return <group {...props}>{verticals}</group>;
// 	// }
// };

// function usePosition(source) {
// 	const bind = useRef();

// 	useFrame(() => bind.current.position.set(source[0], source[1], 0));

// 	return bind;
// }

// function useTransientData(source) {
// 	const bind = useRef();
// 	useFrame(() => applyProps(bind.current, source));

// 	return bind;
// }
// const divsX = useStore((state) => state.shelvesY);

const Build = ({ ...props }) => {
	// const width = useRef(api.getState((state) => state.width));
	const width = useStore((state) => state.width);
	const shelvesY = useStore((state) => state.shelvesY);
	const drawers = useStore((state) => state.drawers);
	console.log(
		'build',
		drawers.map((i) => i.pos[1])
	);

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
	// const fillDrawers = drawers.map((drawer) => {
	// 	console.log('fill drawers', drawer.pos[1]);
	// 	return <Model key={drawer.id} position={drawer.pos} />;
	// });
	return (
		<group>
			<Suspense fallback={null}>
				<Shelf
					position={[width / 2, topShelf, 0]}
					size={[width, 18, 400]}
					key={'shelf' + topShelf + topIndex}
					index={topIndex}
				/>
				{/* {fillDrawers} */}
				{builder}
			</Suspense>
		</group>
	);
};
// const handleClick = (e) => {
// 	// const mesh = useRef();
//
// 	const x = e.clientX;
// 	const y = e.clientY;
// 	// MakeDrawers({ arr: [x, y] });

// 	const newDrawers = useStore((state) => state.adjustDrawers([x, y, 0]));
// 	// return <Model position={[e.clientX, e.clientY, 0]} />;
// 	return;
// };

// const MakeDrawers = (props) => {
// 	const { arr } = props;
//
// 	const thingo = arr.map((element) => {
// 		return <Model position={[0, element, 0]} />;
// 	});
// 	return <>{thingo}</>;
// };

// const fillDrawers = (drawers) => {
// 	return drawers.map((drawer) => {
//
// 		return <Model key={drawer.id} position={drawer.pos} />;
// 	});
// };
const FillDrawers = () => {
	const wholeScene = useThree();
	console.log(
		wholeScene.scene.children.map((i) => i.children.length),
		wholeScene.scene.children.length
	);
	const drawers = useStore((state) => state.drawers);

	const fillDrawers = drawers.map((drawer) => {
		console.log('fill drawers', drawer.pos[0]);
		return <Model key={drawer.id} position={drawer.pos} />;
	});
	return <>{fillDrawers}</>;
};

export default () => {
	const state = useStore();
	const { height, adjustDrawer: newDrawer } = state;

	// const height = useStore((state) => state.height);

	// const {newDrawers = useStore((state) => state.adjustDrawers([x, y, 0]));
	// const handleClick = (e) => {
	// 	// const mesh = useRef();
	//
	// 	const x = e.clientX;
	// 	const y = e.clientY;
	// 	// MakeDrawers({ arr: [x, y] });
	// 	newDrawers([x, y, 0]);
	// 	// return <Model position={[e.clientX, e.clientY, 0]} />;
	// };

	const handleClick = (e) => {};
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
					{/* <Model
						position={useStore((state) => state.drawer)}
						onClick={handleClick}
					/>
					<Model
						position={[height, useStore((state) => state.width), 0]}
						onClick={handleClick}
					/> */}
					<FillDrawers />
					{/* <MakeDrawers arr={[100, 200, 300]} /> */}
					<Build position={[0, 0, 0]} />
				</Suspense>
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
