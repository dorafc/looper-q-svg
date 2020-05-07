// draw something
let drawSomething = () => {
  let space = document.getElementById("quilt")
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  quiltSVG.setAttribute("height", 800)
  quiltSVG.setAttribute("width", 800)
  quiltSVG.setAttribute("viewbox", `0 0 800 800`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // generate blocks
  let block = drawBlock("test")

  quiltSVG.appendChild(block)
  space.appendChild(quiltSVG)
}

// draw a block
let drawBlock = (id) => {
  // future parameters: rotation, colors, id
  let bgColor = "#140430"
  let arcColors = ['#007d30', '#5fc219', '#e8de1c', '#ff7370', '#c9497e', '#e090bc']
  let block = document.createElementNS("http://www.w3.org/2000/svg", "g")
  
  // generate corner piece
  let corner = drawConvexCorner(bgColor, 0, 0, 100, id)
  block.appendChild(corner)

  let arcs = arcColors.map((color, i) => {
    return drawArc(color, 100 * (i+1), 0, 100, i + 1, id)
  })

  // block.appendChild(arcs)
  arcs.forEach(arc => {
    block.appendChild(arc)
  })

  let endCorner = drawConcaveCorner(bgColor, 700, 0, 100, id)
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

let drawConcaveCorner = (color, startX, startY, dimension, blockID) => {
  let piece = document.createElementNS("http://www.w3.org/2000/svg", "path")
  piece.setAttribute("id", `end-corner-${blockID}`)
  piece.setAttribute("fill", color)
  piece.setAttribute("d",   `M${startX} ${startY} 
                            l${dimension} 0
                            l0 800
                            l-800 0
                            l0 -${dimension}
                            a700 700 0 0 0 700 -700Z`)
  return piece
}


drawSomething()