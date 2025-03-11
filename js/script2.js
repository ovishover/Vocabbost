let currentIndex = 0; // Позиція поточного слова в масиві
let shuffledWords = []; // Перемішаний набір слів
let selectedWords = []; // Масив вибраних слів

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
    showWord(currentIndex); // Показуємо перше слово
}

// Функція для завантаження слів
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

// Викликаємо функцію завантаження слів при натисканні кнопки
function startGame() {
    document.getElementById('train_list').classList.add('hidden');
    document.getElementById('game_area').classList.remove('hidden');
    loadTrainingWords();
}

// Показати слово та його переклад
function showWord(index) {
    console.log("showWord called with index:", index); // Лог для перевірки індексу
    const wordObj = shuffledWords[index]; // Отримуємо об'єкт слова
    if (!wordObj) {
        console.error("Немає слова для показу.");
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
        showWord(currentIndex);
    } else {
        console.log("Немає наступного слова.");
        endGame();  // Викликаємо завершення гри
    }
}


// Функція завершення гри
function endGame() {
    console.log("Гра завершена! Ви пройшли всі слова."); // Вивести повідомлення
    document.getElementById('game_area').classList.add('hidden');
    document.getElementById('result_menu').classList.remove('hidden');
    
   // Перевіряємо, чи кнопка вже є на сторінці
const existingButton = document.querySelector('.restartButton');

// if (!existingButton) {
//     // Якщо кнопка ще не існує, створюємо її
//     const restartButton = document.createElement('div');
//     restartButton.classList.add('restartButton', 'set_button'); // Додаємо клас для ідентифікації
//     restartButton.textContent = 'Перезапустити гру';
//     restartButton.onclick = restartGame;
//     document.body.appendChild(restartButton); // ЗМІНИТИ КОНТЕЙНЕР ДЛЯ КНОПКИ
// }
}

// Функція перезапуску гри
function restartGame() {
    loadTrainingWords();  // Завантажуємо нові слова
    console.log("Гра перезапущена!");
    currentIndex = 0;  // Скидаємо індекс на початок
    showWord(currentIndex);  // Відображаємо перше слово
    
    // Видаляємо кнопку після перезапуску
    const restartButton = document.querySelector('.restartButton');
    if (restartButton) {
        restartButton.remove();  // Видаляємо кнопку для перезапуску
    }
}


// Змінна для фіксації часу останнього натискання
let lastClickTime = 0;

// Мінімальний інтервал між натисканнями кнопки (в мілісекундах)
const minInterval = 1000;

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
