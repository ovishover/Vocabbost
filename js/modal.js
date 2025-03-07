// Отримуємо елементи з HTML
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const startModalBtns = document.querySelectorAll(".start_btn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalWordList = document.getElementById("modalWordList"); // Новий елемент для списку слів

// Функція для відкриття модального вікна
function openModal(title, content, wordList) {
    modalTitle.textContent = title;
    modalContent.textContent = content;
    
    // Виводимо перелік слів у модалці
    const wordListHtml = wordList.map(word => `<li>${word}</li>`).join('');
    modalWordList.innerHTML = `<h4>Слова:</h4><ul>${wordListHtml}</ul>`;

    modal.style.display = "block";
    backdrop.style.display = "block";
    document.body.classList.add("modal-open");
}

// Обробник кнопок закриття модалки
closeModalBtn.onclick = function() {
    modal.style.display = "none";
    backdrop.style.display = "none";
    document.body.classList.remove("modal-open");
};

// Функція для старту тренування
startModalBtns.forEach(btn => {
    btn.onclick = function() {
        const set = modalTitle.textContent.replace("Set ", "").trim();
        window.location.href = `training.html?set=${set}`;
    };
};
