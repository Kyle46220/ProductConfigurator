After a disheartening loss of the viewer component code. I am determined to be a little bit more professional from now on.

The immediate plan is -

Load glTF model into the browser.

Make a clickable Threex domelement

Then I have to create some bounding boxes or other geometry based on the positions of the shelves etc.

Whether this is buffer geometry or regular geometry i'm not sure.

Then I need to connect with redux and form sliders.

Then i need to make sure everything is in sensible scale.

Then i need to apply materials and appearances.

SO i just got the ray caster working FINALLY!

there wwas a lot of stuff in here which i didn't realise was happening.

eg - determining mouse vectors based on window size. Used a new JS function called getBoundingClientRect - which returns the size of an element and its position relative to the viewport. before this it took me ages to figure out where my ray was based on mouseevent coords.

Secondly I spent ages trying to figure out why my colours weren't saving. it turned out I was instantiating a new class every render loop so there was no memory. I had to call the class instance outside the loop, and then update it from inside.
this is why it seemed like the data flow was backwards inside the pick helper class, because it was using data from the last loop. (how you gonna restore colour of a picked object before you've saved it)

Next i'm gonna try make some geometry in the empty spaces between the cabinet meshes and then used that as the array for the picking, instead of the actual meshes.

first step is to find where each child mesh gets its world coords from.

I have put a new initial state object in the app component. The reducer now taks an object with a few props to create a new shelf.

Now to make the shelf render from the state.

---

did some refactoring to make everything more modular.

working on how to use state to build shelves and dividers from the ground up.

this i need a function to clone a piece and then create the reducer action whatever thing to add this to the object.

not sure if i'm gonna use the bounding box in the end. Might have to switch it out to use regular geometry. OR maybe I can just use new THREE.Object3D(box3geom).

Gonna make transparent boxes in between the divs and then use raycasting to change the transparency on these.

was building a function that creates a bounding box between two divs. this will work on all amount of divs if i put an if statement that checks if its not the rightmost div.

See you tomorroW!

I have built functions that place shelves and divs based on coordinates from the state object

NOw, I will like to plug in the in between functions.

Then I would like to build a state machine that provides the constraints that allow only sensible placement of parts.

Looking at the state machine Xstate docs. I think it is what I need.

Today I'm looking at morph targets and statemachines.

Morph targets seem to be you create a target object geometry, and then you morph your existing object into that geometry.
Found some good examples on github.

one thing to consider. Using morph targets - this is a way to make changes inside three js render loop, not React render looop.

If i'm connecting this with redux, it may need to stay in react loop.

Reading a good formum. - What is a scene graph? three js funamentals. Its like a node graph.

Looking at redux with hooks and how this would work with react fiber.

This seems to be the way to go.

It seems like the key here, is going to be how to get the default cabinet designs. Do I want to import a model to get the defaults for the design?

The instances of a design type ( eg bookcases) this will be stored in state. But what about the style? eg, grid slanted etc. Where will I store these?

Basically its looking like I have an array of positions for a shelf with divs, then i copy this to multiple levels and define the height of each.

This makes sense for a grid, but what about different styles? would the sstyle change be a function that clones or copies the shelf levels in a different way?

I don't necessarily like this because It stoo hard coded.

Wait ok, theres a value in state which determines how the shelves are copied on every level. Whether its, evenly spaced, offset, random or gradient. the positions of the divs in each shelf need to come from state.

so in summary, I don't need the gltf loaded model. I can just use basic gemoetry.

i can use react-fiber, and then I can make components for each shelf and div, and then easily update these from redux.

I will still need some gltf models and transforms for the drawers and cupboard doors etc.

how would the functions I have written be different if it was react components rather than three.js objects?

if i load the objects as react componenets, can i still put things between them? can i access their geometry still?

I'm going to use three.js normal first. Then maybe rebuild with react fiber after i reach MVP for the component. I will be able to reuse most of the redux stuff anyway.

maybe I don't need such a complex config object.

i just need

shelvesY = [0, 280, 560, 840, 1120 ]
divsX = [[0, 300, 600, 900],[0, 300, 600, 900], [0, 300, 600, 900], [0, 300, 600, 900], [0, 300, 600, 900] ]

then i can just map them to each other by index.

I just got the shelf and div creators working properyl.

I can get almost everything out of the initial state object now except the above arrays.

next I want to get some reduxing done on the sliders to just display or log the desired values from the state. Then I can try figure how to scale everything accross.

This is gonna mean i'm gonna need some logic to caluclate div and shelf positions - could just be as simple as height - (shelfqty \* materialThicknes) / shelfqty
or whatever it is.

had a weird bug today when i added ray picking back in to the mix, it went into debugging mode and opened up the sources devtools tab. it was almost like there was an active debugger in the three.js package. In the end i think it was because i had a variable named this.RayCast which maybe was fucking with the this.Raycast in the package because it openend up to a part of three js that was to do with raycasting. I changed the name to something normal like this.pickHelper with lower case 'p' and it seemed to work. i think this was a naming convention issue but who knows. Make sure not to name things with things that might be reserved!

when I get the redux going in a second. All the sliders need to connect to is the arrays in state. and they just need to update the values accordingly.

so calculating the widths. gonna have to calculate these from overall width. this will be different than height because of the set heights. so this will mean that defaults load pre constrained div widths or it will jump. the slider handler function will take the width from the slider and the update the width and update the divs array from this and send it to the reducer. will need a thing like every 600 but no less than 300

i have got the div positioner vaguely working. the slider updates the divsX position array and then there is a function that maps all these values to the div X position.

the problem is that this doesn't create or remove any divs if more are needed, so they are missing. I tried just rebuilding the cabinet on every move. This just creates more and more divs everytime.

I think I need to refactor this into smaller modulart parts with functions for createSingleShelf. positionSingleShelf. createSingleDiv, and positionSingleDiv. then I can just run these functions once for every item in the divX array on component mount. and then run position functions for every update and run add or remove functions as needed. These will also need to be nested maybe so that shelves coordinates can be passed through to div coordinates.

I also want each shelve roow to be somewhat individual because later I will want different styles. eg grid, random, gradient etc.

order will go. create shelf. position shelf. create divs, position divs.
on resize, create shelg, remove shelf, position shelf. create div, remove div, position div.

where do I put scene add? Maybe I could Have maybe 30 or so meshes not added to the scene, and the functions just do the scene add. for each one. WE have a set up function that runs on mount and creates 30 Meshes. Then the other functions just assign dimensions, positions and names.

when you use a forEach loop you can't .pop all items. the last one wont make it.

so have easily added the hoverboxes. using the same mesh store idea. with these guys on every component update I reset, return to store, and re-calculate positions, and then re-add all the boxes to these new positions. it is runnning a bit sloweer now, but I think this is because of the nested loops. nest I want to flat the arrays and use a filter to pick out shelvesY and DIvsX values to calculate the box positions. I think it will nmake some difference cos i am doing a lot of IF checks on everything everytime at the moment.

adding an event listener using the ray caster is super easy. I just added and extra method to the pick class called click and it just executes whatever. the event listener is on the renderer, and whenever there is a click in this canvas, the lickhandler function runs, which calls the pickhelper.click which setst raycaster and checks for intersects and if so, executes whatever the click result is.

Now I am trying to add the GLTF loader so i can load a drawer. I'm thinking I will also have a cupboard and each click will just cycle through, cuoboard, drawer, openshelf. Will i have a store of GLTF Objects that i add to the scene here? I think this is prudent. I might try clone here as well.

Where should I put the loading function? I might create a new method in base class to load the objects. and then the picker method will just toggle between cloning and adding drawers and cuoboards.

I'm going to try to put them in separate files too

Ok so got a lot done. Loaded the GLTF drawer in and worked it with the click.

these don't update with the sliders though.
its confusing having react components and regular classes. can't alwsysd use redux, gottas pass things through in ndifferent ways. next step is to figure out how the update is gonna work. The update is all done with redux. but i can't connec the no react components with their constructor functions

have started using the matrix transforms.

Wanna start passing nobjects between functions as well I think this will make params less messy.

how do I calculate the scale from the measurements.

eg is something is 150mm tall and i want it to be 200mm tall, what is the scale?

i think its just 200/1500 = 1.33 so scale by 1.33.
Now i just need to make a neat way to do this with the matrix.

to work the drawers in with redux. Load them everyframe like with the hover boxes.

But when a box is clicked and loaded. This updates redux within array of drawer positions using dispatch and then the drawers are loaded independently in a different function in the main class.

does this mean its easy to dispatch from a non-react class, but that you can't use the connect funcion from react-redux to access the state? tyhis would make sense becasue what use is react-redux if you're not using react. maybe just need to import the dispatch from redux only.

Ok I'm feeling like I might have hit a snag that requires a major refactor to reconcile redux, react and three js loaders.
The gltfjsx part of fiber looks like the solution, but this is going to return the loaded object as a jsx object that will be fucked with in the render function of the main viewer component.

Does this matter? I can just pass through the props that I need to the component. like the position and bounding box I get from the raycaster.

HMMMM. where would i put the function that renders the gltf for each item in the store array? need a

maybe I need to look up a raycasting component as well.

ok raycasting happens automatically within react three fiber.

it looks like I will be able to use my functions the same for positioning all the meshes from the state arrays.

its just the way they are added into the scene thatis different.

so i will write a function that generates however many meshes, then just chuck this in the render function or the return of the fuinctional component.

I think it's time for a new branch.

// addShelves(shelfMesh, divMesh, config) {
// //this takes the whole config object. and clones the shelves based on this object.

    // 	const { shelves } = this.props.config;

    // 	shelves.forEach(obj => {
    // 		// get id
    // 		const { id, min, max } = obj;
    // 		// const [mesh] = meshArr;

    // 		// here you can use clone or copy. might come up later.
    // 		// const clone = new THREE.Mesh(mesh.geometry, mesh.material);
    // 		// clone.copy(mesh);
    // 		const clone = shelfMesh.clone();
    // 		const { divs: dividers } = obj;

    // 		// still need to figure out how to get the right coordinates based on the state object.
    // 		clone.position.set(max.x, max.y, max.z);
    // 		clone.parent = shelfMesh.parent;
    // 		// need to put the parent id in here.
    // 		clone.name = `${obj.id}`;
    // 		this.id = obj.id;

    // 		// this.objects.push(clone); // this is to make raycaster work but should props change raycaster to just scene.children
    // 		this.partCloner(dividers, divMesh);
    // 		this.scene.add(clone);
    // 		this.objects.push(clone);
    // 	});
    // }

    // partCloner(array, mesh) {
    // 	array.forEach(obj => {
    // 		// get id
    // 		const { id, min, max } = obj;
    // 		// console.log(meshArr);
    // 		// const [mesh] = meshArr;

    // 		// here you can use clone or copy. might come up later.
    // 		// const clone = new THREE.Mesh(mesh.geometry, mesh.material);
    // 		// clone.copy(mesh);
    // 		const clone = mesh.clone();

    // 		// still need to figure out how to get the right coordinates based on the state object.
    // 		clone.position.set(max.x, max.y, max.z);
    // 		clone.parent = mesh.parent;
    // 		// need to put the parent id in here.
    // 		clone.name = `${this.id + id}`;

    // 		// this.objects.push(clone); // this is to make raycaster work but should props change raycaster to just scene.children

    // 		this.scene.add(clone);
    // 		this.objects.push(clone);
    // 	});
    // }

    // calcShelfAreas(config) {
    // 	const { shelves } = config;
    // 	shelves.forEach(shelf => {
    // 		this.calcOpenAreas(shelf, this.objects);
    // 	});
    // }

    // calcOpenAreas(shelf, objectArr) {
    // 	// need a naming convention.
    // 	// this will take the div position from a shelf arr and then call on the corresponding meshes (via the naming convention) to build the bounding box.
    // 	const { divs: dividers } = shelf;
    // 	dividers.forEach((divider, i) => {
    // 		if (divider.id < dividers.length - 1) {
    // 			// looking for a way to destructure the meshes and the pass them to below function.

    // 			const mesh1 = this.getPiece(
    // 				this.objects,
    // 				`${shelf.id + dividers[i].id}`
    // 			);
    // 			const mesh2 = this.getPiece(
    // 				this.objects,
    // 				`${shelf.id + dividers[i + 1].id}`
    // 			);
    // 			console.log(mesh1, mesh2);
    // 			this.calculateOpenArea(mesh1, mesh2);
    // 		}
    // 	});
    // }

    // calculateOpenArea(Mesh1, Mesh2) {
    // 	// i wanna make this so it accepts a mesh and takes the bounding box.

    // 	const [
    // 		{
    // 			name: Mesh1Name,
    // 			geometry: { boundingBox: Mesh1Box }
    // 		}
    // 	] = Mesh1;
    // 	const [
    // 		{
    // 			name: Mesh2Name,
    // 			geometry: { boundingBox: Mesh2Box }
    // 		}
    // 	] = Mesh2;

    // 	//figure out how to do the object destructuring for this.

    // 	const box = new THREE.Box3();

    // 	box.expandByPoint({
    // 		x: Mesh1Box.max.x - 18,
    // 		y: Mesh1Box.max.y,
    // 		z: Mesh1Box.max.z
    // 	});
    // 	box.expandByPoint({
    // 		x: Mesh2Box.min.x + 18,
    // 		y: Mesh2Box.min.y,
    // 		z: Mesh2Box.min.z
    // 	});
    // 	console.log(Mesh2Box, Mesh1Box);
    // 	const material = new THREE.MeshBasicMaterial();

    // 	const helper = new THREE.Box3Helper(box, 0xff00ff);
    // 	// const cube = new THREE.Mesh(helper, material);
    // 	// this.scene.add(cube);
    // 	this.scene.add(helper);
    // }

    // getPiece(array, name) {
    // 	const object = array.filter(obj => {
    // 		return obj.name === name;
    // 	});
    // }

    // createSkeletonArray(objects) {
    // 	// this picks out the bottom and left and starts the arrays for each level.
    // 	this.horiz = [];
    // 	this.vert = [];

    // 	const left = objects.filter(obj => {
    // 		return obj.name === 'Left';
    // 	});
    // 	const bottom = objects.filter(obj => {
    // 		return obj.name === 'Bottom';
    // 	});
    // 	this.horiz.push(bottom);
    // 	this.vert.push(left);
    // }

    // createChildArray = scene => {
    // 	this.objects = [];

    // 	const objects = this.objects;
    // 	scene.traverse(obj => objects.push(obj));
    // 	this.objects = this.objects.slice(11);

    // 	this.objects.forEach(i => {
    // 		i.material = new THREE.MeshStandardMaterial({
    // 			color: this.randomColor()
    // 		});
    // 	});
    // };

    	// modelLoader = () => {
    // 	const gltfLoader = new GLTFLoader();
    // 	const url = '/cabinetTest1.gltf';
    // 	gltfLoader.load(url, gltf => {
    // 		const root = gltf.scene;

    // 		const {
    // 			children: [{ children: sceneObjects }]
    // 		} = root;

    // 		this.sceneMeshes = sceneObjects.filter(obj => {
    // 			return obj.type === 'Mesh';
    // 		});

    // 		const Divider = this.getPiece(sceneObjects, 'Div');
    // 		const Solid15 = this.getPiece(sceneObjects, 'Solid15');
    // 		const Bottom = this.getPiece(sceneObjects, 'Bottom');
    // 		const Left = this.getPiece(sceneObjects, 'Left');
    // 		this.calculateOpenArea(Divider, Solid15);
    // 		// this.createSkeletonArray();

    // 		const [leftMesh] = Left;
    // 		const [dividerMesh] = Divider;
    // 		const [shelfMesh] = Bottom;

    // 		this.objects.push(leftMesh, shelfMesh);
    // 		this.addShelves(shelfMesh, dividerMesh, this.props.config);

    // 		this.root = root;
    // 		this.scene.add(leftMesh, shelfMesh);
    // 		const shelf = this.props.config.shelves[0];
    // 		this.calcOpenAreas(shelf, this.objects);
    // 		this.calcShelfAreas(this.props.config);

    // 		console.log('done');
    // 	});
    // };
    // makeInvisibleCube(vector1, vector2) {
    // 	const box = new THREE.BoxGeometry(100, 100, 100);
    // 	const material = new THREE.MeshBasicMaterial();
    // 	const cube = new THREE.Mesh(box, material);
    // 	const bbox = new THREE.Box3(vector1, vector2);
    // 	const bhelp = new THREE.Box3Helper(box, 0x0000ff);
    // 	// this.scene.add(bhelp);
    // 	this.scene.add(cube);
    // 	const center = new THREE.Vector3();
    // 	bbox.getCenter(center);

    // 	cube.position.z = center.z;
    // }


    console.log(e.target.value);

    	const calcDiv = inputValue => {
    		const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    		let divQty;
    		let i = 1;
    		while (inputValue / values[i] > 400) {
    			i++;
    			divQty = values[i];
    			console.log(divQty);
    			console.log('i', i);
    		}
    		return divQty;
    	};
    	const divs = calcDiv(e.target.value);
    	const dispatchDivPos = (divnum, width) => {
    		const newWidthArray = [];
    		let x = 0;
    		let i = 0;
    		let space = divnum / width;

    		while (x < width) {
    			x = space * i;
    			newWidthArray.push(x);
    			i++;
    			console.log(x);
    		}
    	};

    	dispatchDivPos(divs, e.target.value);
