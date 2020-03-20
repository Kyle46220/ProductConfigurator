import React from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PickHelper from './picker';
// import { ObjectSpaceNormalMap } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

var initializeDomEvents = require('threex-domevents');
var THREEx = {};

initializeDomEvents(THREE, THREEx);

const Canvas = styled.canvas`
	border: 5px solid fuchsia;
	height: 50%;
	display: inline;
`;
const Wrapper = styled.section`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

class Viewer extends React.Component {
	componentDidMount() {
		console.log('mounted');

		this.sceneSetup();
		this.addObjectsToScene();

		this.startAnimationLoop();
	}

	componentDidUpdate() {}

	addObjectsToScene = () => {
		const lights = [];
		lights[0] = new THREE.PointLight(0xffffff, 1, 0);
		lights[1] = new THREE.PointLight(0xffffff, 1, 0);
		lights[2] = new THREE.PointLight(0xffffff, 1, 0);

		lights[0].position.set(0, 2000, 0);
		lights[1].position.set(1000, 2000, 1000);
		lights[2].position.set(-1000, -2000, -1000);

		this.scene.add(lights[0]);
		this.scene.add(lights[1]);
		this.scene.add(lights[2]);

		const cubeGeo = new THREE.BoxGeometry(1000, 1000, 1000);
		const material = new THREE.MeshBasicMaterial(0xffff00);
		const cube = new THREE.Mesh(cubeGeo, material);
		// this.scene.add(cube);

		// this.loadObject();
		let controls = new OrbitControls(this.camera, this.el);
		controls.width = this.el.clientWidth;
		controls.height = 500;
		controls.update();
		// console.log(this.scene.children);
	};
	createChildArray = scene => {
		this.objects = [];

		const objects = this.objects;
		scene.traverse(obj => objects.push(obj));
		this.objects = this.objects.slice(12);
		console.log(this.objects);
		this.objects.forEach(i => {
			i.material = new THREE.MeshStandardMaterial();
		});
		this.objects[0].material.color.setHex(0x00ffff);
	};

	// definePartGeometries = (names, objects) => {
	// 	//this function goes through the object array and defines each object based on the names
	// 	names.forEach(objects.getElementByName('name'));
	// };
	// addListenerToGeometry = mesh => {
	// 	const domEvents = new THREEx.DomEvents(this.camera, this.canvas);
	// 	domEvents.addEventListener(
	// 		mesh,
	// 		'click',
	// 		(e = {
	// 			//this doesn't need to be inside a function.
	// 		})
	// 	);
	// };

	// initRayCasting = () => {
	// 	this.raycaster = new THREE.Raycaster();
	// 	this.mouse = new THREE.Vector2();
	// };
	modelLoader = () => {
		const gltfLoader = new GLTFLoader();
		const url = '/cabinetTest1.gltf';
		gltfLoader.load(url, gltf => {
			const root = gltf.scene;

			this.scene.add(root);
			this.createChildArray(this.scene);

			this.root = root;
			/// GET THE RAY CASTER WORKING WITH A REGULAR CUBE thEN AdD THE OBJECT

			console.log('done');
		});
	};

	getCanvasRelativePosition = event => {
		const rect = this.canvas.getBoundingClientRect();
		//
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};
	onMouseMove = event => {
		event.preventDefault();
		// console.log(this.canvas.clientWidth);
		const pos = this.getCanvasRelativePosition(event);

		this.mouse.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
		this.mouse.y = -(pos.y / this.canvas.clientHeight) * 2 + 1;
		// console.log(this.mouse);
	};
	sceneSetup = () => {
		const width = 500;
		const height = 500;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.1, // near plane
			1000 * 10 // far plane
		);

		this.camera.position.setZ(2000);
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.renderer = new THREE.WebGLRenderer();

		this.canvas = this.renderer.domElement;
		this.renderer.setSize(width, height);
		this.el.appendChild(this.canvas);
		this.stats = new Stats();
		this.el.appendChild(this.stats.dom);
		this.modelLoader();
		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
		console.log(this.canvas);
	};

	rayCasty = () => {
		const rayCast = new PickHelper();
		rayCast.pick(this.mouse, this.objects, this.camera, 0.01);
		// update the picking ray with the camera and mouse position
		// this.raycaster.setFromCamera(this.mouse, this.camera);

		// calculate objects intersecting the picking ray
		// const intersects = this.raycaster.intersectObjects(this.scene.children);

		// if (intersects.length) {
		// console.log(intersects);
		// intersects[i].object.material.color.set(0xff0000);
		// };

		// for (var i = 0; i < intersects.length; i++) {
		// 	console.log(intersects[i].object.name);
		// 	intersects[i].object.material.color.set(0xff0000);
		// }
	};
	startAnimationLoop = () => {
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
		this.rayCasty();
		// this.raycaster.setFromCamera(this.mouse, this.camera);
		// const intersects = this.raycaster.intersectObjects(this.scene.children);

		// if (intersects.length > 0) {

		// 	intersects[0].object.material.color.set(0xff0000);
		// }
		this.stats.update();

		this.renderer.render(this.scene, this.camera);
	};
	render() {
		return (
			<Wrapper>
				<div className="viewer" ref={ref => (this.el = ref)} />
			</Wrapper>
		);
	}
}

export default Viewer;
