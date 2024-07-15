let body = document.getElementsByClassName("central-space")[0];

const enum_cssClasses = Object.freeze({
    backGlow: 'back-glow',
    gameArea: 'game-area',
    startScreen: 'start-screen',
    score: 'score',
    tryAgainScore: 'try-again-score'
})



class SnakeWeb_Event {
    static AccessorKeys = {
        Action: 'Action',
        Type: 'Type'
    }
    static Types = Object.freeze({
        Click: 'click',
        KeyDown: 'keydown',
        Custom: {
            StartGame: 'start-game'
        }
    })
    #action;
    #type;

    constructor({ type, action } = {}) {
        this.#type = type;
        this.#action = action;
    }

    static IsInstance(event) {
        if (!event) return false;

        return event.constructor.name === this.name;
    }
    get Action() { return this.#action; }
    get Type() { return this.#type; }
}

class Component {
    element;

    constructor({ type = 'Div', classList = ''} = {}) {
        this.element = document.createElement(type);
        this.element.classList = `${classList}`;
    }

    addEvents(events = []) {
        for (const event of events) {
            if (!SnakeWeb_Event.IsInstance(event)) return;

            const {
                [SnakeWeb_Event.AccessorKeys.Type]: type,
                [SnakeWeb_Event.AccessorKeys.Action]: action
            } = event

            this.element.addEventListener(type, action);
        }
    }
    remove() {
        this.element.remove();
    }
}

class GameArea extends Component {


    constructor({ } = {}) {
        super({
            classList: enum_cssClasses.gameArea
        })

        const addEvents = (() => {
            const events = [
                new SnakeWeb_Event({
                    type: SnakeWeb_Event.Types.Custom.StartGame,
                    action: (e) => {
                        this.start();
                    }
                })
            ]

            this.addEvents(events);
        })();
    }

    start() {
        screenConductor.showPlayScreen();
        game.gameState = Game.enum_gameState.play;

        Main();
    }
}

class Screen extends Component {
    #components = {
        startBtn: undefined
    }

    constructor({ classList = '', type } = {}) {
        super({
            classList: classList,
            type: type
        })

        this.element.classList.add(enum_cssClasses.backGlow);
    }

    buildStartBtn({ text, id } = {}) {

        const events = [
            new SnakeWeb_Event({
                type: SnakeWeb_Event.Types.Click,
                action: (e) => {
                    const event_startGame = new Event(SnakeWeb_Event.Types.Custom.StartGame, {
                        bubbles: true
                    })

                    this.element.dispatchEvent(event_startGame);
                }
            })
        ]


        this.#StartBtn = new Btn_Start({ text: text, id: id, events: events });
    }

    get StartBtn() { return this.#components.startBtn; }
    set #StartBtn(value) { this.#components.startBtn = value; }
}

class Screen_Play extends Screen {
    #context;

    constructor({ } = {}) {
        super({
            type: 'canvas'
        })
        this.element.height = 400;
        this.element.width = 400;
        this.element.id = 'gameCanvas';
        this.#Context = this.element.getContext("2d");

    }



    get Context() { return this.#context; }
    set #Context(value) { this.#context = value; }
}

class Screen_Start extends Screen {

    constructor({ classList = enum_cssClasses.startScreen, text = 'Start' } = {}) {
        super({
            classList: classList
        })

        this.buildStartBtn({
            text: text,
            id: "startBtn"
        })

        this.element.append(this.StartBtn.element);
    }

}

class Screen_GameOver extends Screen {
    #component = {
        Score: undefined
    }

    constructor({ classList = enum_cssClasses.startScreen } = {}) {
        super({
            classList: classList
        })

        this.buildStartBtn({
            text: 'Try Again',
            id: 'TryAgainBtn'
        })
        
        this.element.append(this.StartBtn.element);

        this.#component.Score = new Component({ classList: enum_cssClasses.tryAgainScore });   
        this.element.append(this.#component.Score.element);
        
    }

    showScore() {

       this.#component.Score.element.innerHTML = 'Score: ' + screenConductor.Score.PreviousScore + '';
    }
}

class Btn extends Component {

    constructor({ text, events = [] } = {}) {
        super({
            type: 'input'
        })

        this.element.value = text;
        this.element.setAttribute('type', 'button');

        this.addEvents(events);
    }
}

class Btn_Start extends Btn {

    constructor({ text, id, events = [] } = {}) {
        super({
            text: text,
            events: events
        })

        this.element.id = id;
    }
}

class Score extends Component {
    #score = 0
    #previousScore = 0

    constructor({ } = {}) {
        super({
            classList: enum_cssClasses.score
        })

        this.element.id = "score";
        this.element.innerHTML = this.Score;
    }

    increase() {
        this.#Score = this.Score + 10;
        this.element.innerHTML = this.Score;
    }

    reset() {
        this.#previousScore = this.#score;
        this.#Score = 0;
        this.element.innerHTML = this.Score;
    }

    get Score() { return this.#score; }
    get PreviousScore() { return this.#previousScore; }
    set #Score(value) { this.#score = value; }
}

class ScreenConductor {
    #screens = {
        Screen_Start: undefined,
        Screen_Play: undefined,
        Screen_GameOver: undefined,
        Score: undefined,
        GameArea: undefined
    }

    constructor({ } = {}) {
        this.Screen_Start = new Screen_Start({});
        this.Screen_Play = new Screen_Play({});
        this.Score = new Score({});
        this.Screen_GameOver = new Screen_GameOver({});
        this.GameArea = new GameArea({});
        body.append(this.GameArea.element);
        body = this.GameArea.element;
    }

    showStartScreen() {

        this.#showScreen(this.Screen_Start.element);
    }

    showPlayScreen() {

        this.#showScreen(this.Screen_Play.element);
    }

    showGameOverScreen() {
        this.Score.reset();
        this.Screen_GameOver.showScore();
        this.#showScreen(this.Screen_GameOver.element);

    }

    #clearScreens() {
        const screens = [
            this.Screen_Start,
            this.Screen_Play,
            this.Screen_GameOver,
            this.Score
        ]


        for (const screen of screens) screen.remove();
    }

    #showScreen(screen) {
        this.#clearScreens();

        body.append(screen);
        body.append(this.Score.element);
    }

    get Screen_Start() { return this.#screens.Screen_Start; }
    set Screen_Start(value) { this.#screens.Screen_Start = value; }
    get Screen_Play() { return this.#screens.Screen_Play; }
    set Screen_Play(value) { this.#screens.Screen_Play = value; }
    get Score() { return this.#screens.Score; }
    set Score(value) { this.#screens.Score = value; }
    get GameArea() { return this.#screens.GameArea; }
    set GameArea(value) { this.#screens.GameArea = value; }
    get Screen_GameOver() { return this.#screens.Screen_GameOver; }
    set Screen_GameOver(value) { this.#screens.Screen_GameOver = value; }

}

class snake {
    #snake = []
    #eggCollection;
    #velocity;

    constructor({ eggCollection = [] } = {}) {
        this.#eggCollection = eggCollection;
        this.#velocity = new SnakeVelocity();
        this.reset();
    }

    reset() {
        this.Snake = [
            { x: 200, y: 200 },
            { x: 190, y: 200 },
            { x: 180, y: 200 },
            { x: 170, y: 200 },
            { x: 160, y: 200 }
        ];

        this.#velocity.reset();
    }

    add() {
        let newX = this.Snake[0].x + this.#velocity.xShift;
        let newY = this.Snake[0].y + this.#velocity.yShift;
        let newSnakeHead = { x: newX, y: newY };
        this.Snake.unshift(newSnakeHead);
    }

    remove() {
        this.Snake.pop();
    }

    checkIfDead() {
        const snakepart = this.#snake[0]

        const
            passedBoundary = (() => {
                const hitLeftWall = snakepart.x < 0;
                const hitRightWall = snakepart.x > screenConductor.Screen_Play.element.width - 10;
                const hitTopWall = snakepart.y < 0;
                const hitBottomWall = snakepart.y > screenConductor.Screen_Play.element.height - 10;

                return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
            })(),
            hitBody = (() => {
                for (let i = 1; i < this.#snake.length; i++) {
                        if (snakepart.x === this.#snake[i].x && snakepart.y === this.#snake[i].y) {
                            return true;
                        }
                }
                return false;
            })()

        if (passedBoundary || hitBody) {
            const gameEvent = new GameEvent({
                action: () => { game.gameState = Game.enum_gameState.dead; }
            })

            //Add this event to the game's events collection
            game.addEvent(gameEvent);
        }
    }

    checkIfAte() {
        if (this.#snake[0].x === this.#eggCollection[0].x && this.#snake[0].y === this.#eggCollection[0].y) {
            //Create a new game event
            const gameEvent = new GameEvent({
                action: () => {
                    screenConductor.Score.increase();
                    game.Egg.generate();
                }
            })

            //Add this event to the game's events collection
            game.addEvent(gameEvent);
        }
        else {
            this.remove();
        }

    }

    update(egg) {
        this.#eggCollection = egg;
        this.add();
        this.checkIfAte();
        this.checkIfDead();

    }

    get Snake() { return this.#snake; }
    set Snake(value) { this.#snake = value; }
}
class Draw {
    static enum_SnakeCtx = Object.freeze({
        shadowColor: 'hsla(316, 69%, 55%, 1)',
        fillStyle: 'hsla(308, 69%, 98%, 1)',
        strokestyle: 'hsla(308, 69%, 46%, 1)'
    })
    static enum_EggCtx = Object.freeze({
        shadowColor: 'hsla(112, 67%, 51%, 1)',
        fillStyle: 'hsla(112, 67%, 98%, 1)',
        strokestyle: 'hsla(112, 67%, 42%, 1)'
    })
    #playContext = undefined;

    constructor({ } = {}) {
        this.#playContext = screenConductor.Screen_Play.Context;

    }

    elementDraw({ shadowColor = '', shadowOffsetY = 1, ShadowOffSetX = -6, shadowBlur = 5, fillStyle = '', strokestyle = '', objX = 0, objY = 0 }) {

        this.#playContext.shadowColor = shadowColor;
        this.#playContext.shadowOffsetY = shadowOffsetY;
        this.#playContext.ShadowOffSetX = ShadowOffSetX;
        this.#playContext.shadowBlur = shadowBlur;
        this.#playContext.fillStyle = fillStyle;
        this.#playContext.strokestyle = strokestyle;
        this.#playContext.fillRect(objX, objY, 10, 10);
        this.#playContext.strokeRect(objX, objY, 10, 10);
    }

    canvasClear() {

        this.#playContext.fillStyle = 'hsla(265, 100%, 2%, 1)';
        this.#playContext.fillRect(0, 0, screenConductor.Screen_Play.element.width, screenConductor.Screen_Play.element.height);
        this.#playContext.strokeRect(0, 0, screenConductor.Screen_Play.element.width, screenConductor.Screen_Play.element.height);
    }
}

class Draw_Snake extends Draw {
    constructor({ } = {}) {
        super()
    }
    draw(snakeParts = []) {

        for (const snakePart of snakeParts) {

            this.elementDraw({
                shadowColor: Draw.enum_SnakeCtx.shadowColor,
                fillStyle: Draw.enum_SnakeCtx.fillStyle,
                strokestyle: Draw.enum_SnakeCtx.strokestyle,
                objX: snakePart.x,
                objY: snakePart.y
            });
        }
    }
}

class Draw_Egg extends Draw {
    constructor({ } = {}) {
        super();
    }
    draw(egg = []) {
        this.elementDraw({
            shadowColor: Draw.enum_EggCtx.shadowColor,
            fillStyle: Draw.enum_EggCtx.fillStyle,
            strokestyle: Draw.enum_EggCtx.strokestyle,
            objX: egg[0].x,
            objY: egg[0].y
        })
    }
}

class SnakeVelocity {
    #velocity = {
        xShift: 0,
        yShift: 0
    }
    #speed = 10;
    constructor({ } = {}) {
        this.reset();
        document.addEventListener(SnakeWeb_Event.Types.KeyDown, (e) => { this.changeDirection(e) });
    }

    reset() {
        this.xShift = this.#speed;
        this.yShift = 0;
    }

    changeDirection(event) {

        switch (event.keyCode) {
            // Move Left
            case 37:
                {
                    if (this.xShift === 10) break;
                    this.xShift = -1 * this.#speed;
                    this.yShift = 0;
                    break;
                }
            // Move Down
            case 38:
                {
                    if (this.yShift === 10) break;
                    this.xShift = 0;
                    this.yShift = -1 * this.#speed;
                    break;
                }
            // Move Right
            case 39:
                {
                    if (this.xShift === -10) break;
                    this.xShift = this.#speed;
                    this.yShift = 0;
                    break;
                }
            // Move Up
            case 40:
                {
                    if (this.yShift === -10) break;
                    this.xShift = 0;
                    this.yShift = this.#speed;
                    break;
                }
        }
    }

    set xShift(value) { this.#velocity.xShift = value; }
    get xShift() { return this.#velocity.xShift; }

    set yShift(value) { this.#velocity.yShift = value; }
    get yShift() { return this.#velocity.yShift; }
}

class Egg {
    #egg = [];
    #min = 0;
    #max = screenConductor.Screen_Play.element.width - 10;
    constructor({ } = {}) {
        this.generate();
    }

    generate() {
        let x = this.randomLocation();
        let y = this.randomLocation();
        this.#egg = [
            { x: x, y: y }
        ]
    }

    randomLocation() {
        return Math.round((Math.random() * (this.#max - this.#min) + this.#min) / 10) * 10;
    }

    get Egg() { return this.#egg; }
}

class Game {
    #snake = undefined
    #snakeDraw = undefined
    #egg = undefined
    #eggDraw = undefined
    events = new Collection();
    #gameState = Game.enum_gameState.play;
    static enum_gameState = Object.freeze({
        dead: 'dead',
        play: 'play'
    })

    constructor({ } = {}) {
        this.#egg = new Egg();
        this.#Snake = new snake({ eggCollection: this.#egg.Egg });
        this.#SnakeDraw = new Draw_Snake();
        this.#eggDraw = new Draw_Egg();

    }

    advanceBoardState() {
    
        for (const event of this.events.objects) {
                event.action();
        }
        this.events.clear();
        
        this.#SnakeDraw.canvasClear();
        this.#EggDraw.draw(this.#egg.Egg);
        this.Snake.update(this.#egg.Egg);
        this.#SnakeDraw.draw(this.Snake.Snake);
    }

    gameOver() {
        this.Snake.reset();
        this.#egg.generate();
        this.#snakeDraw.canvasClear();
        this.#gameState = Game.enum_gameState.play;
        screenConductor.showGameOverScreen();
        this.events.clear();

    }

    checkGameOver() {
        switch (this.#gameState) {
            case (Game.enum_gameState.play): {
                return false;
            }
            case (Game.enum_gameState.dead): {
                this.gameOver();
                return true;
            }
            default: return false;
        }

    }

    addEvent(event) {
        if (!event) return;

        this.events.add(event);
    }

    set #Snake(value) { this.#snake = value; }
    set #SnakeDraw(value) { this.#snakeDraw = value; }
    set #Egg(value) { this.#egg = value; }
    set #EggDraw(value) { this.#eggDraw = value; }
    set gameState(value) { this.#gameState = value; }
    get Snake() { return this.#snake; }
    get #SnakeDraw() { return this.#snakeDraw; }
    get Egg() { return this.#egg; }
    get #EggDraw() { return this.#eggDraw; }
    get gameState() { return this.#gameState; }

}

class Collection {
    objects = []


    constructor({ } = {}) {

    }

    add(object) {
        if (!object) return;
        this.objects.push(object);
    }

    clear() {
        this.objects = [];
    }
}

class GameEvent {
    static enum_Types = Object.freeze({
        dead: 'dead',
        ate: 'ate'
    })
    #action;

    constructor({ action } = {}) {
        this.#action = action
    }

    get action() { return this.#action; }
}


const screenConductor = new ScreenConductor();
screenConductor.showStartScreen();
const game = new Game();
function Main() {

    if (game.checkGameOver()) return;

        setTimeout(function onTick() {
            game.advanceBoardState();
            Main();
        }, 100)
   
}






