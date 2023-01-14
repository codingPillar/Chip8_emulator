import { CHIP_CANVAS_HEIGHT, CHIP_CANVAS_WIDTH } from "../constants.js";
import { ChipRenderer } from "./chipRenderer.js";
import { KeyPadRenderer } from "./keyPadRenderer.js";
import { OutputRenderer } from "./outputRenderer.js";
export class MainRenderer {
    constructor(displayCanvas, chipContext, keyPadContext, model) {
        this.displayCanvas = displayCanvas;
        this.chipContext = chipContext;
        this.chipRenderer = new ChipRenderer(chipContext, model);
        this.outputRenderer = new OutputRenderer(displayCanvas, model.getGraphicMemory());
        this.keyPadRenderer = new KeyPadRenderer(model.getKeyPad(), keyPadContext);
    }
    draw() {
        this.clearViews();
        this.chipRenderer.draw();
        this.outputRenderer.draw();
        this.keyPadRenderer.draw();
    }
    run() {
        this.draw();
    }
    getKeypadRenderer() {
        return this.keyPadRenderer;
    }
    clearViews() {
        this.chipContext.fillStyle = '#ffffff';
        this.chipContext.fillRect(0, 0, CHIP_CANVAS_WIDTH, CHIP_CANVAS_HEIGHT);
        this.displayCanvas.fillStyle = '#ffffff';
        this.displayCanvas.fillRect(0, 0, CHIP_CANVAS_WIDTH, CHIP_CANVAS_HEIGHT);
        this.keyPadRenderer.clear();
    }
}
