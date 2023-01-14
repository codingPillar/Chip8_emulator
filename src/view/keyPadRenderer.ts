import { KEYPAD_CANVAS_SIZE, KEYPAD_GRID_SIZE, KEYPAD_SQUARE_SIZE, KEY_VALUES_ORDER } from "../constants.js";
import { Key } from "../model/key.js";
import { KeyPad } from "../model/keyPad.js";

export class KeyPadRenderer{
    private context: CanvasRenderingContext2D;
    private model: KeyPad;

    constructor(model: KeyPad, context: CanvasRenderingContext2D){
        this.model = model;
        this.context = context;
    }

    draw(){
        this.drawGrid();
        this.drawKeys();
    }

    clear(){
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, KEYPAD_CANVAS_SIZE, KEYPAD_CANVAS_SIZE);
    }

    getKeyValue(mouseX: number, mouseY: number): number {
        const yOffset = Math.floor(mouseY / KEYPAD_SQUARE_SIZE) * KEYPAD_GRID_SIZE;
        const xOffset = Math.floor(mouseX / KEYPAD_SQUARE_SIZE);
        return KEY_VALUES_ORDER[xOffset + yOffset];
    }

    private drawGrid(): void {
        this.context.strokeStyle = '#000000';
        this.context.beginPath();
        for(let i = 0; i < KEYPAD_GRID_SIZE; i++){
            this.context.moveTo(0, i * KEYPAD_SQUARE_SIZE);
            this.context.lineTo(KEYPAD_CANVAS_SIZE, i * KEYPAD_SQUARE_SIZE);
            this.context.moveTo(i * KEYPAD_SQUARE_SIZE, 0);
            this.context.lineTo(i * KEYPAD_SQUARE_SIZE, KEYPAD_CANVAS_SIZE);
        }
        this.context.stroke();
    }

    private drawKeys(): void {
        for(let i = 0; i < KEYPAD_GRID_SIZE; i++){
            for(let j = 0; j < KEYPAD_GRID_SIZE; j++){
                const gridIndex = j * KEYPAD_GRID_SIZE + i;
                const currentKey = this.model.getKey(KEY_VALUES_ORDER[gridIndex]);
                if(currentKey.pressed){
                    this.context.fillStyle = '#ff0000';
                    this.context.fillRect(i * KEYPAD_SQUARE_SIZE, j * KEYPAD_SQUARE_SIZE, KEYPAD_SQUARE_SIZE, KEYPAD_SQUARE_SIZE);
                }
                this.context.fillStyle = "#000000";
                this.context.font = `${KEYPAD_SQUARE_SIZE / 3}px Arial`;
                this.context.fillText(currentKey.getValue().toString(16), (i + 0.33) * KEYPAD_SQUARE_SIZE, (j + 0.67) * KEYPAD_SQUARE_SIZE);
            }
        }
    }
}