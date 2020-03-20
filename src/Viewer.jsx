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
		console.log('mounted');
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

	calculateOpenAreas(Mesh1, Mesh2) {
		// i wanna make this so it accepts a mesh and takes the bounding box.
		console.log(Mesh1);
		const { boundingBox } = Mesh1;
		//figure out how to do the object destructuring for this.
		console.log(boundingBox);
		const box = new THREE.Box3();
		const Divider = this.getPiece(this.objects, 'Div');
		// so this could bring out the piece from the state object. then when you calculate the bounding box below, it will make sense. you just get dividerA and dividerA+1. Then jsut applpy this function if shelfQTy.length-1 > shelfQTy.index or something (ie its not the last shelf.)
		const Solid15 = this.getPiece(this.objects, 'Solid15');

		const DividerGeo = Divider[0].geometry.boundingBox.max;
		const Solid15Geo = Solid15[0].geometry.boundingBox.min;
		box.expandByPoint({
			x: DividerGeo.x - 18,
			y: DividerGeo.y,
			z: DividerGeo.z
		});
		box.expandByPoint({
			x: Solid15Geo.x + 18,
			y: Solid15Geo.y,
			z: Solid15Geo.z
		});
		const helper = new THREE.Box3Helper(box, 0xff00ff);
		console.log(box);
		this.scene.add(helper);
		// this.makeInvisibleCube(
		// 	{
		// 		x: this.gapsMin[0].x + 18,
		// 		y: this.gapsMin[0].y,
		// 		z: this.gapsMin[0].z
		// 	},
		// 	{
		// 		x: this.gapsMax[5].x - 18,
		// 		y: this.gapsMax[5].y,
		// 		z: this.gapsMax[5].z
		// 	}
		// );
	}

	getPiece(array, name) {
		const left = array.filter(obj => {
			return obj.name === name;
		});
		return left;
	}

	createSkeletonArray() {
		// this picks out the bottom and left and starts the arrays for each level.
		this.horiz = [];
		this.vert = [];

		const left = this.objects.filter(obj => {
			return obj.name === 'Left';
		});
		const bottom = this.objects.filter(obj => {
			return obj.name === 'Bottom';
		});
		this.horiz.push(bottom);
		this.vert.push(left);
		console.log(this.horiz, this.vert);
	}

	createChildArray = scene => {
		this.objects = [];

		const objects = this.objects;
		scene.traverse(obj => objects.push(obj));
		this.objects = this.objects.slice(11);
		console.log(this.objects);
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

			this.scene.add(root);
			this.createChildArray(this.scene);
			const Divider = this.getPiece(this.objects, 'Div');
			const Solid15 = this.getPiece(this.objects, 'Solid15');
			this.calculateOpenAreas(Divider, Solid15);
			this.createSkeletonArray();

			this.root = root;

			console.log('done');
		});
	};
	makeInvisibleCube(vector1, vector2) {
		console.log(vector1, vector2);
		const box = new THREE.BoxGeometry(100, 100, 100);
		const material = new THREE.MeshBasicMaterial();
		const cube = new THREE.Mesh(box, material);
		const bbox = new THREE.Box3(vector1, vector2);
		const bhelp = new THREE.Box3Helper(box, 0x0000ff);
		// this.scene.add(bhelp);
		this.scene.add(cube);
		const center = new THREE.Vector3();
		bbox.getCenter(center);
		console.log(center);
		cube.position.z = center.z;

		console.log('invisible end');
		console.log(cube);
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
		// console.log(this.canvas.clientWidth);
		const pos = this.getCanvasRelativePosition(event);

		this.mouse.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
		this.mouse.y = -(pos.y / this.canvas.clientHeight) * 2 + 1;
		// console.log(this.mouse);
	};
	sceneSetup = () => {
		const width = 500;
		const height = 500;
		this.objects = [];

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.1, // near plane
			1000 * 10 // far plane
		);

		this.camera.position.setZ(2000);
		// this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(-1, -1);
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
