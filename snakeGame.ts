// GAME VARIABLES AND TYPES:
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let gameOver = false;

type Point = {
    x: number;
    y: number;
};

let snake: Point[] = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200}
];
let dx = 10; // horizontal velocity
let dy = 0; // vertical velocity
let food: Point;

// Initialize food position
createFood();

// GAME LOOP: 
function gameLoop() {
    if (didGameEnd()) return;

    setTimeout(() => {
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
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check if snake ate food
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        createFood(); // Generate new food position
        // Optionally, increase the size of the snake here
    } else {
        snake.pop(); // Remove the last part of the snake if it didn't grow
    }
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}

// CLEAR CANVAS: 
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// SNAKE FOOD FUNCTIONS:
function randomFood(min: number, max: number) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    food = {
        x: randomFood(0, canvas.width - 10),
        y: randomFood(0, canvas.height - 10)
    };

    // Check if the new food position is on the snake
    snake.forEach(part => {
        const foodIsOnSnake = part.x === food.x && part.y === food.y;
        if (foodIsOnSnake)
            createFood(); // Recursively generate new position if on the snake
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
}

// KEYBOARD INPUT HANDLING:
document.addEventListener('keydown', (e) => {
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

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
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) {
            gameOver = true;
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        gameOver = true;
        return true;
    }

    return false;
}

// RESET GAME LOGIC:
document.getElementById('resetButton')!.addEventListener('click', resetGame);

function resetGame() {
    snake = [
        {x: 200, y: 200}, 
        {x: 190, y: 200}, 
        {x: 180, y: 200}
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

export {};