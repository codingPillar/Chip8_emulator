import { CHARACTER_SEGMENT, DISPLAY_HEIGHT, DISPLAY_WIDTH, GENERAL_USE_SEGMENT, KEY_STENCIL, MEMORY_SIZE, SIZE_BYTE } from "../constants.js";
import { DelayTimer } from "./delayTimer.js";
import { KeyPad } from "./keyPad.js";
import { Memory } from "./memory.js";
import { Processor } from "./processor.js";
export class Chip8 {
    constructor() {
        this.observers = [];
        this.period = 10;
        this.clock = undefined;
        this.memory = new Memory(MEMORY_SIZE);
        this.graphicMemory = new Memory(DISPLAY_WIDTH * DISPLAY_HEIGHT / SIZE_BYTE);
        this.initMemory();
        this.keyPad = new KeyPad();
        this.delayTimer = new DelayTimer();
        this.soundTimer = new DelayTimer();
        this.processor = new Processor(this.memory, this.graphicMemory, this.keyPad, this.delayTimer, this.soundTimer);
    }
    start() {
        this.addClock();
    }
    run() {
        this.processor.executeCycle();
        this.notify();
    }
    loadProgram(data) {
        for (let i = 0; i < data.length; i++)
            this.memory.writeBytes(GENERAL_USE_SEGMENT[0] + i, data[i]);
    }
    // returns current state (false if not running)
    changeRunState() {
        if (this.clock) {
            this.removeClock();
            return false;
        }
        this.addClock();
        return true;
    }
    pressKey(value) {
        this.keyPad.pressKey(value);
    }
    releaseKey(value) {
        this.keyPad.releaseKey(value);
    }
    addClock() {
        this.clock = setInterval(() => {
            this.run();
        }, this.period);
    }
    removeClock() {
        clearInterval(this.clock);
        this.clock = undefined;
    }
    initMemory() {
        const BYTES_PER_CHAR = KEY_STENCIL[0].length;
        for (let i = 0; i < KEY_STENCIL.length; i++) {
            for (let j = 0; j < BYTES_PER_CHAR; j++)
                this.memory.writeBytes(CHARACTER_SEGMENT[0] + i * BYTES_PER_CHAR + j, KEY_STENCIL[i][j]);
        }
    }
    // to notify the view on each clock cycle;
    addObserver(observer) {
        this.observers.push(observer);
    }
    notify() {
        for (const observer of this.observers)
            observer.run();
    }
    // ACCESSORS
    getRegisterValues() {
        return this.processor.getRegisterValues();
    }
    getStackValues() {
        return this.processor.getStackValues();
    }
    getStackPointer() {
        return this.processor.getStackPointer();
    }
    getGraphicMemory() {
        return this.graphicMemory;
    }
    getTimerValues() {
        return [this.delayTimer.getValue(), this.soundTimer.getValue()];
    }
    getProgramCounterValue() {
        return this.processor.getProgramCounterValue();
    }
    getCurrentOpCode() {
        return this.processor.getCurrentOpCode();
    }
    getNextOpCode() {
        return this.processor.getNextOpCode();
    }
    getIndexRegisterValue() {
        return this.processor.getIndexRegisterValue();
    }
    getKeyState() {
        return this.keyPad.getKeyState();
    }
    getKeyPad() {
        return this.keyPad;
    }
    isRunning() {
        return this.clock != undefined;
    }
}
