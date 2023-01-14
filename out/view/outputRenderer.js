import { DISPLAY_CANVAS_HEIGHT, DISPLAY_CANVAS_WIDTH, DISPLAY_HEIGHT, DISPLAY_WIDTH, SIZE_BYTE } from "../constants.js";
export class OutputRenderer {
    constructor(context, graphicMemory) {
        this.context = context;
        this.graphicMemory = graphicMemory;
        this.pixelSize = DISPLAY_CANVAS_WIDTH / DISPLAY_WIDTH;
    }
    draw() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, DISPLAY_CANVAS_WIDTH, DISPLAY_CANVAS_HEIGHT);
        this.context.fillStyle = '#ffffff';
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            for (let j = 0; j < DISPLAY_WIDTH / SIZE_BYTE; j++) {
                const rowSectionState = this.graphicMemory.access(i * DISPLAY_WIDTH / SIZE_BYTE + j);
                for (let k = SIZE_BYTE - 1; k >= 0; k--) {
                    if (!((rowSectionState & (1 << k)) != 0))
                        continue;
                    this.context.fillRect(((j * SIZE_BYTE) + (SIZE_BYTE - 1 - k)) * this.pixelSize, i * this.pixelSize, this.pixelSize, this.pixelSize);
                }
            }
        }
        //this.debug();
    }
    debug() {
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            this.context.moveTo(0, i * this.pixelSize);
            this.context.lineTo(DISPLAY_CANVAS_WIDTH, i * this.pixelSize);
        }
        for (let j = 0; j < DISPLAY_WIDTH; j++) {
            this.context.moveTo(j * this.pixelSize, 0);
            this.context.lineTo(j * this.pixelSize, DISPLAY_CANVAS_HEIGHT);
        }
        this.context.stroke();
    }
}
