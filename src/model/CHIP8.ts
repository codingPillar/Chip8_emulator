import { CHARACTER_SEGMENT, DISPLAY_HEIGHT, DISPLAY_WIDTH, GENERAL_USE_SEGMENT, KEY_COUNT, KEY_STENCIL, MEMORY_SIZE, SIZE_BYTE } from "../constants.js";
import { DelayTimer } from "./delayTimer.js";
import { Observed, Observer } from "./interfaces/observer_pattern.js";
import { KeyPad } from "./keyPad.js";
import { Memory } from "./memory.js";
import { Processor } from "./processor.js";

export class Chip8 implements Observed{
    private observers: Observer[] = [];
    private processor: Processor;
    private memory: Memory;
    private graphicMemory: Memory;
    private delayTimer: DelayTimer;
    private soundTimer: DelayTimer;
    private keyPad: KeyPad;

    private period = 10;

    private clock: number | undefined = undefined;

    constructor(){
        this.memory = new Memory(MEMORY_SIZE);
        this.graphicMemory = new Memory(DISPLAY_WIDTH * DISPLAY_HEIGHT / SIZE_BYTE);
        this.initMemory();
        this.keyPad = new KeyPad();
        this.delayTimer = new DelayTimer();
        this.soundTimer = new DelayTimer();
        this.processor = new Processor(this.memory, this.graphicMemory, this.keyPad, this.delayTimer, this.soundTimer);
    }

    start(): void {
        this.addClock();
    }

    run(){
        this.processor.executeCycle();
        this.notify();
    }

    loadProgram(data: number[]): void {
        for(let i = 0; i < data.length; i++)
            this.memory.writeBytes(GENERAL_USE_SEGMENT[0] + i, data[i]);
    }

    // returns current state (false if not running)
    changeRunState(): boolean {
        if(this.clock){
            this.removeClock();
            return false;
        } 
        this.addClock();
        return true;
    }

    pressKey(value: number): void {
        this.keyPad.pressKey(value);
    }

    releaseKey(value?: number): void {
        this.keyPad.releaseKey(value);
    }

    private addClock(): void {
        this.clock = setInterval(() => {
            this.run();
        }, this.period);
    }

    private removeClock(): void {
        clearInterval(this.clock);
        this.clock = undefined;
    }

    private initMemory(): void {
        const BYTES_PER_CHAR = KEY_STENCIL[0].length;
        for(let i = 0; i < KEY_STENCIL.length; i++){
            for(let j = 0; j < BYTES_PER_CHAR; j++)
                this.memory.writeBytes(CHARACTER_SEGMENT[0] + i * BYTES_PER_CHAR + j, KEY_STENCIL[i][j]);
        }
    }

    // to notify the view on each clock cycle;
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notify(): void {
        for(const observer of this.observers) observer.run();
    }

    // ACCESSORS
    getRegisterValues(): number[]{
        return this.processor.getRegisterValues();
    }

    getStackValues(): number[]{
        return this.processor.getStackValues();
    }

    getStackPointer(): number {
        return this.processor.getStackPointer();
    }

    getGraphicMemory(): Memory{
        return this.graphicMemory;
    }

    getTimerValues(): [number, number] {
        return [this.delayTimer.getValue(), this.soundTimer.getValue()];
    }

    getProgramCounterValue(): number {
        return this.processor.getProgramCounterValue();
    }

    getCurrentOpCode(): number {
        return this.processor.getCurrentOpCode();
    }

    getNextOpCode(): number {
        return this.processor.getNextOpCode();
    }

    getIndexRegisterValue(): number {
        return this.processor.getIndexRegisterValue();
    }

    getKeyState(): Map<number, boolean> {
        return this.keyPad.getKeyState();
    }

    getKeyPad(): KeyPad {
        return this.keyPad;
    }

    isRunning(): boolean {
        return this.clock != undefined;
    }
}