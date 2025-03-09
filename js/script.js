  // ======== ОТРИМАННЯ ЕЛЕМЕНТІВ ==========
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("backdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalWordList = document.getElementById("modalWordList");
  const repeatBtn = document.getElementById("repeatBtn");
  const trainList = document.getElementById("train_list");
  const backToSets = document.getElementById("backToSets");
  const answSection = document.getElementById("answ_section");
  const backToTrainList = document.getElementById("backToTrainList");

  // ======== ФУНКЦІЯ ВІДКРИТТЯ МОДАЛКИ ==========
  function openModal(set, words) {
      if (!modal || !modalTitle || !modalWordList || !backdrop || !closeModalBtn) {
          console.error("Помилка: не знайдено елементи модального вікна.");
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
      document.body.classList.add("modal-open");

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

  if (closeModalBtn) {
      closeModalBtn.onclick = function () {
          modal.style.display = "none";
          backdrop.style.display = "none";
          document.body.classList.remove("modal-open");
      };
  }

  // ======== ЗАВАНТАЖЕННЯ СЛІВ ==========
  fetch('words.json')
      .then(response => response.json())
      .then(words => {
          const sets = [...new Set(words.map(w => w.set))].sort();
          const container = document.getElementById('sets');
          if (!container) {
              console.error("Елемент 'sets' не знайдено.");
              return;
          }

          sets.forEach(set => {
              const btn = document.createElement('div');
              btn.className = 'set_button openModalBtn';
              btn.textContent = `Set ${set}`;
              btn.onclick = () => {
                  const wordList = words.filter(word => word.set == set);
                  openModal(set, wordList);
              };
              container.appendChild(btn);
          });
      })
      .catch(error => console.error("Помилка при завантаженні даних:", error));

  if (repeatBtn) {
      repeatBtn.onclick = () => startMode("anagram");
  }

  // ======== НАВІГАЦІЯ ПО КНОПКАМ ==========
  function toggleVisibility(elementsToHide, elementsToShow, backToTrainListVisibility = 'none') {
      elementsToHide.forEach(el => el && (el.style.display = 'none'));
      elementsToShow.forEach(el => el && (el.style.display = 'block'));
      if (backToTrainList) backToTrainList.style.display = backToTrainListVisibility;
  }

  document.querySelectorAll(".trainItems").forEach(button => {
      button.addEventListener("click", () => {
          toggleVisibility([trainList, backToSets], [answSection, backToTrainList], 'flex');
      });
  });

  if (backToTrainList) {
      backToTrainList.addEventListener("click", () => {
          toggleVisibility([answSection, backToTrainList], [trainList, backToSets], 'none');
      });
  }

  document.querySelectorAll(".backToMain").forEach(button => {
      button.addEventListener("click", () => {
          window.location.href = 'index.html';
      });
  });
