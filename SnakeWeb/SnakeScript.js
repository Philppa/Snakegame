const Enum_Classes = Object.freeze({
    GameCanvas: 'game-canvas',
    Backglow: 'backglow',
    StartScreen: 'start-screen'
})
const Enum_Identifiers = Object.freeze({
    GameCanvas: 'game-canvas'
})

class Component {
    element;

    constructor({ type = 'div', classList = '' } = {}) {
        const createElement = (() => {
            this.element = document.createElement(type);

            this.element.classList = `${classList}`;
        })();
    }

    addEvents(events = []) {
        for (const event of events) this.element.addEventListener(event.type, event.action);
    }
}

class Game extends Component {
    #screen = {
        startScreen: undefined,
        gameOverScreen: undefined,
        playScreen: undefined
    }


    constructor({ } = {}) {
        super({
            classList: `${Enum_Classes.GameCanvas} ${Enum_Classes.StartScreen}`
        });

        this.#StartScreen = new StartScreen();
        this.#PlayScreen = document.createElement('canvas');

        
    }


    set #StartScreen(value) { this.#screen.startScreen = value; }
    get StartScreen() { return this.#screen.startScreen; }
}

class Screen extends Component {
    constructor({ classList = ''} = {}) {
        super({
            classList: classList
        })
    }
}
class StartScreen extends Screen {
    #components = {
        startBtn: undefined
    }

    constructor({ classList = `${Enum_Classes.StartScreen}` } = {}) {
        super({
            classList: classList
        });

        this.#build();
    }

    #build({ } = {}) {
        const createComponents = (() => {

            const startBtn = (() => {
                const events = [
                    {
                        type: 'click',
                        action: (e) => {
                            console.log(e);
                        }
                    }
                ]

                this.#StartBtn = new StartBtn({
                    events: events
                })
            })();

            
        })();
    }

    get StartBtn() { return this.#components.startBtn; }
    set #StartBtn(value) { this.#components.startBtn = value; }
}

class PlayScreen extends Screen {
    constructor({ height = 400, width = 400, classList = `` } = {}) {
        super({
            classList: classList
        })
    }
}

class Button extends Component {

    constructor({ text, events = [] } = {}) {
        super({
            type: 'button',
            classList: ''
        });

        this.element.innerText = text;

        this.addEvents(events);
    }
}


class StartBtn extends Button {

    constructor({ events = [] } = {}) {
        super({
            text: 'Start',
            events: events
        })

    }
}




const board_border = 'hsla(265, 100%, 97%, 1)';
const board_background = "hsla(265, 100%, 2%, 1)";
const snake_col = 'hsla(308, 69%, 98%, 1)';
const snake_border = 'hsla(308, 69%, 46%, 1)';
const snake_shadow = 'hsla(316, 69%, 55%, 1)';
const snakeboard = document.createElement('canvas');
snakeboard.id = "gameCanvas";
snakeboard.className = "gameCanvas";
snakeboard.width = 400;
snakeboard.height = 400;
const body = document.getElementsByClassName("game-area")[0];
const startScreen = document.createElement('Div');
startScreen.id = "startScreen";
startScreen.classList.add("gameCanvas");
startScreen.classList.add("start-screen");
body.append(startScreen);
const startBtn = document.createElement('input');
startBtn.id = "startBtn";
startBtn.setAttribute('type', 'button');
startBtn.setAttribute('value', 'start');
startScreen.append(startBtn);
let snakeboard_ctx;
let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
]

let score = 0;
let changing_direction = false;
let foodx;
let foody;
let dx = 10;
let dy = 0;



gen_food();


document.addEventListener("keydown", changeDirection);


startBtn.addEventListener('click', function () { startGame() });

function startGame() {
    body.append(snakeboard);
    startScreen.remove();
    snakeboard_ctx = gameCanvas.getContext("2d");
    
    main();
}

function gameOver() {
    score = 0;
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
    ]
    snakeboard.remove();
    body.append(startScreen);
    startScreen.append(startBtn);
    
}

function main() {
    if (has_game_ended()) {
        gameOver();
    }
    else {
        changing_direction = false;
        setTimeout(function onTick() {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, 100)
    }
}
function clearCanvas() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokestyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}
function drawSnakePart(snakePart) {
    snakeboard_ctx.shadowColor = snake_shadow;
    snakeboard_ctx.shadowOffsetY = 1;
    snakeboard_ctx.ShadowOffSetX = -6;
    snakeboard_ctx.shadowBlur = 5;
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokestyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);

}
function drawSnake() {
    snake.forEach(drawSnakePart);
}
function moveSnake() {
    let xPos = snake[0].x + dx;
    let yPos = snake[0].y + dy;
    const head = { x: xPos, y: yPos };
    snake.unshift(head);
    const has_eaten_food = snake[0].x === foodx && snake[0].y === foody;
    if (has_eaten_food) {
        score += 10;

        document.getElementById("score").innerHTML = score;
        gen_food();
    } else {
        snake.pop();
    }

}
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (has_collided)
            return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
    do {
        foodx = random_food(0, snakeboard.width - 10);
        foody = random_food(0, snakeboard.height - 10);
        var redoDraw = insideSnake(foodx, foody);
        console.log(redoDraw);
    } while (redoDraw = false);

    snake.forEach(function has_eaten_food(part) {
        const has_eaten = part.x == foodx && part.y == foody;
        if (has_eaten) gen_food;
    });
}

function drawFood() {
    snakeboard_ctx.shadowColor = "hsla(112, 67%, 51%, 1)";
    snakeboard_ctx.fillStyle = 'hsla(112, 67%, 98%, 1)';
    snakeboard_ctx.strokestyle = 'hsla(112, 67%, 42%, 1)';
    snakeboard_ctx.fillRect(foodx, foody, 10, 10);
    snakeboard_ctx.strokeRect(foodx, foody, 10, 10);

}
function insideSnake(x, y) {
    var result = false;
    snake.forEach((part) => {
       // console.log(`${part.x} ${part.y} ${x} ${y}`);
       if (part.x === x && part.y === y) {
           result = true;
        }
    });
    return result;
}