const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const walls: any = document.getElementsByName('walls');

const boardWidth = 800;
const boardHeight = 800;
const blockSize = 50;
const boardSizeW = boardWidth / blockSize;
const boardSizeH = boardHeight / blockSize;

let solidWalls = true;
let board: Tile[][] = [];
let currentDirection: Key = 37;
let refresh = 250;
let timeout = null;
let snake: ISnakePart[] = [];
let food: IFood = null;

interface IPosition {
    x: number,
    y: number
}

interface ISnakePart extends IPosition {}
interface IFood extends IPosition {}

enum Tile {
    Empty,
    Snake,
    Food
}

enum Key {
    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40
}

const drawTile = (x: number, y: number, type: Tile) => {
    ctx.fillStyle = getTileColor(type);
    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
}

const draw = () => {
    
    clear();

    // draw board
    drawBoard()

    // draw food
    drawFood();

    // calculate next
    calculateNextPositions();

    // check collision
    checkCollision();

    // is food eaten
    checkFeast();

    // draw snake
    drawSnake();


}

const checkCollision = () => {
    if (snake.filter((s, index) => snake[0].x === s.x && snake[0].y === s.y && index > 0).length) gameOver();
}

const checkFeast = () => {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y
        });
        refresh -= 2;
        scoreEl.innerHTML = `${snake.length}`;
        randomizeFood();
    }
}

const drawFood = () => {
    drawTile(food.x, food.y, Tile.Food);
}

const drawSnake = () => {
    for(let s = 0; s < snake.length; s++) {
        drawTile(snake[s].x, snake[s].y, Tile.Snake);
    }
}

const drawBoard = () => {
    for (let y = 0; y < boardSizeH; y++) {
        for (let x = 0; x < boardSizeW; x++) {
            drawTile(x, y, Tile.Empty);
        }
    }
}

const gameOver = () => {
    alert("Fail, game over");
    initBoard();
    // window.location.reload();
}

const frame = () => {
    draw();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        requestAnimationFrame(frame);
    }, refresh)
}

const calculateNextPositions = () => {

    let currentX = snake[0].x;
    let currentY = snake[0].y;

    if (currentX < 0 || currentX > boardSizeW || currentY < 0 || currentY > boardSizeH) return;

    switch(currentDirection) {
        case Key.DOWN: currentY++; break; 
        case Key.UP: currentY--; break;
        case Key.LEFT: currentX--; break;
        case Key.RIGHT: currentX++; break;
        default: break;
    }

    snake.pop();

    if (currentY > boardSizeH - 1) { solidWalls ? gameOver() : currentY = 0 };
    if (currentY < 0) { solidWalls ? gameOver() : currentY = boardSizeH - 1 };
    if (currentX < 0) { solidWalls ? gameOver() : currentX = boardSizeW - 1 };
    if (currentX > boardSizeW - 1) { solidWalls ? gameOver() : currentX = 0 };

    snake.unshift({
        x: currentX,
        y: currentY
    });

}

const clear = () => ctx.clearRect(0, 0, boardWidth, boardHeight)

const attachListeners = () => document.onkeyup = bindKeys;   
const unbindListeners = () => document.onkeyup = null;

const bindKeys = (e) => {
    switch(e.keyCode) {
        case Key.DOWN:
            if (currentDirection === Key.UP) return;
            currentDirection = Key.DOWN;
            break;
        case Key.UP:
            if (currentDirection === Key.DOWN) return;        
            currentDirection = Key.UP;
            break;
        case Key.LEFT:
            if (currentDirection === Key.RIGHT) return;                
            currentDirection = Key.LEFT;
            break;
        case Key.RIGHT:
            if (currentDirection === Key.LEFT) return;                        
            currentDirection = Key.RIGHT;
            break;
        default:
            break;
    }
}

const getTileColor = (type: Tile): string => {
    switch(type) {
        case Tile.Empty: 
            return '#9ac503';
        case Tile.Food:
            return '#000000';
        case Tile.Snake:
            return '#000000';
        default:
            return '#9ac503';
    }
}

const initBoard = () => {

    for (let y = 0; y < boardSizeH; y++) {
        board[y] = new Array(10);
        for (let x = 0; x < boardSizeW; x++) {
            board[y][x] = Tile.Empty;
        }
    }

    for (let i = 0; i < walls.length; i++) {
        if (walls[i].checked) {
            solidWalls = walls[i].value;
            break;
        }
    }

    clearTimeout(timeout);
    snake = [];
    scoreEl.innerHTML = `0`;
    refresh = 250;
    currentDirection = Key.LEFT;
    unbindListeners();
    initSnake();
    randomizeFood();
    attachListeners();
    requestAnimationFrame(frame);
    

}

const randomizeFood = () => {

    let foodInitX = Math.floor(Math.random() * (boardSizeW - 1));
    let foodInitY = Math.floor(Math.random() * (boardSizeH - 1));

    while(snake.filter(v => v.x == foodInitX && v.y == foodInitY).length) {
        foodInitX = Math.floor(Math.random() * (boardSizeW - 1));
        foodInitY = Math.floor(Math.random() * (boardSizeH - 1));
    }

    food = {
        x: foodInitX,
        y: foodInitY 
    }

}

const initSnake = () => snake.push({ x: 8, y: 8 });

initBoard();