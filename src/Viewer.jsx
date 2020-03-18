import React from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Canvas = styled.canvas`
	border: 5px solid fuchsia;
	height: 50%;
	display: inline;
`;
const Wrapper = styled.section`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
`;

class Viewer extends React.Component {
	componentDidMount() {
		this.sceneSetup();
		this.addObjectsToScene();
		this.startAnimationLoop();
		this.modelLoader();
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

		// this.loadObject();
		let controls = new OrbitControls(this.camera, this.el);
		controls.width = this.el.clientWidth;
		controls.height = 500;
		controls.update();
	};

	modelLoader = () => {
		const gltfLoader = new GLTFLoader();
		const url = 'cabinetTest1.gltf';
		gltfLoader.load(url, gltf => {
			const root = gltf.scene;
			this.scene.add(root);
		});
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

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);
		this.el.appendChild(this.renderer.domElement);
	};
	resizeRendererToDisplaySize = renderer => {
		const canvas = this.renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
	};

	startAnimationLoop = () => {
		this.renderer.render(this.scene, this.camera);
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
		// this.resizeRendererToDisplaySize(this.renderer);
	};
	render() {
		return (
			<Wrapper>
				<Canvas>
					<div className="viewer" ref={ref => (this.el = ref)} />
				</Canvas>
			</Wrapper>
		);
	}
}

export default Viewer;
