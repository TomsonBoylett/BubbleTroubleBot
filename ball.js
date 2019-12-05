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

  collided(player) {
    return collideRectCircle(player.x, player.y, player.s, player.s, this.x, this.y, this.r * 2)
  }
}