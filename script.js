// variable and constants

// music,sounds and direction object of the snake game
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("tools/eat.mp3");
const gameOverSound = new Audio("tools/crash.mp3");
const moveSound = new Audio("tools/changeDirection.mp3");
const musicSound = new Audio("tools/background.mp3");
// modal components start
const btn = document.getElementById("submit");
const modal = document.querySelector(".alert-window");
const closebtn = document.querySelector("#close");
const alertBox = document.getElementById("alert-box");
// modal components end
// game components start
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const highScore = document.getElementById("highscore");
let score = 0;
let speed = 7;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 5, y: 3 };
canPlay = true;

// all functions goes here
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

// remove addEventListener from window to show alert 
function removeListner(e) {
  console.log("remove event called");
  window.removeEventListener("keydown", removeListner);
}

// show alert when snake crash
function showAlert() {
  alertBox.innerHTML = "";
  alertBox.innerHTML =
    "Game Over! Score : " + score + " ,Press ENTER To Play Again.";
  modal.style.display = "block";
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      closebtn.click();
      musicSound.pause();
      removeListner();
      canPlay = false;
      return;
    }
  });
}

function isCollide(snake) {
  //if your crash with yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      speed = 7;
      return true;
    }
  }

  // you creashed with the wall
  if (
    snake[0].x >= 20 ||
    snake[0].x <= 0 ||
    snake[0].y >= 20 ||
    snake[0].y <= 0
  ) {
    speed = 7;
    return true;
  }
}

function gameEngine() {
  // part 1 : update snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    showAlert();

    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreEl.innerHTML = "Score : " + score;
  }

  // if you have eaten the food then increament the score and regenerate the food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      highScore.innerHTML = "High Score :" + hiscoreval;
    }
    scoreEl.innerHTML = "Score : " + score;
    //increase speed of snake as score increases
    if (score > 15 && score <= 20) {
      speed++;
    } else if (score > 20 && score <= 25) {
      score++;
    } else if (score > 25) {
      speed++;
    }
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 18;
    //reallocate location of food randomely
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // part 2: display the snake and food
  // display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//main logic goes here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  highScore.innerHTML = "High Score :" + hiscoreval;
}

window.requestAnimationFrame(main);
if (canPlay) {
  window.addEventListener("keydown", (e) => {
    // inputDir = {x:0 , y:1}; // start the game
    moveSound.play();
    musicSound.play();
    switch (e.key) {
      case "ArrowUp":
        inputDir.x = 0;
        inputDir.y = -1;
        break;

      case "ArrowDown":
        inputDir.x = 0;
        inputDir.y = 1;
        break;

      case "ArrowLeft":
        inputDir.x = -1;
        inputDir.y = 0;
        break;

      case "ArrowRight":
        inputDir.x = 1;
        inputDir.y = 0;
        break;
    }
  });
}

//to close modal on enter
closebtn.onclick = function () {
  modal.style.display = "none";
};
