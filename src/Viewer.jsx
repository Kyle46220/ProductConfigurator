import React from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ObjectSpaceNormalMap } from 'three';

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
		this.initRayCasting();
		this.sceneSetup();
		this.addObjectsToScene();
		this.modelLoader();
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

		// const cubeGeo = new THREE.BoxGeometry(1000, 1000, 1000);
		// const material = new THREE.MeshBasicMaterial(0xffff00);
		// const cube = new THREE.Mesh(cubeGeo, material);
		// this.scene.add(cube);

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
			console.log(this.objects);

			this.initRayCasting();
		});
	};
	onMouseMove = event => {
		event.preventDefault();

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

		this.renderer = new THREE.WebGLRenderer();
		this.canvas = this.renderer.domElement;
		this.renderer.setSize(width, height);
		this.el.appendChild(this.canvas);
		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
	};
	resizeRendererToDisplaySize = renderer => {
		const canvas = this.renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			this.renderer.setSize(width, height, false);
		}
	};
	sleazyRays = () => {
		// update the picking ray with the camera and mouse position
		this.raycaster.setFromCamera(this.mouse, this.camera);

		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.objects);

		// console.log(this.scene.children);
		// console.log('intersects', intersects);
		if (intersects.length) {
			console.log(intersects[0].object.name);
		}

		// for (var i = 0; i < intersects.length; i++) {
		// 	// console.log(intersects[i].object.name);
		// 	intersects[i].object.material.color.set(0xff0000);
		// }
	};

	startAnimationLoop = () => {
		this.sleazyRays();
		this.renderer.render(this.scene, this.camera);
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);

		// this.resizeRendererToDisplaySize(this.renderer);
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
