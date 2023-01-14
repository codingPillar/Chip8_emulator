import { CHIP_CANVAS_HEIGHT, CHIP_CANVAS_WIDTH } from "../constants.js";
import { Chip8 } from "../model/CHIP8.js";
import { Observer } from "../model/interfaces/observer_pattern.js";
import { ChipRenderer } from "./chipRenderer.js";
import { KeyPadRenderer } from "./keyPadRenderer.js";
import { OutputRenderer } from "./outputRenderer.js";

export class MainRenderer implements Observer{
    private chipContext: CanvasRenderingContext2D;
    private displayCanvas: CanvasRenderingContext2D;
    private chipRenderer: ChipRenderer;
    private outputRenderer: OutputRenderer;
    private keyPadRenderer: KeyPadRenderer;

    constructor(displayCanvas: CanvasRenderingContext2D, chipContext: CanvasRenderingContext2D, keyPadContext: CanvasRenderingContext2D, model: Chip8){
        this.displayCanvas = displayCanvas;
        this.chipContext = chipContext;
        this.chipRenderer = new ChipRenderer(chipContext, model);
        this.outputRenderer = new OutputRenderer(displayCanvas, model.getGraphicMemory());
        this.keyPadRenderer = new KeyPadRenderer(model.getKeyPad(), keyPadContext);
    }

    draw(): void {
        this.clearViews();
        this.chipRenderer.draw();
        this.outputRenderer.draw();
        this.keyPadRenderer.draw();
    }

    run(): void {
        this.draw();
    }

    getKeypadRenderer(): KeyPadRenderer {
        return this.keyPadRenderer;
    }

    private clearViews(): void {
        this.chipContext.fillStyle = '#ffffff';
        this.chipContext.fillRect(0, 0, CHIP_CANVAS_WIDTH, CHIP_CANVAS_HEIGHT);
        this.displayCanvas.fillStyle = '#ffffff';
        this.displayCanvas.fillRect(0, 0, CHIP_CANVAS_WIDTH, CHIP_CANVAS_HEIGHT);
        this.keyPadRenderer.clear();
    }
}