dumpObject = (obj, lines = [], isLast = true, prefix = '') => {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(
		`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${
			obj.type
		}]`
	);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx;
		this.dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
};

console.log(this.dumpObject(root).join('\n')); // this goes in the loader
