const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const startButton = document.getElementById("startBtn");
const restartButton = document.getElementById("restartBtn");
const questinText = document.getElementById("questionText");
const answerSection = document.getElementById("answerSection");
const questionNumber = document.getElementById("questionNumber");
const totalQuestions = document.getElementById("totalQuestions");
const currentScore = document.getElementById("currentScore");
const finalScore = document.getElementById("finalScore");
const totalScore = document.getElementById("totalScore");
const message = document.getElementById("message");
const progressBar = document.getElementById("progress");



const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Paris", correct: true },
            { text: "Madrid", correct: false },
        ],
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Venus", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ],
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
        ],
    },
    {
        question: "Which of these is NOT a programming language?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "Banana", correct: true },
            { text: "JavaScript", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Go", correct: false },
            { text: "Gd", correct: false },
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
        ],
    },
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestions.textContent = quizQuestions.length;
totalScore.textContent = quizQuestions.length;

//event listeners
startButton.addEventListener("click", startQuiz)
restartButton.addEventListener("click", restartQuiz)

function startQuiz() {
    // reset vars
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}

function showQuestion() {
    answersDisabled = false;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionNumber.textContent = currentQuestionIndex + 1;

    const progress = (currentQuestionIndex) / quizQuestions.length * 100;
    progressBar.style.width = `${progress}%`;

    questinText.textContent = currentQuestion.question;

    answerSection.innerHTML = "";
    currentQuestion.answers.forEach((answer) =>{
        const Button = document.createElement("Button");
        Button.textContent = answer.text;
        Button.classList.add("answerButton");


        Button.dataset.correct = answer.correct;
        Button.addEventListener("click", selectAnswer);
        answerSection.appendChild(Button);
    });
}

function selectAnswer(event) {
    //optimization check;
    if (answersDisabled) return;

    answersDisabled = true;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    // Here Array.from() is used to convert the NodeList returned by answersContainer.children into an array,
    // this is because the NodeList is not an array and we need to use the forEach method
    Array.from(answerSection.children).forEach((Button) => {
        if(Button.dataset.correct === "true") {
            Button.classList.add("correct");
        }
        else if(Button === selectedButton) {
            Button.classList.add("incorrect");
        }
    });
    if(isCorrect) {
        score++;
        currentScore.textContent = score;
    }
    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        }
        else {
            showResult();
        }
    },800);
}

function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScore.textContent = score;

    const percentage = (score / quizQuestions.length) * 100;

    if (percentage === 100) {
        message.textContent = "Perfect! You're a genius!";
    } else if (percentage >= 80) {
        message.textContent = "Great job! You know your stuff!";
    } else if (percentage >= 60) {
        message.textContent = "Good effort! Keep learning!";
    } else if (percentage >= 40) {
        message.textContent = "Not bad! Try again to improve!";
    } else {
        message.textContent = "Keep studying! You'll get better!";
    }
}


function restartQuiz() {
    resultScreen.classList.remove("active");
    startQuiz();
}