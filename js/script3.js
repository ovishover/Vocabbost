// // ======== СКРИПТ КНОПОК НАВІГАЦІЇ ==========



// //   // ======== ОТРИМАННЯ ЕЛЕМЕНТІВ ==========
// const trainList = document.getElementById("train_list");
// const backToSets = document.getElementById("backToSets");
// const answSection = document.getElementById("game_area");
// const backToTrainList = document.getElementById("backToTrainList");

// function toggleVisibility(elementsToHide, elementsToShow, backToTrainListVisibility = 'none') {
//     // Додаємо клас 'hidden' для елементів, які потрібно приховати
//     elementsToHide.forEach(el => el && el.classList.add('hidden'));

//     // Видаляємо клас 'hidden' для елементів, які потрібно показати
//     elementsToShow.forEach(el => el && el.classList.remove('hidden'));

//     // Замість стилю використовуємо клас для видимості
//     if (backToTrainList) {
//         if (backToTrainListVisibility === 'none') {
//             backToTrainList.classList.add('hidden');
//         } else {
//             backToTrainList.classList.remove('hidden');
//         }
//     }
// }

// document.querySelectorAll(".trainItems").forEach(button => {
//     button.addEventListener("click", () => {
//         toggleVisibility([trainList, backToSets], [answSection, backToTrainList], 'flex');
//     });
// });

// if (backToTrainList) {
//     backToTrainList.addEventListener("click", () => {
//         toggleVisibility([answSection, backToTrainList], [trainList, backToSets], 'none');
//     });
// }

// document.querySelectorAll(".backToMain").forEach(button => {
//     button.addEventListener("click", () => {
//         window.location.href = 'index.html';
//     });
// });
