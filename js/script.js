// ======== МОДАЛЬНЕ ВІКНО ==========

// Отримання елементів
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalWordList = document.getElementById("modalWordList");
const startModalBtns = document.querySelectorAll(".start_btn");
const trainList = document.querySelectorAll(".train_list");

// Функція для відкриття модалки
function openModal(set, words) {
  modalTitle.textContent = `Set ${set}`;

  if (!Array.isArray(words) || words.length === 0) {
    modalWordList.innerHTML = "<p>Список слів не знайдено</p>";
    return;
  }

  const wordListHtml = words.map(word => {
    return `<li class="list_item"><div>${word.word}</div><div>${word.translate}</div></li>`;
  }).join('');

  modalWordList.innerHTML = `<ul>${wordListHtml}</ul>`;

  startModalBtns.forEach(btn => {
    btn.onclick = () => {
      window.location.href = `training.html?set=${set}`; // Перенаправлення на сторінку тренування
    };
  });

  modal.style.display = "block";
  backdrop.style.display = "block";
  document.body.classList.add("modal-open");
}

closeModalBtn.onclick = function () {
  modal.style.display = "none";
  backdrop.style.display = "none";
  document.body.classList.remove("modal-open");
};

// ======== ЗАВАНТАЖЕННЯ СЛІВ ==========
fetch('words.json')
  .then(response => response.json())
  .then(words => {
    const sets = [...new Set(words.map(w => w.set))].sort();
    const container = document.getElementById('sets');

    sets.forEach(set => {
      const btn = document.createElement('div');
      btn.className = 'set_button openModalBtn';
      btn.textContent = `Set ${set}`;
      btn.onclick = () => {
        const wordList = words.filter(word => word.set == set);
        openModal(set, wordList);
        hideTrainingsList(); // Ховаємо список тренувань після вибору
      };
      container.appendChild(btn);
    });
  })
  .catch(error => console.error("Помилка при завантаженні даних:", error));

// ======== ЛОГІКА ТРЕНУВАННЯ ==========
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
        console.log(`Завантажено ${words.length} слів для Set ${set}`);
      }
    })
    .catch(error => console.error("Помилка при завантаженні слів:", error));
}

function startMode(mode) {
  if (words.length === 0) {
    alert("Завантаження слів, будь ласка, зачекайте!");
    return;
  }

  document.getElementById("answ_section").classList.remove("hidden");
  document.getElementById("modes").classList.add("hidden"); // Ховаємо список тренувань
  document.getElementById("backToTrainingsBtn").style.display = 'block'; // Показуємо кнопку для повернення до тренувань

  correctAnswers = 0;
  mistakes = [];
  currentIndex = 0;

  document.getElementById("score").textContent = `Правильних відповідей: ${correctAnswers}`;
  document.getElementById("mistakes").innerHTML = '';
  document.getElementById("repeatBtn").style.display = 'none';

  if (mode === "anagram") {
    showAnagram();
  } else if (mode === "multipleChoiceUA") {
    showMultipleChoice("UA");
  } else if (mode === "multipleChoiceEN") {
    showMultipleChoice("EN");
  }
}

function showAnagram() {
  if (currentIndex >= words.length) {
    showMistakes();
    return;
  }

  const word = words[currentIndex].word;
  const shuffled = word.split("").sort(() => Math.random() - 0.5).join("");

  document.getElementById("gameArea").innerHTML = `
    <h3>${shuffled}</h3>
    <input type="text" id="answer" placeholder="Введіть слово">
    <button onclick="checkAnagram('${word}')">Перевірити</button>
  `;
}

function checkAnagram(correct) {
  const userAnswer = document.getElementById("answer").value.trim().toLowerCase();

  if (userAnswer === correct.toLowerCase()) {
    correctAnswers++;
    document.getElementById("answer").style.border = "2px solid green";
  } else {
    if (!mistakes.includes(correct)) {
      mistakes.push(correct);
    }
    document.getElementById("answer").style.border = "2px solid red";
  }

  setTimeout(() => {
    currentIndex++;
    document.getElementById("score").textContent = `Правильних відповідей: ${correctAnswers}`;
    showAnagram();
  }, 500);
}

function showMistakes() {
  let list = mistakes.map(word => `<li>${word}</li>`).join("");
  document.getElementById("mistakes").innerHTML = `<h3>Помилки:</h3><ul>${list}</ul>`;

  if (mistakes.length > 0) {
    document.getElementById("repeatBtn").style.display = "block";
  }
}

function repeatMistakes() {
  words = mistakes.map(mistake => words.find(w => w.word === mistake));
  correctAnswers = 0;
  mistakes = [];
  currentIndex = 0;
  startMode("anagram");
}

document.getElementById("repeatBtn").onclick = repeatMistakes;

// Функція для повернення до списку тренувань
function goBackToTrainings() {
  document.getElementById("answ_section").classList.add("hidden"); // Приховуємо секцію тренування
  document.getElementById("modes").classList.remove("hidden"); // Показуємо секцію тренувань
  document.getElementById("backToTrainingsBtn").style.display = 'none'; // Приховуємо кнопку "Повернутися"
}

// Функція для приховування списку тренувань
function hideTrainingsList() {
  document.getElementById("modes").classList.add("hidden"); // Ховаємо список тренувань
}
