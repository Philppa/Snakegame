const body = document.getElementsByClassName("game-area")[0];

const enum_cssClasses = Object.freeze({
    backGlow: 'back-glow',
    startScreen: 'start-screen'
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
        this.element.height = 400;
        this.element.width = 400;
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

    #build({ } = {}) {
        const createComponents = (() => {
            const startBtn = (() => {
                const events = [
                    new SnakeWeb_Event({
                        type: SnakeWeb_Event.Types.Click,
                        action: (e) => {
                            startGame();
                        }
                    })
                ]
                this.#component.startBtn = new Btn_Start({ text: "Start", id: "startBtn", events: events });
            })();
        })();
    }

    get StartBtn() { return this.#component.startBtn; }
    set StartBtn(value) { this.#component.startBtn = value; }
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

class ScreenConductor {
    #screens = {
        Screen_Start: undefined,
        Screen_Play: undefined
    }

    constructor({ } = {}) {
        this.Screen_Start = new Screen_Start({ classList: enum_cssClasses.startScreen });
        this.Screen_Play = new Screen_Play({});
    }

    showStartScreen() {

        this.#showScreen(this.Screen_Start.element);
    }

    showPlayScreen() {

        this.#showScreen(this.Screen_Play.element);
    }

    #clearScreens() {
        const screens = [
            this.Screen_Start,
            this.Screen_Play
        ]

        //TODO: make remove method
        for (const screen of screens) screen.remove();
    }

    #showScreen(screen) {
        this.#clearScreens();
        body.append(screen);
    }


    get Screen_Start() { return this.#screens.Screen_Start; }
    set Screen_Start(value) { this.#screens.Screen_Start = value; }
    get Screen_Play() { return this.#screens.Screen_Play; }
    set Screen_Play(value) { this.#screens.Screen_Play = value; }


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


function startGame() {
    screenConductor.showPlayScreen();

    //main();
}

