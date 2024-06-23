//Need to create a class that creates start screens...
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
        //this.element.classList = enum_cssClasses.startScreen;
        console.log(classList);
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
}

class Screen extends Component {

    constructor({ classList = '' } = {}) {
        super({
            classList: classList
        })

        this.element.classList.add(enum_cssClasses.backGlow);
    }

    
}

class Screen_Start extends Screen {
    #component = {
        startBtn: undefined
    }

    constructor({classList = enum_cssClasses.startScreen } = {}) {
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

    constructor({text, events = []} = {}) {
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

const body = document.getElementsByClassName("game-area")[0];
const startScreenObj = new Screen_Start({ classList: enum_cssClasses.startScreen });
const startScreen = startScreenObj.element
body.append(startScreen);

function startGame() {
    //body.append(snakeboard);
    startScreen.remove();
    //snakeboard_ctx = gameCanvas.getContext("2d");

    //main();
}

