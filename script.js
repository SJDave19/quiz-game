let currentQuestionIndex = 0
let score = 0
let questions = []
let timer

async function startGame() {
    const difficulty = document.getElementById('difficulty').value
    const response = await fetch(`https://quizzapi.jomoreschi.fr/api/v1/quiz?difficulty=${difficulty}`)
    const data = await response.json()
    questions = data.quizzes
    document.getElementById('difficulty-select').style.display = 'none'
    document.getElementById('question-container').style.display = 'block'
    showQuestion()
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert(`Game Over! Your score: ${score}`)
        resetGame()
        return
    }

    const question = questions[currentQuestionIndex]
    document.getElementById('question').innerText = question.question
    const answersContainer = document.getElementById('answers')
    answersContainer.innerHTML = ''

    const correctAnswer = `<button onclick="checkAnswer(true)" class="bg-gray-800 p-2 rounded">${question.answer}</button>`
    const incorrectAnswers = question.badAnswers.map(answer => `<button onclick="checkAnswer(false)" class="bg-gray-800 p-2 rounded">${answer}</button>`)

    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5)
    allAnswers.forEach(answerHtml => answersContainer.innerHTML += answerHtml)

    startTimer()
}

function startTimer() {
    let timeLeft = 10
    document.getElementById('timer').innerText = `Temps restant: ${timeLeft}s`
    timer = setInterval(() => {
        timeLeft--
        document.getElementById('timer').innerText = `Temps restant: ${timeLeft}s`
        if (timeLeft <= 0) {
            clearInterval(timer)
            alert('Time\'s up! Game Over.')
            resetGame()
        }
    }, 1000)
}

function checkAnswer(isCorrect) {
    clearInterval(timer)
    if (isCorrect) {
        score++
        document.getElementById('score').innerText = `Score: ${score}`
        currentQuestionIndex++
        showQuestion()
    } else {
        alert('Wrong answer! Game Over.')
        resetGame()
    }
}

function resetGame() {
    document.getElementById('difficulty-select').style.display = 'block'
    document.getElementById('question-container').style.display = 'none'
    document.getElementById('score').innerText = ''
    document.getElementById('timer').innerText = ''
    currentQuestionIndex = 0
    score = 0
}
