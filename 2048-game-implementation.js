class Game {
    constructor(container) {
        this.container = container;
        this.size = 4;
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
    }

    start() {
        this.addNumber();
        this.addNumber();
        this.updateDisplay();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    updateDisplay() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(${this.size}, 1fr); gap: 10px; width: 400px; height: 400px;">
                ${this.grid.flat().map(value => `
                    <div class="tile" style="background-color: ${this.getTileColor(value)}; color: ${value > 4 ? '#f9f6f2' : '#776e65'}; display: flex; justify-content: center; align-items: center; font-size: 2em; font-weight: bold;">
                        ${value || ''}
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 20px;">Score: ${this.score}</div>
        `;
    }

    getTileColor(value) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[value] || '#cdc1b4';
    }

    addNumber() {
        const emptyTiles = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyTiles.push({i, j});
                }
            }
        }
        if (emptyTiles.length > 0) {
            const {i, j} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    handleKeyPress(event) {
        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }
        if (moved) {
            this.addNumber();
            this.updateDisplay();
            if (this.isGameOver()) {
                alert('Game Over! Your score: ' + this.score);
            }
        }
    }

    moveUp() {
        return this.move((col) => {
            let newCol = col.filter(val => val !== 0);
            for (let i = 0; i < newCol.length - 1; i++) {
                if (newCol[i] === newCol[i + 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i + 1, 1);
                }
            }
            while (newCol.length < this.size) newCol.push(0);
            return newCol;
        });
    }

    moveDown() {
        return this.move((col) => {
            let newCol = col.filter(val => val !== 0);
            for (let i = newCol.length - 1; i > 0; i--) {
                if (newCol[i] === newCol[i - 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i - 1, 1);
                }
            }
            while (newCol.length < this.size) newCol.unshift(0);
            return newCol;
        });
    }

    moveLeft() {
        return this.move((row) => {
            let newRow = row.filter(val => val !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < this.size) newRow.push(0);
            return newRow;
        });
    }

    moveRight() {
        return this.move((row) => {
            let newRow = row.filter(val => val !== 0);
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i - 1, 1);
                }
            }
            while (newRow.length < this.size) newRow.unshift(0);
            return newRow;
        });
    }

    move(callback) {
        const originalGrid = JSON.stringify(this.grid);
        for (let i = 0; i < this.size; i++) {
            let column = this.grid.map(row => row[i]);
            let newColumn = callback(column);
            for (let j = 0; j < this.size; j++) {
                this.grid[j][i] = newColumn[j];
            }
        }
        return originalGrid !== JSON.stringify(this.grid);
    }

    isGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) return false;
                if (i < this.size - 1 && this.grid[i][j] === this.grid[i + 1][j]) return false;
                if (j < this.size - 1 && this.grid[i][j] === this.grid[i][j + 1]) return false;
            }
        }
        return true;
    }
}
