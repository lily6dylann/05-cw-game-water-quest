// Game configuration and state variables
const difficultySelect = document.getElementById('difficulty');

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy:   { goal: 15, time: 40, spawn: 1200 },
  normal: { goal: 20, time: 30, spawn: 900 },
  hard:   { goal: 30, time: 20, spawn: 600 }
};

let GOAL_CANS = DIFFICULTY_SETTINGS.normal.goal;
let timer = DIFFICULTY_SETTINGS.normal.time;
let spawnSpeed = DIFFICULTY_SETTINGS.normal.spawn;

let currentCans = 0;
let gameActive = false;
let spawnInterval;
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
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => cell.innerHTML = '');

  const idx = Math.floor(Math.random() * cells.length);
  const can = document.createElement('div');
  can.className = 'water-can';
  can.title = 'Collect this can!';
  can.setAttribute('tabindex', '0');
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

  if (this.dataset.type === 'bad') {
    currentCans = Math.max(0, currentCans - 2); // deduct points for bad can
    showAchievement("Oops! Dirty water -2");
  } else {
    currentCans++;
    showAchievement("+1 can collected!");
    // Special achievement every 5 cans
    if (currentCans > 0 && currentCans % 5 === 0) {
      showAchievement(`You’ve helped ${currentCans} people get clean water!`);
    }
  }
  cansCounter.textContent = currentCans;

  // Update progress bar
  document.getElementById('progress-bar').style.width =
    `${(currentCans / GOAL_CANS) * 100}%`;

  // Add a quick pop animation before removing the can
  this.style.transition = 'transform 0.15s, opacity 0.15s';
  this.style.transform = 'scale(1.3)';
  this.style.opacity = '0';

  // Remove the can from the DOM after the animation
  setTimeout(() => {
    if (this.parentNode) this.parentNode.removeChild(this);
  }, 150);

  // Prevent double-collecting
  this.removeEventListener('click', collectCan);
  this.removeEventListener('keydown', collectCan);
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

// Update settings based on difficulty
function setDifficulty() {
  const diff = difficultySelect.value;
  GOAL_CANS = DIFFICULTY_SETTINGS[diff].goal;
  timer = DIFFICULTY_SETTINGS[diff].time;
  spawnSpeed = DIFFICULTY_SETTINGS[diff].spawn;
  timerDisplay.textContent = timer;
  document.querySelector('.game-instructions').textContent =
    `Collect ${GOAL_CANS} items to complete the game!`;
}

// Start the game
function startGame() {
  setDifficulty();
  if (gameActive) return;
  gameActive = true;
  currentCans = 0;
  cansCounter.textContent = currentCans;
  timerDisplay.textContent = timer;
  createGrid();
  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, spawnSpeed);
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
  let win = currentCans >= GOAL_CANS;
  let message = win
    ? winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : losingMessages[Math.floor(Math.random() * losingMessages.length)];
  showAchievement(message);
  if (win) launchConfetti();
}

// Reset the game
function resetGame() {
  setDifficulty();
  timerDisplay.textContent = timer;
  achievement.textContent = '';
  createGrid();(timerInterval);
} currentCans = 0;
  cansCounter.textContent = currentCans;
// Confetti effect (simple)= timer;
function launchConfetti() { '';
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.background = ['#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A', '#F5402C', '#159A48', '#F16061'][Math.floor(Math.random()*8)];
    conf.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    conf.style.opacity = Math.random();('div');
    conf.style.transform = `rotate(${Math.random()*360}deg)`;
    conf.style.position = 'fixed';) * 100 + 'vw';
    conf.style.top = '-20px';'#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A', '#F5402C', '#159A48', '#F16061'][Math.floor(Math.random()*8)];
    conf.style.width = '10px';on = (Math.random() * 1 + 1.5) + 's';
    conf.style.height = '18px';andom();
    conf.style.zIndex = 9999;otate(${Math.random()*360}deg)`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2000);
  } conf.style.width = '10px';
}   conf.style.height = '18px';
    conf.style.zIndex = 9999;
// Event listenersappendChild(conf);
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
}
// Initialize grid on load
createGrid();eners
startBtn.addEventListener('click', startGame);
// Add CSS for score-bump animationresetGame);
const style = document.createElement('style');
style.innerHTML = `on load
#current-cans.score-bump {
  color: #FFC907;
  font-size: 2em;ore-bump animation
  transition: font-size 0.2s, color 0.2s;le');
}tyle.innerHTML = `
`;urrent-cans.score-bump {
document.head.appendChild(style);
  font-size: 2em;
// Add confetti CSSsize 0.2s, color 0.2s;
const confettiStyle = document.createElement('style');
confettiStyle.innerHTML = `
.confetti {ad.appendChild(style);
  border-radius: 3px;
  pointer-events: none;
  animation: confetti-fall linear forwards;t('style');
}onfettiStyle.innerHTML = `
@keyframes confetti-fall {
  to {er-radius: 3px;
    transform: translateY(100vh) rotate(360deg);
  }nimation: confetti-fall linear forwards;
}
`;eyframes confetti-fall {
document.head.appendChild(confettiStyle);
    transform: translateY(100vh) rotate(360deg);
  }
}
`;
document.head.appendChild(confettiStyle);

/* Suggested CSS Change */
.water-can {
  background: #2E9DF7;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  box-shadow: 0 0 8px #2E9DF755;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popUp 0.2s;
}
