// // ======== СКРИПТ ДЛЯ ГОЛОВНОЇ СТОРІНКИ ==========


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
    document.body.classList.add("modal-open");

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
if (closeModalBtn) {
    closeModalBtn.onclick = function () {
        modal.style.display = "none";
        backdrop.style.display = "none";
        document.body.classList.remove("modal-open");
    };
}