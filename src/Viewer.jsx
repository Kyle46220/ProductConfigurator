import React from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ObjectSpaceNormalMap } from 'three';
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
		this.scene.add(cube);

		// this.loadObject();
		let controls = new OrbitControls(this.camera, this.el);
		controls.width = this.el.clientWidth;
		controls.height = 500;
		controls.update();
	};
	createChildArray = scene => {
		this.objects = [];

		const objects = this.objects;
		scene.traverse(obj => objects.push(obj));
		this.objects = this.objects.slice(12);
		console.log(this.objects);
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

	initRayCasting = () => {
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
	};
	modelLoader = () => {
		const gltfLoader = new GLTFLoader();
		const url = '/cabinetTest1.gltf';
		gltfLoader.load(url, gltf => {
			const root = gltf.scene;

			this.scene.add(root);
			this.createChildArray(this.scene);
			// this.rayCasty();
			this.canvas.addEventListener('mousemove', this.onMouseMove, false);
			this.root = root;
			/// GET THE RAY CASTER WORKING WITH A REGULAR CUBE thEN AdD THE OBJECT

			console.log('done');
		});
	};
	onMouseMove = event => {
		event.preventDefault();
		console.log('mouse');

		this.mouse.x = (event.clientX / this.canvas.width) * 2 - 1;
		this.mouse.y = -(event.clientY / this.canvas.height) * 2 + 1;
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

		// console.log(this.objects);
		// this.initRayCasting();
		// this.canvas.addEventListener('mousemove', this.onMouseMove, false);
	};

	rayCasty = () => {
		// console.log(this.raycaster);
		// update the picking ray with the camera and mouse position

		this.raycaster.setFromCamera(this.mouse, this.camera);
		// console.log(this.raycaster);

		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.scene.children);
		// console.log(this.objects);

		// console.log(this.scene.children);
		// console.log('intersects', intersects);
		if (intersects.length) {
			console.log(intersects);
			// intersects[i].object.material.color.set(0xff0000);
		}

		// for (var i = 0; i < intersects.length; i++) {
		// 	console.log(intersects[i].object.name);
		// 	intersects[i].object.material.color.set(0xff0000);
		// }
	};
	// rayCasty2;

	startAnimationLoop = () => {
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
		// this.rayCasty();
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(this.scene.children);

		if (intersects.length) {
			// console.log(intersects);

			console.log(intersects[0]);
			// intersects[i].object.material.color.set(0xff0000);
		}
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
