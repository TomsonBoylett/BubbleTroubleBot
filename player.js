class Player {

    constructor(x, s) {
        this.x = x
        this.s = s
        this.speed = 5
    }

    draw() {
        this.y = height - this.s;
        square(this.x, this.y, this.s)
    }

    moveLeft() {
        this.x -= this.speed

        if (this.x < 0) {
            this.x = 0
        }
    }

    moveRight() {
        this.x += this.speed

        if (this.x > width - this.s) {
            this.x = width - this.s
        }
    }

    collided(ball) {
        return ball.collided(this)
    }
}