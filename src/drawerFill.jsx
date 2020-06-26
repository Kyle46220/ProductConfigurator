import React from 'react';

import { useStore } from './zusStore';

export default drawerFill = () => {
	const shelvesY = useStore((state) => state.shelvesY);
	const divsX = useStore((state) => state.divsX);
};
