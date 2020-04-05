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
		this.updateShelfMeshPosition();

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

		// const cubeGeo = new THREE.BoxGeometry(1000, 1000, 1000);
		// const material = new THREE.MeshBasicMaterial(0xffff00);
		// const cube = new THREE.Mesh(cubeGeo, material);

		let controls = new OrbitControls(this.camera, this.el);
		controls.width = this.el.clientWidth;
		controls.height = 500;
		controls.update();
		this.buildCabinet(
			this.props.config,
			this.props.width,
			this.props.depth,
			this.props.materialThickness
		);
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

	addRandomMaterial(object) {
		console.log(object);
		// if (array instanceof Array) {
		// 	array.forEach(i => {
		// 		i.material = new THREE.MeshStandardMaterial({
		// 			color: `${this.randomColor()}`
		// 		});
		// 	});
		// } else {
		// 	array.geometry.material = new THREE.MeshStandardMaterial({
		// 		color: this.randomColor()
		// 	});
		// }
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
		this.boxes = [];
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
		// this.stats = new Stats();
		// this.el.appendChild(this.stats.dom);

		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
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

	// updateMeshPositions = () => {
	// 	const divPos = this.props.config.divsX;
	// 	const shelfPos = this.props.config.shelvesY;

	// 	const array = this.scene.children;
	// 	console.log(array);
	// 	array.forEach((item, index) => {
	// 		item.position.setX;
	// 	});

	// 	shelfPos.forEach((shelfPosValue, shelfPosIndex) => {
	// 		if (shelfPosIndex <= shelfPos.length) {
	// 			divPos.forEach((divPosArray, divPosIndex) => {
	// 				if (divPosIndex <= divPos.length) {
	// 					const shelfMesh = array.find(item => {
	// 						return item.name === `${shelfPosIndex}`;
	// 					});
	// 					console.log(shelfMesh);
	// 					console.log(`div${shelfPosIndex}${divPosIndex}`);
	// 					shelfMesh.position.setX(divPosArray);
	// 					console.log(shelfMesh.position);
	// 				}
	// 			});
	// 		}
	// 	});
	// };

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
