import { CYCLE_BTN_ID, DISPLAY_CANVAS_ID, KEYPAD_CANVAS_ID, KEY_NAMES, PAUSE_BTN_ID } from "../constants.js";
export class MainController {
    constructor(model, renderer) {
        this.model = model;
        this.renderer = renderer;
        this.addPauseButtonEvent();
        this.addCycleBtnEvent();
        this.addKeyEvents();
        this.addKeypadClickEvent();
    }
    addPauseButtonEvent() {
        const pauseBtn = document.getElementById(PAUSE_BTN_ID);
        pauseBtn.addEventListener('click', (event) => {
            if (this.model.changeRunState())
                pauseBtn.innerHTML = 'PAUSE';
            else
                pauseBtn.innerHTML = 'START';
            this.renderer.draw();
        });
    }
    addCycleBtnEvent() {
        const cycleBtn = document.getElementById(CYCLE_BTN_ID);
        cycleBtn.addEventListener('click', (event) => {
            if (this.model.isRunning())
                return;
            this.model.run();
        });
    }
    addKeypadClickEvent() {
        const keyPadCanvas = document.getElementById(KEYPAD_CANVAS_ID);
        keyPadCanvas.addEventListener('mousedown', (event) => {
            const keyIndex = this.renderer.getKeypadRenderer().getKeyValue(event.offsetX, event.offsetY);
            this.model.pressKey(keyIndex);
        });
        const releaseCallback = () => {
            this.model.releaseKey();
        };
        keyPadCanvas.addEventListener('mouseup', releaseCallback);
        keyPadCanvas.addEventListener('mouseleave', releaseCallback);
    }
    addKeyEvents() {
        const canvas = document.getElementById(DISPLAY_CANVAS_ID);
        canvas.addEventListener('keypress', (event) => {
            const index = KEY_NAMES.indexOf(event.key);
            if (index != -1)
                this.model.pressKey(index);
        });
        canvas.addEventListener('keyup', (event) => {
            const index = KEY_NAMES.indexOf(event.key);
            if (index != -1)
                this.model.releaseKey(index);
        });
    }
}
