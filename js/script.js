
// Завантаження даних для наборів слів
fetch('words.json')
  .then(response => response.json())
  .then(words => {
    // Якщо слова завантажено успішно
    const sets = [...new Set(words.map(w => w.set))]; // Унікальні набори
    sets.sort(); // Сортуємо набір за зростанням

    const container = document.getElementById('sets'); // Контейнер для відображення кнопок

    // Перевірка, чи ми на головній сторінці
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      // Якщо набори не знайдені, показуємо повідомлення
      if (sets.length === 0) {
        alert('Немає доступних наборів слів');
      }
    }

    // Створюємо кнопки для кожного набору
    sets.forEach(set => {
      const btn = document.createElement('div');
      btn.className = 'set_button openModalBtn';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', 0);
      btn.textContent = `Set ${set}`;

      // Викликаємо функцію для відкриття модалки, коли натискається на кнопку
      btn.onclick = () => {
        const title = `Set ${set}`;
        const content = `Details for Set ${set}`;

        // Отримуємо перелік слів для цього набору
        const wordList = words.filter(word => word.set == set).map(word => word.word);

        // Відкриваємо модалку
        openModal(title, content, wordList);
      };

      // Обробка події на клавіатурі (Enter або Space)
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          btn.click();  // Імітуємо клік на натискання клавіші Enter або Space
        }
      });

      container.appendChild(btn); // Додаємо кнопку в контейнер
    });
  })
  .catch(error => {
    console.error("Помилка при завантаженні даних:", error);
  });

// Функція для відкриття модалки
function openModal(title, content, wordList) {
  // Оновлення вмісту модалки
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalContent").textContent = content;

  // Виведення списку слів
  const modalWordList = document.getElementById("modalWordList");
  const wordListHtml = wordList.map(word => `<li>${word}</li>`).join('');
  modalWordList.innerHTML = `<h4>Слова для тренування:</h4><ul>${wordListHtml}</ul>`;

  // Показуємо модальне вікно та бекдроп
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("backdrop");

  modal.style.display = "block";
  backdrop.style.display = "block";
  document.body.classList.add("modal-open");
}

// Закриття модалки при натисканні на кнопку
document.getElementById("closeModalBtn").onclick = function() {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("backdrop");

  modal.style.display = "none";
  backdrop.style.display = "none";
  document.body.classList.remove("modal-open");
};

// Початок тренування
document.querySelectorAll(".start_btn").forEach(button => {
  button.onclick = function() {
    // Отримуємо дані про вибраний набір слів без локального сховища
    const selectedSetTitle = document.getElementById("modalTitle").textContent.replace("Set ", "").trim();
    const selectedSetWordList = Array.from(document.querySelectorAll("#modalWordList li"))
      .map(item => item.textContent);

    if (selectedSetWordList.length > 0) {
      // Передаємо параметри в URL і переходимо на сторінку тренувань
      window.location.href = `training.html?set=${selectedSetTitle}`;
    } else {
      alert('Не вибрано набір слів для тренування');
    }
  };
});
