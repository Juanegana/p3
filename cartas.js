const deckSize = 10; // Número de cartas en el juego
let cards = []; // Almacenar las cartas del juego
let flippedCards = []; // Almacenar las cartas volteadas temporalmente
let matchedCards = []; // Almacenar las cartas coincidentes

// Función para inicializar el juego
async function initGame() {
    try {
        // Obtener cartas del mazo
        const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=${deckSize / 2}`);
        const data = await response.json();
        
        // Duplicar las cartas para formar los pares
        cards = [...data.cards, ...data.cards];
        
        // Barajar las cartas
        shuffle(cards);
        
        // Mostrar las cartas en el tablero
        renderCards();
    } catch (error) {
        console.error('Error al inicializar el juego:', error);
    }
}

// Función para barajar las cartas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para renderizar las cartas en el tablero
function renderCards() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.innerHTML = `
            <img src="${card.image}" class="front" alt="${card.value} ${card.suit}">
            <img src="atras.jpg" class="back" alt="Parte Trasera de la Carta">
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Función para voltear una carta
function flipCard(event) {
    const selectedCard = event.currentTarget;
    const index = parseInt(selectedCard.dataset.index);
    
    // Verificar si la carta ya ha sido volteada o coincide
    if (!flippedCards.includes(index) && !matchedCards.includes(index)) {
        selectedCard.classList.toggle('flipped');
        flippedCards.push(index);
        
        // Verificar si hay dos cartas volteadas
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Función para verificar si las cartas son iguales
function checkMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    
    if (firstCard.code === secondCard.code) {
        // Las cartas son iguales, mantenerlas volteadas
        matchedCards.push(firstIndex, secondIndex);
        flippedCards = [];
        
        // Verificar si se han encontrado todas las parejas
        if (matchedCards.length === deckSize) {
            alert('¡Has ganado!');
        }
    } else {
        // Las cartas no son iguales, voltearlas de nuevo después de un breve período de tiempo
        setTimeout(() => {
            flippedCards.forEach(index => {
                const cardElement = document.querySelector(`.card[data-index="${index}"]`);
                cardElement.classList.remove('flipped');
            });
            flippedCards = [];
        }, 1000);
    }
}

// Función para reiniciar el juego
function resetGame() {
    flippedCards = [];
    matchedCards = [];
    initGame();
}

// Inicializar el juego al cargar la página
initGame();
