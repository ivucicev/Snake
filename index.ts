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

function initBoard() {

    for (let y = 0; y < boardSizeH; y++) {
        board[y] = new Array(10);
        for (let x = 0; x < boardSizeW; x++) {
            board[y][x] = Tile.Empty;
        }
    }

    randomizeStartPositions();
    console.log(JSON.stringify(board));
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

function drawTile(x: number, y: number, type: Tile) {
    ctx.fillStyle = getTileColor(type);
    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
}

function draw() {
    
    clear();

    let tempBoard = board.slice();
    let nextX = null;
    let nextY = null;

    //draw snake parts

    // // calculate positions
    // for (let y = 0; y < boardSizeH; y++) {
    //     for (let x = 0; x < boardSizeW; x++) {
    //         if (tempBoard[x][y] == Tile.Snake && x != nextX && y != nextY) {
    //             board[x][y] = Tile.Empty;
    //             //break;
    //             let next = move(x, y);
    //             nextX = next[0];
    //             nextY = next[1]; 
    //             if (board[nextX][nextY] == Tile.Food) {
    //                 snakeSize++;
    //                 snake.unshift({
    //                     x: 1,
    //                     y: 1,
    //                 });
    //             }
    //             if (board[nextX][nextY] == Tile.Snake) {
    //                 console.log("GAME OVER");
    //             }
    //         }
    //     }
    // }

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

function move(x: number, y: number): number[] {
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

    console.log("NEXT", x, y);
    if (x < boardSizeW && y < boardSizeH && y >= 0 && x >= 0) {
        board[x][y] = Tile.Snake;
    }

    return [x, y];

}

function clear() {
    ctx.clearRect(0, 0, boardWidth, boardHeight)
}

function attachListeners() {
    document.onkeyup = bindKeys;   
}

function bindKeys(e) {
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
        case 32:
            draw();
            break;
        default:
            break;
    }

}

function getTileColor(type: Tile): string {
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

initBoard();