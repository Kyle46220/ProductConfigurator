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

This is gonna mean i'm gonna need some logic to caluclate div and shelf positions - could just be as simple as height - (shelqty \* materialThicknes) / shelf QTY or whatever it is.
