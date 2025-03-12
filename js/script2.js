let currentIndex = 0; // Позиція поточного слова в масиві
let shuffledWords = []; // Перемішаний набір слів
let selectedWords = []; // Масив вибраних слів
let currentGame = null;
let lastClickTime = 0; // Змінна для фіксації часу останнього натискання
const minInterval = 1000; // Мінімальний інтервал між натисканнями кнопки (в мілісекундах


// ====== СЛУЖБОВІ ФУНКЦІЇ ====== 

// Функція для отримання параметра з URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Функція для перемішування масиву
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
         [arr[i], arr[j]] = [arr[j], arr[i]]; // Міняємо місцями елементи
    }
}

 // Перемішуємо слова перед початком гри
function shuffleWords() {
    // Перевіряємо, чи є selectedWords
    if (selectedWords.length === 0) {
        console.error("Немає слів для перемішування.");
        return;
    }

    shuffledWords = [...selectedWords]; // Копіюємо масив слів
    shuffleArray(shuffledWords); // Перемішуємо його
    return shuffledWords
    // startMemorizeGame(currentIndex); // Показуємо перше слово
}

// Функція початку гри
    function startGame(gameId) {
    currentGame = gameId; // Зберігаємо ID гри
    shuffleWords();
    document.getElementById('train_list').classList.add('hidden');
    // document.getElementById('game_area').classList.remove('hidden');

    const gameElement = document.getElementById(String(currentGame));
    if (gameElement) {
        gameElement.style.display = 'block';
    } else {
        console.error(`Елемент з ID '${currentGame}' не знайдено.`);
        return;
    }

    currentIndex = 0; // Починаємо з першого слова

    if (currentGame === 1) {
        startMemorizeGame(currentIndex);
    } else if (currentGame === 2) {
        testGame2(currentIndex); // АБО testGame2(shuffledWords), якщо потрібно передавати масив
    } else if (currentGame === 3) {
        testGame3(currentIndex);
    } else if (currentGame === 4) {
        testGame4(currentIndex);
    } else {
        console.error(`Гра з ID '${gameId}' не знайдена.`);
    }
}

function nextGame () {
    currentIndex = 0;
    if (currentGame > 3) {
        currentGame = 1
        // console.log("вийдіть з гри")
    }else {
        currentGame++
        console.log(currentGame)
    }
    startGame(currentGame);
    document.getElementById('result_menu').style.display = 'none';
}


// Функція перезапуску гри
function restartGame() {
    
    currentIndex = 0;
    startGame(currentGame)
    console.log("Гра перезапущена!");
    document.getElementById('result_menu').style.display = 'none';
}


// Функція завершення гри
function endGame() {
    console.log("Гра завершена! Ви пройшли всі слова."); // Вивести повідомлення
    // currentGame++
    currentIndex = 0;  // Скидаємо індекс на початок
    document.getElementById(currentGame).style.display = 'none';
    document.getElementById('result_menu').style.display = 'block';
}


// Функція для відтворення звуку з перевіркою інтервалу
function playSoundForCurrentWord() {
    const currentTime = Date.now();
    
    // Перевіряємо, чи пройшов мінімальний інтервал з останнього натискання
    if (currentTime - lastClickTime < minInterval) {
        console.log("Занадто швидке натискання! Зачекайте.");
        return; // Якщо натискання було занадто швидким, звуковий файл не відтворюється
    }

    lastClickTime = currentTime; // Оновлюємо час останнього натискання
    
    const wordObj = shuffledWords[currentIndex]; // Отримуємо поточне слово
    if (!wordObj || !wordObj.word) {
        console.error("Немає звуку для цього слова.");
        return;
    }

    const soundName = wordObj.word; // Ім'я звукового файлу
    const audio = new Audio(`./sounds/${soundName}.mp3`); // Шлях до звуку (заміни 'sounds' на свій шлях)
    audio.play();
}

// Додаємо слухача події на кнопку
document.getElementById('playSoundBtn').addEventListener('click', playSoundForCurrentWord);



// ЗАВАНТАЖЕННЯ СЛІВ ІЗ ФАЙЛУ JSON
async function loadTrainingWords() {
    const setNumber = getUrlParameter('set');
    console.log('Отриманий номер сету:', setNumber);  // Додайте це для перевірки
    if (!setNumber) {
        console.error("Номер сету не вказаний в URL.");
        return;
    }

    try {
        // Завантажуємо дані з JSON
        const response = await fetch('words.json');
        const words = await response.json();

        // Перевірка на те, чи дані були завантажені
        if (!Array.isArray(words)) {
            console.error("Дані у файлі words.json мають неправильний формат.");
            return;
            }

        // Фільтруємо слова для відповідного сету
        selectedWords = words.filter(word => word.set == setNumber);

        // Якщо немає слів для вказаного сету, вивести помилку
        if (selectedWords.length === 0) {
            console.error(`Немає слів для сету ${setNumber}.`);
            return;
        }

        // Логіка успішного завантаження набору
        console.log(`Набір слів для Set ${setNumber} успішно завантажено!`);
        const cardTitleElementGeme = document.getElementById('cardTitleGame');
        // const cardTitle = cardTitleElement.textContent; // Отримуємо текст
        cardTitleElementGeme.textContent = `set #${setNumber}`; // Присвоюємо новий текст
        const cardTitleElementResult = document.getElementById('cardTitleResult');
        // const cardTitle = cardTitleElement.textContent; // Отримуємо текст
        cardTitleElementResult.textContent = `set #${setNumber}`; // Присвоюємо новий текст
                
        // Після завантаження слів, перемішуємо їх
        shuffleWords();

    } 
    catch (error) {
        console.error("Помилка при завантаженні даних для тренування:", error);
    }
}




//  ====== GAME 1 (memorize) ====== - перегляд карток для запам'ятовування
// Показати слово та його переклад
function startMemorizeGame(index) {
    const wordObj = shuffledWords[index]; // Отримуємо об'єкт слова
    if (!wordObj) {
        console.error("Немає слова для показу.");
        console.log(shuffledWords);
        console.log("wordObj:", wordObj);
        return;
    }
    console.log("wordObj:", wordObj); // Лог для перевірки об'єкта слова
    document.getElementById('word').textContent = wordObj.word;
    document.getElementById('translation').textContent = wordObj.translate;
}

// Показати наступне слово
function showNextWord() {
    if (currentIndex < shuffledWords.length - 1) {
        currentIndex++;
        console.log("showNextWord called, new index:", currentIndex); // Лог для нового індексу
        startMemorizeGame(currentIndex);
    } else {
        console.log("Немає наступного слова.");
        endGame();  // Викликаємо завершення гри
    }
}




//  ====== GAME 2 (audiotraining) ====== - ПЕРЕГЛЯД КАРТОК ЗІ СЛОВАМИ
function testGame2() {
    console.log("test game:"); // Лог для перевірки індексу
}




//  ====== GAME 3 (anagram) ====== - зібрати слово по буквам
function testGame3() {
    console.log("test game:"); // Лог для перевірки індексу
}




//  ====== GAME 4 (boom) ====== - гра у так/ні
function testGame4() {
    console.log("test game:"); // Лог для перевірки індексу
}








document.addEventListener('DOMContentLoaded', function() {
    loadTrainingWords();
});



















