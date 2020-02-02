function mod(n, m) {
  return ((n % m) + m) % m;
}

class Bot {
    constructor(balls, steps) {
        this.balls_over_time = Array(balls.length).fill(0)
									.map(a => Array(steps))
		
        this.steps = steps

        this.buffer = 1
		
		this.time = 0
		
        this.first_update = true

        this.graph = createGraph();
    }

    update_balls() {
		if (this.first_update) {
			for (var bi = 0; bi < balls.length; bi++) {
				let ball_clone = Object.assign(Object.create(Object.getPrototypeOf(balls[bi])), balls[bi]);

				for (var ti = 0; ti < this.steps; ti++) {
					this.balls_over_time[bi][ti] = Object.assign(Object.create(Object.getPrototypeOf(ball_clone)), ball_clone);
					ball_clone.update()
				}
			}
		}
		let future_ti = mod(this.time - 1, this.steps)
		let before_future_ti = mod(this.time - 2, this.steps)
		for (var bi = 0; bi < this.balls_over_time.length; bi++) {
			let ball_clone = Object.assign(Object.create(Object.getPrototypeOf(this.balls_over_time[bi][before_future_ti])), this.balls_over_time[bi][before_future_ti]);
			ball_clone.update()
			this.balls_over_time[bi][future_ti] = ball_clone
		}
		
    }

    calc_unsafe_ball(ti, bi, player) {
        let ball = this.balls_over_time[bi][ti]
    
        let r = ball.r + this.buffer
        let x1 = undefined
        let x2 = undefined
        let player_y = height - player.s

        if (ball.y >= player_y) {
            x1 = ball.x - r
            x2 = ball.x + r
        }
        else {
            let a = Math.pow(r, 2) - Math.pow(player_y - ball.y, 2)

            if (a < 0) {
                return
            }

            a = Math.sqrt(a)
            
            x1 = ball.x - a
            x2 = ball.x + a
        }

        x1 -= player.s

        x1 = min([max([x1, 0]), width - 1])
        x2 = min([max([x2, 0]), width - 1])

        x1 = Math.floor(x1)
        x2 = Math.ceil(x2)
        
        for (var ui = x1; ui <= x2; ui++) {
            this.unsafe[ti][ui] = true;
        }
    }

    calc_unsafe(player) {
        if (this.first_update) {
            this.unsafe = Array(this.steps).fill(0)
                            .map(a => Array(width).fill(false));
            
            for (var ti = 0; ti < this.unsafe.length; ti++) {
                for (var ui = width - player.s; ui < width; ui++) {
                    this.unsafe[ti][ui] = true;
                }
            }

            for (var bi = 0; bi < this.balls_over_time.length; bi++) {
                for (var ti = 0; ti < this.steps; ti++) {
                    this.calc_unsafe_ball(ti, bi, player);
                }
            }
        }
        else {
            let future_ti = mod(this.time - 1, this.steps)

            for (var xi = 0; xi < width - player.s; xi++) {
                this.unsafe[future_ti][xi] = false;
            }

            for (var bi = 0; bi < this.balls_over_time.length; bi++) {
                this.calc_unsafe_ball(future_ti, bi, player)
            }
        }
    }
	
	createKey(x, t) {
		return x * this.steps + t
	}

    generateGraph(player) {
        let offsets = [-player.speed, 0, player.speed]
        if (this.first_update) {
            for (var ti = 0; ti < this.steps - 1; ti++) {
                for(var x = 0; x < width; x++) {
                    if (this.unsafe[ti][x]) {
                        continue
                    }

                    let from = this.createKey(x, ti);
                    for (let o of offsets) {
                        let xo = x + o
                        let to = this.createKey(xo, ti + 1);
                        let weight = ((o == 0) ? 1 : 2)
                        if (0 <= xo && xo < width && !this.unsafe[ti + 1][xo]) {
                            this.graph.addLink(from, to, {weight: weight})
                        }
                    }
                }
            }

            for(let x = 0; x < width; x++) {
                let from = this.createKey(x, this.steps - 1);
                let to = -1;
                let center = Math.floor(width / 2)
                this.graph.addLink(from, to, {weight: Math.abs(x - center) * 1000})
            }
        }
        else {
            this.graph.removeNode(-1);

            let future_ti = mod(this.time - 1, this.steps)
            let before_future_ti = mod(this.time - 2, this.steps)

            for(var x = 0; x < width; x++) {
                this.graph.removeNode(this.createKey(x, future_ti))

                if (this.unsafe[before_future_ti][x]) {
                    continue
                }
                
                let to = this.createKey(x, future_ti);
                for (let o of offsets) {
                    let xo = x + o
                    let from = this.createKey(xo, before_future_ti);
                    let weight = ((o == 0) ? 1 : 2)
                    if (0 <= xo && xo < width && !this.unsafe[future_ti][xo]) {
                        this.graph.addLink(from, to, {weight: weight})
                    }
                }

                let from = this.createKey(x, future_ti);
                to = -1;
                let center = Math.floor(width / 2)
                this.graph.addLink(from, to, {weight: Math.abs(x - center) * 1000})
            }
        }
    }

    findPath(player) {
        let playerNode = this.createKey(player.x, this.time)
        if (!this.graph.hasNode(playerNode)) {
            return
        }
        let pathFinder = ngraphPath.aStar(this.graph, {
            oriented: true,
            // We tell our pathfinder what should it use as a distance function:
            distance(fromNode, toNode, link) {
                // We don't really care about from/to nodes in this case,
                // as link.data has all needed information:
                return link.data.weight;
            }
        });
        let foundPath = pathFinder.find(playerNode, -1);
        this.foundPath = foundPath
        return foundPath
    }

    movePlayer(player) {
		this.update_balls()
		this.calc_unsafe(player)
        this.generateGraph(player)

        this.first_update = false
        this.time = (this.time + 1) % this.steps

        let foundPath = this.findPath(player)
        if (!foundPath) {
            return -1
        }
        let node = foundPath[foundPath.length - 2]
        if (!node) {
            return -1
        }
        let newX = Math.floor(node.id / this.steps)
        if (newX < player.x) {
            player.moveLeft()
        }
        else if (newX > player.x) {
            player.moveRight()
        }
        return 1
    }

    draw(player) {
        let img = createImage(width, this.steps);
        img.loadPixels();
        
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                img.set(x, y, this.unsafe[this.unsafe.length - y - 1][x] ? color('white') : color('black'));
            }
        }

        /*
        for (let x = player.x - 5; x < player.x + 5; x++) {
            for (let y = this.steps - 1; y > this.steps - 3; y--) {
                img.set(x, y, color('green'))
            }
        }
        */

        if (this.foundPath) {
            for (let node of this.foundPath) {
                let x = Math.floor(node.id / this.steps)
				let y = node.id % this.steps
                img.set(x, img.height - y - 1, color('red'))
            }
        }
        
        

        img.updatePixels();
        img.resize(width, Math.floor(height/2));
        image(img, 0, 0);
        
    }
}