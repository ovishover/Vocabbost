// ======== СКРИПТ ДЛЯ СТОРІНКИ ТРЕНУВАНЬ ==========



// /// Функція для отримання параметра з URL
// function getUrlParameter(name) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(name);
// }

// // Функція для завантаження слів
// async function loadTrainingWords() {
//   const setNumber = getUrlParameter('set'); // Отримуємо номер сету з URL
//   if (!setNumber) {
//       console.error("Номер сету не вказаний в URL.");
//       return;
//   }

//   try {
//       // Завантажуємо дані з JSON
//       const response = await fetch('words.json');
//       const words = await response.json();

//       // Фільтруємо слова для відповідного сету
//       const selectedWords = words.filter(word => word.set == setNumber);

//       if (selectedWords.length === 0) {
//           console.error(`Немає слів для сету ${setNumber}.`);
//           return;
//       }

//       // Логіка успішного завантаження набору
//       console.log(`Набір слів для Set ${setNumber} успішно завантажено!`);

//       // Зберігаємо набір слів у глобальній змінній
//       window.selectedWords = selectedWords;

//       // Перевірка, чи набір слів завантажено
//       console.log(window.selectedWords);

//   } catch (error) {
//       console.error("Помилка при завантаженні даних для тренування:", error);
//   }
// }

// // Викликаємо функцію завантаження слів при завантаженні сторінки
// loadTrainingWords();


