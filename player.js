class Player {

    constructor(x, s) {
        self.x = x
        self.s = s
        self.speed = 5
    }

    draw() {
        self.y = height - self.s;
        square(self.x, self.y, self.s)
    }

    moveLeft() {
        self.x -= self.speed

        if (self.x < 0) {
            self.x = 0
        }
    }

    moveRight() {
        self.x += self.speed

        if (self.x > width - self.s) {
            self.x = width - self.s
        }
    }

    collided(ball) {
        return ball.collided(self)
    }
}