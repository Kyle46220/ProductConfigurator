import * as THREE from 'three';

import GLTFLoader from 'three-gltf-loader';

class Loader {
	constructor() {
		this.loader = new GLTFLoader();
	}

	loadDrawer = (scene, position, matrix) => {
		const drawer = '/drawer.gltf';
		this.loader.load(drawer, (gltf) => {
			this.root = gltf.scene;
			const drawerMesh = this.root.children[0];
			this.positionDrawer(drawerMesh, position, matrix);
			scene.add(drawerMesh);
		});
	};

	positionDrawer = (mesh, position, matrix) => {
		//matrix is hoverbox matrix

		mesh.matrixAutoUpdate = false;
		let vector = new THREE.Vector3();
		vector.setFromMatrixScale(matrix);
 
		const bbox = new THREE.Box3();
		bbox.expandByObject(mesh);

		const { min, max } = bbox;

		const height = max.y - min.y;
		const width = max.x - min.x;
		const depth = max.z - min.z;
		console.log(height);
		const vector2 = new THREE.Vector3();
		vector2.set(width, height, depth);

		// so i'm trying to get the scale of the hover box and divide it by the scale of the drawer and set this as the new scale of the drawer.
		// need to get the vectors of both, and do a .divide and then do a matrix .set scale.

		const newScale = vector.divide(vector2);
		mesh.scale.setX(newScale.x);
		mesh.scale.setY(newScale.y);

		mesh.scale.setZ(newScale.z);

		mesh.position.setFromMatrixPosition(matrix);
		mesh.position.setY(mesh.position.y - 50);

		mesh.updateMatrix();
	};
}

export default Loader;
