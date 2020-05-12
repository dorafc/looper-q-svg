/* ----------
* DRAW QUILT FUNCTION 
* --------- */
let drawQuilt = () => {
  // quilt dimensions
  const blockWidth = 300
  const colCount = 2;
  const rowCount = 2;

  // orientation of the quilt blocks
  const rotations = [[180,270],[0,90]]        // order of the quilt block rotations
  const colorDirection = [[1, 1],[0, 0]]      // 1 current order, 0 reversed order

  // color pallatte + fabric
  const bgColor = "#140430"
  const bgPattern = "url(#background)"
  let patternDimension = 150
  let xSize = 3
  const arcColors = ['#007d30', '#5fc219', '#e8de1c', '#ff7370', '#c9497e', '#e090bc'] 

  // set up <svg> and set proper attributes
  let space = document.getElementById("quilt")
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  quiltSVG.setAttribute("width", blockWidth * colCount)
  quiltSVG.setAttribute("height", blockWidth * rowCount)
  quiltSVG.setAttribute("viewbox", `0 0  ${blockWidth * colCount} ${blockWidth * rowCount}`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // generate the background fabric pattern and add to the <defs>
  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  let pattern = generatePattern("background", bgColor, patternDimension, xSize)
  defs.appendChild(pattern)
  quiltSVG.appendChild(defs)

  // generate array or block groups
  let blocks = []
  for (let r = 0; r < rowCount; r++){
    for (let c = 0; c < colCount; c++){
      // clone arc colors to prevent reversing the original colors
      let arcColorsDir = [...arcColors]

      if (colorDirection[r][c] === 0){
        arcColorsDir = arcColorsDir.reverse()
      }

      blocks.push(drawBlock(`test${r}${c}`, 
                              blockWidth * c, 
                              blockWidth * r, 
                              blockWidth, 
                              bgPattern, 
                              arcColorsDir, 
                              rotations[r][c]))
    }
  }

  // add blocks to quilt
  blocks.forEach((block, i) => {
    quiltSVG.appendChild(block)
  })
  
  // add quilt to page
  space.appendChild(quiltSVG)
}

/* ----------
* SET UP THE PATTERN FOR BACKGROUND FABRIC 
* --------- */
let generatePattern = (patternName, bgColor, dimension, xSize) => {
  
  // set up <pattern>
  let pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
  pattern.setAttribute("id", `${patternName}`)
  pattern.setAttribute("x", "0")
  pattern.setAttribute("y", "0")
  pattern.setAttribute("width", dimension)   // % of total box size
  pattern.setAttribute("height", dimension)   // % of total box size
  pattern.setAttribute("patternUnits", "userSpaceOnUse")

  // add a rectangle with the background color to the pattern
  let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  bgRect.setAttribute("fill", bgColor)
  bgRect.setAttribute("x", "0")
  bgRect.setAttribute("y", "0")
  bgRect.setAttribute("width", dimension)
  bgRect.setAttribute("height", dimension)

  // set up 'x's in the background with randomized locations
  // number of x's is dependent on the size of the pattern
  let crosses = []
  for (let i = 0; i < dimension / 5; i++){
    let cross = drawX(Math.random() * (dimension - xSize), Math.random() * (dimension - xSize), xSize)
    crosses.push(cross)
  }

  // add pattern elements to the pattern
  pattern.appendChild(bgRect)
  crosses.forEach(cross => {
    pattern.appendChild(cross)
  })

  return pattern;
}

/* ----------
* DRAW X FOR THE PATTERN GENERATION 
* --------- */
let drawX = (startX, startY, size) => {
  let cross = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
  let line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
  line1.setAttribute("x1", startX)
  line1.setAttribute("x2", startX + size)
  line1.setAttribute("y1", startY)
  line1.setAttribute("y2", startY + size)
  line1.setAttribute("stroke", "white")

  line2.setAttribute("x1", startX + size)
  line2.setAttribute("x2", startX)
  line2.setAttribute("y1", startY)
  line2.setAttribute("y2", startY + size)
  line2.setAttribute("stroke", "white")

  cross.appendChild(line1)
  cross.appendChild(line2)

  return cross
}

/* ----------
* CREATE SHAPES FOR A BLOCK 
* --------- */
let drawBlock = (id, startX, startY, dimensions, bgColor, arcColors, rotation) => {
  // calculate width of the arc
  const arcDimension = dimensions/8

  // create group for the block
  let block = document.createElementNS("http://www.w3.org/2000/svg", "g")
  
  // generate corner piece
  let corner = drawConvexCorner(bgColor, startX, startY, arcDimension, id)
  block.appendChild(corner)

  // generate curved pieces
  let arcs = arcColors.map((color, i) => {
    return drawArc(color, arcDimension * (i+1) + startX, startY, arcDimension, i + 1, id)
  })

  // block.appendChild(arcs)
  arcs.forEach(arc => {
    block.appendChild(arc)
  })

  // create end corner piece
  let endCorner = drawConcaveCorner(bgColor, startX + arcDimension*7, startY, arcDimension, dimensions, id)
  block.appendChild(endCorner)

  // rotate the block
  if (rotation !== 0){
    block.setAttribute("transform", `rotate(${rotation} ${dimensions/2 + startX} ${dimensions/2 + startY})`)
  }

  return block
}


/* ----------
* DRAW SMALL CORNER PIECE 
* --------- */
let drawConvexCorner = (color, startX, startY, dimension, blockID) => {
  let piece = document.createElementNS("http://www.w3.org/2000/svg", "path")
  piece.setAttribute("id", `corner-${blockID}`)
  piece.setAttribute("fill", color)
  piece.setAttribute("d",   `M${startX} ${startY} 
                            l${dimension} 0
                            a${dimension} ${dimension} 0 0 1 -${dimension} ${dimension}Z`)
                            // rx, ry size of the ellipse
                            // rotation of the ellipse
                            // use the big or small arc
                            // direction of arc (cw or counter cw)
                            // where the second point is (dx dy or x y)

  return piece
}

/* ----------
* DRAW ARC PIECE 
* --------- */
let drawArc = (color, startX, startY, dimension, orbit, blockID) => {
  let piece = document.createElementNS("http://www.w3.org/2000/svg", "path")
  piece.setAttribute("id", `arc-${blockID}`)
  piece.setAttribute("fill", color)
  piece.setAttribute("d", `M${startX} ${startY}
                          l${dimension} 0
                          a${dimension * (1 + orbit)} ${dimension * (1 + orbit)} 0 0 1 -${dimension * (1 + orbit)} ${dimension * (1 + orbit)}
                          l0 -${dimension}
                          a${dimension * orbit} ${dimension * orbit} 0 0 0 ${dimension * orbit} -${dimension * orbit}Z`)
  return piece;
}

/* ----------
* DRAW LARGE CORNER PIECE
* --------- */
let drawConcaveCorner = (color, startX, startY, dimension, fullDimensions, blockID) => {
  let innerArc = fullDimensions - dimension
  let piece = document.createElementNS("http://www.w3.org/2000/svg", "path")
  piece.setAttribute("id", `end-corner-${blockID}`)
  piece.setAttribute("fill", color)
  piece.setAttribute("d",   `M${startX} ${startY} 
                            l${dimension} 0
                            l0 ${fullDimensions}
                            l-${fullDimensions} 0
                            l0 -${dimension}
                            a${innerArc} ${innerArc} 0 0 0 ${innerArc} -${innerArc}Z`)
  return piece
}


drawQuilt()