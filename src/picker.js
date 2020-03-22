import * as THREE from 'three';

class PickHelper {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.pickedObject = null;
		this.pickedObjectSavedColor = 0;
	}
	pick(normalizedPosition, array, camera, time) {
		// restore the color if there is a picked object

		if (this.pickedObject) {
			// console.log(this.pickedObject);
			this.pickedObject.material.emissive.setHex(
				this.pickedObjectSavedColor
			);

			this.pickedObject = undefined;
		}

		// cast a ray through the frustum
		this.raycaster.setFromCamera(normalizedPosition, camera);
		// get the list of objects the ray intersected
		const intersectedObjects = this.raycaster.intersectObjects(array);
		if (intersectedObjects.length) {
			// console.log(intersectedObjects);
			// pick the first object. It's the closest one

			this.pickedObject = intersectedObjects[0].object;
			// save its color

			this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();

			// console.log('picked', this.pickedObject);
			// object is flashing as a whole, not in parts, because all the items share a material. I will need to make sure they each have a different material OR activate a different change here.
			// set its emissive color to flashing red/yellow
			this.pickedObject.material.emissive.setHex(
				(time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
			);
		}
	}
}

export default PickHelper;
