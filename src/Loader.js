import * as THREE from 'three';
// import React from 'react';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GLTFLoader from 'three-gltf-loader';
import { connect } from 'react-redux';

// function mapStateToProps(state) {
// 	return {
// 		config: state.config,
// 		height: state.height,
// 		width: state.width,
// 		depth: state.depth,
// 		materialThickness: state.materialThickness,
// 		shelvesY: state.shelvesY,
// 		divsX: state.divsX
// 	};
// }

class Loader {
	constructor() {
		this.loader = new GLTFLoader();
	}

	loadDrawer = (scene, position, matrix) => {
		const cab = '/cabinetTest1.gltf';
		const drawer = '/drawer.gltf';
		const test = '/newtest.gltf';
		this.loader.load(drawer, gltf => {
			console.log('drawer.gltf', gltf.scene);
			this.root = gltf.scene;
			this.positionDrawer(this.root, position, matrix);
			scene.add(this.root);
		});
	};

	positionDrawer = (mesh, position, matrix) => {
		console.log(matrix);
		// mesh.applyMatrix4(matrix);
		// mesh.updateMatrix();
		mesh.position.setX(position.x);
		mesh.position.setY(position.y);
		mesh.position.setZ(position.z);
	};
}

export default Loader;
