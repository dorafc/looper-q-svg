// draw something
let drawSomething = () => {
  let space = document.getElementById("quilt")
  let quiltSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  let block = document.createElementNS("http://www.w3.org/2000/svg", "g")
  let piece = document.createElementNS("http://www.w3.org/2000/svg", "path")

  quiltSVG.setAttribute("height", 100)
  quiltSVG.setAttribute("width", 100)
  quiltSVG.setAttribute("viewbox", `0 0 100 100`)
  quiltSVG.setAttribute("id", "quiltSVG")

  // replace with parameters
  const fabricColor = "#140430"

  piece.setAttribute("id", "test-piece")
  piece.setAttribute("fill", fabricColor)
  // piece.setAttribute("d", "M0 0 l0 100 l100 0 l0 -100Z")
  piece.setAttribute("d", "M0 0 l0 100 l100 0 l0 -100Z")

  block.appendChild(piece)
  quiltSVG.appendChild(block)
  space.appendChild(quiltSVG)
}


// draw the curved corner piece
let drawConvexCorner = () => {

}


drawSomething()