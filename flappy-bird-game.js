class Game {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
        this.bird = { x: 50, y: 300, velocity: 0 };
        this.pipes = [];
        this.gravity = 0.5;
        this.score = 0;
        this.gameLoop = null;
    }

    start() {
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.jump();
        });
        this.gameLoop = setInterval(() => this.update(), 20);
    }

    update() {
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < 250) {
            this.pipes.push(this.generatePipe());
        }

        this.pipes.forEach(pipe => {
            pipe.x -= 2;
            if (this.checkCollision(pipe)) {
                this.gameOver();
            }
            if (pipe.x + pipe.width < this.bird.x && !pipe.passed) {
                this.score++;
                pipe.passed = true;
            }
        });

        this.pipes = this.pipes.filter(pipe => pipe.x + pipe.width > 0);

        this.draw();

        if (this.bird.y > this.canvas.height) {
            this.gameOver();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bird
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, 20, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw pipes
        this.ctx.fillStyle = 'green';
        this.pipes.forEach(pipe => {
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            this.ctx.fillRect(pipe.x, pipe.bottom, pipe.width, this.canvas.height - pipe.bottom);
        });

        // Draw score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    jump() {
        this.bird.velocity = -10;
    }

    generatePipe() {
        const gap = 200;
        const minHeight = 50;
        const maxHeight = this.canvas.height - gap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        return {
            x: this.canvas.width,
            top: height,
            bottom: height + gap,
            width: 50,
            passed: false
        };
    }

    checkCollision(pipe) {
        return (
            this.bird.x + 20 > pipe.x &&
            this.bird.x - 20 < pipe.x + pipe.width &&
            (this.bird.y - 20 < pipe.top || this.bird.y + 20 > pipe.bottom)
        );
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.fillText('Game Over', 100, 300);
    }

    reset() {
        this.bird = { x: 50, y: 300, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        clearInterval(this.gameLoop);
        this.start();
    }
}
