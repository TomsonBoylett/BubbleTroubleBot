gravity = 0.3;

balls = [
  new Ball(0, 400, 10, gravity, 10, 0),
  new Ball(0, 390, 10, gravity, 9, 0),
  new Ball(0, 380, 10, gravity, 8, 0),
  new Ball(0, 370, 10, gravity, 7, 0),
  new Ball(0, 360, 10, gravity, 6, 0),
  new Ball(0, 350, 10, gravity, 5, 0),
  new Ball(0, 340, 10, gravity, 4, 0),
  new Ball(0, 330, 10, gravity, 3, 0),
  new Ball(0, 320, 10, gravity, 2, 0),
  new Ball(0, 350, 30, gravity, 5, 0),
]

player = new Player(300, 50);

bot = new Bot(balls.length, 60, 1);

function setup() {
  createCanvas(600, 600);
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
  bot.generate_graph(player)
  bot.movePlayer(player)
  bot.draw(player)
}
