canvasWidth = 100;
canvasHeight = 200;
gravity = 0.3;

balls = []

for (let i = 0; i < 10; i++) {
  balls.push(new Ball(rand(0, canvasWidth), rand(canvasHeight * 0.5, canvasHeight * 0.9), rand(2, 5), gravity, rand(-3, 3), rand(-3, 3)))
}

player = new Player(Math.floor(canvasWidth / 2), 5);

bot = new Bot(balls.length, 60, 1);

function rand(a, b) {
  return a + Math.random() * Math.abs(a - b + 1);
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
}

function draw() {
  background(220);

  if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft();
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.moveRight();
  }

  fill('white');
  collided = false;
  for (b of balls) {
    if (player.collided(b)) {
      collided = true;
    }

    b.update();
    b.draw();
  }

  bot.update(balls);
  bot.calc_unsafe(player);
  result = bot.movePlayer(player)
  bot.draw(player)

  if (result == -1) {
    fill('blue');
  }

  if (collided) {
    fill('red');
  }
  player.draw();

}
