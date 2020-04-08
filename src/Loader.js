import * as THREE from 'three';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GLTFLoader from 'three-gltf-loader';

class Loader {
	constructor() {
		this.loader = new GLTFLoader();
	}

	loadDrawer = scene => {
		this.loader.load('./DrawerAssembly.gltf', function(gltf) {
			this.drawer = gltf.scene;
			scene.add(gltf.scene);
		});
		return this.drawer;
	};
}

export default Loader;
