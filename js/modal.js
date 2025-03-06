// Отримуємо елементи з HTML
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

// Отримуємо всі кнопки для відкриття модального вікна
const openModalBtns = document.querySelectorAll(".openModalBtn");

// Функція для відкриття модального вікна
openModalBtns.forEach(button => {
    button.onclick = function() {
        const title = button.getAttribute("data-title");
        const content = button.getAttribute("data-content");

        // Оновлюємо контент модального вікна
        modalTitle.textContent = title;
        modalContent.textContent = content;

        // Показуємо модальне вікно та бекдроп
        modal.style.display = "block";
        backdrop.style.display = "block";
    };
});

// Функція для закриття модального вікна
closeModalBtn.onclick = function() {
    modal.style.display = "none";
    backdrop.style.display = "none";
};

// Закрити модальне вікно при кліку на бекдроп
backdrop.onclick = function() {
    modal.style.display = "none";
    backdrop.style.display = "none";
};
