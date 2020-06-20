import React, { useEffect, useRef } from 'react';

import { api } from './zusStore';

export const TestBox = ({ ...props }) => {
	const { position } = props;
	console.log('Box Rendered', api.getState().width);

	const width = useRef(api.getState().width);
	const height = useRef(api.getState().height);

	const mesh = useRef();

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
