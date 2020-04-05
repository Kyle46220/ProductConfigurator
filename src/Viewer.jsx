import React from 'react';

import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PickHelper from './picker';

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
	return {
		config: state.config,
		height: state.height,
		width: state.width,
		depth: state.depth,
		materialThickness: state.materialThickness
	};
}

class Viewer extends React.Component {
	componentDidMount() {
		this.rayCasty();
		this.sceneSetup();
		this.addObjectsToScene();

		this.startAnimationLoop();
	}

	componentDidUpdate() {
		this.addShelves();
		// this.updateShelfMeshPosition();
		// this.buildCabinet(
		// 	this.props.config,
		// 	this.props.width,
		// 	this.props.depth,
		// 	this.props.materialThickness
		// );
	}

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

		let controls = new OrbitControls(this.camera, this.el);
		controls.width = this.el.clientWidth;
		controls.height = 500;
		controls.update();
		this.initializeDefaultMeshes(70);
		this.addShelves();
		// this.buildCabinet(
		// 	this.props.config,
		// 	this.props.width,
		// 	this.props.depth,
		// 	this.props.materialThickness
		// );
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
	isolateMeshes = () => {
		this.objects = this.scene.children.filter(item => item.type === 'Mesh');
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

		const pos = this.getCanvasRelativePosition(event);

		this.mouse.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
		this.mouse.y = -(pos.y / this.canvas.clientHeight) * 2 + 1;
	};
	sceneSetup = () => {
		const width = 500;
		const height = 500;
		this.objects = [];
		this.boxes = [];
		this.id = 7;
		this.meshStore = [];
		this.shelfMeshes = [];

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
		// this.stats = new Stats();
		// this.el.appendChild(this.stats.dom);

		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
	};
	createMesh = () => {
		// create meshes, add to Mesh Store array, give default name
		const geom = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({
			color: this.randomColor()
		});
		const mesh = new THREE.Mesh(geom, material);
		mesh.name = 'default';
		this.meshStore.push(mesh);
		console.log('default mesh added', mesh);
	};
	initializeDefaultMeshes = num => {
		let i = 0;
		while (i < num) {
			this.createMesh();
			i++;
		}
	};
	addShelf = shelfPos => {
		const shelfMesh = this.meshStore.pop();
		shelfMesh.name = 'shelf';
		this.shelfMeshes.push(shelfMesh);
		this.positionShelf(shelfMesh, shelfPos);
		this.scene.add(shelfMesh);
	};

	addShelves = () => {
		const { shelvesY: shelves } = this.props.config;
		console.log('before', shelves, this.shelfMeshes.length);
		if (shelves.length > this.shelfMeshes.length) {
			let num = shelves.length - this.shelfMeshes.length;
			for (let i = 0; i < num; i++) {
				const shelfPos = shelves[shelves.length - 1 - i];
				this.addShelf(shelfPos);
				console.log(shelfPos);
				console.log('shelf added', shelves, this.shelfMeshes.length);
			}
		} else if (shelves.length < this.shelfMeshes.length) {
			while (shelves.length < this.shelfMeshes.length) {
				const unNeededShelf = this.shelfMeshes.pop();
				this.returnToStore(unNeededShelf);
				console.log('shelf removed', shelves, this.shelfMeshes.length);
			}
		} else if ((shelves.length = this.shelfMeshes.length)) {
			console.log('equal');
		}
	};

	returnToStore = mesh => {
		this.scene.remove(mesh);
		mesh.name = 'default';
		mesh.scale.setX(1);
		mesh.scale.setY(1);
		mesh.scale.setZ(1);
		mesh.position.setX(0);
		mesh.position.setY(0);
		mesh.position.setZ(0);
		this.meshStore.push(mesh);
	};
	positionShelf = (mesh, position) => {
		const width = this.props.width;
		const height = this.props.materialThickness;
		const depth = this.props.depth;
		mesh.position.setX(width / 2);
		mesh.position.setY(position);
		mesh.position.setZ(0);

		mesh.geometry.parameters.width = width;
		mesh.scale.setX(1000);
		mesh.scale.setY(18);
		mesh.scale.setZ(400);

		mesh.geometry.parameters.height = height;
		mesh.geometry.parameters.depth = depth;
	};

	createShelf(width, depth, posY, materialThickness, scene) {
		const shelfGeom = new THREE.BoxGeometry(
			width,
			materialThickness,
			depth
		);
		const shelfMaterial = new THREE.MeshStandardMaterial({
			color: this.randomColor()
		});

		const shelfMesh = new THREE.Mesh(shelfGeom, shelfMaterial);
		const {
			geometry: {
				parameters: { width: x, height: y, depth: z }
			}
		} = shelfMesh;

		shelfMesh.position.setX(x / 2);
		shelfMesh.position.setY(posY);

		scene.add(shelfMesh);
		return shelfMesh;
	}
	buildCabinet(config, width, depth, materialThickness) {
		const { shelvesY } = config;

		console.log(shelvesY.length);

		shelvesY.forEach((item, index) => {
			console.log('item', item);

			const position = item;
			const shelf = this.createShelf(
				this.props.width,

				this.props.depth,
				position,
				this.props.materialThickness,
				this.scene
			);
			shelf.name = `shelf${index}`;
			console.log(shelf.name);
			if (index < shelvesY.length - 1) {
				this.createDividers(item, index);
			}
		});
	}

	createDividers(shelf, index) {
		console.log('create div shelf', shelf);
		console.log(this.props.config.shelvesY);

		const divs = this.props.config.divsX;
		console.log(divs);

		divs[index].forEach((item, i) => {
			const divGeom = new THREE.BoxGeometry(
				this.props.materialThickness,
				this.props.config.divHeights[index] -
					this.props.materialThickness * 2,
				this.props.depth
			);
			const material = new THREE.MeshBasicMaterial({
				color: this.randomColor()
			});
			const shelfPosition = this.props.config.shelvesY[index];
			const shelfHeight = this.props.config.divHeights[index];
			const divMesh = new THREE.Mesh(divGeom, material);
			divMesh.position.setX(item);
			divMesh.position.setY(shelfPosition + shelfHeight / 2);
			divMesh.name = `div${index}` + `${i}`;
			if (divs[index].length - 1 > i) {
				const boxX = item + (divs[index][i + 1] - item) / 2;
				const boxWidth = divs[index][i + 1] - item;
				console.log('BOX', boxWidth);
				const boxPosition = {
					x: boxX,
					y: shelfPosition + shelfHeight / 2,
					z: 0
				};
				const box = this.createBoxes(
					boxWidth,
					200,
					this.props.depth,
					boxPosition
				);
				box.name = 'box name here';
			}
			this.scene.add(divMesh);
			console.log(divMesh);
		});
	}

	createBoxes = (width, height, depth, pos) => {
		console.log('createBox');
		const cube = new THREE.BoxGeometry(width, height, depth);
		const material = new THREE.MeshStandardMaterial({
			color: this.randomColor(),
			transparent: true,
			opacity: 0.0
		});
		const box = new THREE.Mesh(cube, material);

		console.log(box);
		box.position.set(pos.x, pos.y, pos.z);
		this.boxes.push(box);
		this.scene.add(box);
		return box;
	};

	updateShelfMeshPosition = () => {
		const shelfPos = this.props.config.shelvesY;
		const divPos = this.props.config.divsX;
		const array = this.scene.children;

		const filterItems = query => {
			return array.filter(item => {
				const { name } = item;

				return name.toLowerCase().indexOf(query.toLowerCase()) > -1;
			});
		};
		console.log(filterItems('div'));

		console.log(divPos);
		const filtered = filterItems('div');
		console.log(filtered);
		filtered.forEach((item, index) => {
			const { position } = item;
			position.setX(divPos.flat()[index]);
			console.log(position);
		});
		// var fruits = ['apple', 'banana', 'grapes', 'mango', 'orange'];

		// function filterItems(query) {
		// 	return fruits.filter(function(el) {
		// 		return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
		// 	});
		// }

		// console.log(filterItems('ap'));
	};

	rayCasty = () => {
		this.pickHelper = new PickHelper();
	};

	startAnimationLoop = time => {
		time *= 0.001;

		this.pickHelper.pick(this.mouse, this.boxes, this.camera, time);

		// this.stats.update();
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
