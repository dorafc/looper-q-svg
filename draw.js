// draw something
let drawQuilt = () => {
  const blockWidth = 300
  const colCount = 1;
  const rowCount = 1;

  const bgColor = "#140430"
  const arcColors = ['#007d30', '#5fc219', '#e8de1c', '#ff7370', '#c9497e', '#e090bc'] 

  let space = document.getElementById("quilt")
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  quiltSVG.setAttribute("width", blockWidth * colCount)
  quiltSVG.setAttribute("height", blockWidth * rowCount)
  quiltSVG.setAttribute("viewbox", `0 0  ${blockWidth * colCount} ${blockWidth * rowCount}`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // generate blocks
  let block = drawBlock("test", 0, 0, blockWidth, bgColor, arcColors, 0)

  quiltSVG.appendChild(block)
  
  space.appendChild(quiltSVG)
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
    block.setAttribute("transform", `rotate(${rotation} ${dimensions/2} ${dimensions/2})`)
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