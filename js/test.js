// ========================
// 🚀 Глобальні змінні
// ========================
let currentGame = null;
let currentIndex = 0;
let shuffledWords = [];

// ========================
// 🔥 Запуск гри
// ========================
function startGame(gameId) {
    currentGame = gameId; // Зберігаємо ID гри

    document.getElementById('train_list').classList.add('hidden');
    document.getElementById('game_area').classList.remove('hidden');

    loadTrainingWords(() => {
        if (currentGame === 'memorize') {
            startMemorizeGame();
        } else if (currentGame === 'quiz') {
            startQuizGame();
        } else {
            console.error(`Гра з ID '${gameId}' не знайдена.`);
        }
    });
}

// ========================
// 🧠 Гра 1: Запам'ятовування слів (Memorize)
// ========================
function startMemorizeGame() {
    currentIndex = 0;
    console.log("🔹 Запуск гри 'Memorize'");
    showWord(currentIndex);
}

// Показати слово та переклад
function showWord(index) {
    const wordObj = shuffledWords[index];
    if (!wordObj) {
        console.error("❌ Немає слова для показу.");
        return;
    }
    document.getElementById('word').textContent = wordObj.word;
    document.getElementById('translation').textContent = wordObj.translate;
}

// Показати наступне слово
function showNextWord() {
    if (currentIndex < shuffledWords.length - 1) {
        currentIndex++;
        showWord(currentIndex);
    } else {
        console.log("✅ Всі слова переглянуті.");
        endGame();
    }
}

// ========================
// ❓ Гра 2: Вікторина (Quiz)
// ========================
function startQuizGame() {
    console.log("🔹 Запуск гри 'Quiz'");
    currentIndex = 0;
    showQuizQuestion();
}

// Показати питання для вікторини
function showQuizQuestion() {
    const wordObj = shuffledWords[currentIndex];
    if (!wordObj) return;

    document.getElementById('quiz_question').textContent = `Як перекладається слово "${wordObj.word}"?`;
    
    // Створюємо варіанти відповідей (поки що просто випадкові слова)
    const options = generateQuizOptions(wordObj.translate);
    document.getElementById('quiz_options').innerHTML = options
        .map(option => `<button onclick="checkQuizAnswer('${option}', '${wordObj.translate}')">${option}</button>`)
        .join('');
}

// Перевірити відповідь у вікторині
function checkQuizAnswer(userAnswer, correctAnswer) {
    if (userAnswer === correctAnswer) {
        alert("✅ Правильно!");
        showNextQuizQuestion();
    } else {
        alert("❌ Неправильно!");
    }
}

// Перейти до наступного питання
function showNextQuizQuestion() {
    if (currentIndex < shuffledWords.length - 1) {
        currentIndex++;
        showQuizQuestion();
    } else {
        console.log("✅ Вікторина завершена!");
        endGame();
    }
}

// Генерація випадкових варіантів відповідей (спрощено)
function generateQuizOptions(correctAnswer) {
    let options = [correctAnswer];
    while (options.length < 4) {
        const randomWord = shuffledWords[Math.floor(Math.random() * shuffledWords.length)].translate;
        if (!options.includes(randomWord)) options.push(randomWord);
    }
    return options.sort(() => Math.random() - 0.5);
}

// ========================
// 🏁 Завершення гри
// ========================
function endGame() {
    console.log("🎉 Гра завершена!");
    document.getElementById('game_area').classList.add('hidden');
    document.getElementById('result_menu').classList.remove('hidden');
}

// ========================
// 🔄 Перезапуск гри
// ========================
function restartGame() {
    if (!currentGame) {
        console.error("❌ Гру для перезапуску не знайдено!");
        return;
    }

    document.getElementById('game_area').classList.remove('hidden');
    document.getElementById('result_menu').classList.add('hidden');

    if (currentGame === 'memorize') {
        startMemorizeGame();
    } else if (currentGame === 'quiz') {
        startQuizGame();
    }
}

// ========================
// 📥 Завантаження слів
// ========================
function loadTrainingWords(callback) {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            shuffledWords = data.sort(() => Math.random() - 0.5);
            console.log(`📦 Завантажено ${shuffledWords.length} слів`);
            if (callback) callback();
        })
        .catch(error => console.error("❌ Помилка завантаження слів:", error));
}
