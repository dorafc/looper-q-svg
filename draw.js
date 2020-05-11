// draw something
let drawQuilt = () => {
  // quilt dimensions
  const blockWidth = 300
  const colCount = 2;
  const rowCount = 2;
  const rotations = [[180,270],[0,90]]
  const colorDirection = [[1, 1],[0, 0]]      // 1 current order, 0 reversed order

  // color pallatte
  const bgColor = "url(#background)"
  const arcColors = ['#007d30', '#5fc219', '#e8de1c', '#ff7370', '#c9497e', '#e090bc'] 

  // set up <svg>
  let space = document.getElementById("quilt")
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  // figure out pattern stuff
  // include in <defs>
  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

  defs.appendChild(generatePattern("background"))
  quiltSVG.appendChild(defs)

  quiltSVG.setAttribute("width", blockWidth * colCount)
  quiltSVG.setAttribute("height", blockWidth * rowCount)
  quiltSVG.setAttribute("viewbox", `0 0  ${blockWidth * colCount} ${blockWidth * rowCount}`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // generate blocks
  let blocks = []
  for (let r = 0; r < rowCount; r++){
    for (let c = 0; c < colCount; c++){
      // clone colors to prevent reversing the original colors
      let arcColorsDir = [...arcColors]

      if (colorDirection[r][c] === 0){
        arcColorsDir = arcColorsDir.reverse()
      }

      blocks.push(drawBlock(`test${r}${c}`, 
                              blockWidth * c, 
                              blockWidth * r, 
                              blockWidth, 
                              bgColor, 
                              arcColorsDir, 
                              rotations[r][c]))
    }
  }

  // generate blocks
  blocks.forEach((block, i) => {
    quiltSVG.appendChild(block)
  })
  
  space.appendChild(quiltSVG)
}

// generate a pattern for the background fabric
let generatePattern = (patternName) => {
  console.log("generating a pattern")
  let pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
  pattern.setAttribute("id", `${patternName}`)
  pattern.setAttribute("x", "0")
  pattern.setAttribute("y", "0")
  pattern.setAttribute("width", "60")   // % of total box size
  pattern.setAttribute("height", "60")   // % of total box size
  pattern.setAttribute("patternUnits", "userSpaceOnUse")

  let bgColor = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  bgColor.setAttribute("fill", "#140430")
  bgColor.setAttribute("x", "0")
  bgColor.setAttribute("y", "0")
  bgColor.setAttribute("width", "60")
  bgColor.setAttribute("height", "60")

  let dot = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  dot.setAttribute("fill","white")
  dot.setAttribute("x", "0")
  dot.setAttribute("y", "0")
  dot.setAttribute("width", "15")
  dot.setAttribute("height", "15")

  pattern.appendChild(bgColor)
  pattern.appendChild(dot)
  // create an 'x'
  console.log(pattern)
  return pattern;
}

// draw a block
let drawBlock = (id, startX, startY, dimensions, bgColor, arcColors, rotation) => {
  // future parameters: rotation
  const arcDimension = dimensions/8
  let block = document.createElementNS("http://www.w3.org/2000/svg", "g")
  
  // generate corner piece
  let corner = drawConvexCorner(bgColor, startX, startY, arcDimension, id)
  block.appendChild(corner)

  let arcs = arcColors.map((color, i) => {
    return drawArc(color, arcDimension * (i+1) + startX, startY, arcDimension, i + 1, id)
  })

  // block.appendChild(arcs)
  arcs.forEach(arc => {
    block.appendChild(arc)
  })

  if (rotation !== 0){
    block.setAttribute("transform", `rotate(${rotation} ${dimensions/2 + startX} ${dimensions/2 + startY})`)
  }

  let endCorner = drawConcaveCorner(bgColor, startX + arcDimension*7, startY, arcDimension, dimensions, id)
  block.appendChild(endCorner)

  return block
}


// draw the curved corner piece
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