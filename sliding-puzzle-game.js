class Game {
    constructor(container) {
        this.container = container;
        this.size = 3;
        this.tiles = Array.from({length: this.size * this.size - 1}, (_, i) => i + 1);
        this.tiles.push(null);
        this.shuffleTiles();
    }

    start() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(${this.size}, 1fr); gap: 5px; width: 300px; height: 300px;">
                ${this.tiles.map((tile, index) => `
                    <div class="tile" style="background-color: ${tile ? '#ddd' : 'transparent'}; display: flex; justify-content: center; align-items: center; font-size: 2em; cursor: pointer;" data-index="${index}">
                        ${tile || ''}
                    </div>
                `).join('')}
            </div>
        `;
        this.container.querySelectorAll('.tile').forEach(tile => {
            tile.addEventListener('click', () => this.moveTile(parseInt(tile.dataset.index)));
        });
    }

    shuffleTiles() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
        if (!this.isSolvable()) this.shuffleTiles();
    }

    isSolvable() {
        let inversions = 0;
        for (let i = 0; i < this.tiles.length - 1; i++) {
            for (let j = i + 1; j < this.tiles.length; j++) {
                if (this.tiles[i] && this.tiles[j] && this.tiles[i] > this.tiles[j]) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    }

    moveTile(index) {
        const emptyIndex = this.tiles.indexOf(null);
        if (this.isAdjacent(index, emptyIndex)) {
            [this.tiles[index], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[index]];
            this.start();
            if (this.isSolved()) {
                setTimeout(() => alert('Félicitations ! Vous avez résolu le puzzle !'), 100);
            }
        }
    }

    isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / this.size);
        const col1 = index1 % this.size;
        const row2 = Math.floor(index2 / this.size);
        const col2 = index2 % this.size;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    isSolved() {
        for (let i = 0; i < this.tiles.length - 1; i++) {
            if (this.tiles[i] !== i + 1) return false;
        }
        return true;
    }

    reset() {
        this.shuffleTiles();
        this.start();
    }
}
