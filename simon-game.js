class Game {
    constructor(container) {
        this.container = container;
        this.sequence = [];
        this.playerSequence = [];
        this.colors = ['red', 'blue', 'green', 'yellow'];
        this.round = 0;
    }

    start() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 300px; height: 300px;">
                ${this.colors.map(color => `
                    <div class="simon-button" style="background-color: ${color}; border-radius: 50%; cursor: pointer;"></div>
                `).join('')}
            </div>
            <div id="status" style="margin-top: 20px;">Appuyez sur une couleur pour commencer</div>
        `;
        this.container.querySelectorAll('.simon-button').forEach((button, index) => {
            button.addEventListener('click', () => this.handleClick(index));
        });
    }

    nextRound() {
        this.round++;
        this.playerSequence = [];
        this.sequence.push(Math.floor(Math.random() * 4));
        this.playSequence();
    }

    playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            this.flash(this.sequence[i]);
            i++;
            if (i >= this.sequence.length) {
                clearInterval(interval);
                this.container.querySelector('#status').textContent = 'Votre tour';
            }
        }, 1000);
    }

    flash(index) {
        const button = this.container.querySelectorAll('.simon-button')[index];
        button.style.opacity = '0.5';
        setTimeout(() => {
            button.style.opacity = '1';
        }, 500);
    }

    handleClick(index) {
        if (this.round === 0) {
            this.nextRound();
            return;
        }
        this.playerSequence.push(index);
        this.flash(index);
        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.gameOver();
            return;
        }
        if (this.playerSequence.length === this.sequence.length) {
            setTimeout(() => this.nextRound(), 1000);
        }
    }

    gameOver() {
        this.container.querySelector('#status').textContent = `Partie terminée! Score: ${this.round}`;
        this.round = 0;
        this.sequence = [];
    }

    reset() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 0;
        this.start();
    }
}
