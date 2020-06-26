import * as THREE from 'three';

import Loader from './Loader.js';

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;
		this.loader = new Loader();
	}
	pick(normalizedPosition, array, camera, time) {
		// restore the color if there is a picked object

		if (this.pickedObject) {
			this.pickedObject.material.color.setHex(
				this.pickedObjectSavedColor
			);

			this.pickedObject.material.transparent = true;

			this.pickedObject.material.opacity = 0;

			this.pickedObject = undefined;
		}

		// cast a ray through the frustum
		this.raycaster.setFromCamera(normalizedPosition, camera);
		// get the list of objects the ray intersected
		const intersectedObjects = this.raycaster.intersectObjects(array);
		if (intersectedObjects.length) {
			// pick the first object. It's the closest one

			this.pickedObject = intersectedObjects[0].object;
			// save its color

			this.pickedObjectSavedColor = this.pickedObject.material.color.getHex();
			this.pickedObjectSavedTransparency = this.pickedObject.material.transparent;
			this.pickedObjectSavedOpacity = this.pickedObject.material.opacity;

			// object is flashing as a whole, not in parts, because all the items share a material. I will need to make sure they each have a different material OR activate a different change here.
			// set its emissive color to flashing red/yellow
			this.pickedObject.material.color.setHex(
				(time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
			);
			this.pickedObject.material.transparent = true;
			this.pickedObject.material.opacity = 0.5;
		}
	}

	click(normalizedPosition, array, camera, scene) {
		this.raycaster.setFromCamera(normalizedPosition, camera);
		const intersectedObjects = this.raycaster.intersectObjects(array);
		if (intersectedObjects.length > 0) {
			const object = intersectedObjects[0].object;
			const { position } = object;
			const matrix = object.matrix;

			this.loader.loadDrawer(scene, position, matrix);
		}
	}
}

export default PickHelper;
