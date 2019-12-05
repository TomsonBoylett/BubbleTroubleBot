gravity = 0.3

balls = [
  new Ball(0, 100, 10, gravity, 3, -5),
  new Ball(200, 200, 10, gravity, 3, 0)
]

player = new Player(300, 50)

function setup() {
  createCanvas(600, 300);
  frameRate(60);
}

function draw() {
  background(220);

  if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft()
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.moveRight()
  }

  collided = false
  for (b of balls) {
    if (player.collided(b)) {
      collided = true
    }

    b.update();
    b.draw();
  }

  if (collided) {
    fill('red')
  }
  player.draw()

  // fill('white')
  
}
