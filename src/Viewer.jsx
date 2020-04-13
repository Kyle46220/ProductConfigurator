import React, { useRef, useState } from 'react';

import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import GLTFLoader from 'three-gltf-loader';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PickHelper from './picker';
import Loader from './Loader.js';
import { Box3Helper } from 'three';

// const Canvas = styled.canvas`
// 	border: 5px solid fuchsia;
// 	height: 50%;
// 	display: inline;
// `;
extend({ OrbitControls });

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
		materialThickness: state.materialThickness,
		shelvesY: state.shelvesY,
		divsX: state.divsX,
	};
}

function Box(props) {
	const mesh = useRef();
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
			onClick={(e) => setActive(!active)}
			onPointerOver={(e) => setHover(true)}
			onPointerOut={(e) => setHover(false)}
		>
			<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
			<meshStandardMaterial
				attach="material"
				color={hovered ? 'hotpink' : 'orange'}
			/>
		</mesh>
	);
}
function OrbitCont() {
	const {
		camera,
		gl: { domELement },
	} = useThree();
	return <orbitControls args={['camera, domElement']} />;
}

function Shelf(props) {
	const mesh = useRef();
	return (
		<mesh>
			<boxBufferGeometry
				attach="gemoetry"
				args={(props.x, props.y, props.z)}
			/>
			<meshStandardMaterial attach="material" color={'hotpink'} />
		</mesh>
	);
}

class Viewer extends React.Component {
	componentDidMount() {
		this.sceneSetup();
		// this.loadDrawer();
		this.addObjectsToScene();
		this.rayCasty();
		this.startAnimationLoop();
	}

	componentDidUpdate() {
		// this.adjustShelves();
		this.adjustWidth(this.props);
		this.adjustHeight(this.props);
		// this.camera.position.set(this.props.width, this.props.height, 2000);
		// this.controls.update();
		this.resetBoxes();
		this.createBoxPositions();
		this.addBoxes(this.boxValueArray);
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

		this.controls = new OrbitControls(this.camera, this.el);
		this.controls.width = this.el.clientWidth;
		this.controls.height = 500;
		this.camera.position.set(
			this.props.width / 2,
			this.props.height / 2,
			2000
		);
		this.controls.update();
		this.initializeDefaultMeshes(200);
		this.initializeShelves();
		this.initializeDividers(this.props);
		this.resetBoxes();
		this.createBoxPositions();
		this.addBoxes(this.boxValueArray);

		console.log(this.drawers);
		// this.loader = new Loader();
		// this.drawer = this.loader.loadDrawer(this.scene);
		// console.log(this.drawer);
	};
	loadDrawer = () => {
		const loader = new GLTFLoader();
		const cab = '/cabinetTest1.gltf';
		const drawer = '/drawer.gltf';
		const test = '/newtest.gltf';
		loader.load(drawer, (gltf) => {
			console.log('drawer.gltf', gltf.scene);
			this.root = gltf.scene;
		});
	};
	rand(min, max) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return min + (max - min) * Math.random();
	}

	positionDrawer = (drawer) => {};
	loadDrawer = () => {
		const loader = new GLTFLoader();
		const cab = '/cabinetTest1.gltf';
		const drawer = '/drawer.gltf';
		const test = '/newtest.gltf';
		loader.load(drawer, (gltf) => {
			console.log('drawer.gltf', gltf.scene);
			this.root = gltf.scene;
		});
	};

	randomColor() {
		return `hsl(${this.rand(360) | 0}, ${this.rand(50, 100) | 0}%, 50%)`;
	}
	isolateMeshes = (array) => {
		// this.objects = this.scene.children.filter(item => item.type === 'Mesh');
		const filterItems = (query) => {
			return array.filter(
				(el) => el.toLowerCase().indexOf(query.toLowerCase()) > -1
			);
		};
		return filterItems('Solid');
	};

	getCanvasRelativePosition = (event) => {
		const rect = this.canvas.getBoundingClientRect();
		//
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	};
	onMouseMove = (event) => {
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
		this.divMeshes = [];
		this.material = new THREE.MeshStandardMaterial({
			color: this.randomColor(),
			transparent: true,
			opacity: 0.5,
		});
		this.drawers = [];
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.1, // near plane
			1000 * 10 // far plane
		);

		this.camera.position.set(
			this.props.width / 2,
			this.props.height / 2,
			2000
		);

		this.mouse = new THREE.Vector2(-1, -1);
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setClearColor(0x000000, 0);

		this.canvas = this.renderer.domElement;
		this.renderer.setSize(width, height);
		this.el.appendChild(this.canvas);
		// this.stats = new Stats();
		// this.el.appendChild(this.stats.dom);

		this.canvas.addEventListener('mousemove', this.onMouseMove, false);
		this.canvas.addEventListener('click', this.clickHandler);
	};
	createMesh = (geom) => {
		// create meshes, add to Mesh Store array, give default name

		const material = new THREE.MeshStandardMaterial({
			color: this.randomColor(),
		});
		const mesh = new THREE.Mesh(geom, material);
		mesh.name = 'default';
		this.meshStore.push(mesh);
		// console.log('default mesh added', mesh);
	};
	initializeDefaultMeshes = (num) => {
		let i = 0;
		const geom = new THREE.BoxGeometry(1, 1, 1);
		while (i < num) {
			this.createMesh(geom);
			i++;
		}
	};
	addShelf = (shelfPos) => {
		const shelfMesh = this.meshStore.pop();
		// shelfMesh.name = 'shelf';
		this.shelfMeshes.push(shelfMesh);
		// this.positionShelf(shelfMesh, shelfPos);
		this.scene.add(shelfMesh);
		shelfMesh.scale.setX(1000);
		shelfMesh.scale.setY(18);
		shelfMesh.scale.setZ(400);
	};
	removeShelf = (meshArray) => {
		console.log('remove shelf');
		this.returnToStore(meshArray.pop());
	};

	addDivider = (divPos, shelfIndex, height) => {
		const { shelvesY } = this.props;
		console.log('divider added');
		const divMesh = this.meshStore.pop();
		divMesh.name = 'div';
		this.divMeshes[shelfIndex].push(divMesh);
		this.scene.add(divMesh);

		// this.positionShelf(shelfMesh, shelfPos);
	};

	addDividerRow = (divArr, shelfPos, shelfIndex) => {
		const { shelvesY } = this.props;
		this.divMeshes.push([]);

		let divHeight;

		divArr[shelfIndex].forEach((divPos, i) => {
			this.addDivider(divPos, shelfIndex, 180);
			this.positionDivider(
				this.divMeshes[shelfIndex][i],
				divPos,
				shelfPos,
				shelfIndex
			);
		});
	};

	removeDividerRow = (meshArray) => {
		this.returnArrayToStore(meshArray);

		this.divMeshes.pop();
	};

	removeSingleDivider = (meshArray) => {
		console.log('single div removed from', meshArray);
		const mesh = meshArray.pop();
		this.returnToStore(mesh);
	};

	returnArrayToStore = (meshArray) => {
		meshArray.forEach((mesh) => {
			this.scene.remove(mesh);
			mesh.name = 'default';
			mesh.scale.setX(1);
			mesh.scale.setY(1);
			mesh.scale.setZ(1);
			mesh.position.setX(0);
			mesh.position.setY(0);
			mesh.position.setZ(0);
			this.meshStore.push(mesh);
		});
	};

	initializeShelves = () => {
		const { shelvesY: shelves } = this.props;
		shelves.forEach((shelfPos, index) => {
			this.addShelf(shelfPos);
			this.positionShelf(this.shelfMeshes[index], shelfPos);
		});
	};

	initializeDividers = (props) => {
		const { divsX: divs, shelvesY: shelves } = props;

		shelves.forEach((shelf, index) => {
			this.addDividerRow(divs, shelf, index);
		});
	};

	adjustHeight = (props) => {
		const { shelvesY, divsX } = props;

		this.shelfMeshes.forEach((item, index) => {
			if (shelvesY[index] === undefined) {
				this.removeDividerRow(this.divMeshes[index]);
				this.removeShelf(this.shelfMeshes);
			}
		});

		shelvesY.forEach((item, index) => {
			if (this.shelfMeshes[index] === undefined) {
				this.addShelf(item);
				this.addDividerRow(divsX, item, index);
			}
		});

		this.shelfMeshes.forEach((mesh, index) => {
			this.positionShelf(mesh, shelvesY[index]);
		});
	};

	adjustWidth = (props) => {
		const { shelvesY: shelves, divsX } = props;

		divsX.forEach((divs, index) => {
			if (this.divMeshes[index]) {
				while (divs.length !== this.divMeshes[index].length) {
					if (divs.length > this.divMeshes[index].length) {
						const divPos = this.divMeshes[index].length;

						this.addDivider(divPos, index, 280);
					} else if (divs.length < this.divMeshes[index].length) {
						this.removeSingleDivider(this.divMeshes[index]);
					}
				}
				this.divMeshes[index].forEach((mesh, i) => {
					this.positionDivider(mesh, divs[i], shelves[index], index);
				});
			}
		});
		this.shelfMeshes.forEach((mesh, index) => {
			this.positionShelf(mesh, shelves[index]);
		});
	};

	returnToStore = (mesh) => {
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
		mesh.scale.setX(width);
	};
	positionDivider = (mesh, position, shelfPos, shelfIndex) => {
		const { shelvesY } = this.props;
		const width = this.props.materialThickness;
		const height = 100;
		const depth = this.props.depth;
		mesh.position.setX(position);

		mesh.position.setZ(0);

		mesh.scale.setX(18);

		mesh.scale.setZ(400);

		if (shelfIndex === shelvesY.length - 1) {
			mesh.scale.setY(1);
			mesh.scale.setX(1);

			mesh.scale.setZ(1);
		} else {
			const divHeight = shelvesY[shelfIndex + 1] - shelvesY[shelfIndex];
			mesh.scale.setY(divHeight);
			mesh.position.setY(shelfPos + divHeight / 2);
		}
	};

	resetBoxes = () => {
		this.boxes.forEach((item) => {
			this.scene.remove(item);
			this.returnToStore(item);
			const material = new THREE.MeshStandardMaterial({
				color: this.randomColor(),
			});
			item.material = material;
		});

		this.boxes = [];
	};

	createBoxPositions = () => {
		const { shelvesY, divsX, width, height, depth } = this.props;
		const divMeshes = this.divMeshes.flat();
		this.boxValueArray = [];

		// function filterWidth(item) {
		// 	return item.position.x !== width / 2;
		// }
		// console.log(divMeshes.filter(filterWidth));
		// console.log(shelvesY, divsX);
		divsX.forEach((arr, index) => {
			if (index === divsX.length - 1) {
				return;
			} else {
				const boxHeight = shelvesY[index + 1] - shelvesY[index];
				const centreY =
					shelvesY[index] +
					(shelvesY[index + 1] - shelvesY[index]) / 2;

				arr.forEach((pos, i) => {
					if (i === arr.length - 1) {
						return;
					} else {
						const boxValues = {};
						const boxPos = {};
						boxValues.boxHeight = boxHeight;
						boxValues.boxWidth = arr[i + 1] - pos;
						boxValues.boxDepth = depth;
						const centreX = pos + (arr[i + 1] - pos) / 2;
						console.log(centreX);
						boxPos.x = centreX;
						boxPos.y = centreY;
						boxPos.z = 0;
						boxValues.boxPos = boxPos;

						console.log(boxValues);
						this.boxValueArray.push(boxValues);
					}
				});
			}
		});
		console.log(this.boxValueArray);
	};
	addBoxes = (array) => {
		array.forEach((item) => {
			const material = new THREE.MeshStandardMaterial({
				color: this.randomColor(),
				transparent: true,
				opacity: 0.0,
			});
			const box = this.meshStore.pop();

			const {
				boxHeight,
				boxWidth,
				boxDepth,
				boxPos: { x, y, z },
			} = item;

			box.position.setX(x);
			box.position.setY(y);
			box.position.setZ(z);

			box.scale.set(boxWidth, boxHeight, boxDepth);
			box.material = material;

			this.boxes.push(box);
			this.scene.add(box);
		});
		console.log(this.boxes);
	};

	clickHandler = (event) => {
		this.pickHelper.click(this.mouse, this.boxes, this.camera, this.scene);
	};

	rayCasty = () => {
		this.pickHelper = new PickHelper();
	};

	startAnimationLoop = (time) => {
		time *= 0.001;
		// this.clickHandler();

		this.pickHelper.pick(this.mouse, this.boxes, this.camera, time);

		this.renderer.render(this.scene, this.camera);
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
	};
	render() {
		return (
			<Wrapper>
				<Canvas>
					<ambientLight />
					<pointLight position={[10, 10, 10]} />
					<Box position={[-1.2, 0, 0]} />
					<Shelf position={[0, this.props.shelvesY[0], 0]} />
					<Box position={[1.2, 0, 0]} />
					{/* <OrbitCont /> */}
				</Canvas>
				<div className="viewer" ref={(ref) => (this.el = ref)} />
			</Wrapper>
		);
	}
}

export default connect(mapStateToProps)(Viewer);
