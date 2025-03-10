// ======== СКРИПТ ДЛЯ ГОЛОВНОЇ СТОРІНКИ ==========

// ======== ЗАВАНТАЖЕННЯ СЛІВ ========
async function loadWords() {
    try {
        // Завантажуємо дані з JSON
        const response = await fetch('words.json');
        const words = await response.json();

        // Формуємо унікальні набори
        const sets = [...new Set(words.map(w => w.set))].sort();
        const container = document.getElementById('sets');
        
        if (!container) {
            console.error("Елемент 'sets' не знайдено. (main page)");
            return;
        }

        // Створюємо кнопки для кожного набору
        sets.forEach(set => {
            const btn = document.createElement('div');
            btn.className = 'set_button openModalBtn';
            btn.textContent = `Set ${set}`;
            btn.onclick = () => {
                const wordList = words.filter(word => word.set === set);
                openModal(set, wordList);
            };
            container.appendChild(btn);
        });
    } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
    }
}

loadWords(); // викликаємо функцію завантаження слів


// ======== ФУНКЦІЯ ВІДКРИТТЯ МОДАЛКИ ========
function openModal(set, words) {
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('backdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalWordList = document.getElementById('modalWordList');
    
    if (!modal || !backdrop || !modalTitle || !modalWordList) {
        console.error("Один з елементів модалки не знайдений!");
        return;
    }

    modalTitle.textContent = `Set ${set}`;

    if (!Array.isArray(words) || words.length === 0) {
        modalWordList.innerHTML = "<p>Список слів не знайдено</p>";
        return;
    }

    modalWordList.innerHTML = words.map(word =>
        `<li class="list_item"><div>${word.word}</div><div>${word.translate}</div></li>`
    ).join('');

    modal.style.display = "block";
    backdrop.style.display = "block";
    modal.classList.add("modal-open"); // Додаємо клас modal-open до елемента modal

    // Кнопка "Start" для переходу на сторінку тренування
    const startModalBtns = document.querySelectorAll(".start_btn");
    if (startModalBtns.length > 0) {
        startModalBtns.forEach(btn => {
            btn.onclick = () => {
                window.location.href = `training.html?set=${set}`;
            };
        });
    } else {
        console.error("Елементи з класом 'start_btn' не знайдені!");
    }
}


// ======== ФУНКЦІЯ ЗАКРИТТЯ МОДАЛКИ ========
const closeModalBtn = document.getElementById('closeModalBtn'); // перевірка кнопки закриття
const modal = document.getElementById('modal');
const backdrop = document.getElementById('backdrop');

if (closeModalBtn) {
    closeModalBtn.onclick = function () {
        if (modal && backdrop) {
            modal.style.display = "none";
            backdrop.style.display = "none";
            modal.classList.remove("modal-open"); // Видаляємо клас modal-open з елемента modal
        } else {
            console.error("Елементи модалки або бекдропу не знайдені!");
        }
    };
} else {
    console.error("Кнопка закриття модалки не знайдена!");
}
