// let variables from document,
let body = document.body
let gameArea = document.querySelector(".gameArea")

// Global variables,
let player = {}
let playArea = {}
let gameObj
playArea.stats = document.querySelector(".stats")
playArea.main = document.querySelector(".main")
playArea.game = document.querySelector(".game")

// Get arrays from selecting all btn elements of node lists,
playArea.btns = Array.from(document.querySelectorAll(".btn"))
playArea.pages = Array.from(document.querySelectorAll(".page"))

// check the DOM is loaded by browser,
document.addEventListener("DOMContentLoaded", documentLoaded)

// player props moved to startGame() func,

function documentLoaded() {
    console.log("DOM loaded")
    // add class to visible the page,
    playArea.main.classList.add("visible")
    // get json file as variable,
    fetch("./game.json")
        .then((response) => response.json())
        .then((json) => {
            gameObj = json.data
            buildBoard()
        })
}

playArea.btns.forEach((item) => {
    item.addEventListener("click", handleBtns)
});

function handleBtns() {
    if (this.classList.contains("newGame")) {
        startGame()
    }
}

function startGame() {
    // player properties,
    player.score = 0
    player.life = 3

    // Add and remove classes that we start the game,
    playArea.main.classList.remove("visible")
    playArea.game.classList.add("visible")
    player.gameOver = false
    startPop()
}

function buildBoard() {
    // create element for score board,
    playArea.scoreBoard = document.createElement("div")
    playArea.scoreBoard.innerHTML = "Press this button to start the game"
    playArea.scoreBoard.classList.add("scoreBoard")
    playArea.stats.appendChild(playArea.scoreBoard)

    // we set the rows and columns of our game board,
    let rows = 4
    let cols = 4
    let count = 0

    // set the width with cols 408px to the game board and center it, 
    playArea.game.style.width = (cols * 100) + (cols * 2)
    playArea.game.style.margin = "auto"

    //game board creating with loops,
    // column loop,
    for (let y = 0; y < cols; y++) {
        let divMain = document.createElement("div")
        divMain.setAttribute("class", "row")
        divMain.style.width = (cols * 100) + (cols * 2)
        // row loop,
        for (let x = 0; x < rows; x++) {
            let div = document.createElement("div")
            div.setAttribute("class", "pop")
            count++
            div.innerText = count
            div.count = count;
            divMain.appendChild(div)
        }
        playArea.game.appendChild(divMain)
    }
}

// we setup the game pop up while start the game,
function randomUp() {
    const pops = document.querySelectorAll(".pop")
    const index = Math.floor(Math.random() * pops.length)
    if (pops[index].count == playArea.last) {
        return randomUp()
    }
    return pops[index]
}

function startPop() {
    let newPop = randomUp()
    newPop.classList.add("active")
    newPop.addEventListener("click", hitPop)
    // create random time for showing popup,
    const time = Math.round(Math.random() * (1500) + 750)
    //taking game objects from json file value,
    const gameObjVal = Math.floor(Math.random() * gameObj.length)
    // saving all old values as variables bofore set a new one,
    newPop.old = newPop.innerHTML
    newPop.val = gameObj[gameObjVal].value
    newPop.innerHTML = gameObj[gameObjVal].icon + "<br/>" + gameObj[gameObjVal].value

    // setTimeout method for popup the value in game area,
    playArea.inPlay = setTimeout(() => {
        newPop.classList.remove("active")
        newPop.removeEventListener("click", hitPop)
        newPop.innerHTML = newPop.old

        //update life items,
        if (newPop.val > 0) {
            player.life--
            updateScore()
        }

        if (player.life <= 0) {
            gameOver()
        }

        // if player game ove ris false means it continously run,
        if (!player.gameOver) {
            startPop()
        }
    }, time)
}

function hitPop(e) {
    let newPop = e.target
    // after we hit the op it gonna run this code,
    player.score = player.score + newPop.val
    updateScore()
    newPop.classList.remove("active")
    newPop.removeEventListener("click", hitPop)
    newPop.innerHTML = newPop.old
    clearTimeout(playArea.inPlay)

    //if newPop value maybe negative one means,
    if (newPop.val < 0) {
        player.life--
        updateScore()
    }

    if (player.life <= 0) {
        gameOver()
    }

    if (!player.gameOver) {
        startPop()
    }
}

// setup function for update the score,
function updateScore() {
    playArea.scoreBoard.innerHTML = "Score: " + player.score + " Lives: " + player.life
}

//if player lose life,
function gameOver() {
    player.gameOver = true;
    playArea.main.classList.add("visible")
    playArea.game.classList.remove("visible")
    document.querySelector(".newGame").innerHTML = "Try Again!"
}
