
let words = [];
let mistakes = [];
let currentWords = [];
let allAnswers = [];
let score = 0;
let audioCorrect = new Audio("sounds/correct.mp3");
let audioWrong = new Audio("sounds/wrong.mp3");

async function loadWords() {
    let response = await fetch("words.csv");
    let data = await response.text();
    words = data.trim().split("\n").map(line => line.split(","));
    createPortionMenu();
}

function createPortionMenu() {
    let portionMenu = document.getElementById("portionMenu");
    portionMenu.innerHTML = "";
    for (let i = 0; i < words.length; i += 10) {
        let btn = document.createElement("button");
        btn.textContent = `Набір ${i / 10 + 1}`;
        btn.classList.add("btn_part");
        btn.onclick = () => previewWords(words.slice(i, i + 10), i);
        portionMenu.appendChild(btn);
    }
}

function previewWords(portion, index) {
    let preview = document.getElementById("wordPreview");
    preview.innerHTML = portion.map(word => `${word[0]} - ${word[1]}`).join("<br>");
    preview.classList.remove("hidden");
    let startBtn = document.createElement("button");
    startBtn.classList.add("button_start");
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-container");
    startBtn.textContent = "Розпочати";
    buttonDiv.appendChild(startBtn);
    preview.appendChild(buttonDiv);
    startBtn.onclick = () => startPortion(words.slice(index, index + 10));
    preview.appendChild(buttonDiv);
}


function startPortion(portion) {
    currentWords = portion.slice();
    allAnswers = portion.slice();
    score = 0;
    mistakes = [];
    document.querySelector(".menu").classList.add("hidden");
    document.querySelector(".game").classList.remove("hidden");
    showQuestion();
}

function showQuestion() {
    if (currentWords.length === 0) {
        endGame();
        return;
    }

    let randomIndex = Math.floor(Math.random() * currentWords.length);
    let word = currentWords[randomIndex];
    currentWords.splice(randomIndex, 1);

    document.querySelector(".question").textContent = word[0];
    document.querySelector(".question").classList.add("flash");
    setTimeout(() => document.querySelector(".question").classList.remove("flash"), 600);

    let options = [...allAnswers].sort(() => Math.random() - 0.5).slice(0, 3);
    options.push(word);
    options.sort(() => Math.random() - 0.5);

    let answers = document.querySelector(".answers");
    answers.innerHTML = "";
    options.forEach(option => {
        let btn = document.createElement("button");
        btn.classList.add("button-answ");
        btn.textContent = option[1];
        btn.onclick = () => checkAnswer(word, option[1]);
        answers.appendChild(btn);
    });
}

function checkAnswer(correct, selected) {
    if (correct[1] === selected) {
        score++;
        document.getElementById("score").textContent = score;
        audioCorrect.play();
    } else {
        mistakes.push(correct);
        audioWrong.play();
    }
    setTimeout(showQuestion, 400);
}

function exitGame() {
    if (confirm("Ви дійсно хочете вийти?")) {
        location.reload();
    }
}

function endGame() {
    document.querySelector(".exitRound").classList.add("hidden");
    document.querySelector(".question").classList.add("hidden");
    document.querySelector(".answers").classList.add("hidden");
    document.querySelector(".endMsg").classList.remove("hidden");
    // document.querySelector(".answers").innerHTML = "";
    let result = document.querySelector(".result");
    mistakes.forEach(m => {
        result.innerHTML += `<div class="result_words">${m[0]}</div> <div class="result_words">${m[1]}</div>`;
    });
    result.innerHTML += `<button onclick="location.reload()" class="comeback">Повернутися до меню</button>`;
}

window.onload = loadWords;
