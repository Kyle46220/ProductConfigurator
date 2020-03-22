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
function mapStateToProps(state) {
	return { config: state.config };
}

class Viewer extends React.Component {
	componentDidMount() {
		this.rayCasty();
		this.sceneSetup();
		this.addObjectsToScene();
		// this.makeInvisibleCube(
		// 	{ x: 0, y: 0, z: 0 },
		// 	{ x: 100, y: 100, z: 100 }
		// );

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
	rand(min, max) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return min + (max - min) * Math.random();
	}

	randomColor() {
		return `hsl(${this.rand(360) | 0}, ${this.rand(50, 100) | 0}%, 50%)`;
	}

	addShelves(shelfMesh, divMesh, config) {
		//this takes the whole config object. and clones the shelves based on this object.

		const { shelves } = this.props.config;

		shelves.forEach(obj => {
			// get id
			const { id, min, max } = obj;
			// const [mesh] = meshArr;

			// here you can use clone or copy. might come up later.
			// const clone = new THREE.Mesh(mesh.geometry, mesh.material);
			// clone.copy(mesh);
			const clone = shelfMesh.clone();
			const { divs: dividers } = obj;

			// still need to figure out how to get the right coordinates based on the state object.
			clone.position.set(max.x, max.y, max.z);
			clone.parent = shelfMesh.parent;
			// need to put the parent id in here.
			clone.name = `${obj.id}`;
			this.id = obj.id;

			// this.objects.push(clone); // this is to make raycaster work but should props change raycaster to just scene.children
			this.partCloner(dividers, divMesh);
			this.scene.add(clone);
			this.objects.push(clone);
		});
	}

	partCloner(array, mesh) {
		array.forEach(obj => {
			// get id
			const { id, min, max } = obj;
			// console.log(meshArr);
			// const [mesh] = meshArr;

			// here you can use clone or copy. might come up later.
			// const clone = new THREE.Mesh(mesh.geometry, mesh.material);
			// clone.copy(mesh);
			const clone = mesh.clone();

			// still need to figure out how to get the right coordinates based on the state object.
			clone.position.set(max.x, max.y, max.z);
			clone.parent = mesh.parent;
			// need to put the parent id in here.
			clone.name = `${this.id + id}`;

			// this.objects.push(clone); // this is to make raycaster work but should props change raycaster to just scene.children

			this.scene.add(clone);
			this.objects.push(clone);
		});
	}

	setDefaultState() {
		// not sure if we need this yet.
		// but I want a way to build in a bunch of constraints on the model so that they don't have to be built into all the sliders etc. is this a david k piano state machine type thing?
	}
	calcShelfAreas(config) {
		const { shelves } = config;
		shelves.forEach(shelf => {
			this.calcOpenAreas(shelf, this.objects);
		});
	}

	calcOpenAreas(shelf, objectArr) {
		// need a naming convention.
		// this will take the div position from a shelf arr and then call on the corresponding meshes (via the naming convention) to build the bounding box.
		const { divs: dividers } = shelf;
		dividers.forEach((divider, i) => {
			if (divider.id < dividers.length - 1) {
				// looking for a way to destructure the meshes and the pass them to below function.

				const mesh1 = this.getPiece(
					this.objects,
					`${shelf.id + dividers[i].id}`
				);
				const mesh2 = this.getPiece(
					this.objects,
					`${shelf.id + dividers[i + 1].id}`
				);
				console.log(mesh1, mesh2);
				this.calculateOpenArea(mesh1, mesh2);
			}
		});
	}

	calculateOpenArea(Mesh1, Mesh2) {
		// i wanna make this so it accepts a mesh and takes the bounding box.

		const [
			{
				name: Mesh1Name,
				geometry: { boundingBox: Mesh1Box }
			}
		] = Mesh1;
		const [
			{
				name: Mesh2Name,
				geometry: { boundingBox: Mesh2Box }
			}
		] = Mesh2;

		//figure out how to do the object destructuring for this.

		const box = new THREE.Box3();

		box.expandByPoint({
			x: Mesh1Box.max.x - 18,
			y: Mesh1Box.max.y,
			z: Mesh1Box.max.z
		});
		box.expandByPoint({
			x: Mesh2Box.min.x + 18,
			y: Mesh2Box.min.y,
			z: Mesh2Box.min.z
		});
		console.log(Mesh2Box, Mesh1Box);
		const material = new THREE.MeshBasicMaterial();

		const helper = new THREE.Box3Helper(box, 0xff00ff);
		// const cube = new THREE.Mesh(helper, material);
		// this.scene.add(cube);
		this.scene.add(helper);
	}

	getPiece(array, name) {
		const object = array.filter(obj => {
			return obj.name === name;
		});
		return object;
	}

	createSkeletonArray(objects) {
		// this picks out the bottom and left and starts the arrays for each level.
		this.horiz = [];
		this.vert = [];

		const left = objects.filter(obj => {
			return obj.name === 'Left';
		});
		const bottom = objects.filter(obj => {
			return obj.name === 'Bottom';
		});
		this.horiz.push(bottom);
		this.vert.push(left);
	}

	createChildArray = scene => {
		this.objects = [];

		const objects = this.objects;
		scene.traverse(obj => objects.push(obj));
		this.objects = this.objects.slice(11);

		this.objects.forEach(i => {
			i.material = new THREE.MeshStandardMaterial({
				color: 0xffffff
			});
		});
	};

	modelLoader = () => {
		const gltfLoader = new GLTFLoader();
		const url = '/cabinetTest1.gltf';
		gltfLoader.load(url, gltf => {
			const root = gltf.scene;

			const {
				children: [{ children: sceneObjects }]
			} = root;

			this.sceneMeshes = sceneObjects.filter(obj => {
				return obj.type === 'Mesh';
			});

			const Divider = this.getPiece(sceneObjects, 'Div');
			const Solid15 = this.getPiece(sceneObjects, 'Solid15');
			const Bottom = this.getPiece(sceneObjects, 'Bottom');
			const Left = this.getPiece(sceneObjects, 'Left');
			this.calculateOpenArea(Divider, Solid15);
			// this.createSkeletonArray();

			const [leftMesh] = Left;
			const [dividerMesh] = Divider;
			const [shelfMesh] = Bottom;

			this.objects.push(leftMesh, shelfMesh);
			this.addShelves(shelfMesh, dividerMesh, this.props.config);

			this.root = root;
			this.scene.add(leftMesh, shelfMesh);
			const shelf = this.props.config.shelves[0];
			this.calcOpenAreas(shelf, this.objects);
			this.calcShelfAreas(this.props.config);

			console.log('done');
		});
	};
	makeInvisibleCube(vector1, vector2) {
		const box = new THREE.BoxGeometry(100, 100, 100);
		const material = new THREE.MeshBasicMaterial();
		const cube = new THREE.Mesh(box, material);
		const bbox = new THREE.Box3(vector1, vector2);
		const bhelp = new THREE.Box3Helper(box, 0x0000ff);
		// this.scene.add(bhelp);
		this.scene.add(cube);
		const center = new THREE.Vector3();
		bbox.getCenter(center);

		cube.position.z = center.z;
	}

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

		const pos = this.getCanvasRelativePosition(event);

		this.mouse.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
		this.mouse.y = -(pos.y / this.canvas.clientHeight) * 2 + 1;
	};
	sceneSetup = () => {
		const width = 500;
		const height = 500;
		this.objects = [];
		this.id = 7;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.1, // near plane
			1000 * 10 // far plane
		);

		this.camera.position.setZ(2000);

		this.mouse = new THREE.Vector2(-1, -1);
		this.renderer = new THREE.WebGLRenderer();

		this.canvas = this.renderer.domElement;
		this.renderer.setSize(width, height);
		this.el.appendChild(this.canvas);
		this.stats = new Stats();
		this.el.appendChild(this.stats.dom);
		this.modelLoader();
		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
	};

	rayCasty = time => {
		this.rayCast = new PickHelper();
	};

	rayCasty2() {
		const box = new THREE.BoxGeometry(1000, 1000, 1000, {
			wireframe: true
		});
		const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
		const cube = new THREE.Mesh(box, material);
		this.scene.add(cube);
		const raycaster2 = new THREE.Raycaster();
		raycaster2.setFromCamera(this.mouse, this.camera);
		const intersects = raycaster2.intersectObject(cube);
	}

	startAnimationLoop = time => {
		time *= 0.001;

		this.rayCast.pick(this.mouse, this.objects, this.camera, time);

		this.stats.update();
		// this.rayCasty2();

		this.renderer.render(this.scene, this.camera);
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
	};
	render() {
		return (
			<Wrapper>
				<div className="viewer" ref={ref => (this.el = ref)} />
			</Wrapper>
		);
	}
}

export default connect(mapStateToProps)(Viewer);
