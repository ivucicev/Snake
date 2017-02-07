const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

const boardWidth = 500;
const boardHeight = 500;
const blockSize = 50;
const boardSizeW = boardWidth / blockSize;
const boardSizeH = boardHeight / blockSize;

let board: Tile[][] = [];
let currentDirection: Key = 37;
let refresh = 250;
let snakeSize: number = 1;
let snake: ISnakePart[] = [];

interface ISnakePart {
    x: number;
    y: number;
}

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

    let tempBoard = board.slice();
    let nextX = null;
    let nextY = null;

    // draw board
    for (let y = 0; y < boardSizeH; y++) {
        for (let x = 0; x < boardSizeW; x++) {
            drawTile(x, y, tempBoard[x][y]);
        }
    }

    // draw snake
    for(let s; s < snakeSize; s++) {
        drawTile(s.x, s.y, Tile.Snake);
    }

    // SEPARATE SNAKE FROM BOARD, make snake has its own path non dependable of board

}

const move = (x: number, y: number): number[] => {
    switch(currentDirection) {
        case Key.DOWN:
            y++;
            break;
        case Key.UP:
            y--;
            break;
        case Key.LEFT:
            x--;
            break;
        case Key.RIGHT:
            x++;
            break;
        default:
            break;
    }

    if (x < boardSizeW && y < boardSizeH && y >= 0 && x >= 0) {
        board[x][y] = Tile.Snake;
    }

    return [x, y];

}

const clear = () => {
    ctx.clearRect(0, 0, boardWidth, boardHeight)
}

const attachListeners = () => {
    document.onkeyup = bindKeys;   
}

const bindKeys = (e) => {
    switch(e.keyCode) {
        case Key.DOWN:
            currentDirection = Key.DOWN;
            break;
        case Key.UP:
            currentDirection = Key.UP;
            break;
        case Key.LEFT:
            currentDirection = Key.LEFT;
            break;
        case Key.RIGHT:
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

const moveLeft = () => {

}

const moveRight = () => {

}

const moveDown = () => {

}

const moveUp = () => {

}

const initBoard = () => {

    for (let y = 0; y < boardSizeH; y++) {
        board[y] = new Array(10);
        for (let x = 0; x < boardSizeW; x++) {
            board[y][x] = Tile.Empty;
        }
    }

    randomizeStartPositions();
    attachListeners();
    setInterval(draw, refresh);

}

const randomizeStartPositions = () => {

    const snakeInitX = 5;
    const snakeInitY = 5;

    let foodInitX = snakeInitX;
    let foodInitY = snakeInitY;

    // make sure first food is not on the same position as snake
    while(foodInitX == snakeInitX && foodInitY == snakeInitY) {
        foodInitX = Math.floor(Math.random() * (boardSizeW - 1));
        foodInitY = Math.floor(Math.random() * (boardSizeH - 1));
    }

    board[snakeInitY][snakeInitX] = Tile.Snake;
    board[foodInitY][foodInitX] = Tile.Food;

}

initBoard();