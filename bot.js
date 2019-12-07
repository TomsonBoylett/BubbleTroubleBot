class Bot {
    constructor(no_balls, steps, skip=1) {
        this.balls = Array(no_balls).fill(0)
                        .map(a => Array(steps))

        this.steps = steps
        this.skip = skip

        this.buffer = 5
    }

    update(balls) {
        if (balls.length != this.balls.length) {
            return
        }

        for (var bi = 0; bi < this.balls.length; bi++) {
            let ball_clone = Object.assign(Object.create(Object.getPrototypeOf(balls[bi])), balls[bi]);

            for (var ti = 0; ti < this.steps; ti++) {
                this.balls[bi][ti] = {...ball_clone}
                for (var si = 0; si < this.skip; si++) {
                    ball_clone.update()
                }
            }
        }
    }

    calc_unsafe(player) {
        let unsafe = Array(this.steps).fill(0)
                        .map(a => Array(width).fill(false));
        
        for (var ti = 0; ti < unsafe.length; ti++) {
            for (var ui = width - player.s; ui < width; ui++) {
                unsafe[ti][ui] = true;
            }
        }
        
        for (var bi = 0; bi < this.balls.length; bi++) {
            for (var ti = 0; ti < this.steps; ti++) {
                let ball = this.balls[bi][ti]

                ball.r += this.buffer

                let x1 = undefined
                let x2 = undefined

                if (ball.y >= player.y) {
                    x1 = ball.x - ball.r
                    x2 = ball.x + ball.r
                }
                else {
                    let a = Math.pow(ball.r, 2) - Math.pow(player.y - ball.y, 2)

                    if (a < 0) {
                        continue
                    }

                    a = Math.sqrt(a)
                    
                    x1 = ball.x - a
                    x2 = ball.x + a
                }

                x1 -= player.s

                x1 = min([max([x1, 0]), width - 1])
                x2 = min([max([x2, 0]), width - 1])

                x1 = Math.round(x1)
                x2 = Math.round(x2)
                
                for (var ui = x1; ui <= x2; ui++) {
                    unsafe[ti][ui] = true;
                }
            }
        }
        // console.log(unsafe[0].filter(v => v).length)
        this.unsafe = unsafe
    }

    generate_graph(player) {
        var graph = createGraph();

        let offsets = [-player.speed, 0, player.speed]

        for (var ti = 0; ti < this.steps - 1; ti++) {
            for(var x = 0; x < width; x++) {
                if (this.unsafe[ti][x]) {
                    continue
                }

                let from = ti + ',' + x;
                let to = (ti + 1) + ',';
                for (let o of offsets) {
                    let xo = x + o
                    if (0 <= xo && xo < width && !this.unsafe[ti + 1][xo]) {
                        graph.addLink(from, to + xo)
                    }
                }
            }
        }

        for(let x = 0; x < width; x++) {
            let from = (this.steps - 1) + ',' + x;
            let to = 'goal';
            graph.addLink(from, to)
        }

        let playerNode = 0 + ',' + player.x
        if (graph.hasNode(playerNode)) {
            let pathFinder = ngraphPath.nba(graph);
            let foundPath = pathFinder.find(0 + ',' + player.x, 'goal');
            this.foundPath = foundPath
        }
    }

    movePlayer(player) {
        let newX = this.foundPath[this.foundPath.length - 2].id.split(',')[1]
        if (newX < player.x) {
            player.moveLeft()
        }
        else if (newX > player.x) {
            player.moveRight()
        }
    }

    draw(player) {
        
        let img = createImage(width, this.steps);
        img.loadPixels();
        
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                img.set(x, y, this.unsafe[this.unsafe.length - y - 1][x] ? color('white') : color('black'));
            }
        }

        for (let x = player.x - 20; x < player.x + 20; x++) {
            for (let y = this.steps - 1; y > this.steps - 3; y--) {
                img.set(x, y, color('green'))
            }
        }

        for (let node of this.foundPath) {
            let pos = node.id.split(',')
            img.set(pos[1], img.height - pos[0] - 1, color('red'))
        }
        

        img.updatePixels();
        img.resize(width, Math.floor(height/2));
        image(img, 0, 0);
        
    }
}