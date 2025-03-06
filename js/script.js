// Завантаження даних для наборів слів
  fetch('words.json')
  .then(response => response.json())
  .then(words => {
    const sets = [...new Set(words.map(w => w.set))]; // Унікальні набори
    sets.sort(); // Сортуємо набір за зростанням (якщо це числові значення, можна додати додаткову логіку сортування)

    const container = document.getElementById('sets');

    sets.forEach(set => {
      const btn = document.createElement('div');
      btn.className = 'set_button openModalBtn';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', 0);
      btn.textContent = `Set ${set}`;
      btn.onclick = () => {
        const title = `Set ${set}`;  // Можна передавати відповідну інформацію
        const content = `Details for Set ${set}`;  // Інформація для контенту

    modalTitle.textContent = title;  // Оновлюємо заголовок модалки
    modalContent.textContent = content;  // Оновлюємо контент модалки

    // Показуємо модальне вікно та бекдроп
    modal.style.display = "block";
    backdrop.style.display = "block";

    // Блокуємо прокручування сторінки
    document.body.classList.add("modal-open");
      };
       // Обробка події на клавіатурі (Enter або Space)
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
          btn.click();  // Імітуємо клік на натискання клавіші Enter або Space
      }
  });
      container.appendChild(btn);
    });
  });



    // Отримання параметрів URL і завантаження слів для тренування
    const urlParams = new URLSearchParams(window.location.search);
    const set = urlParams.get('set');
    let words = [];
    let correctAnswers = 0;
    let mistakes = [];
    let currentIndex = 0;
    
    document.getElementById('repeatBtn').style.display = 'none';
    
    fetch('words.json')
      .then(response => response.json())
      .then(data => {
        words = data.filter(w => w.set == set);
        console.log(`Завантажено ${words.length} слів для набору ${set}`);
      });
    


      // Функція для старту тренування (режими гри)
    function startMode(mode) {
      if (words.length === 0) {
        alert('Завантаження слів, будь ласка, зачекайте!');
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
    

    