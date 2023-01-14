import { CHIP_CANVAS_HEIGHT, CHIP_CANVAS_ID, CHIP_CANVAS_WIDTH, DISPLAY_CANVAS_HEIGHT, DISPLAY_CANVAS_ID, DISPLAY_CANVAS_WIDTH, KEYPAD_CANVAS_ID, KEYPAD_CANVAS_SIZE } from "./constants.js";
import { MainController } from "./controller/mainController.js";
import { Chip8 } from "./model/CHIP8.js";
import { PONG_ROM } from "./model/ROMS.js";
import { MainRenderer } from "./view/mainRenderer.js";
function main() {
    console.log("WELCOME");
    const chipCanvas = document.getElementById(CHIP_CANVAS_ID);
    chipCanvas.setAttribute('width', CHIP_CANVAS_WIDTH.toString());
    chipCanvas.setAttribute('height', CHIP_CANVAS_HEIGHT.toString());
    const chipContext = chipCanvas.getContext('2d');
    const displayCanvas = document.getElementById(DISPLAY_CANVAS_ID);
    displayCanvas.setAttribute('width', DISPLAY_CANVAS_WIDTH.toString());
    displayCanvas.setAttribute('height', DISPLAY_CANVAS_HEIGHT.toString());
    const displayContext = displayCanvas.getContext('2d');
    displayCanvas.focus();
    const keyPadCanvas = document.getElementById(KEYPAD_CANVAS_ID);
    keyPadCanvas.setAttribute('width', KEYPAD_CANVAS_SIZE.toString());
    keyPadCanvas.setAttribute('height', KEYPAD_CANVAS_SIZE.toString());
    const keyPadContext = keyPadCanvas.getContext('2d');
    const model = new Chip8();
    const renderer = new MainRenderer(displayContext, chipContext, keyPadContext, model);
    const controller = new MainController(model, renderer);
    model.loadProgram(PONG_ROM);
    model.addObserver(renderer);
    model.start();
    renderer.draw();
}
main();
