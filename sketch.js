class Ball {
  constructor(x, y, r, g, vx, vy) {
    this.x = x
    this.y = y
    this.r = r
    this.g = g
    this.vx = vx
    this.vy = vy

    this.max_vy = undefined
  }

  update() {
    this.vy += this.g
    this.x += this.vx
    this.y += this.vy

    if (this.y > height - this.r) {
      if (!this.max_vy) {
        this.max_vy = this.vy
      }
      
      this.vy = this.max_vy * Math.sign(this.vy) * -1
      this.y = height - this.r
    }

    if (this.x > width - this.r) {
      this.vx *= -1
      this.x = width - this.r
    }

    if (this.x < this.r) {
      this.vx *= -1
      this.x = this.r
    }
  }

  draw() {
    circle(this.x, this.y, this.r * 2);
  }
}

gravity = 0.3

balls = [
  new Ball(0, 100, 10, gravity, 3, -5),
  new Ball(200, 200, 10, gravity, 3, 0)
]

function setup() {
  createCanvas(600, 300);
  frameRate(60);
}

function draw() {
  background(220);
  for (b of balls) {
    b.update();
    b.draw();
  }
}