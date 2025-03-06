// Отримуємо елементи з HTML
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const startModalBtn = document.getElementById("start_btn");
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

        // Блокуємо прокручування сторінки
        document.body.classList.add("modal-open");
    };
});

// Функція для закриття модального вікна при натисканні на кнопку закриття
closeModalBtn.onclick = function() {
    modal.style.display = "none";
    backdrop.style.display = "none";

    // Відновлюємо прокручування сторінки
    document.body.classList.remove("modal-open");
};

// startModalBtn.onclick = function() {
//     const set = modalTitle.textContent; // Або отримайте значення іншим способом
//     window.location.href = `training.html?set=${set}`;
// };




const startModalBtns = document.querySelectorAll(".start_btn");

startModalBtns.forEach(btn => {
    btn.onclick = function() {
        const set = modalTitle.textContent.replace("Set ", "").trim(); // Отримуємо номер набору
        window.location.href = `training.html?set=${set}`;
    };
});
