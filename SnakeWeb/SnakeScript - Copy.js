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

        this.element.classList = enum_cssClasses.backGlow;
    }

    
}

class Screen_Start extends Screen {
    #component = {
        startBtn: undefined;
    }

    constructor({classList = enum_cssClasses.startScreen } = {}) {
        super({
            classList: classList
        })
        this.#build();
    }

    #build({ } = {}) {
        const createComponents = (() => {
            const startBtn = (() => {
                const events = [
                    new SnakeWeb_Event({
                        type: SnakeWeb_Event.Types.Click,
                        action: (e) => {
                            console.log(e);
                        }
                    })
                ]
                this.#StartBtn = new //// COME BACK AFTER CLASS IS CREATED 
            })();
        })();
    }

    get StartBtn() { return this.#component.startBtn; }
    set StartBtn(value) { this.#component.startBtn = value; }
}

class Button extends Component {

    constructor({text, id, events = []} = {}) {
        super({
            type: 'input';
        })
        this.element.id = id;
        this.element.value
        this.addEvents(events);


    }
}

