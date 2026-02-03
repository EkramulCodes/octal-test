const heading = document.querySelector(".heading");
const setupArea = document.querySelector("#setup-area");
const p1Area = document.querySelector("#player1-area");
const guessArea = document.querySelector("#guess-area");
const numberPad = document.querySelector(".number-pad");
const resultsSummary = document.querySelector("#results-summary");
const resetBtn = document.querySelector(".reset-btn");

const pCountInput = document.querySelector(".player-count");
const p1Input = document.querySelector(".player-1-num");
const p1Err = document.querySelector(".player-1-err");
const guessErr = document.querySelector(".guess-err");

let secretNumber;
let totalGuessers = 2;
let currentPlayerIndex = 2; 
let guessesLeft = 3;
let gameHistory = []; 

// Create buttons 1-10 once
for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.classList.add("num-btn");
    btn.innerText = i;
    btn.addEventListener("click", () => handleGuess(i));
    numberPad.appendChild(btn);
}

document.querySelector(".start-setup-btn").addEventListener("click", () => {
    totalGuessers = parseInt(pCountInput.value);
    if (totalGuessers < 2 || totalGuessers > 5) return;
    setupArea.classList.add("hidden");
    p1Area.classList.remove("hidden");
    heading.innerHTML = "Player 1: Set the Number";
});

document.querySelector(".player-1-btn").addEventListener("click", () => {
    const val = parseInt(p1Input.value);
    if (!p1Input.value || isNaN(val) || val < 1 || val > 10) {
        p1Err.innerHTML = "Enter 1-10";
        return;
    }
    secretNumber = val;
    p1Area.classList.add("hidden");
    guessArea.classList.remove("hidden");
    startNewPlayerTurn();
});

function startNewPlayerTurn() {
    gameHistory.push({ player: currentPlayerIndex, guesses: [], won: false });
    heading.innerHTML = `Player ${currentPlayerIndex} - <span>${guessesLeft}</span> chances`;
    guessErr.innerHTML = "";
}

function handleGuess(num) {
    if (guessesLeft <= 0) return;

    guessesLeft--;
    const currentRecord = gameHistory[gameHistory.length - 1];
    currentRecord.guesses.push(num);

    if (num === secretNumber) {
        currentRecord.won = true;
        guessErr.innerHTML = "Correct!";
        finishTurn(); 
    } else if (guessesLeft === 0) {
        guessErr.innerHTML = "Out of chances!";
        finishTurn();
    } else {
        guessErr.innerHTML = num > secretNumber ? `${num} is too High! ↓` : `${num} is too Low! ↑`;
        heading.innerHTML = `Player ${currentPlayerIndex} - <span>${guessesLeft}</span> chances`;
    }
}

function finishTurn() {
    // Disable pad briefly
    numberPad.style.pointerEvents = "none";

    if (currentPlayerIndex < totalGuessers + 1) {
        setTimeout(() => {
            currentPlayerIndex++;
            guessesLeft = 3;
            numberPad.style.pointerEvents = "auto";
            startNewPlayerTurn();
        }, 1500);
    } else {
        setTimeout(showFinalScoreboard, 1000);
    }
}

function showFinalScoreboard() {
    guessArea.classList.add("hidden");
    heading.innerHTML = `Game Over! Secret Number: ${secretNumber}`;
    
    let tableHtml = `<table><tr><th>Player</th><th>Guesses</th><th>Status</th></tr>`;
    gameHistory.forEach(item => {
        tableHtml += `
            <tr>
                <td>Player ${item.player}</td>
                <td>${item.guesses.join(", ")}</td>
                <td class="${item.won ? 'status-right' : 'status-wrong'}">
                    ${item.won ? 'Correct' : 'Incorrect'}
                </td>
            </tr>`;
    });
    tableHtml += `</table>`;
    
    resultsSummary.innerHTML = tableHtml;
    resultsSummary.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
}

resetBtn.addEventListener("click", () => location.reload());