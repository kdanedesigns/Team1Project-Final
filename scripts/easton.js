// Array of boolean values that correspond to the grid of squares
// true = bomb, false = free
const board = []

// Keep track of game progress
let totalBombs = 0
let gameLost = false

// Keep track of progress so that we do not reveal a square multiple times if it is clicked again
const revealedSquares = new Set()

// Return a random 20% chance of a new square being a bomb
// If the square already exists, check if supplied index correlates to a bomb
function isBomb(gridIndex) {
  if (gridIndex === undefined) return Math.random() < 0.20
  else return board[gridIndex]
}
// Reduce the tracked count of bombs so we know when we win
function decreaseBombs() {
  totalBombs--
  const bombCounter = document.getElementById('bomb-counter')
  bombCounter.innerText = `Bombs Remaining: ${totalBombs}`
}
// Change the color of the revealed square
// If it is a bomb and we directly clicked on it, make us lose
// If it is free, check neighbors if they are a bomb and reveal them
function revealSquare(gridIndex, clicked=true) {
  const gameResult = document.getElementById('game-result')
  const gridSquare = document.getElementById(`gridSquare-${gridIndex}`)

  if (gameLost) return

  if (isBomb(gridIndex)) {
    gridSquare.classList.remove('unknown-space')

    // Only make a bomb explode if the user clicks on it
    // This will happen even if the bomb is already revealed, so they must be extra careful!
    if (clicked) {
      gridSquare.classList.add('dead-space')
      gameResult.innerText = 'You set off a bomb, so you lose!'
      gameLost = true
    } else {
      gridSquare.classList.add('bomb-space')
    }
    decreaseBombs()
  } else {
    if (revealedSquares.has(gridIndex)) return

    gridSquare.classList.remove('unknown-space')
    gridSquare.classList.add('free-space')
  }
  revealedSquares.add(gridIndex)
  // Winning condition: No bombs left to reveal
  if (totalBombs === 0) return gameResult.innerText = 'You revealed all of the bombs! You win!'

  // Check neighbors if they are a bomb
  revealNeighbor(gridIndex)
}
// Make the game eaiser for the player by revealing direct left/right neighbor squares that are a bomb
function revealNeighbor(gridIndex) {
  // Cannot check if they click the first or last square of the board (missing a second neighbor in both cases)
  if (gridIndex === 0 || gridIndex === 16*16) return

  // Check right neighbor
  if(isBomb(gridIndex + 1)) {
    if (revealedSquares.has(gridIndex + 1)) return
    revealSquare(gridIndex + 1, false)
  }
  // Check left neighbor
  if(isBomb(gridIndex - 1)) {
    if (revealedSquares.has(gridIndex - 1)) return
    revealSquare(gridIndex - 1, false)
  }
}
// Create an element for the gridSquare and attach it to the board
function appendElement(gridIndex) {
  const grid = document.getElementById('board-grid')
  const gridSquare = document.createElement('div')

  // Set all of the element values
  gridSquare.id = `gridSquare-${gridIndex}`
  gridSquare.setAttribute('data-gridIndex', gridIndex)
  gridSquare.classList.add('board-space', 'unknown-space')
  // Reveal the square type when it is clicked
  gridSquare.onclick = () => { revealSquare(gridIndex, true) }

  // Attach element to the board
  grid.appendChild(gridSquare)
}
// The grid is 16x16
// We create each square and ranomly assign its type (bomb or free)
function generateGrid() {
  const startButton = document.getElementById('start-button')
  const instructions = document.getElementById('instructions')

  // Hide starter actions/info
  startButton.style.display = 'none'
  instructions.style.display = 'none'

  // 16 row height, 16 column width
  for (i=0; i<(16*16); i++) {
    // Function result value must be the same for the next two expressions
    const squareIsBomb = isBomb()

    // Add square type to main array
    board.push(squareIsBomb)
    if (squareIsBomb) totalBombs++
    
    // Create the actual viewable human product
    appendElement(i)
  }

  // Let the player know how close they are to winning
  const bombCounter = document.getElementById('bomb-counter')
  bombCounter.innerText = `Bombs Remaining: ${totalBombs}`
}
