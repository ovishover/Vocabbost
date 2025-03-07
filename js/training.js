// Отримуємо параметри URL і завантажуємо слова для тренування
const urlParams = new URLSearchParams(window.location.search);
const set = urlParams.get('set');
let words = [];
let correctAnswers = 0;
let mistakes = [];
let currentIndex = 0;

// Завантажуємо слова для вибраного набору
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    // Фільтруємо слова для цього набору
    words = data.filter(w => w.set == set);

    // Якщо слів для цього набору немає, виводимо повідомлення на сторінку
    if (words.length === 0) {
      document.getElementById('gameArea').innerHTML = '<h3>Немає слів для цього набору. Виберіть інший набір або спробуйте знову пізніше.</h3>';
      return; // Якщо слів немає, не продовжуємо далі
    } else {
      console.log(`Завантажено ${words.length} слів для набору ${set}`);
      startMode('anagram'); // Запускаємо гру, якщо слова є
    }
  })
  .catch(error => {
    // Якщо сталася помилка при завантаженні даних
    console.error("Помилка при завантаженні слів:", error);
    document.getElementById('gameArea').innerHTML = '<h3>Сталася помилка при завантаженні слів. Спробуйте пізніше.</h3>';
  });

// Функція для старту тренування (режими гри)
function startMode(mode) {
  if (words.length === 0) {
    // Якщо слів все ж немає, зупиняємо гру
    document.getElementById('gameArea').innerHTML = '<h3>Завантаження слів, будь ласка, зачекайте!</h3>';
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

// Відображення анаграми і перевірка відповіді:
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

// Відображення помилок і повторення
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
