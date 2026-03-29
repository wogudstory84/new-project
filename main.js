class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    background-color: ${this.getColor(number)};
                }
                 @media (max-width: 600px) {
                    .ball {
                        width: 50px;
                        height: 50px;
                        font-size: 1.2rem;
                    }
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }

    getColor(number) {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa'; // Gray
        return '#b0d840'; // Green
    }
}

customElements.define('lotto-ball', LottoBall);

document.getElementById('generate-button').addEventListener('click', () => {
    const container = document.getElementById('lotto-balls-container');
    container.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            container.appendChild(lottoBall);
        }, index * 100); // Stagger the appearance of the balls
    });
});
