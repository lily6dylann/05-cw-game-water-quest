// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timer = 30;
let timerInterval;

// Water Quest Game Logic
const grid = document.querySelector('.game-grid');
const cansCounter = document.getElementById('current-cans');
const startBtn = document.getElementById('start-game');
const totalCans = 20;
let collected = 0;
let cans = [];
const timerDisplay = document.getElementById('timer');

// Winning and losing messages
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

// Creates the 3x3 game grid where items will appear
function createGrid() {
  grid.innerHTML = '';
  cans = [];
  for (let i = 0; i < totalCans; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
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
    cell.appendChild(can);
    grid.appendChild(cell);
    cans.push(can);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function collectCan(e) {
  if (!this.classList.contains('collected')) {
    this.classList.add('collected');
    this.style.backgroundColor = '#FFC907'; // charity: water yellow
    setTimeout(() => {
      this.style.backgroundColor = '';
    }, 200);
    collected++;
    currentCans++;
    cansCounter.textContent = currentCans;
    // Animate the counter for feedback
    cansCounter.classList.add('score-bump');
    setTimeout(() => cansCounter.classList.remove('score-bump'), 200);
    // Show a motivational message
    showAchievement('You just brought clean water closer to someone!');
    if (collected >= totalCans) {
      setTimeout(() => alert('Congratulations! You collected all the cans and helped bring clean water to a community!'), 100);
    }
  }
}

function showAchievement(message) {
  const achievement = document.getElementById('achievements');
  achievement.textContent = message;
  achievement.style.background = '#2E9DF7'; // charity: water blue
  achievement.style.color = '#fff';
  achievement.style.padding = '8px 0';
  achievement.style.borderRadius = '6px';
  achievement.style.transition = 'opacity 0.3s';
  achievement.style.opacity = '1';
  setTimeout(() => {
    achievement.style.opacity = '0';
  }, 1200);
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  collected = 0;
  currentCans = 0;
  cansCounter.textContent = currentCans;
  createGrid(); // Set up the game grid
  startTimer();
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
}

function startTimer() {
  timer = 30;
  timerDisplay.textContent = timer;
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  let win = currentCans >= 20;
  let message;
  if (win) {
    message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    showAchievement(message);
    launchConfetti();
  } else {
    message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    showAchievement(message);
  }
}

// Simple confetti effect
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

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);

function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  collected = 0;
  currentCans = 0;
  cansCounter.textContent = currentCans;
  timer = 30;
  timerDisplay.textContent = timer;
  createGrid();
  showAchievement('Game reset! Ready to bring more clean water?');
}

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
