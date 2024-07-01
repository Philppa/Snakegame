let body = document.getElementsByClassName("central-space")[0];

const enum_cssClasses = Object.freeze({
    backGlow: 'back-glow',
    gameArea: 'game-area',
    startScreen: 'start-screen',
    score: 'score'
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

    get Action() { return this.#action; }
    get Type() { return this.#type; }

    static IsInstance(event) {
        if (!event) return false;

        return event.constructor.name === this.name;
    }
}

class Component {
    element;

    constructor({ type = 'Div', classList = '' } = {}) {
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

        screenConductor.Score.increase();
    }
}

class Screen extends Component {

    constructor({ classList = '', type } = {}) {
        super({
            classList: classList,
            type: type
        })

        this.element.classList.add(enum_cssClasses.backGlow);
    }


}

class Screen_Play extends Screen {
    #context;

    constructor({ } = {}) {
        super({
            type: 'canvas'
        })

        this.element.id = 'gameCanvas';
        this.#Context = this.element.getContext("2d");

    }

    get Context() { return this.#context; }
    set #Context(value) { this.#context = value; }
}

class Screen_Start extends Screen {
    #component = {
        startBtn: undefined
    }

    constructor({ classList = enum_cssClasses.startScreen } = {}) {
        super({
            classList: classList
        })

        this.#build();

        this.element.append(this.#component.startBtn.element);
    }

    get StartBtn() { return this.#component.startBtn; }
    set StartBtn(value) { this.#component.startBtn = value; }

    #build({ } = {}) {
        const createComponents = (() => {
            const startBtn = (() => {
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

                this.#component.startBtn = new Btn_Start({ text: "Start", id: "startBtn", events: events });
            })();
        })();
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

    constructor({ } = {}) {
        super({
            classList: enum_cssClasses.score
        })

        this.element.id = "score";
        this.element.innerHTML = this.Score;
    }

    get Score() { return this.#score; }
    set #Score(value) { this.#score = value; }

    increase() {
        this.#Score = this.Score + 10;
        this.element.innerHTML = this.Score;
    }

    reset() {
        this.#Score = 0;
        this.element.innerHTML = this.Score;
    }
}

class ScreenConductor {
    #screens = {
        Screen_Start: undefined,
        Screen_Play: undefined,
        Score: undefined,
        GameArea: undefined
    }

    constructor({ } = {}) {
        this.Screen_Start = new Screen_Start({ classList: enum_cssClasses.startScreen });
        this.Screen_Play = new Screen_Play({});
        this.Score = new Score({});
        this.GameArea = new GameArea({});
        body.append(this.GameArea.element);
        body = this.GameArea.element;
    }

    get Screen_Start() { return this.#screens.Screen_Start; }
    set Screen_Start(value) { this.#screens.Screen_Start = value; }
    get Screen_Play() { return this.#screens.Screen_Play; }
    set Screen_Play(value) { this.#screens.Screen_Play = value; }
    get Score() { return this.#screens.Score; }
    set Score(value) { this.#screens.Score = value; }
    get GameArea() { return this.#screens.GameArea; }
    set GameArea(value) { this.#screens.GameArea = value; }

    showStartScreen() {

        this.#showScreen(this.Screen_Start.element);
    }

    showPlayScreen() {

        this.#showScreen(this.Screen_Play.element);
    }

    #clearScreens() {
        const screens = [
            this.Screen_Start,
            this.Screen_Play,
            this.Score
        ]

        
        for (const screen of screens) screen.remove();
    }

    #showScreen(screen) {
        this.#clearScreens();

        body.append(screen);
        body.append(this.Score.element);
    }

}


const screenConductor = new ScreenConductor();
screenConductor.showStartScreen();


//----------------------------------------------------------------------Move to classes in another file
//const snakeboard_ctx = screenConductor.Screen_Play.Context;

//snakeboard_ctx.shadowColor = 'hsla(316, 69%, 55%, 1)';
//snakeboard_ctx.shadowOffsetY = 1;
//snakeboard_ctx.ShadowOffSetX = -6;
//snakeboard_ctx.shadowBlur = 5;
//snakeboard_ctx.fillStyle = 'hsla(308, 69%, 98%, 1)';
//snakeboard_ctx.strokestyle = 'hsla(308, 69%, 46%, 1)';
//snakeboard_ctx.fillRect(200, 200, 10, 10);
//snakeboard_ctx.strokeRect(200, 200, 10, 10);




