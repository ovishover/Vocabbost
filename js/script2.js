let currentIndex = 0;
let selectedWords = [];
let shuffledWords = [];
let currentGame = null;
let lastClickTime = 0;
const minInterval = 600;
let header = document.querySelector('.header_title');
let results = [];
let correctAnswers = 0;

const gameFunctions = {
    1: startMemorizeGame,
    2: ChooseTranslate,
    3: testGame3,
    4: testGame4
};

function updateProgressBar() {
    if (!shuffledWords.length) return;
    let progress = ((currentIndex + 1) / shuffledWords.length) * 100; // Від 1 до 100%
    document.querySelector('.header_progress').style.setProperty('--progress', `${progress}%`);
}


function getUrlParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}

function shuffleWords() {
    if (!selectedWords.length) return console.error("Немає слів для перемішування.");
    shuffledWords = [...selectedWords];
    shuffleArray(shuffledWords);
}

function startGame(gameId) {
    currentGame = gameId;
    shuffleWords();
    document.querySelectorAll('.heder_items').forEach(item => item.style.display = 'flex');
    document.querySelector('.header_list').style.display = 'flex';
    document.getElementById('name_label').style.display = 'none';
    document.getElementById('train_list').style.display = 'none';
    
    let gameElement = document.getElementById(String(currentGame));
    if (!gameElement) return console.error(`Елемент з ID '${currentGame}' не знайдено.`);
    gameElement.style.display = 'block';
    
    currentIndex = 0;
    gameFunctions[currentGame]?.(currentIndex);
}

function nextGame() {
    currentIndex = 0;
    currentGame = (currentGame % 4) + 1;
    startGame(currentGame);
    document.getElementById('result_menu').style.display = 'none';
}

function restartGame() {
    currentIndex = 0; // Скидаємо лічильник індексу
    updateProgressBar(); // Скидаємо шкалу на 0%
    startGame(currentGame); // Перезапускаємо гру
    console.log("Гра перезапущена!");
    document.getElementById('result_menu').style.display = 'none';
}


function endGame() {
    console.log("Гра завершена!");
    document.getElementById(currentGame).style.display = 'none';
    document.getElementById('result_menu').style.display = 'block';
}

function playSoundForCurrentWord() {
    if (Date.now() - lastClickTime < minInterval) return console.log("Занадто швидке натискання! Зачекайте.");
    lastClickTime = Date.now();
    
    let wordObj = shuffledWords[currentIndex];
    if (!wordObj?.word) return console.error("Немає звуку для цього слова.");
    
    new Audio(`./sounds/${wordObj.word}.mp3`).play();
}

document.getElementById('playSoundBtn')?.addEventListener('click', playSoundForCurrentWord);

async function loadTrainingWords() {
    let setNumber = getUrlParameter('set');
    if (!setNumber) return console.error("Номер сету не вказаний в URL.");
    
    try {
        let response = await fetch('words.json');
        let words = await response.json();
        
        if (!Array.isArray(words)) return console.error("Невірний формат JSON.");
        selectedWords = words.filter(word => word.set == setNumber);
        if (!selectedWords.length) return console.error(`Немає слів для сету ${setNumber}.`);
        
        document.getElementById('cardTitleGame').textContent = `set #${setNumber}`;
        document.getElementById('cardTitleResult').textContent = `set #${setNumber}`;
        
        shuffleWords();
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
    }
}

function startMemorizeGame(index) {
    header.innerHTML = 'Memorize';
    let wordObj = shuffledWords[index];
    if (!wordObj) return console.error("Немає слова для показу.");
    document.getElementById('word').textContent = wordObj.word;
    document.getElementById('translation').textContent = wordObj.translate;
    
    updateProgressBar(); // Оновлюємо лінію прогресу
}

function showNextWord() {
    if (Date.now() - lastClickTime < minInterval) return console.log("Занадто швидке натискання!");
    lastClickTime = Date.now();
    
    if (currentIndex < shuffledWords.length - 1) {
        startMemorizeGame(++currentIndex);
        updateProgressBar(); // Оновлюємо лінію прогресу
    } else {
        endGame();
    }
}


function ChooseTranslate() {
    results = [];
    shuffleWords();
    header.innerHTML = 'Translation';
    currentIndex = 0;
    updateProgressBar();

    function getRandomChoices(correctAnswer, allWords) {
        let choices = [correctAnswer];
        while (choices.length < 4) {
            let randomChoice = allWords[Math.floor(Math.random() * allWords.length)].translate;
            if (!choices.includes(randomChoice)) choices.push(randomChoice);
        }
        return choices.sort(() => Math.random() - 0.5);
    }

    function askQuestion(wordObj) {
        if (Date.now() - lastClickTime < minInterval) return console.log("Занадто швидке натискання!");
        lastClickTime = Date.now();

        let choices = getRandomChoices(wordObj.translate, shuffledWords);
        let wordElement = document.getElementById("word2");
        wordElement.textContent = wordObj.word;
        wordElement.classList.remove("flash"); // Очищуємо анімацію перед новим питанням

        let answersContainer = document.getElementById("answers_container");
        answersContainer.innerHTML = "";

        choices.forEach(choice => {
            let answerButton = document.createElement("li");
            answerButton.textContent = choice;
            answerButton.classList.add("choose_button");

            answerButton.addEventListener("click", () => {
                let isCorrect = choice === wordObj.translate;
                results.push({ word: wordObj.word, correct: isCorrect });
                correctAnswers += isCorrect ? 1 : 0;

                // Додаємо підсвічування
                answerButton.classList.add(isCorrect ? "correct" : "incorrect");

                // Якщо відповідь неправильна – додаємо анімацію хитання слова
                if (!isCorrect) {
                    wordElement.classList.add("flash");
                }

                // Блокування кнопок після вибору
                document.querySelectorAll(".choose_button").forEach(btn => btn.style.pointerEvents = "none");

                updateProgressBar();

                // Пауза перед наступним питанням
                setTimeout(() => {
                    wordElement.classList.remove("flash"); // Забираємо хитання перед наступним словом
                    currentIndex++;
                    nextQuestion();
                }, 800); // 800 мс для анімації
            });

            answersContainer.appendChild(answerButton);
        });
    }

    function nextQuestion() {
        if (currentIndex < shuffledWords.length) {
            askQuestion(shuffledWords[currentIndex]);
        } else {
            endGame();
            document.getElementById("resultMsg").textContent = `Game over!`;
            document.getElementById("resultCount").textContent = `${correctAnswers}/${results.length}`;
        }
    }

    nextQuestion();
}




function testGame3() { header.innerHTML = 'Anagram'; }
function testGame4() { header.innerHTML = 'Yes | No'; }

document.addEventListener('DOMContentLoaded', loadTrainingWords);
