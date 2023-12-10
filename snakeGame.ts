// GAME VARIABLES AND TYPES
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

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
let food: Point = {x: 0, y: 0};

