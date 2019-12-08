gravity = 0.3;

balls = []

for (let i = 0; i < 6; i++) {
  balls.push(new Ball(rand(5, 95), rand(5, 50), 5, gravity, rand(-3, 3), rand(-3, 3)))
}

player = new Player(50, 5);

bot = new Bot(balls.length, 120, 1);

function rand(a, b) {
  return a + Math.random() * Math.abs(a - b + 1);
}

function setup() {
  createCanvas(100, 100);
  frameRate(60);
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

  if (collided) {
    fill('red');
  }
  player.draw();

  bot.update(balls);
  bot.calc_unsafe(player);
  bot.movePlayer(player)
  // bot.draw(player)
}
