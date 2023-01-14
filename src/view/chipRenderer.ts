import { KEY_NAMES } from "../constants.js";
import { Chip8 } from "../model/CHIP8.js";
import { OFFSET_FACTOR, REGISTER_FONT, REGISTER_HEIGHT, REGISTER_LABEL_WIDTH, REGISTER_WIDTH } from "./viewConstants.js";

export class ChipRenderer{
    private context: CanvasRenderingContext2D;
    private model: Chip8;

    constructor(context: CanvasRenderingContext2D, model: Chip8){
        this.context = context;
        this.model = model;
    }

    draw(){
        this.drawRegisters();
        this.drawStack();
        this.drawTimers();
        this.drawInstructionInfo();
        this.drawKeys();
    }

    private drawRegisters(): void {
        const values = this.model.getRegisterValues();
        for(let i = 0; i < values.length; i++)
            this.drawRegister(0, i * (REGISTER_HEIGHT + 5), values[i], i);
    }

    private drawRegister(x: number, y: number, value: number, index: number): void {
        this.context.fillStyle = '#000000';
        this.context.font = REGISTER_FONT;
        this.context.fillText(`V${index}`, x, y + REGISTER_HEIGHT * 0.9)
        this.context.fillRect(x + REGISTER_LABEL_WIDTH, y, REGISTER_WIDTH, REGISTER_HEIGHT);
        this.context.fillStyle = '#ffffff';
        this.context.fillText(value.toString(16), x + REGISTER_LABEL_WIDTH + REGISTER_WIDTH / 3, y + REGISTER_HEIGHT * 0.9);
    }

    private drawStack(){
        const stackValues = this.model.getStackValues();
        const sp = this.model.getStackPointer();
        this.context.fillStyle = '#000000';
        this.context.fillText('Stack', OFFSET_FACTOR, REGISTER_HEIGHT * 0.9);
        for(let i = 0; i < stackValues.length; i++){
            this.context.fillStyle = '#000000';
            if(i === sp) this.context.fillStyle = '#ff0000';
            this.context.fillRect(OFFSET_FACTOR, (i + 1) * REGISTER_HEIGHT, REGISTER_WIDTH, REGISTER_HEIGHT);
            this.context.fillStyle = '#ffffff';
            this.context.fillText(stackValues[i].toString(16), OFFSET_FACTOR + REGISTER_WIDTH / 3, REGISTER_HEIGHT * (i + 1 + 0.9));
        }
    }

    private drawTimers(){
        const offsetX = 2 * OFFSET_FACTOR;
        const timerValues = this.model.getTimerValues();
        this.context.fillStyle = '#000000';
        this.context.fillText('Timers', offsetX, REGISTER_HEIGHT * 0.9);
        for(let i = 0; i < timerValues.length; i++){
            this.context.fillStyle = '#000000';
            this.context.fillRect(offsetX, (i + 1) * REGISTER_HEIGHT, REGISTER_WIDTH, REGISTER_HEIGHT);
            this.context.fillStyle = '#ffffff';
            this.context.fillText(timerValues[i].toString(16), offsetX + REGISTER_WIDTH / 3, REGISTER_HEIGHT * (i + 1 + 0.9));
        }
    }

    private drawInstructionInfo(): void {
        const offsetY = 100;
        const offsetX = 2 * OFFSET_FACTOR - 25;
        const boxOffset = offsetX + 30;
        const values = [this.model.getProgramCounterValue(), this.model.getCurrentOpCode(), this.model.getNextOpCode(), this.model.getIndexRegisterValue()];
        const labels = [' pc ', ' op ', 'nop', ' ir'];
        for(let i = 0; i < values.length; i++){
            this.context.fillStyle = '#000000';
            const textOffset = offsetY + (i + 1 + 0.9) * REGISTER_HEIGHT
            this.context.fillText(labels[i], offsetX, textOffset);
            this.context.fillRect(boxOffset, offsetY + (i + 0.9) * REGISTER_HEIGHT, REGISTER_WIDTH, REGISTER_HEIGHT);
            this.context.fillStyle = '#ffffff';
            this.context.fillText(values[i].toString(16), boxOffset + REGISTER_WIDTH / 3, textOffset);
        }
    }

    private drawKeys(): void {
        const offsetX = 3 * OFFSET_FACTOR;
        const keyState = this.model.getKeyState();
        this.context.fillStyle = '#000000';
        this.context.fillText('Keys', offsetX, REGISTER_HEIGHT * 0.9);
        for(let i = 0; i < keyState.size; i++){
            this.context.fillStyle = '#000000';
            if(keyState.get(i)) this.context.fillStyle = '#FF0000';
            this.context.fillRect(offsetX, (i + 1) * REGISTER_HEIGHT, REGISTER_WIDTH, REGISTER_HEIGHT);
            this.context.fillStyle = '#ffffff';
            this.context.fillText(`${i.toString(16)}  (${KEY_NAMES[i]})`, offsetX + REGISTER_WIDTH / 3, REGISTER_HEIGHT * (i + 1 + 0.9));
        }
    }
}