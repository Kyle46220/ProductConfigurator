import React from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Model(props) {
	const { nodes, materials } = useLoader(GLTFLoader, '/DrawerAssembly.gltf');
	return (
		<group {...props} dispose={null}>
			<group
				name="Camera"
				position={[10, 0, 50]}
				rotation={[Math.PI / 2, 0, 0]}
			>
				<primitive object={nodes.Camera_Orientation} />
			</group>
			<group
				name="Sun"
				position={[100, 50, 100]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				<primitive object={nodes.Sun_Orientation} />
			</group>
			<group name="Cube">
				<mesh
					material={materials.base}
					geometry={nodes.Cube_003_0.geometry}
				/>
				<mesh
					material={materials.inner}
					geometry={nodes.Cube_003_1.geometry}
				/>
			</group>
		</group>
	);
}
