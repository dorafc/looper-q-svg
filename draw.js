// update the type of quilting pattern visible
let quiltState = "none";
const quiltOpt = document.getElementById("quilt-opt")
quiltOpt.addEventListener('change', (event) =>{
  drawQuilt(event.target.value)
})

/* ----------
* DRAW QUILT FUNCTION 
* --------- */
let drawQuilt = (quiltOpt) => {
  // quilt dimensions
  const blockWidth = 400
  const colCount = 2;
  const rowCount = 2;

  // orientation of the quilt blocks
  const rotations = [[180,270],[0,90]]        // order of the quilt block rotations
  const colorDirection = [[1, 1],[0, 0]]      // 1 current order, 0 reversed order

  // color pallatte + fabric
  const bgColor = "#140430"
  const bgPattern = "url(#background)"
  let patternDimension = blockWidth / 2
  let xSize = blockWidth / 100
  const arcColors = ['#007d30', '#5fc219', '#e8de1c', '#ff7370', '#c9497e', '#e090bc'] 

  // set up <svg> and set proper attributes
  let space = document.getElementById("quilt")
  space.innerHTML = ""
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  quiltSVG.setAttribute("width", blockWidth * colCount)
  quiltSVG.setAttribute("height", blockWidth * rowCount)
  quiltSVG.setAttribute("viewbox", `0 0  ${blockWidth * colCount} ${blockWidth * rowCount}`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // generate the background fabric pattern and add to the <defs>
  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  let pattern = generatePattern("background", bgColor, patternDimension, xSize)
  defs.appendChild(pattern)

  // create a clipping path for the arc
  let clipArc = generateArcClipPath(blockWidth, "clipy")
  defs.appendChild(clipArc)
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

  // render quilting
  let quilts = new Map()
  quilts.set("opt1", drawQuiltOpt1)
  quilts.set("opt2", drawQuiltOpt2)
  quilts.set("opt3", drawQuiltOpt3)
  if (quiltOpt !== "none"){
    
    let quilting = quilts.get(quiltOpt)
    quiltSVG.appendChild(quilting(blockWidth, "test"))
  }

  // add quilt to page
  space.appendChild(quiltSVG)
}

/* ----------
* GENERATE CLIP PATH FOR ARCS
* --------- */
let generateArcClipPath = (dimension, clipID) => {
  let clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath")
  let topPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  let bottomPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  clipPath.setAttribute("id", clipID)
  let shortDim = dimension / 8
  let longDim = dimension - shortDim

  topPath.setAttribute("d", `M0 ${dimension+shortDim} 
                              a${shortDim} ${shortDim} 0 0 0 ${shortDim} -${shortDim}
                              a${longDim} ${longDim} 0 0 1 ${longDim} -${longDim}
                              a${longDim} ${longDim} 0 0 1 ${longDim} ${longDim}
                              a${shortDim} ${shortDim} 0 0 0 ${shortDim} ${shortDim}
                              l0 -${dimension+shortDim}
                              l-${dimension*2} 0Z
                              `)

  bottomPath.setAttribute("d", `M0 ${dimension+longDim} 
                              a${longDim} ${longDim} 0 0 0 ${longDim} -${longDim}
                              a${shortDim} ${shortDim} 0 0 1 ${shortDim} -${shortDim}
                              a${shortDim} ${shortDim} 0 0 1 ${shortDim} ${shortDim}
                              a${longDim} ${longDim} 0 0 0 ${longDim} ${longDim}
                              l0 ${shortDim}
                              l-${dimension*2} 0Z
                              `)
  clipPath.appendChild(topPath)
  clipPath.appendChild(bottomPath)

  return clipPath;
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
  for (let i = 0; i < dimension / (xSize * 2); i++){
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
  let quiltLine1 = drawArcQuiltSeam(startX+5, startY, (dimension * orbit) + 5, blockID)
  let quiltLine2 = drawArcQuiltSeam(startX+dimension-5, startY, (dimension * (orbit+1)) - 5, blockID)
  piece.setAttribute("d", `M${startX} ${startY}
                          l${dimension} 0
                          a${dimension * (1 + orbit)} ${dimension * (1 + orbit)} 0 0 1 -${dimension * (1 + orbit)} ${dimension * (1 + orbit)}
                          l0 -${dimension}
                          a${dimension * orbit} ${dimension * orbit} 0 0 0 ${dimension * orbit} -${dimension * orbit}Z`)
  
  return piece;
}

/* ----------
* DRAW ARC QUILTING 
* --------- */
let drawArcQuiltBlock = (startX, startY, dimension, rotation, blockID) => {
  let arcQuiltBlock = document.createElementNS("http://www.w3.org/2000/svg", "g")
  arcQuiltBlock.setAttribute("id", `arc-${blockID}-quilt`)
  if (rotation !== 0){
    arcQuiltBlock.setAttribute()
  }
}

/* ----------
* DRAW QUILTING DESIGN 
* --------- */
let drawQuiltOpt1 = (width, quiltID) => {
  let quiltDesign = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let dimension = width / 8         // dimension of the "arc" piece
  let offset = 7                    // distance of the line from the seam

  // generate array of lines based on offset
  let arcLines = []
  for (let i = 1; i <= 6; i++){
    arcLines.push(drawArcQuiltSeam((i * dimension), width, quiltID))
    arcLines.push(drawArcQuiltSeam((i * dimension) + offset, width, quiltID))
    // arcLines.push(drawArcQuiltSeam((i * dimension) + offset + offset, width, quiltID))
    // arcLines.push(drawArcQuiltSeam((i * dimension) + (dimension/2), width, quiltID))
    // arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset - offset, width, quiltID))
    arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset, width, quiltID))
  }
  arcLines.push(drawArcQuiltSeam((7 * dimension), width, quiltID))
  arcLines.forEach(arcLine => {quiltDesign.appendChild(arcLine)})

  // test drawing radial line
  let radGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let numLines = 10
  let line = drawRadialSeam(0, 0, numLines, width, 0, quiltID)
  let line2 = drawRadialSeam(width, 0, numLines, width, 90, quiltID)
  let line3 = drawRadialSeam(0, width, numLines, width, 270, quiltID)
  let line4 = drawRadialSeam(width, width, numLines, width, 180, quiltID)
  radGroup.appendChild(line)
  radGroup.appendChild(line2)
  radGroup.appendChild(line3)
  radGroup.appendChild(line4)
  radGroup.setAttribute("clip-path", "url(#clipy)")
  quiltDesign.appendChild(radGroup)
  return quiltDesign
}

let drawQuiltOpt2 = (width, quiltID) => {
  let quiltDesign = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let dimension = width / 8         // dimension of the "arc" piece
  let offset = 7                    // distance of the line from the seam

  // generate array of lines based on offset
  let arcLines = []
  for (let i = 1; i <= 6; i++){
    arcLines.push(drawArcQuiltSeam((i * dimension), width, quiltID))
    // arcLines.push(drawArcQuiltSeam((i * dimension) + offset, width, quiltID))
    // arcLines.push(drawArcQuiltSeam((i * dimension) + offset + offset, width, quiltID))
    arcLines.push(drawArcQuiltSeam((i * dimension) + (dimension/2), width, quiltID))
    // arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset - offset, width, quiltID))
    // arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset, width, quiltID))
  }
  arcLines.push(drawArcQuiltSeam((7 * dimension), width, quiltID))
  arcLines.forEach(arcLine => {quiltDesign.appendChild(arcLine)})

  // test drawing radial line
  let radGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let numLines = 15
  let line = drawRadialSeam(0, 0, numLines, width, 0, quiltID)
  let line2 = drawRadialSeam(width, 0, numLines, width, 90, quiltID)
  let line3 = drawRadialSeam(0, width, numLines, width, 180, quiltID)
  let line4 = drawRadialSeam(width, width, numLines, width, 270, quiltID)
  radGroup.appendChild(line)
  radGroup.appendChild(line2)
  radGroup.appendChild(line3)
  radGroup.appendChild(line4)
  // radGroup.setAttribute("clip-path", "url(#clipy)")
  quiltDesign.appendChild(radGroup)
  return quiltDesign
}

let drawQuiltOpt3 = (width, quiltID) => {
  let quiltDesign = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let dimension = width / 8         // dimension of the "arc" piece
  let offset = 7                    // distance of the line from the seam

  // generate array of lines based on offset
  let arcLines = []
  for (let i = 1; i <= 6; i++){
    arcLines.push(drawArcQuiltSeam((i * dimension), width, quiltID))
    arcLines.push(drawArcQuiltSeam((i * dimension) + offset, width, quiltID))
    arcLines.push(drawArcQuiltSeam((i * dimension) + offset + offset, width, quiltID))
    // arcLines.push(drawArcQuiltSeam((i * dimension) + (dimension/2), width, quiltID))
    arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset - offset, width, quiltID))
    arcLines.push(drawArcQuiltSeam(((i+1) * dimension) - offset, width, quiltID))
  }
  arcLines.push(drawArcQuiltSeam((7 * dimension), width, quiltID))
  arcLines.forEach(arcLine => {quiltDesign.appendChild(arcLine)})

  // test drawing radial line
  let radGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let numLines = 7
  let line = drawRadialSeam(0, 0, numLines, width, 0, quiltID)
  let line2 = drawRadialSeam(width, 0, numLines, width, 90, quiltID)
  let line3 = drawRadialSeam(0, width, numLines, width, 180, quiltID)
  let line4 = drawRadialSeam(width, width, numLines, width, 270, quiltID)
  radGroup.appendChild(line)
  radGroup.appendChild(line2)
  radGroup.appendChild(line3)
  radGroup.appendChild(line4)
  radGroup.setAttribute("clip-path", "url(#clipy)")
  quiltDesign.appendChild(radGroup)
  return quiltDesign
}

/* ----------
* DRAW RADIAL QUILT SEAMS 
* --------- */
let drawRadialSeam = (startX, startY, numLines, width, rotation, radID) => {
  let radLines = document.createElementNS("http://www.w3.org/2000/svg", "g")
  radLines.setAttribute("stroke", "white")
  radLines.setAttribute("fill", "none")
  radLines.setAttribute("opacity", .6)
  radLines.setAttribute("stroke-dasharray", "2 3")

  let lineOffset = width / (numLines + 1)

  let radLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
  radLine.setAttribute("id", `rad-${radID}-quiltSeam`)
  radLine.setAttribute("x1", startX)
  radLine.setAttribute("y1", startY)
  radLine.setAttribute("x2", startX + width)
  radLine.setAttribute("y2", startY + width)

  let radLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
  radLine2.setAttribute("id", `rad-${radID}-edgeSeam`)
  radLine2.setAttribute("x1", startX)
  radLine2.setAttribute("y1", startY)
  radLine2.setAttribute("x2", startX)
  radLine2.setAttribute("y2", startY + width)

  radLines.appendChild(radLine)
  radLines.appendChild(radLine2)

  for (let i = 0; i < numLines; i++){
    let lineX = document.createElementNS("http://www.w3.org/2000/svg", "line")
    lineX.setAttribute("id", `rad-${radID + i}-quiltSeam`)
    lineX.setAttribute("x1", startX)
    lineX.setAttribute("y1", startY)
    lineX.setAttribute("x2", startX + lineOffset * (i+1))
    lineX.setAttribute("y2", startY + width)

    let lineY = document.createElementNS("http://www.w3.org/2000/svg", "line")
    lineY.setAttribute("id", `rad-${radID + i}-quiltSeam`)
    lineY.setAttribute("x1", startX)
    lineY.setAttribute("y1", startY)
    lineY.setAttribute("x2", startX + width)
    lineY.setAttribute("y2", startY + lineOffset * (i+1))

    radLines.appendChild(lineX)
    radLines.appendChild(lineY)
  }

  radLines.setAttribute("transform", `rotate(${rotation}, ${startX + width/2}, ${startY + width/2})`)

  return radLines
}

/* ----------
* DRAW ARC QUILT SEAM 
* --------- */
let drawArcQuiltSeam = (radius, blockDimension, blockID) => {
  let arcLine = document.createElementNS("http://www.w3.org/2000/svg", "path")
  arcLine.setAttribute("id", `arc-${blockID}-quiltSeam`)
  arcLine.setAttribute("stroke", "white")
  arcLine.setAttribute("fill", "none")
  arcLine.setAttribute("opacity", .6)
  arcLine.setAttribute("stroke-dasharray", "2 3")
  arcLine.setAttribute("d", `M0 ${blockDimension + radius} 
                              a${radius} ${radius} 0 0 0 ${radius} -${radius}
                              a${blockDimension - radius} ${blockDimension - radius} 0 0 1 ${blockDimension - radius} ${-blockDimension + radius}
                              a${blockDimension - radius} ${blockDimension - radius} 0 0 1 ${blockDimension - radius} ${blockDimension - radius}
                              a${radius} ${radius} 0 0 0 ${radius} ${radius}`)

  return arcLine;
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


drawQuilt("none")