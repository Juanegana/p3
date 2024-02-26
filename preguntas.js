const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');
const scoreContainer = document.getElementById('score-container');
const scoreDisplay = document.getElementById('score');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Obtener preguntas de la API
async function getQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const data = await response.json();
    questions = data.results.map(question => {
        return {
            question: question.question,
            correctAnswer: question.correct_answer,
            incorrectAnswers: question.incorrect_answers
        };
    });
    showQuestion();
}

// Mostrar pregunta actual
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion.question;
    optionsContainer.innerHTML = '';
    const allAnswers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
    const shuffledAnswers = shuffleArray(allAnswers);
    shuffledAnswers.forEach(answer => {
        const option = document.createElement('button');
        option.innerText = answer;
        option.classList.add('option');
        option.addEventListener('click', () => checkAnswer(answer, option));
        optionsContainer.appendChild(option);
    });
}

// Comprobar respuesta seleccionada
function checkAnswer(selectedAnswer, option) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    if (selectedAnswer === correctAnswer) {
        option.classList.add('correct');
        score++;
    } else {
        option.classList.add('incorrect');
        // Encontrar la opción correcta y resaltarlo
        optionsContainer.querySelectorAll('.option').forEach(opt => {
            if (opt.innerText === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }
    scoreDisplay.innerText = score;
    // Desactivar los botones de opciones para evitar múltiples selecciones
    optionsContainer.querySelectorAll('.option').forEach(opt => {
        opt.disabled = true;
    });
}

// Avanzar a la siguiente pregunta
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert('¡Fin del juego! Puntuación final: ' + score);
        // Aquí puedes agregar código para guardar la puntuación localmente
        // Por ejemplo, usando localStorage
    }
}

// Función para barajar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Obtener preguntas al cargar la página
getQuestions();

// Event listener para el botón "Siguiente"
nextButton.addEventListener('click', nextQuestion);

// Event listener para el botón "Volver a Inicio"
backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
