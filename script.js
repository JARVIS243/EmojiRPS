const emojis = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️"
};

// 🎵 Load sounds
const winSound = new Audio('assets/audios/win.mp3');
const loseSound = new Audio('assets/audios/lose.mp3');
const drawSound = new Audio('assets/audios/draw.mp3');
const clickSound = new Audio('assets/audios/click.mp3');

let playerScore = 0;
let computerScore = 0;
let streak = 0;
let highscore = parseInt(localStorage.getItem("highscore")) || 0;
let isMuted = false;
let gameOver = false;

document.getElementById("highscore").textContent = highscore;

// Main game logic
function play(playerMove) {
  if (gameOver) return;

  const computerMove = getComputerMove();
  document.getElementById("player-choice").textContent = `You: ${emojis[playerMove]}`;
  document.getElementById("computer-choice").textContent = `Computer: ❓`;
  document.getElementById("outcome").textContent = "Thinking...";

  const vsFlash = document.getElementById("vs-flash");
  vsFlash.classList.add("show");

  setTimeout(() => {
    vsFlash.classList.remove("show");
    document.getElementById("computer-choice").textContent = `Computer: ${emojis[computerMove]}`;
    
    const result = getResult(playerMove, computerMove);
    const targetScore = parseInt(document.getElementById("targetScoreSelect").value);

    if (result === "win") {
      playerScore++;
      streak++;
      if (streak > highscore) {
        highscore = streak;
        localStorage.setItem("highscore", highscore);
      }
      document.getElementById("outcome").textContent = "🎉 You Win!";
      if (!isMuted) winSound.play();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (result === "lose") {
      computerScore++;
      streak = 0;
      document.getElementById("outcome").textContent = "😞 You Lose!";
      if (!isMuted) loseSound.play();
    } else {
      document.getElementById("outcome").textContent = "🤝 It's a Draw!";
      if (!isMuted) drawSound.play();
    }

    updateScore();

    // End game if target score reached
    if (playerScore >= targetScore) {
      document.getElementById("outcome").textContent = "🏆 You reached the target!";
      gameOver = true;
    } else if (computerScore >= targetScore) {
      document.getElementById("outcome").textContent = "💀 Computer reached the target!";
      gameOver = true;
    }

  }, 1000);
}

// Random computer move
function getComputerMove() {
  const moves = ["rock", "paper", "scissors"];
  return moves[Math.floor(Math.random() * moves.length)];
}

// Determine result
function getResult(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) return "win";
  return "lose";
}

// Update all score displays
function updateScore() {
  document.getElementById("player-score").textContent = playerScore;
  document.getElementById("computer-score").textContent = computerScore;
  document.getElementById("streak").textContent = streak;
  document.getElementById("highscore").textContent = highscore;
}

// 🔁 Reset game
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  streak = 0;
  gameOver = false;
  updateScore();
  document.getElementById("player-choice").textContent = "You: ❓";
  document.getElementById("computer-choice").textContent = "Computer: ❓";
  document.getElementById("outcome").textContent = "Let's play!";
}

// 🌗 Toggle dark mode
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 🔇 Toggle mute
document.getElementById("muteToggle").addEventListener("click", () => {
  isMuted = !isMuted;
  document.getElementById("muteToggle").textContent = isMuted ? "🔇" : "🔊";
});
