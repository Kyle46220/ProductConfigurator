import React from 'react';
import Model from './DrawerGLTFJSX';
import useStore from './zusStore';

// here i'm trying to update drawer position based on height, width from sliders and handle the clicks.

// on click - get location.
//on slider - update location.

//on click - remove.

export default (target) => {
	const state = useStore();
	const { height, width, adjustDrawers: newDrawers } = state;

	const handleToggleClick = (e) => {
		newDrawers([]);
	};
	return <Model position={result} onClick={handleToggleClick}></Model>;
};
