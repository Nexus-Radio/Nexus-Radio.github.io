class Game {
    constructor(container) {
        this.container = container;
        this.words = ['javascript', 'python', 'html', 'css', 'react', 'node'];
        this.word = '';
        this.guessedLetters = [];
        this.remainingGuesses = 6;
    }

    start() {
        this.word = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessedLetters = [];
        this.remainingGuesses = 6;
        this.updateDisplay();

        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const keyboardHTML = alphabet.map(letter => 
            `<button class="letter-button" style="margin: 2px;">${letter}</button>`
        ).join('');

        this.container.innerHTML += `
            <div id="keyboard" style="margin-top: 20px;">
                ${keyboardHTML}
            </div>
        `;

        this.container.querySelectorAll('.letter-button').forEach(button => {
            button.addEventListener('click', () => this.guessLetter(button.textContent));
        });
    }

    updateDisplay() {
        const wordDisplay = this.word
            .split('')
            .map(letter => this.guessedLetters.includes(letter) ? letter : '_')
            .join(' ');

        this.container.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 20px;">${wordDisplay}</div>
            <div>Remaining guesses: ${this.remainingGuesses}</div>
            <div id="message"></div>
        `;
    }

    guessLetter(letter) {
        if (this.guessedLetters.includes(letter)) return;

        this.guessedLetters.push(letter);
        if (!this.word.includes(letter)) {
            this.remainingGuesses--;
        }

        this.updateDisplay();

        if (this.checkWin()) {
            this.container.querySelector('#message').textContent = 'Congratulations! You won!';
        } else if (this.remainingGuesses === 0) {
            this.container.querySelector('#message').textContent = `Game over. The word was: ${this.word}`;
        }

        const button = this.container.querySelector(`button:contains('${letter}')`);
        if (button) button.disabled = true;
    }

    checkWin() {
        return this.word.split('').every(letter => this.guessedLetters.includes(letter));
    }

    reset() {
        this.start();
    }
}
