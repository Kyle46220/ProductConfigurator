import * as THREE from 'three';
// import React from 'react';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GLTFLoader from 'three-gltf-loader';
// import { connect } from 'react-redux';

// function mapStateToProps(state) {
// 	return {
// 		config: state.config,
// 		height: state.height,
// 		width: state.width,
// 		depth: state.depth,
// 		materialThickness: state.materialThickness,
// 		shelvesY: state.shelvesY,
// 		divsX: state.divsX,
// 	};
// }

class Loader {
	constructor() {
		this.loader = new GLTFLoader();
	}

	loadDrawer = (scene, position, matrix) => {
		// const cab = '/cabinetTest1.gltf';
		const drawer = '/drawer.gltf';
		// const test = '/newtest.gltf';
		this.loader.load(drawer, (gltf) => {
			this.root = gltf.scene;
			const drawerMesh = this.root.children[0];
			this.positionDrawer(drawerMesh, position, matrix);
			scene.add(drawerMesh);
			console.log('drawerMesh', drawerMesh);
		});
	};

	positionDrawer = (mesh, position, matrix) => {
		//matrix is hoverbox matrix
		console.log('scale drawer', matrix);
		mesh.matrixAutoUpdate = false;
		let vector = new THREE.Vector3();
		vector.setFromMatrixScale(matrix);
		console.log(matrix);
		console.log('vector', vector);

		const bbox = new THREE.Box3();
		bbox.expandByObject(mesh);
		console.log(bbox);
		const { min, max } = bbox;

		const height = max.y - min.y;
		const width = max.x - min.x;
		const depth = max.z - min.z;
		console.log(height);
		const vector2 = new THREE.Vector3();
		vector2.set(width, height, depth);
		// so i'm trying to get the scale of the hover box and divide it by the scale of the drawer and set this as the new scale of the drawer.
		// need to get the vectors of both, and do a .divide and then do a matrix .set scale.
		// console.log(mesh.scale);
		const newScale = vector.divide(vector2);
		mesh.scale.setX(newScale.x);
		mesh.scale.setY(newScale.y);

		mesh.scale.setZ(newScale.z);

		// matrix = matrix.makeScale(newScale);
		// console.log('newScale', newScale);
		// console.log(mesh.scale);
		// mesh.scale.setFromMatrixScale(matrix);
		console.log(mesh.scale);

		mesh.position.setFromMatrixPosition(matrix);
		mesh.position.setY(mesh.position.y - 50);
		// mesh.scale.set(matrix);
		// 	mesh.position.setX(position.x);
		// 	mesh.position.setY(position.y);
		// 	mesh.position.setZ(position.z);
		mesh.updateMatrix();
	};
}

export default Loader;
