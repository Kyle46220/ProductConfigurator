## Hello!

# its been a while since i've done some coding as work has been intense with mvoing and stuff. BUt I'm back baby.

Ive just strated up again trying to figure out the cabinet configurator.

Have jumped back in with the gltfJSX loader. I've just figured out how to get multiple models to load froim an array.

I had an error for ages. i forgot that you have to return a JSX object in a functional component in react.

Now it works.

THe next task is to get on onClick event to manifest a drawer in the clicked zone. i had used raycasting in the plain three.js version but now I think i can juste put an onclick event handler straight in the JSX mesh object.

click handler changes state and then state is updated on main component re-render
