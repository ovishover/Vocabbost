// ======== СКРИПТ ДЛЯ ГОЛОВНОЇ СТОРІНКИ ==========

let category
// ======== ЗАВАНТАЖЕННЯ СЛІВ ========
async function loadWords() {
    try {
        // Завантажуємо дані з JSON
        const response = await fetch('words.json');
        const words = await response.json();

        // Формуємо унікальні набори
        const sets = [...new Set(words.map(w => Number(w.set)))].sort((a, b) => a - b);
        const container = document.getElementById('sets');
        
        if (!container) {
            console.error("Елемент 'sets' не знайдено. (main page)");
            return;
        }

        // Створюємо кнопки для кожного набору
        sets.forEach(set => {
            const btn = document.createElement('li');
            btn.className = 'set_button openModalBtn';
        
            // Визначаємо категорію для цього сета
            const setCategory = words.find(word => Number(word.set) === set)?.category || 'Unknown';
        
            const pSet = document.createElement('p');
            pSet.textContent = `Set: ${set}`;
            pSet.classList.add('set_info');
        
            const pCategory = document.createElement('p');
            pCategory.textContent = `${setCategory}`;
            pCategory.classList.add('category_info');
        
            btn.appendChild(pSet);
            btn.appendChild(pCategory);
        
            btn.onclick = () => {
                const wordList = words.filter(word => Number(word.set) === set);
                openModal(set, wordList, setCategory); // ← передаємо категорію
            };
        
            container.appendChild(btn);
        });
        
    } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
    }
}

loadWords(); // викликаємо функцію завантаження слів


// ======== ФУНКЦІЯ ВІДКРИТТЯ МОДАЛКИ ========
function openModal(set, words, category) {
    const modal = document.getElementById('modal');
    const backdrop = document.getElementById('backdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalWordList = document.getElementById('modalWordList');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const startModalBtns = document.querySelectorAll(".start_btn");

    if (!modal || !backdrop || !modalTitle || !modalWordList || !closeModalBtn || !startModalBtns) {
        console.error("Один з елементів модалки не знайдений!");
        return;
    }

    modalTitle.textContent = `Set ${set} - ${category}`;

    if (!Array.isArray(words) || words.length === 0) {
        modalWordList.innerHTML = "<p>Список слів не знайдено</p>";
        return;
    }

    modalWordList.innerHTML = words.map(word =>
        `<li class="list_item"><div>${word.word}</div><div>${word.translate}</div></li>`
    ).join('');

    modal.style.display = "block";
    backdrop.style.display = "block";
    modal.classList.add("modal-open");

    // Кнопка "Start" для переходу на сторінку тренування
    
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
        if (modal && backdrop) {
            modal.style.display = "none";
            backdrop.style.display = "none";
            modal.classList.remove("modal-open");
        } else {
            console.error("Елементи модалки або бекдропу не знайдені!");
        }
    };
} else {
    console.error("Кнопка закриття модалки не знайдена!");
}
