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

so i will write a function that generates however many meshes, then just chuck this in the render function or the return of the functional component. so i can probs cannabalise the existing functions that create the divs and shelves.

I think it's time for a new branch.

ok so I think I will create a functional component that renders meshes from state arrays. like we did the hover boxes. this just creates and positions meshes from arrays and then updates on all changes.

i think i can leave the redux form components as is for now.

find the function here the key meshes are created.

-- issues with height slider
// there's something here about how things are rendered. height changes only show up when width slider is used. Width works fine, because width is defined every change inside the row component. the shelf array is also definined inside this component. i had this problem in the impoerative code as well. what did i do to solve it? is it perhaps how in viewer.jsx i had the position shelf function that ran after the logic that decides whether to remove or add. It may be this separation of positioning and creating differently?
//though fiber seems to update the width fine. why is this?

// it looks like it just re-renders from within the conditional if else
// like it just stays there and doesn't go all the way back to the start of the component and loops through the return of each cnoditional part as long as its there.
// i'm quitting for the night bu i think its going to be somehitng to do with how the divs a renderseed every fram but the shelves areent'

// the difference is adjusting the items that are already there vs creating/deleting new ones. I need to make it so that all shapes are loaded on every frame.

### April 13 2020

I'm going to try using zustand instead of react-redux for this specific issue.

MAYYYYBE i keep running in to issues because i'm using 2 different state arrays? could I have a better way of doing this?

i can use an object, because, if all the valuse are in there, then it won't matter if they stay in order.

config = {height: 900, width: 900, depth: 400, 0:[0,300,600,900], 1:[0,300,600,900], 2:[0, 300, 600, 900], 3:[0, 300, 600, 900]}

i tried nearly alll day to get zustand to work and i finally did! when creating a function in the state, you need to make suyre when you call use Store hook, that you assign it to a variable, and then call this variable if it needs to go inside a function. because hooks have to stay inside a component, and can't be in a regular JS function.

seem to finally be working things out.

have just done the slider handler, and all the updaters for the state with zustand. its good, you don't even need the reducer at all. you just call the function from the store and then you can put whatever in there.

it seems to be that all the imperative code is getting isolated inside a few functions and only receiving props. I jsut di this with the heigth handler, and next I will do it with the height as well.
maybe this has something to do with useEffect

i will try to remember that only some components will need to be rerendered if i change the way i access the state. if i acess all and then destructure, everything gets rerenders, if i just useStore the specific things, I think everything else doesn't get rendered.

for animations react-spring will be the nex thing. I'm very glad to have found this group o libraries and peter henschel .

### April 15

doing height controls

found out that if you can't calla fcuntiondirectly because of hooks reuls or something, you can just assign it to a variabvle and then call the variable.

trying now to write a function, that takes an array, and a value, sums bvalue andf last array value, and adds it to array and then repeats.

ok got the height and width functions owkring apart from the same issue i've had a million times of not trying to create divs beyond the last shelf when the slider goes dow, or in this case, up or down.

ok i think the problems is not necessarily that iyts trying to iterate over an array that i've jsut removed - but what they are sayuin is a memory leak. I need to useEffect because I'm changing things after render but no doing the componentDidMount thing.

useRef and useEffect I think have the answer, useEffect runs everytime the component is updated. COuld is use this to calculate the position array?

useRef seems to be sort of like what i was using 'this' for earlier. to launch into some imperative wangjangling.

ok calling setState after a component has unmounted will give the warning I have seen. i need to do a cleanup it seems like?
Use effect can return cleanups,.

r3F is supposed to dispaose of objexcts autmativcally. Is it then jsut that I am calling state on an unmounted component?
its gotta be something to do without how before I had the store array adn managed all that, whereas now I don't. it works with the shelves though? ???

it could be because when i delete the shelf and the array, its just one componenyt and one state update, wheras when i remove an array of divs, the state only updates once, to remove the array, but multiple components need to be removed.

This could be it. I would need to think about how the component unmounts. maybe there needs to be a function in the width height controller?

there's something wrong with the order of state setting and mounting components. it couls havew something to do with trying to use a single array and then an array of arrays.

If i used this state object

config: [
{ y: 0, x: [0, 300, 600, 900] },
{ y: 300, x: [0, 300, 600, 900] },
{ y: 600, x: [0, 300, 600, 900] },

     i have a feeling the problem would go away.

there's a way to do it with the 2 arrays but i'm not smart enough.

ok i figured it out. just had the wrong index in a slice function doh.

now I want to put the first value of every Divs array as the shelf height value

its very slow at the moment, This could be because I am having all components update on every state change> this will be a about the way i've used useStore hook?

why did I want to put the first value of the ddivs array as the shelfY height?

I think because having separate functions that manipulate an object in an array vs the array in an array thing.

Could i also use a giant object? hmmmmm not sure. Popping off the end of the array seemsz pretty smooth for now

The problem is rerendering rather than just updating.

its use effect. so with useeffect, whatever is in the callback will get called everytime the componenet updates. the second param afer the callback will define what to listen to for changes. - so could I put the slider values here?
Maybe. doesn't necessaril help though. cos fast slider still might screw it up.
I need to change position rather than rerender.
So i can make a use effect to rerenders the whole component when something changes and only change position when something else changes. So can I change the position of the meshes on the screen without rerendering the component and just by adding a listener to ....?
For example for a row of divs,

If the <mesh> JSX tag is new THREE.mesh . then perhaps I should have separate position and create functions? would thes eboth be components?

its about passing data through vs re-rendering.

https://github.com/react-spring/react-three-fiber/issues/126

https://spectrum.chat/react-three-fiber/general/optimising-performance~03cf08f1-5d42-411a-8b42-9199b49c831b

HOw would I update a property of an object without rerendering?

use ref i think is like 'this

```
javascript
const [useStore, api] = create(set => ({ "0": [-10, 0], "1": [10, 5], ... })) // this creates the store object.

function Component({ id }) {
  // Fetch initial state --- use ref and fetch state to add to component
  const xy = useRef(api.getState()[id])
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a callback
  useEffect(() => api.subscribe(coords => (xy.current = coords), state => state[id]), [id])
```

now that i've got the useeffect with the console log of render. If I can make the box size change without the console log render appearing I win. I will make a custome hook for this.

made some good progress with use effect and subscribe. it's sort of like nested listeners.

https://codesandbox.io/s/peaceful-johnson-txtws?file=/src/store.js

This just shows an example of transient updates.

So in the shelf model, what is getting updated tranisently, and what is getting re-rendered?

Everytime a piece gets added or removed, we do a re-render from state.

I think the issue is for every change of any component in the whole tree, all the component sget re-rendered and built again. So we want to keep the rerendering to the parts that require it.

Maybe rather than having components that call components, inside the canvas the different shelves are called spearately. Thes don't need to be all contained in the one component do they? Then for simple width changes of the shelves, for example, only the divs would need to re-render.

Would this still have the same 'map of undefined' problem?
Maybe not if the components weren't so nested. because they'd be independent.

Make each Type of part an independent component that works in basically the same way as the test box.
Namely - set an initial component to render, use the effect and subscribe nest to make transient changes. Each component just calls from state directly. We use listeners to make the changes that are needed to already rendered components.

i need to make an example of a transiently updated height adjustment with creation and deletion of components. Could I do this by having adding a visible = true attribute to some stuff?
Or maybe just having separate component that render-render individually and less frequently won't be as bad.

I think I need to have it so that the xy coords only need to be calculated once in state when the sliders are changed, then when rendering, I just pass these coords transiently to the componenet meshes. Could also put a visible=false in the subscribe callback as well to transiently add/remove.

maybe i put a use effect on the arry length of the divs that will trigger to add another. The transient positions of the divs can be updated until this trigger is called.

subscribe listens for div positions and updates meshes positions. This is inside a useEffect triggered by the divs array.
another useEffect that is triggered by the length of the array ads components.

I think the main issue is that the quick slider movement re-renders too many components too quickly at once. what if it was just one component per slider?
I wanna avoid having the visible=true option for some reason. this seems too hackey.
a new divs component would be div = state.divs.

return divs.map return <mesh>

if the divs state had all the coords in it that would be good.

it would need to re-render on both height and width changes.
maybe using transient update when only the positions change, and then re-rendering when some are added would be enough to allow it to catch up?

Can we listen for changes in the stores elements. Like when the qty of shelves changes, re-render, but the position just do transient update?

The error just happens when you do the slider really quickly.
