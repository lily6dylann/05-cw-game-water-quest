// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timer = 30;
let timerInterval;

const grid = document.querySelector('.game-grid');
const cansCounter = document.getElementById('current-cans');
const startBtn = document.getElementById('start-game');
const resetBtn = document.getElementById('reset-game');
const timerDisplay = document.getElementById('timer');
const achievement = document.getElementById('achievements');

const winningMessages = [
  "Amazing! You brought clean water to a community!",
  "Incredible! Every can counts for clean water!",
  "You did it! More people have access to safe water!",
  "Victory! Your speed brings hope!",
  "Fantastic! You’re a water hero!"
];
const losingMessages = [
  "Time is up! Try again to bring clean water!",
  "Almost there! Give it another go!",
  "Keep going! Every can helps!",
  "Don't give up! Clean water is worth it!",
  "So close! Try again for more impact!"
];

// Create the grid cells (3x3)
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Show a can in a random cell
function spawnWaterCan() {
  if (!gameActive) return;
  // Clear all cells
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => cell.innerHTML = '');

  // Pick a random cell
  const idx = Math.floor(Math.random() * cells.length);
  const can = document.createElement('div');
  can.className = 'water-can';
  can.title = 'Collect this can!';
  can.setAttribute('tabindex', '0');

  // Click or keyboard to collect
  can.addEventListener('click', collectCan);
  can.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      collectCan.call(can, e);
    }
  });

  cells[idx].appendChild(can);
}

// Collect can handler
function collectCan(e) {
  if (!gameActive) return;
  currentCans++;
  cansCounter.textContent = currentCans;
  showAchievement("+1 can collected!");
  // Prevent double-collecting
  this.removeEventListener('click', collectCan);
  this.removeEventListener('keydown', collectCan);
  // Remove can after click for feedback
  this.style.opacity = '0.5';
}

// Show achievement message
function showAchievement(message) {
  achievement.textContent = message;
  achievement.style.background = '#2E9DF7';
  achievement.style.color = '#fff';
  achievement.style.padding = '8px 0';
  achievement.style.borderRadius = '6px';
  achievement.style.transition = 'opacity 0.3s';
  achievement.style.opacity = '1';
  setTimeout(() => {
    achievement.style.opacity = '0';
  }, 900);
}

// Start the game
function startGame() {
  if (gameActive) return;
  gameActive = true;
  currentCans = 0;
  cansCounter.textContent = currentCans;
  timer = 30;
  timerDisplay.textContent = timer;
  createGrid();
  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, 900);
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

// End the game
function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  // Remove all cans
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => cell.innerHTML = '');
  let win = currentCans >= 20;
  let message = win
    ? winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : losingMessages[Math.floor(Math.random() * losingMessages.length)];
  showAchievement(message);
  if (win) launchConfetti();
}

// Reset the game
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  cansCounter.textContent = currentCans;
  timer = 30;
  timerDisplay.textContent = timer;
  achievement.textContent = '';
  createGrid();
}

// Confetti effect (simple)
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.background = ['#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A', '#F5402C', '#159A48', '#F16061'][Math.floor(Math.random()*8)];
    conf.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    conf.style.opacity = Math.random();
    conf.style.transform = `rotate(${Math.random()*360}deg)`;
    conf.style.position = 'fixed';
    conf.style.top = '-20px';
    conf.style.width = '10px';
    conf.style.height = '18px';
    conf.style.zIndex = 9999;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2000);
  }
}

// Event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Initialize grid on load
createGrid();

// Add CSS for score-bump animation
const style = document.createElement('style');
style.innerHTML = `
#current-cans.score-bump {
  color: #FFC907;
  font-size: 2em;
  transition: font-size 0.2s, color 0.2s;
}
`;
document.head.appendChild(style);

// Add confetti CSS
const confettiStyle = document.createElement('style');
confettiStyle.innerHTML = `
.confetti {
  border-radius: 3px;
  pointer-events: none;
  animation: confetti-fall linear forwards;
}
@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}
`;
document.head.appendChild(confettiStyle);
