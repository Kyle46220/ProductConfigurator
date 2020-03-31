// this is going to make a thing that makes all the pieces line up.

//constraints
// 1 all parts the same depth
//2 all shelves the same width.
//3 all divs the same height.
//4 all parts fron edge coordinates are the same - all parts z position is the same.
// i think it has to be a class that references the height, width, shelf number, and div number and constrains everything else. 

// maybe i'll build this using hooks and redux for practise

import React, { useState } from 'react';

const depth

function setDepth(config) {
  const {shelves} = config;
  shelves.forEach((item) => {


  })
}

function constraintMachine() {
  const shelfHeights = [180,280,380]
  const shelfDepths = [280, 380, 480, 580]
  const materialThickness = 18;

  const shelfWidths = (min, max) => {
    result = []
    for ( let i = min; i <= max; i++)
    {result.push(i)}
    return result
  }

  const shelfHeights = () => {
    // eventually this is all combinations of shelfHeights that are less than 3m. but for now lets just do one shelf height at 280
    
    
  }
const [depth, setDepth] = useState(shelfDepths[0])
const [width, setWidth] = useState(0)
const [height, setHeight] = useState(280)
const[ shelfQTY, setShelfQTY] = useState(0)



}
