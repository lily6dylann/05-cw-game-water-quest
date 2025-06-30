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
let highScore = localStorage.getItem('highScore') || 0;
let streak = 0;
const highScoreDisplay = document.getElementById('high-score');
const streakDisplay = document.getElementById('streak');

const progressBar = document.getElementById('progress-bar');
const container = document.querySelector('.container');
let lastMilestone = 0;

const MILESTONES = [
  { percent: 0.25, messages: ["Great start! 25% of your goal!", "Keep going! 25% reached!"] },
  { percent: 0.5,  messages: ["Halfway there! 50% reached!", "Awesome! You’re halfway!"] },
  { percent: 0.75, messages: ["Almost done! 75% reached!", "So close! 75% of your goal!"] },
  { percent: 1,    messages: ["Goal reached! Amazing!", "You did it! 100% complete!"] }
];
let triggeredMilestones = new Set();

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

// Create the grid cells (4x3 for 12 cells)
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 12; i++) {
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
  let isBonus = Math.random() < 0.2; // 20% chance
  can.className = isBonus ? 'water-can bonus-can' : 'water-can';
  can.title = isBonus ? 'Bonus can! +3 points' : 'Collect this can!';
  can.setAttribute('tabindex', '0');
  can.addEventListener('click', function(e) {
    collectCan.call(can, e, isBonus);
  });
  can.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      collectCan.call(can, e, isBonus);
    }
  });
  cells[idx].appendChild(can);
}

// Collect can handler
function collectCan(e, isBonus = false) {
  if (!gameActive) return;
  let points = isBonus ? 3 : 1;
  currentCans += points;
  cansCounter.textContent = currentCans;
  showAchievement(isBonus ? "+3 bonus!" : "+1 can collected!");

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

  // Play collect sound
  document.getElementById('collect-sound').play();

  // Update streak and high score
  streak++;
  streakDisplay.textContent = streak;
  if (currentCans > highScore) {
    highScore = currentCans;
    localStorage.setItem('highScore', highScore);
    highScoreDisplay.textContent = highScore;
  }

  updateProgress();
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
  triggeredMilestones.clear(); // <-- Reset milestones
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
    ? "You helped provide clean water! 🌊 " + winningMessages[Math.floor(Math.random() * winningMessages.length)]
    : "Try again to help more people get clean water! " + losingMessages[Math.floor(Math.random() * losingMessages.length)];
  showAchievement(message);
  if (win) {
    const winSound = document.getElementById('win-sound');
    winSound.currentTime = 0;
    winSound.play();
    launchConfetti();
  }
  // Optionally, show a donate link or fact here as well
  document.getElementById('cw-fact').innerHTML = 
    win 
      ? "🎉 Amazing! Your effort represents real impact—every can is a step toward clean water for all. <a href='https://www.charitywater.org/donate' target='_blank' class='cw-donate-link'>Donate or Learn More</a>"
      : "💧 Keep going! Every can brings us closer to clean water for everyone. <a href='https://www.charitywater.org/donate' target='_blank' class='cw-donate-link'>Learn More</a>";
}

// Reset the game
function resetGame() {
  setDifficulty();
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  cansCounter.textContent = currentCans;
  timerDisplay.textContent = timer;
  achievement.textContent = '';
  streak = 0;
  streakDisplay.textContent = streak;
  lastMilestone = 0;
  progressBar.style.width = "0%";
  triggeredMilestones.clear(); // <-- Reset milestones
  createGrid();
}

// Update progress bar and check milestones
function updateProgress() {
  const percent = Math.min((currentCans / GOAL_CANS), 1);
  progressBar.style.width = (percent * 100) + "%";

  // Check milestones
  MILESTONES.forEach(milestone => {
    if (percent >= milestone.percent && !triggeredMilestones.has(milestone.percent)) {
      triggeredMilestones.add(milestone.percent);
      // Pick a random message for this milestone
      const msg = milestone.messages[Math.floor(Math.random() * milestone.messages.length)];
      showMilestone(msg);
    }
  });
}

// Show milestone effect
function showMilestone(msg) {
  showAchievement(msg);

  // Flash container for feedback
  container.classList.add('milestone-flash');
  setTimeout(() => container.classList.remove('milestone-flash'), 600);
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
startBtn.addEventListener('click', () => {
  document.getElementById('button-sound').play();
  startGame();
});
document.getElementById('reset-game').addEventListener('click', () => {
  buttonSound.currentTime = 0;
  buttonSound.play();
  resetGame();
});

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

// On page load: display high score
highScoreDisplay.textContent = highScore;

window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-overlay');
  const closeIntro = document.getElementById('close-intro');
  if (intro && closeIntro) {
    closeIntro.addEventListener('click', () => {
      intro.style.opacity = '0';
      setTimeout(() => {
        intro.style.display = 'none';
      }, 400);
    });
  }

  const startBtn = document.getElementById('start-game');
  startBtn.addEventListener('click', () => {
    document.getElementById('button-sound').play();
    startGame();
  });
});