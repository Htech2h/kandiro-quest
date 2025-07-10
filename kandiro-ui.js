'use strict'
// UI Game State
let gameUI = {
    player_A: [4, 4, 4, 4, 4, 4],
    kandiro_A: 0,
    player_B: [4, 4, 4, 4, 4, 4],
    kandiro_B: 0,
    currentPlayer: "A",
    seeds: 4,
    gameOver: false,
    soundEnabled: true
};

// Audio context for sounds
let audioContext;
let sounds = {};

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSounds();
    } catch (e) {
        console.log("Audio not supported");
        gameUI.soundEnabled = false;
    }
}

// Create sound effects
function createSounds() {
    if (!gameUI.soundEnabled) return;
    
    // Create different sound frequencies
    sounds.move = createOscillator(400, 0.1); // Puu sound for movement
    sounds.capture = createOscillator(200, 0.3); // Buzz sound for capture
    sounds.drop = createOscillator(600, 0.05); // Quick drop sound
}

function createOscillator(frequency, duration) {
    return function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
}

function playSound(soundName) {
    if (gameUI.soundEnabled && sounds[soundName]) {
        sounds[soundName]();
    }
}

// Initialize game
function initGame() {
    gameUI.seeds = parseInt(document.getElementById('seedCount').value);
    
    // Reset board with selected seed count
    for (let i = 0; i < 6; i++) {
        gameUI.player_A[i] = gameUI.seeds;
        gameUI.player_B[i] = gameUI.seeds;
    }
    
    gameUI.kandiro_A = 0;
    gameUI.kandiro_B = 0;
    gameUI.currentPlayer = "A";
    gameUI.gameOver = false;
    
    // Restore original player labels
    document.getElementById('playerALabel').textContent = 'Player A (You)';
    document.getElementById('playerBLabel').textContent = 'Player B (Bot)';
    
    updateUI();
    updatePlayerIndicator();
    
    document.getElementById('gameStatus').textContent = '';
}

// Update UI display
function updateUI() {
    // Update Player A pits
    for (let i = 0; i < 6; i++) {
        updateSeedsDisplay(document.getElementById(`pitA${i}`), gameUI.player_A[i]);
    }
    
    // Update Player B pits
    for (let i = 0; i < 6; i++) {
        updateSeedsDisplay(document.getElementById(`pitB${i}`), gameUI.player_B[i]);
    }
    
    // Update Kandiros
    updateSeedsDisplay(document.getElementById('kandiroA'), gameUI.kandiro_A);
    updateSeedsDisplay(document.getElementById('kandiroB'), gameUI.kandiro_B);
    
    // Update scores
    document.getElementById('scoreA').textContent = gameUI.kandiro_A;
    document.getElementById('scoreB').textContent = gameUI.kandiro_B;
}

function updateSeedsDisplay(pitElement, seedCount) {
    const countElement = pitElement.querySelector('.pit-count, .kandiro-count');
    if (countElement) {
        countElement.textContent = seedCount;
        
        // Add number bounce animation
        countElement.classList.add('number-bounce');
        setTimeout(() => {
            countElement.classList.remove('number-bounce');
        }, 300);
    }
    
    // Clear existing seeds
    const existingSeeds = pitElement.querySelectorAll('.seed');
    existingSeeds.forEach(seed => seed.remove());
    
    // Create visual seeds for non-zero counts
    if (seedCount > 0) {
        const isKandiro = pitElement.classList.contains('kandiro');
        const maxVisualSeeds = isKandiro ? 12 : 8; // Show fewer seeds for visual clarity
        const seedsToShow = Math.min(seedCount, maxVisualSeeds);
        
        // Get responsive dimensions based on screen size
        const isMobile = window.innerWidth < 640;
        
        // Get actual element dimensions for perfect centering
        const rect = pitElement.getBoundingClientRect();
        const elementWidth = isKandiro ? (isMobile ? 70 : 80) : (isMobile ? 60 : 70);
        const elementHeight = isKandiro ? (isMobile ? 100 : 120) : (isMobile ? 60 : 70);
        
        // Calculate perfect center based on actual element size
        const centerX = elementWidth / 2;
        const centerY = elementHeight / 2;
        
        // Responsive radius and seed offset
        const radius = isKandiro ? (isMobile ? 16 : 22) : (isMobile ? 10 : 18);
        const seedOffset = isMobile ? 3 : 6; // Half of seed size for perfect centering
        
        for (let i = 0; i < seedsToShow; i++) {
            const seed = document.createElement('div');
            seed.className = 'seed';
            
            // Position seeds in a circle or pattern
            const angle = (i / seedsToShow) * 2 * Math.PI;
            
            const x = centerX + Math.cos(angle) * radius - seedOffset;
            const y = centerY + Math.sin(angle) * radius - seedOffset;
            
            seed.style.left = x + 'px';
            seed.style.top = y + 'px';
            
            pitElement.appendChild(seed);
        }
    }
}

function updatePlayerIndicator() {
    if (gameUI.gameOver) return; // Don't update if game is over
    
    const playerALabel = document.getElementById('playerALabel');
    const playerBLabel = document.getElementById('playerBLabel');
    const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
    
    if (gameUI.currentPlayer === 'A') {
        playerALabel.classList.add('current-player');
        playerBLabel.classList.remove('current-player');
        currentPlayerDisplay.textContent = "You";
        currentPlayerDisplay.className = "text-sm font-bold current-player current-player-text text-red-300";
    } else {
        playerALabel.classList.remove('current-player');
        playerBLabel.classList.add('current-player');
        currentPlayerDisplay.textContent = "Bot";
        currentPlayerDisplay.className = "text-sm font-bold current-player current-player-text text-blue-300";
    }
}

// Animation functions
function animateSeedMovement(movementPath, onComplete, currentPlayer = 'A') {
    if (movementPath.length === 0) {
        onComplete();
        return;
    }
    
    let currentStep = 0;
    
    function animateStep() {
        if (currentStep >= movementPath.length) {
            onComplete();
            return;
        }
        
        const step = movementPath[currentStep];
        const element = document.getElementById(step.elementId);
        
        if (element) {
            // Highlight with player-specific color
            const highlightClass = `seed-highlight-${currentPlayer}`;
            element.classList.add(highlightClass);
            
            // Play drop sound
            playSound('drop');
            
            // Update the display
            updateSeedsDisplay(element, step.newCount);
            
            setTimeout(() => {
                element.classList.remove(highlightClass);
                currentStep++;
                animateStep();
            }, 500);
        } else {
            currentStep++;
            animateStep();
        }
    }
    
    animateStep();
}

function celebrateCapture(capturedPits, player, capturedCount) {
    capturedPits.forEach(pitIndex => {
        const pitId = player === 'A' ? `pitB${pitIndex}` : `pitA${pitIndex}`;
        const pitElement = document.getElementById(pitId);
        if (pitElement) {
            pitElement.classList.add('capture-celebration');
            setTimeout(() => {
                pitElement.classList.remove('capture-celebration');
            }, 800);
        }
    });
    
    // Animate the Kandiro receiving the seeds
    const kandiroId = player === 'A' ? 'kandiroA' : 'kandiroB';
    const kandiroElement = document.getElementById(kandiroId);
    if (kandiroElement) {
        kandiroElement.classList.add('kandiro-celebration');
        setTimeout(() => {
            kandiroElement.classList.remove('kandiro-celebration');
        }, 1000);
        
        // Show floating score
        const floatingScore = document.createElement('div');
        floatingScore.className = 'floating-score absolute text-yellow-400 font-bold text-lg pointer-events-none';
        floatingScore.textContent = `+${capturedCount}`;
        floatingScore.style.left = '50%';
        floatingScore.style.top = '50%';
        floatingScore.style.transform = 'translate(-50%, -50%)';
        floatingScore.style.zIndex = '20';
        
        kandiroElement.appendChild(floatingScore);
        
        setTimeout(() => {
            floatingScore.remove();
        }, 1500);
    }
    
    playSound('capture');
}

// Original algorithms from kandiro.js
function playA(index, movementPath = []) {
    let dist = gameUI.player_A[index];
    gameUI.player_A[index] = 0;
    
    // Add starting position to path
    movementPath.push({
        elementId: `pitA${index}`,
        newCount: 0
    });

    let i = index + 1;
    let lastPosition = -1;
    let lastSide = 'A';

    // Circular sowing loop (your original algorithm)
    while (dist > 0) {
        // Sow in A side (left to right: index+1, index+2, etc.)
        while (i < 6 && dist > 0) {
            gameUI.player_A[i]++;
            dist--;
            lastPosition = i;
            lastSide = 'A';
            
            // Add to animation path
            movementPath.push({
                elementId: `pitA${i}`,
                newCount: gameUI.player_A[i]
            });
            
            i++;
        }

        // Kandiro A
        if (dist > 0) {
            gameUI.kandiro_A++;
            dist--;
            lastSide = 'kandiro_A';
            
            // Add to animation path
            movementPath.push({
                elementId: 'kandiroA',
                newCount: gameUI.kandiro_A
            });
        }

        // Sow in B side (right to left: 5, 4, 3, 2, 1, 0)
        for (let j = 5; j >= 0 && dist > 0; j--) {
            gameUI.player_B[j]++;
            dist--;
            lastPosition = j;
            lastSide = 'B';
            
            // Add to animation path
            movementPath.push({
                elementId: `pitB${j}`,
                newCount: gameUI.player_B[j]
            });
        }

        // Loop back to A side
        i = 0;
    }

    return { lastPosition, lastSide, dist };
}

// Original playB algorithm (decrements index)
function playB(index, movementPath = []) {
    let dist = gameUI.player_B[index];
    gameUI.player_B[index] = 0;
    
    // Add starting position to path
    movementPath.push({
        elementId: `pitB${index}`,
        newCount: 0
    });

    let i = index - 1; // Start from index-1 (moving backwards)
    let lastPosition = -1;
    let lastSide = 'B';

    while(dist > 0){
        // Sow right to left on B side (index-1, index-2, etc. down to 0)
        while(i >= 0 && dist > 0){
            gameUI.player_B[i]++;
            dist--;
            lastPosition = i;
            lastSide = 'B';
            
            // Add to animation path
            movementPath.push({
                elementId: `pitB${i}`,
                newCount: gameUI.player_B[i]
            });
            
            i--; // Keep decreasing
        }
        
        // Sow in kandiro_B
        if(dist > 0){
            gameUI.kandiro_B++;
            dist--;
            lastSide = 'kandiro_B';
            
            // Add to animation path
            movementPath.push({
                elementId: 'kandiroB',
                newCount: gameUI.kandiro_B
            });
        }
        
        // Sow in A left to right (0, 1, 2, 3, 4, 5)
        for(let j = 0; j < 6 && dist > 0; j++){
            gameUI.player_A[j]++;
            dist--;
            lastPosition = j;
            lastSide = 'A';
            
            // Add to animation path
            movementPath.push({
                elementId: `pitA${j}`,
                newCount: gameUI.player_A[j]
            });
        }
        
        // Repeat on B if distance is still >0, start from index 5 (rightmost)
        i = 5;
    }

    return { lastPosition, lastSide, dist };
}

// Capture logic (exactly 2 or 3 seeds)
function captureBowl(index, currentPlayer) {
    const isPlayerA = currentPlayer === 'A';
    const opponentBoard = isPlayerA ? gameUI.player_B : gameUI.player_A;
    const kandiroKey = isPlayerA ? 'kandiro_A' : 'kandiro_B';

    let capturedSeeds = 0;
    let capturedPits = [];

    // Capture consecutive pits with exactly 2 or 3 seeds
    while (index >= 0 && index < 6) {
        if (opponentBoard[index] === 2 || opponentBoard[index] === 3) {
            capturedSeeds += opponentBoard[index];
            opponentBoard[index] = 0;
            capturedPits.push(index);
            
            // Move to next pit in capture direction (original logic)
            if (currentPlayer === 'A') {
                index--; // A captures right to left
            } else {
                index++; // B captures left to right
            }
        } else {
            break; // Stop when pit doesn't have exactly 2 or 3 seeds
        }
    }

    // Only proceed if we actually captured something
    if (capturedSeeds > 0) {
        // Add captured seeds to current player's Kandiro
        gameUI[kandiroKey] += capturedSeeds;

        // Celebrate the capture
        celebrateCapture(capturedPits, currentPlayer, capturedSeeds);
    }
}

// Check if game is over
function isGameOver() {
    let aEmpty = gameUI.player_A.every(pit => pit === 0);
    let bEmpty = gameUI.player_B.every(pit => pit === 0);
    return aEmpty || bEmpty;
}

// End game
function endGame() {
    // Move any remaining seeds to respective Kandiros before ending
    gameUI.kandiro_A += gameUI.player_A.reduce((sum, pit) => sum + pit, 0);
    gameUI.kandiro_B += gameUI.player_B.reduce((sum, pit) => sum + pit, 0);
    gameUI.player_A.fill(0);
    gameUI.player_B.fill(0);
    
    gameUI.gameOver = true;
    
    // Update UI to show final Kandiro counts
    updateUI();
    
    // Calculate final scores (should now match Kandiro displays)
    let scoreA = gameUI.kandiro_A;
    let scoreB = gameUI.kandiro_B;
    
    let winner;
    let winnerText;
    let centerClass;
    if (scoreA > scoreB) {
        winner = "YOU WIN!";
        winnerText = "Player A Wins!";
        centerClass = "text-lg sm:text-xl font-bold text-white bg-green-600 px-2 py-1 rounded shadow-lg";
    } else if (scoreB > scoreA) {
        winner = "BOT WINS!";
        winnerText = "Player B Wins!";
        centerClass = "text-lg sm:text-xl font-bold text-white bg-red-600 px-2 py-1 rounded shadow-lg";
    } else {
        winner = "TIE GAME!";
        winnerText = "It's a Tie!";
        centerClass = "text-lg sm:text-xl font-bold text-white bg-gray-600 px-2 py-1 rounded shadow-lg";
    }
    
    // Replace player labels with winner announcement
    document.getElementById('playerALabel').textContent = winner;
    document.getElementById('playerBLabel').textContent = `Final Score: A(${scoreA}) vs B(${scoreB})`;
    
    // Update center display with prominent winner announcement
    document.getElementById('currentPlayerDisplay').textContent = winner;
    document.getElementById('currentPlayerDisplay').className = centerClass;
    
    // Update game status at bottom
    document.getElementById('gameStatus').textContent = `${winnerText} - Click "New Game" to play again!`;
}

// Main move function
function makeMove(player, pitIndex) {
    if (gameUI.gameOver) return false;
    if (player !== gameUI.currentPlayer) return false;
    
    const board = player === 'A' ? gameUI.player_A : gameUI.player_B;
    if (board[pitIndex] === 0) return false;
    
    playSound('move');
    
    // Create movement path for animation
    let movementPath = [];
    let result;
    
    // Use your proven algorithm
    if (player === 'A') {
        result = playA(pitIndex, movementPath);
    } else {
        result = playB(pitIndex, movementPath);
    }
    
    // Animate the movement
    animateSeedMovement(movementPath, () => {
        // Check for capture using your logic
        if (result.lastSide === 'B' && result.lastPosition >= 0 && player === 'A') {
            captureBowl(result.lastPosition, 'A');
        } else if (result.lastSide === 'A' && result.lastPosition >= 0 && player === 'B') {
            captureBowl(result.lastPosition, 'B');
        }
        
        // Change player
        gameUI.currentPlayer = gameUI.currentPlayer === 'A' ? 'B' : 'A';
        
        // Update UI after captures
        setTimeout(() => {
            updateUI();
            updatePlayerIndicator();
            
            // Check if game is over
            if (isGameOver()) {
                setTimeout(endGame, 500);
            } else if (gameUI.currentPlayer === 'B') {
                // Bot move
                setTimeout(makeBotMove, 1000);
            }
        }, 400);
    }, player);
    
    return true;
}

// Bot AI
function makeBotMove() {
    if (gameUI.gameOver || gameUI.currentPlayer !== 'B') return;
    
    let maxSeeds = 0;
    let bestMove = -1;

     // do some foward checking.
    let board = gameUI.player_A;
    let index = board.indexOf(2);
    index = index !== -1 ? index : board.indexOf(1);
    
    for (let i = 0; i < 6; i++) {
        if(index !== -1){
            if((index + 2 +i)=== gameUI.player_B[i]){
                makeMove('B',i);
                return;
            }
        }
        if (gameUI.player_B[i] > maxSeeds) {
            maxSeeds = gameUI.player_B[i];
            bestMove = i;
        }
    }

    
    if (bestMove !== -1) {
        makeMove('B', bestMove);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio
    initAudio();
    
    // Initialize game
    initGame();
    
    // New game button
    document.getElementById('newGameBtn').addEventListener('click', initGame);
    
    // Pit click handlers
    document.querySelectorAll('.pit').forEach(pit => {
        pit.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            const player = this.getAttribute('data-player');
            const index = parseInt(this.getAttribute('data-index'));
            
            // Only allow Player A to click (user), Bot will play automatically
            if (player === 'A' && gameUI.currentPlayer === 'A') {
                makeMove(player, index);
            }
        });
    });
    
    // Seed count change
    document.getElementById('seedCount').addEventListener('change', function() {
        if (!gameUI.gameOver) {
            initGame(); // Reset game with new seed count
        }
    });
    
    // Enable audio on first user interaction
    document.addEventListener('click', function enableAudio() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        document.removeEventListener('click', enableAudio);
    }, { once: true });
});

/* this was my initial logic before letting gpt take over. but you can simply see 
gpt built on top of this and improved it significantly.
I had the basic game state, player pits, kandiro, and basic move logic.
I had the basic playA and playB functions, but they were not as optimized.

now if you guys like the game i will impliment more features like:
multiplayer, better bot AI, more animations, and sure even a leaderboard.
*/
