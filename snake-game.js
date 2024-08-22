class Game {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        this.snake = [{x: 200, y: 200}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameLoop = null;
    }

    start() {
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        document.addEventListener('keydown', this.changeDirection.bind(this));
        this.gameLoop = setInterval(this.update.bind(this), 100);
    }

    update() {
        const head = {...this.snake[0]};
        switch(this.direction) {
            case 'up': head.y -= 10; break;
            case 'down': head.y += 10; break;
            case 'left': head.x -= 10; break;
            case 'right': head.x += 10; break;
        }
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
        this.checkCollision();
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'green';
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, 10, 10);
        });
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x, this.food.y, 10, 10);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * 40) * 10,
            y: Math.floor(Math.random() * 40) * 10
        };
    }

    changeDirection(event) {
        const keyMap = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right'
        };
        const newDirection = keyMap[event.key];
        if (newDirection) {
            const opposites = {up: 'down', down: 'up', left: 'right', right: 'left'};
            if (newDirection !== opposites[this.direction]) {
                this.direction = newDirection;
            }
        }
    }

    checkCollision() {
        const head = this.snake[0];
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height) {
            this.gameOver();
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Game Over!', 130, 200);
    }

    reset() {
        clearInterval(this.gameLoop);
        this.snake = [{x: 200, y: 200}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.start();
    }
}
