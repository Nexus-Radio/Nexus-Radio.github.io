class Game {
    constructor(container) {
        this.container = container;
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
    }

    start() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 300px;">
                ${this.board.map((cell, index) => `
                    <div style="width: 100px; height: 100px; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center; font-size: 2em; cursor: pointer;" onclick="game.makeMove(${index})">${cell || ''}</div>
                `).join('')}
            </div>
            <div id="status" style="margin-top: 20px; font-size: 1.5em;"></div>
        `;
    }

    makeMove(index) {
        if (this.board[index] || this.gameOver) return;
        this.board[index] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.checkWinner();
        this.start();
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let pattern of winPatterns) {
            if (this.board[pattern[0]] && 
                this.board[pattern[0]] === this.board[pattern[1]] && 
                this.board[pattern[1]] === this.board[pattern[2]]) {
                this.gameOver = true;
                document.getElementById('status').textContent = `${this.board[pattern[0]]} a gagné !`;
                return;
            }
        }
        if (this.board.every(cell => cell)) {
            this.gameOver = true;
            document.getElementById('status').textContent = "Match nul !";
        }
    }

    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.start();
    }
}
