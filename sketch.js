let mySound, isMusicPlaying = false;

// General settings
let boxSize = 60, characterSize = 60, obstacleHei = 50, obstacleSpeed = 5;
let boxX1, boxY1, score1 = 0, boxX2, boxY2, score2 = 0, score3 = 0;
let characterX, characterY, obstacleWid, obstacles = [], game3Over = false;
let style = 0, state = 0;

// Images
let menuImg, bgImg = [], introImg = [], characterImg, obstacleImg;

// Preload assets
function preload() {
  menuImg = loadImage("menu.JPG");
  characterImg = loadImage("character.png");
  obstacleImg = loadImage("obstacle.png");
  for (let i = 0; i < 4; i++) {
    bgImg[i] = loadImage("game" + i + ".JPG");
    introImg[i] = loadImage("intro" + i + ".JPG");
  }
  mySound = loadSound('epic-mystic-motion-resonance-274284.mp3');
}

// Setup the canvas and assets
function setup() {
  createCanvas(600, 600);
  characterImg.resize(boxSize / 0.4, 0);
  obstacleImg.resize(0, obstacleHei * 1.5);
  obstacleWid = obstacleImg.width;
  menuImg.resize(width, height);
  for (let i = 0; i < 4; i++) {
    bgImg[i].resize(width, height);
    introImg[i].resize(width, height);
  }
  resetBox_game1();
  resetBox_game2();
  reset_game3();
  imageMode(CENTER);
}

// Draw function to manage game states
function draw() {
  if (state === 0) {
    image(menuImg, width / 2, height / 2);
  } else if (state === 1) {
    image(introImg[style], width / 2, height / 2);
  } else if (state === 2) {
    if (style === 0) {
      image(bgImg[0], width / 2, height / 2);
    } else if (style === 1) {
      game1();
    } else if (style === 2) {
      game2();
    } else if (style === 3) {
      game3();
    }
  }
}

// Mouse pressed actions
function mousePressed() {
  print(mouseX, mouseY);
  if (state === 0) {
    handleMenuClicks();
  } else if (state === 1) {
    startGame();
  } else {
    handleGameClicks();
  }
  if (!isMusicPlaying) {
    mySound.loop();
    isMusicPlaying = true;
  }
}

// Start the game
function startGame() {
  if (dist(mouseX, mouseY, 526, 565) < 26) state = 2;
}

// Handle clicks on the menu
function handleMenuClicks() {
  if (mouseX > 28 && mouseX < 573 && mouseY > 105 && mouseY < 150) {
    style = 0;
    state = 1;
  }
  if (dist(mouseX, mouseY, 92, 550) < 20) {
    style = 1;
    state = 1;
    score1 = 0;
    resetBox_game1();
  }
  if (dist(mouseX, mouseY, 300, 550) < 20) {
    style = 2;
    state = 1;
    score2 = 0;
    resetBox_game2();
  }
  if (dist(mouseX, mouseY, 510, 550) < 20) {
    style = 3;
    state = 1;
    score3 = 0;
    reset_game3();
  }
}

// Handle clicks during gameplay
function handleGameClicks() {
  if (style === 0 && dist(mouseX, mouseY, 50, 565) < 22) state = 0;
  if (style === 1) checkGame1Click();
  if (style === 2) checkGame2Click();
  if (style === 3) backtomenu();
}

// Check clicks in game 1
function checkGame1Click() {
  if (mouseX > boxX1 && mouseX < boxX1 + boxSize && mouseY > boxY1 && mouseY < boxY1 + boxSize) {
    score1++;
    resetBox_game1();
  } else {
    backtomenu();
  }
}

// Check clicks in game 2
function checkGame2Click() {
  if (mouseX > boxX2 && mouseX < boxX2 + boxSize && mouseY > boxY2 && mouseY < boxY2 + boxSize) {
    score2++;
    resetBox_game2();
  } else {
    backtomenu();
  }
}

// Back to menu
function backtomenu() {
  if (dist(mouseX, mouseY, 523, 51) < 40) state = 0;
}

// Game 1 logic
function game1() {
  image(bgImg[1], width / 2, height / 2);
  image(characterImg, boxX1 + boxSize / 2, boxY1 + boxSize / 2);
  displayScore("Score: " + score1, 20, 30);
}

function resetBox_game1() {
  boxX1 = random(width - boxSize);
  boxY1 = random(height - boxSize);
}

// Game 2 logic
function game2() {
  image(bgImg[2], width / 2, height / 2);
  image(characterImg, boxX2 + boxSize / 2, boxY2 + boxSize / 2);
  boxY2 += 2;
  if (boxY2 > height) resetBox_game2();
  displayScore("Score: " + score2, 10, 30);
}

function resetBox_game2() {
  boxX2 = floor(random(width - boxSize));
  boxY2 = 0 - boxSize;
}

// Game 3 logic
function game3() {
  if (!game3Over) {
    image(bgImg[3], width / 2, height / 2);
    image(characterImg, characterX, characterY);
    updateObstacles();
    moveCharacter();
    generateObstacles();
  }
}

function reset_game3() {
  characterX = width / 2;
  characterY = height - 2 * characterSize;
  game3Over = false;
  obstacles = [];
}

function updateObstacles() {
  for (let obstacle of obstacles) {
    image(obstacleImg, obstacle.x, obstacle.y);
    obstacle.y += obstacleSpeed;
    if (checkCollision(obstacle)) gameOver();
    if (obstacle.y > height) {
      score3++;
      obstacles.splice(obstacles.indexOf(obstacle), 1);
    }
  }
}

function moveCharacter() {
  if (keyIsDown(LEFT_ARROW) && characterX > 0) characterX -= 5;
  if (keyIsDown(RIGHT_ARROW) && characterX < width - characterSize) characterX += 5;
}

function generateObstacles() {
  if (frameCount % 30 === 0) {
    let obstacleX = random(width - obstacleWid);
    obstacles.push({ x: obstacleX, y: 0 });
  }
}

function checkCollision(obstacle) {
  return (
    characterX < obstacle.x + obstacleWid &&
    characterX + obstacleWid > obstacle.x &&
    characterY < obstacle.y + obstacleHei &&
    characterY + obstacleHei > obstacle.y
  );
}

function gameOver() {
  textSize(32);
  fill(0, 0, 255);
  text("Game Over", width / 2 - 100, height / 2 - 16);
  text("Score: " + score3, width / 2 - 70, height / 2 + 20);
  game3Over = true;
}


// Utility function to display score
function displayScore(scoreText, x, y) {
  textSize(20);
  fill(255);
  text(scoreText, x, y);
}
