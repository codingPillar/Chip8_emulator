import { CYCLE_BTN_ID, DISPLAY_CANVAS_ID, KEYPAD_CANVAS_ID, KEY_NAMES, PAUSE_BTN_ID } from "../constants.js";
import { Chip8 } from "../model/CHIP8.js";
import { MainRenderer } from "../view/mainRenderer.js";

export class MainController{
    private model: Chip8;
    private renderer: MainRenderer;

    constructor(model: Chip8, renderer: MainRenderer){
        this.model = model;
        this.renderer = renderer;
        this.addPauseButtonEvent();
        this.addCycleBtnEvent();
        this.addKeyEvents();
        this.addKeypadClickEvent();
    }

    private addPauseButtonEvent(): void {
        const pauseBtn = document.getElementById(PAUSE_BTN_ID) as HTMLButtonElement;
        pauseBtn.addEventListener('click', (event: MouseEvent) => {
            if(this.model.changeRunState()) pauseBtn.innerHTML = 'PAUSE';
            else pauseBtn.innerHTML = 'START';
            this.renderer.draw();
        });
    }

    private addCycleBtnEvent(): void {
        const cycleBtn = document.getElementById(CYCLE_BTN_ID) as HTMLButtonElement;
        cycleBtn.addEventListener('click', (event: MouseEvent) => {
            if(this.model.isRunning()) return;
            this.model.run();
        });
    }

    private addKeypadClickEvent(): void {
        const keyPadCanvas = document.getElementById(KEYPAD_CANVAS_ID) as HTMLCanvasElement;
        keyPadCanvas.addEventListener('mousedown', (event: MouseEvent) => {
            const keyIndex = this.renderer.getKeypadRenderer().getKeyValue(event.offsetX, event.offsetY);
            this.model.pressKey(keyIndex);
        });
        const releaseCallback = () => {
            this.model.releaseKey();
        };
        keyPadCanvas.addEventListener('mouseup', releaseCallback);
        keyPadCanvas.addEventListener('mouseleave', releaseCallback);
    }

    private addKeyEvents(): void {
        const canvas = document.getElementById(DISPLAY_CANVAS_ID) as HTMLCanvasElement;
        canvas.addEventListener('keypress', (event: KeyboardEvent) => {
            const index = KEY_NAMES.indexOf(event.key);
            if(index != -1) this.model.pressKey(index);
        });
        canvas.addEventListener('keyup', (event: KeyboardEvent) => {
            const index = KEY_NAMES.indexOf(event.key);
            if(index != -1) this.model.releaseKey(index);
        });
    }
}