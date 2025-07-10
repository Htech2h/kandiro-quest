'use strict'

let player_A = [];
let kandiro_A = 0;
let player_B = [];
let kandiro_B = 0;


//current player
let player = "A"
//seeds
let seeds = 4;
//populate
function populate(){
    for(let i=0; i < 6; i++){
        player_A[i]=seeds;
        player_B[i]=seeds;
    }
}

//change player
function changePlayer(){
    player = (player=="A")? "B":"A";
}

//bot - chooses pit with highest number of seeds
function Bot(){
    let maxSeeds = 0;
    let bestMove = -1;
    
    // Find pit with most seeds
    for(let i = 0; i < 6; i++){
        if(player_B[i] > maxSeeds){
            maxSeeds = player_B[i];
            bestMove = i;
        }
    }
    
    return bestMove;
}

// Check if game is over
function isGameOver(){
    let aEmpty = player_A.every(pit => pit === 0);
    let bEmpty = player_B.every(pit => pit === 0);
    return aEmpty || bEmpty;
}

//capture when bowl is ===2||3
function captureBowl(index, currentPlayer) {
    let board = currentPlayer === 'A' ? player_B : player_A;
    let kandiro = currentPlayer === 'A' ? 'kandiro_A' : 'kandiro_B';
    let captured = 0;

    while (index >= 0 && index < 6) {
        if (board[index] === 2 || board[index] === 3) {
            captured += board[index];
            board[index] = 0;
            currentPlayer === 'A' ? index-- : index++;
        } else {
            break; // stop chain capture when not 2 or 3
        }
    }

    if (currentPlayer === 'A') {
        kandiro_A += captured;
    } else {
        kandiro_B += captured;
    }
}

// Display current board state
function displayBoard(){
    console.log("\n=== KANDIRO GAME ===");
    //console.log("Player B: " + player_B.slice().reverse().join(" | ") + " (Kandiro B: " + kandiro_B + ")");
    console.log("Player B: " + player_B.join(" | ") + " (Kandiro B: " + kandiro_B + ")");
    console.log("Player A: " + player_A.join(" | ") + " (Kandiro A: " + kandiro_A + ")");
    console.log("Current player: " + player);
    console.log("==================\n");
}

// Get winner
function getWinner(){
    if(kandiro_A > kandiro_B) return "Player A";
    if(kandiro_B > kandiro_A) return "Player B";
    return "Tie";
}

//play 
function play(currentPlayer, index){
    if(index < 0 || index > 5){
        console.log("Index out of bounds (0-5)");
        return false;
    }
    
    // Check if the pit has seeds
    let board = currentPlayer === 'A' ? player_A : player_B;
    if(board[index] === 0){
        console.log("Cannot play from empty pit");
        return false;
    }
    
    // Make the move
    if(currentPlayer === 'A'){
        playA(index);
    } else {
        playB(index);
    }
    
    // Change to next player
    changePlayer();
    return true;
}

//play A (returns distance still to travel)
function playA(index) {
    let dist = player_A[index];
    player_A[index] = 0;

    let i = index + 1;
    let lastPosition = -1;
    let lastSide = 'A';

    // Circular sowing loop
    while (dist > 0) {
        // Sow in A side
        while (i < 6 && dist > 0) {
            player_A[i]++;
            dist--;
            lastPosition = i;
            lastSide = 'A';
            i++;
        }

        // Kandiro A
        if (dist > 0) {
            kandiro_A++;
            dist--;
            lastSide = 'kandiro_A';
        }

        // Sow in B side (right to left)
        for (let j = 5; j >= 0 && dist > 0; j--) {
            player_B[j]++;
            dist--;
            lastPosition = j;
            lastSide = 'B';
        }

        // Loop back to A side
        i = 0;
    }

    // Check for capture if last seed landed on opponent's side (B)
    if (lastSide === 'B' && lastPosition >= 0) {
        captureBowl(lastPosition, 'A');
    }

    return dist;
}

//play B
function playB(index){
    let dist = player_B[index];
    player_B[index] = 0;

    let i = index - 1;
    let lastPosition = -1;
    let lastSide = 'B';

    while(dist > 0){
        //sow right left on B side
        while(i>=0 && dist>0){
            player_B[i]++;
            dist--;
            lastPosition = i;
            lastSide = 'B';
            i--;
        }
        //sow in kandiro_B
        if(dist>0){
            kandiro_B++;
            dist--;
            lastSide = 'kandiro_B';
        }
        //sow in A left to right
        for(let j=0; j <6 && dist>0 ; j++){
            player_A[j]++;
            dist--;
            lastPosition = j;
            lastSide = 'A';
        }
        //repeat on B if distance is still >0
        i=5;
    }

    // Check for capture if last seed landed on opponent's side (A)
    if (lastSide === 'A' && lastPosition >= 0) {
        captureBowl(lastPosition, 'B');
    }

    return dist;
}


// Game initialization and main loop
function startGame(){
    console.log("Starting Kandiro Quest!");
    populate();
    displayBoard();
    
    // Example game moves - you can replace this with user input or AI
    let moves = [
        {player: "A", pit: 0},
        {player: "B", pit: 1},
        {player: "A", pit:2},
        {player: "B", pit: 3},
        {player: "A", pit: 1}
    ];
    
    for(let move of moves){
        if(isGameOver()) break;
        
        console.log(`${player} is playing from pit ${move.pit}`);
        if(play(player, move.pit)){
            displayBoard();
        }
    }
    
    if(isGameOver()){
        console.log("Game Over!");
        console.log("Winner: " + getWinner());
        console.log("Final scores - A: " + kandiro_A + ", B: " + kandiro_B);
    }
}

// Interactive game function for user vs bot
function playInteractive(){
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log("Starting Interactive Kandiro Quest!");
    console.log("You are Player A, Bot is Player B");
    populate();
    displayBoard();
    
    function getUserMove(){
        if(isGameOver()){
            console.log("Game Over!");
            console.log("Winner: " + getWinner());
            console.log("Final scores - A: " + kandiro_A + ", B: " + kandiro_B);
            rl.close();
            return;
        }
        
        if(player === "A"){
            rl.question('Your turn! Choose a pit (0-5): ', (answer) => {
                let pitIndex = parseInt(answer);
                
                if(isNaN(pitIndex) || pitIndex < 0 || pitIndex > 5){
                    console.log("Please enter a number between 0 and 5");
                    getUserMove();
                    return;
                }
                
                if(play(player, pitIndex)){
                    displayBoard();
                    getBotMove();
                } else {
                    getUserMove();
                }
            });
        }
    }
    
    function getBotMove(){
        if(isGameOver()){
            console.log("Game Over!");
            console.log("Winner: " + getWinner());
            console.log("Final scores - A: " + kandiro_A + ", B: " + kandiro_B);
            rl.close();
            return;
        }
        
        if(player === "B"){
            let botMove = Bot();
            if(botMove !== -1){
                console.log(`Bot (Player B) plays from pit ${botMove}`);
                if(play(player, botMove)){
                    displayBoard();
                    getUserMove();
                } else {
                    getBotMove();
                }
            } else {
                console.log("Bot has no valid moves!");
                getUserMove();
            }
        }
    }
    
    getUserMove();
}

// Start the game
playInteractive();

