// Отримуємо елементи модального вікна
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalWordList = document.getElementById("modalWordList");
const startModalBtns = document.querySelectorAll(".start_btn");

// Функція для відкриття модалки
function openModal(set, words) {
    modalTitle.textContent = `Set ${set}`;
    modalContent.textContent = `Details for Set ${set}`;
    
    // Виводимо список слів у модалці
    const wordListHtml = words.map(word => `<li>${word}</li>`).join('');
    modalWordList.innerHTML = `<h4>Слова:</h4><ul>${wordListHtml}</ul>`;

    // Додаємо функціонал переходу на сторінку тренування
    startModalBtns.forEach(btn => {
        btn.onclick = () => {
            window.location.href = `training.html?set=${set}`;
        };
    });

    // Показуємо модальне вікно
    modal.style.display = "block";
    backdrop.style.display = "block";
    document.body.classList.add("modal-open");
}

// Закриваємо модалку
closeModalBtn.onclick = function() {
    modal.style.display = "none";
    backdrop.style.display = "none";
    document.body.classList.remove("modal-open");
};

// Завантаження наборів слів
fetch('words.json')
  .then(response => response.json())
  .then(words => {
    const sets = [...new Set(words.map(w => w.set))].sort();
    const container = document.getElementById('sets');

    sets.forEach(set => {
        const btn = document.createElement('div');
        btn.className = 'set_button openModalBtn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', 0);
        btn.textContent = `Set ${set}`;

        btn.onclick = () => {
            const wordList = words.filter(word => word.set == set).map(word => word.word);
            openModal(set, wordList);
        };

        container.appendChild(btn);
    });
  })
  .catch(error => console.error("Помилка при завантаженні даних:", error));

// Тренування слів
const urlParams = new URLSearchParams(window.location.search);
const set = urlParams.get('set');
let words = [];
let correctAnswers = 0;
let mistakes = [];
let currentIndex = 0;

if (set) {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            words = data.filter(w => w.set == set);
            if (words.length > 0) {
                startMode('anagram');
            } else {
                document.getElementById('gameArea').innerHTML = '<h3>Немає слів для цього набору.</h3>';
            }
        })
        .catch(error => console.error("Помилка при завантаженні слів:", error));
}

function startMode(mode) {
    if (words.length === 0) {
        alert('Завантаження слів, будь ласка, зачекайте!');
        return;
    }

    document.getElementById('gameArea').innerHTML = '';
    correctAnswers = 0;
    mistakes = [];
    currentIndex = 0;
    document.getElementById('score').textContent = `Правильних відповідей: ${correctAnswers}`;
    document.getElementById('mistakes').innerHTML = '';
    document.getElementById('repeatBtn').style.display = 'none';

    if (mode === 'anagram') {
        showAnagram();
    }
}

function showAnagram() {
    if (currentIndex >= words.length) {
        showMistakes();
        return;
    }

    const word = words[currentIndex].word;
    const shuffled = word.split('').sort(() => Math.random() - 0.5).join('');

    document.getElementById('gameArea').innerHTML = `
        <h3>${shuffled}</h3>
        <input type="text" id="answer" placeholder="Введіть слово">
        <button onclick="checkAnagram('${word}')">Перевірити</button>
    `;
}

function checkAnagram(correct) {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();

    if (userAnswer === correct.toLowerCase()) {
        correctAnswers++;
        document.getElementById('answer').style.border = '2px solid green';
    } else {
        if (!mistakes.includes(correct)) {
            mistakes.push(correct);
        }
        document.getElementById('answer').style.border = '2px solid red';
    }

    setTimeout(() => {
        currentIndex++;
        document.getElementById('score').textContent = `Правильних відповідей: ${correctAnswers}`;
        showAnagram();
    }, 500);
}

function showMistakes() {
    let list = mistakes.map(word => `<li>${word}</li>`).join('');
    document.getElementById('mistakes').innerHTML = `<h3>Помилки:</h3><ul>${list}</ul>`;

    if (mistakes.length > 0) {
        document.getElementById('repeatBtn').style.display = 'block';
    }
}

function repeatMistakes() {
    words = words.filter(word => mistakes.includes(word.word));
    currentIndex = 0;
    mistakes = [];
    correctAnswers = 0;
    document.getElementById('mistakes').innerHTML = '';
    document.getElementById('repeatBtn').style.display = 'none';
    startMode('anagram');
}
