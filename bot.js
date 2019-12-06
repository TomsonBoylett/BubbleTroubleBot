class Bot {
    constructor(no_balls, steps, skip=1) {
        this.balls = Array(no_balls).fill(0)
                        .map(a => Array(steps).fill(0)
                        .map(b => Array(2)));
        
        this.skip = skip
    }

    update(balls) {
        if (balls.length != this.balls.length) {
            return
        }

        for (var bi = 0; bi < this.balls.length; bi++) {
            let ball_clone = Object.assign(Object.create(Object.getPrototypeOf(balls[bi])), balls[bi]);

            for (var ti = 0; ti < this.balls[bi].length; ti++) {
                this.balls[bi][ti][0] = ball_clone.x
                this.balls[bi][ti][1] = ball_clone.y
                for (var si = 0; si < this.skip; si++) {
                    ball_clone.update()
                }
            }
        }
    }

    draw() {
        for (var bi = 0; bi < this.balls.length; bi++) {
            for (var ti = 0; ti < this.balls[bi].length - 1; ti++) {
                let p1 = this.balls[bi][ti]
                let p2 = this.balls[bi][ti + 1]
                line(p1[0], p1[1], p2[0], p2[1])
            }
        }
    }
}