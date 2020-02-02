canvasWidth = 200;
canvasHeight = 400;
gravity = 0.5;

balls = []
player = null
bot = null

no_of_balls = 10

function intialise_game_state() {
  balls = []

  for (let i = 0; i < no_of_balls; i++) {
    balls.push(new Ball(rand(0, canvasWidth), rand(canvasHeight * 0.5, canvasHeight * 0.9), 2, gravity, rand(-3, 3), rand(-3, 3)))
  }

  player = new Player(Math.floor(canvasWidth / 2), 10);

  bot = new Bot(balls, 120, 1);
}

function rand(a, b) {
  return a + Math.random() * Math.abs(a - b + 1);
}

function setup() {
  intialise_game_state()

  createCanvas(canvasWidth, canvasHeight);
  frameRate(15);

  let no_of_balls_input = createInput('Number of Balls');
  no_of_balls_input.input(function(){
    no_of_balls = parseInt(this.value())
    intialise_game_state()
  })
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
