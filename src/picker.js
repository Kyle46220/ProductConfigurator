import * as THREE from 'three';
import { GLTFLoader } from 'https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/GLTFLoader.js';

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;
		this.loader = new GLTFLoader();
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

	click(normalizedPosition, array, camera) {
		this.raycaster.setFromCamera(normalizedPosition, camera);
		const intersectedObjects = this.raycaster.intersectObjects(array);
		if (intersectedObjects.length > 0) {
			console.log(intersectedObjects[0]);
			alert(`${JSON.stringify(intersectedObjects[0].object.position)}`);
		}
	}
}

export default PickHelper;
