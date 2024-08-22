class Game {
    constructor(container) {
        this.container = container;
        this.cards = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.cards = [...this.cards, ...this.cards];
        this.shuffleCards();
        this.selectedCards = [];
        this.matchedCards = [];
    }

    start() {
        this.container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 400px;">
                ${this.cards.map((card, index) => `
                    <div class="card" style="width: 80px; height: 120px; background-color: #ddd; display: flex; justify-content: center; align-items: center; font-size: 2em; cursor: pointer;" data-index="${index}"></div>
                `).join('')}
            </div>
        `;
        this.container.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => this.flipCard(card));
        });
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    flipCard(card) {
        const index = card.dataset.index;
        if (this.selectedCards.length < 2 && !this.selectedCards.includes(index) && !this.matchedCards.includes(index)) {
            card.textContent = this.cards[index];
            card.style.backgroundColor = '#fff';
            this.selectedCards.push(index);

            if (this.selectedCards.length === 2) {
                setTimeout(() => this.checkMatch(), 500);
            }
        }
    }

    checkMatch() {
        const [index1, index2] = this.selectedCards;
        const card1 = this.container.querySelector(`[data-index="${index1}"]`);
        const card2 = this.container.querySelector(`[data-index="${index2}"]`);

        if (this.cards[index1] === this.cards[index2]) {
            this.matchedCards.push(index1, index2);
            card1.style.backgroundColor = '#afa';
            card2.style.backgroundColor = '#afa';
            if (this.matchedCards.length === this.cards.length) {
                setTimeout(() => alert('Félicitations ! Vous avez gagné !'), 500);
            }
        } else {
            setTimeout(() => {
                card1.textContent = '';
                card2.textContent = '';
                card1.style.backgroundColor = '#ddd';
                card2.style.backgroundColor = '#ddd';
            }, 500);
        }
        this.selectedCards = [];
    }

    reset() {
        this.shuffleCards();
        this.selectedCards = [];
        this.matchedCards = [];
        this.start();
    }
}
