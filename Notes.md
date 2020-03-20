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
