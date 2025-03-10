// ======== СКРИПТ КНОПОК НАВІГАЦІЇ ==========



//   // ======== ОТРИМАННЯ ЕЛЕМЕНТІВ ==========
const trainList = document.getElementById("train_list");
const backToSets = document.getElementById("backToSets");
const answSection = document.getElementById("game_area");

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
