class Game {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 480;
        this.canvas.height = 320;
        this.ctx = this.canvas.getContext('2d');
        this.ballRadius = 10;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 30;
        this.dx = 2;
        this.dy = -2;
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
        this.rightPressed = false;
        this.leftPressed = false;
        this.brickRowCount = 3;
        this.brickColumnCount = 5;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.score = 0;
        this.bricks = [];
        for(let c=0; c<this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for(let r=0; r<this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    start() {
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        this.draw();
    }

    keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = true;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = true;
        }
    }

    keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = false;
        }
    }

    collisionDetection() {
        for(let c=0; c<this.brickColumnCount; c++) {
            for(let r=0; r<this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                if(b.status == 1) {
                    if(this.x > b.x && this.x < b.x+this.brickWidth && this.y > b.y && this.y < b.y+this.brickHeight) {
                        this.dy = -this.dy;
                        b.status = 0;
                        this.score++;
                        if(this.score == this.brickRowCount*this.brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBricks() {
        for(let c=0; c<this.brickColumnCount; c++) {
            for(let r=0; r<this.brickRowCount; r++) {
                if(this.bricks[c][r].status == 1) {
                    let brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                    let brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    drawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: "+this.score, 8, 20);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawScore();
        this.collisionDetection();

        if(this.x + this.dx > this.canvas.width-this.ballRadius || this.x + this.dx < this.ballRadius) {
            this.dx = -this.dx;
        }
        if(this.y + this.dy < this.ballRadius) {
            this.dy = -this.dy;
        } else if(this.y + this.dy > this.canvas.height-this.ballRadius) {
            if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                this.dy = -this.dy;
            }
            else {
                alert("GAME OVER");
                document.location.reload();
            }
        }

        if(this.rightPressed && this.paddleX < this.canvas.width-this.paddleWidth) {
            this.paddleX += 7;
        }
        else if(this.leftPressed && this.paddleX > 0) {
            this.paddleX -= 7;
        }

        this.x += this.dx;
        this.y += this.dy;
        requestAnimationFrame(this.draw.bind(this));
    }

    reset() {
        document.location.reload();
    }
}
