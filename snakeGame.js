window.addEventListener('keydown', function(e) {
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);



// GAME VARIABLES AND TYPES:
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var gameOver = false;
var snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 }
];
var dx = 10; // horizontal velocity
var dy = 0; // vertical velocity
var food;
// Initialize food position
createFood();
// GAME LOOP: 
function gameLoop() {
    if (didGameEnd())
        return;
    setTimeout(function () {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        // Call gameLoop again
        gameLoop();
    }, 100);
}
// SNAKE MOVEMENT AND DRAWING:
function advanceSnake() {
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    // Check if snake ate food
    var didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        createFood(); // Generate new food position
        // Optionally, increase the size of the snake here
    }
    else {
        snake.pop(); // Remove the last part of the snake if it didn't grow
    }
}
function drawSnake() {
    snake.forEach(function (part) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}
// CLEAR CANVAS: 
function clearCanvas() {
    // ctx.fillStyle = '#fff';
    ctx.fillStyle = '#222021';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// SNAKE FOOD FUNCTIONS:
function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
function createFood() {
    food = {
        x: randomFood(0, canvas.width - 10),
        y: randomFood(0, canvas.height - 10)
    };
    // Check if the new food position is on the snake
    snake.forEach(function (part) {
        var foodIsOnSnake = part.x === food.x && part.y === food.y;
        if (foodIsOnSnake)
            createFood(); // Recursively generate new position if on the snake
    });
}
function drawFood() {
    ctx.fillStyle = '#ff1867';
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
}
// KEYBOARD INPUT HANDLING:
document.addEventListener('keydown', function (e) {
    var goingUp = dy === -10;
    var goingDown = dy === 10;
    var goingRight = dx === 10;
    var goingLeft = dx === -10;
    switch (e.key) {
        case 'ArrowLeft':
            if (!goingRight) {
                dx = -10;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (!goingLeft) {
                dx = 10;
                dy = 0;
            }
            break;
        case 'ArrowUp':
            if (!goingDown) {
                dx = 0;
                dy = -10;
            }
            break;
        case 'ArrowDown':
            if (!goingUp) {
                dx = 0;
                dy = 10;
            }
            break;
    }
});
// GAME END CHECK:
function didGameEnd() {
    for (var i = 4; i < snake.length; i++) {
        var didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) {
            gameOver = true;
            return true;
        }
    }
    var hitLeftWall = snake[0].x < 0;
    var hitRightWall = snake[0].x > canvas.width - 10;
    var hitTopWall = snake[0].y < 0;
    var hitBottomWall = snake[0].y > canvas.height - 10;
    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        gameOver = true;
        return true;
    }
    return false;
}
// RESET GAME LOGIC:
document.getElementById('resetButton').addEventListener('click', resetGame);
const reset = document.getElementById('reset');
reset.addEventListener('click', resetGame);
function resetGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 }
    ];
    dx = 10;
    dy = 0;
    createFood(); // Place the food in a new random location
    gameOver = false;
    // Restart the game loop
    gameLoop();
}

// Start the game
gameLoop();
