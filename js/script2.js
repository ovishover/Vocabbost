async function loadWords() {
    try {
        // Завантажуємо дані з JSON
        const response = await fetch('words.json');
        const words = await response.json();

        // Формуємо унікальні набори
        const sets = [...new Set(words.map(w => w.set))].sort();
        const container = document.getElementById('sets');
        
        if (!container) {
            console.error("Елемент 'sets' не знайдено. (main page)");
            return;
        }

        // Створюємо кнопки для кожного набору
        sets.forEach(set => {
            const btn = document.createElement('li');
            btn.className = 'set_button openModalBtn';
            btn.textContent = `Set ${set}`;
            
            // Знаходимо категорію (припускаємо, що всі слова в сеті мають одну категорію)
            const category = words.find(word => word.set === set)?.category || 'Unknown';
            
            // Створюємо елементи <p> з класом стилів
            const pSet = document.createElement('p');
            pSet.textContent = `Set: ${set}`;
            pSet.classList.add('set-info');
            
            const pCategory = document.createElement('p');
            pCategory.textContent = `Category: ${category}`;
            pCategory.classList.add('category-info');
            
            // Додаємо їх до <li>
            btn.appendChild(pSet);
            btn.appendChild(pCategory);

            btn.onclick = () => {
                const wordList = words.filter(word => word.set === set);
                openModal(set, wordList);
                
                // Оновлюємо заголовок картки з номером сету та категорією
                const cardTitleResult = document.getElementById('cardTitleResult');
                if (cardTitleResult) {
                    cardTitleResult.textContent = `Set #${set}: ${category}`;
                }
            };
            
            container.appendChild(btn);
        });
    } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
    }
}


// Додаємо основний ігровий функціонал
let currentIndex = 0;
let selectedWords = [];
let shuffledWords = [];
let currentGame = null;
let lastClickTime = 0;
const minInterval = 600;
let header = document.querySelector('.header_title');
let results = [];
let correctAnswers = 0;
const elements = document.querySelectorAll('.set_card_title');
let timerInterval = null; // Робимо змінну глобальною

const gameFunctions = {
    1: startMemorizeGame,
    2: ChooseTranslate,
    3: tfDuel,
    4: testGame4
};


function updateProgressBar() {
    if (!shuffledWords.length) return;
    let progress = (currentIndex / shuffledWords.length) * 100; // Від 0 до 100%
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
        
        const category = selectedWords[0]?.category || 'Unknown';
        elements.forEach(element => {
            element.textContent = `Set #${setNumber} - ${category}`;
        });
        document.getElementById('cardTitleResult').textContent = `Set #${setNumber} - ${category}`;
        
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
    updateProgressBar(); // Оновлюємо шкалу прогресу перед початком гри

    // Додаємо аудіофайли
    const correctSound = new Audio('./sounds/correct.mp3');
    const wrongSound = new Audio('./sounds/wrong.mp3');

    let firstAttemptCorrect = 0; // Кількість правильних відповідей з першої спроби

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
        wordElement.classList.remove("flash");

        let answersContainer = document.getElementById("answers_container");
        answersContainer.innerHTML = "";

        let mistakeRegistered = false; // Чи була зарахована помилка за це слово
        let firstAttempt = true; // Чи це перша спроба відповісти на це слово

        choices.forEach(choice => {
            let answerButton = document.createElement("li");
            answerButton.textContent = choice;
            answerButton.classList.add("choose_button");

            answerButton.addEventListener("click", () => {
                let isCorrect = choice === wordObj.translate;

                if (!isCorrect && !mistakeRegistered) {
                    results.push({ word: wordObj.word, correct: false });
                    mistakeRegistered = true;
                }

                if (isCorrect) {
                    results.push({ word: wordObj.word, correct: true });

                    if (firstAttempt) {
                        firstAttemptCorrect++; // Якщо вірна відповідь з першої спроби
                    }

                    correctSound.play();
                } else {
                    wrongSound.play();
                    wordElement.classList.add("flash");
                }

                answerButton.classList.add(isCorrect ? "correct" : "incorrect");

                // Блокування кнопок після вибору
                document.querySelectorAll(".choose_button").forEach(btn => btn.style.pointerEvents = "none");

                if (isCorrect) {
                    setTimeout(() => {
                        wordElement.classList.remove("flash");
                        currentIndex++;
                        updateProgressBar(); // Оновлюємо шкалу після зміни запитання
                        nextQuestion();
                    }, 800);
                } else {
                    setTimeout(() => {
                        wordElement.classList.remove("flash");
                        document.querySelectorAll(".choose_button").forEach(btn => btn.style.pointerEvents = "auto");
                        document.querySelectorAll(".incorrect").forEach(btn => btn.classList.remove("incorrect"));
                    }, 800);
                }

                firstAttempt = false; // Після першого вибору спроба більше не рахується як перша
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
            document.getElementById("resultCount").textContent = `${firstAttemptCorrect}/${shuffledWords.length}`;
        }
    }

    nextQuestion();
}










function tfDuel() {
    header.innerHTML = 'False | True';
    results = [];
    shuffleWords();
    currentIndex = 0;
    updateProgressBar();

    const correctSound = new Audio('./sounds/correct.mp3');
    const wrongSound = new Audio('./sounds/wrong.mp3');

    let firstAttemptCorrect = 0; 
    let timeLeft = 30;

    const wordElement = document.getElementById("word3");
    const translationElement = document.getElementById("translation2");
    const yesButton = document.getElementById("yes_button");
    const noButton = document.getElementById("no_button");
    const timerElement = document.getElementById("timer");
    const effectElement = document.getElementById("word3"); // Елемент для кольорової анімації

    function startTimer() {
        if (!timerElement) return console.error("Елемент #timer не знайдено!");

        // Очистка попереднього таймера перед запуском нового
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null; 
        }

        timeLeft = 30; // Скидаємо час на початкове значення
        timerElement.textContent = `Time left: ${timeLeft}s`;

        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                endGame();
            } else {
                timerElement.textContent = `Time left: ${timeLeft}s`;
                timeLeft--;
            }
        }, 1000);
    }

    function getRandomTranslation(wordObj) {
        if (Math.random() > 0.5) {
            return { translation: wordObj.translate, isCorrect: true };
        } else {
            let randomWord;
            do {
                randomWord = shuffledWords[Math.floor(Math.random() * shuffledWords.length)];
            } while (randomWord.word === wordObj.word);
            return { translation: randomWord.translate, isCorrect: false };
        }
    }

    function askQuestion() {
        if (currentIndex >= shuffledWords.length) {
            clearInterval(timerInterval);
            timerInterval = null;
            endGame();
            return;
        }

        let wordObj = shuffledWords[currentIndex];
        let { translation, isCorrect } = getRandomTranslation(wordObj);

        wordElement.textContent = wordObj.word;
        translationElement.textContent = translation;

        wordElement.classList.remove("flash");
        effectElement.classList.remove("correct", "incorrect");

        yesButton.onclick = () => checkAnswer(true, isCorrect);
        noButton.onclick = () => checkAnswer(false, isCorrect);
    }

    function checkAnswer(userChoice, isCorrect) {
        let answerCorrect = userChoice === isCorrect;

        if (answerCorrect) {
            results.push({ word: shuffledWords[currentIndex].word, correct: true });
            firstAttemptCorrect++;
            correctSound.play();
            effectElement.classList.add("correct"); // Додаємо зелений ефект
        } else {
            results.push({ word: shuffledWords[currentIndex].word, correct: false });
            wrongSound.play();
            effectElement.classList.add("incorrect"); // Додаємо червоний ефект
            wordElement.classList.add("flash"); // Тряска слова при помилці
        }

        yesButton.style.pointerEvents = "none";
        noButton.style.pointerEvents = "none";

        setTimeout(() => {
            wordElement.classList.remove("flash");
            effectElement.classList.remove("correct", "incorrect");
            currentIndex++;
            updateProgressBar();

            yesButton.style.pointerEvents = "auto";
            noButton.style.pointerEvents = "auto";

            askQuestion();
        }, 800);
    }

    function endGame() {
        document.getElementById(currentGame).style.display = 'none';
        document.getElementById('result_menu').style.display = 'block';
        document.getElementById("resultMsg").textContent = `Game over!`;
        document.getElementById("resultCount").textContent = `${firstAttemptCorrect}/${shuffledWords.length}`;
    }

    startTimer();
    askQuestion();
}




function testGame4() { header.innerHTML = 'Anagram'; }
document.addEventListener('DOMContentLoaded', loadTrainingWords);
