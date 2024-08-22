class Game {
    constructor(container) {
        this.container = container;
        this.board = this.generateSudoku();
        this.solution = JSON.parse(JSON.stringify(this.board));
        this.solveSudoku(this.solution);
        this.removeNumbers();
    }

    start() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(9, 1fr); gap: 1px; width: 360px;">
                ${this.board.flat().map((cell, index) => `
                    <input type="number" min="1" max="9" value="${cell || ''}" 
                           style="width: 40px; height: 40px; text-align: center; font-size: 1.2em;"
                           ${cell ? 'readonly' : ''} data-index="${index}">
                `).join('')}
            </div>
            <button id="check" style="margin-top: 10px;">Vérifier</button>
        `;
        document.getElementById('check').addEventListener('click', () => this.checkSolution());
    }

    generateSudoku() {
        return Array(9).fill().map(() => Array(9).fill(0));
    }

    solveSudoku(board) {
        const emptyCell = this.findEmptyCell(board);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }
        return true;
    }

    removeNumbers() {
        const cellsToRemove = 40;
        for (let i = 0; i < cellsToRemove; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (this.board[row][col] === 0);
            this.board[row][col] = 0;
        }
    }

    checkSolution() {
        const inputs = this.container.querySelectorAll('input');
        let correct = true;
        inputs.forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            if (parseInt(input.value) !== this.solution[row][col]) {
                input.style.backgroundColor = '#ffcccc';
                correct = false;
            } else {
                input.style.backgroundColor = '#ffffff';
            }
        });
        if (correct) alert('Félicitations ! Vous avez résolu le Sudoku !');
    }

    reset() {
        this.board = this.generateSudoku();
        this.solution = JSON.parse(JSON.stringify(this.board));
        this.solveSudoku(this.solution);
        this.removeNumbers();
        this.start();
    }
}
