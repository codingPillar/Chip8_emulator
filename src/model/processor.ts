import { CHARACTER_SEGMENT, DISPLAY_HEIGHT, DISPLAY_WIDTH, FLAG_REGISTER_INDEX, GENERAL_USE_SEGMENT, INDEX_REGISTER_SIZE, KEY_STENCIL_SIZE, PROGRAM_COUNTER_SIZE, REGISTER_COUNT, SIZE_BYTE } from "../constants.js";
import { DelayTimer } from "./delayTimer.js";
import { Key } from "./key.js";
import { KeyPad } from "./keyPad.js";
import { Memory } from "./memory.js";
import { Register } from "./register.js";
import { Stack } from "./stack.js";

export class Processor{
    private registers: Register[] = [];
    private indexRegister: Register;
    private programCounter: Register;
    private stack: Stack;
    private memory: Memory;
    private graphicMem: Memory;
    private keyPad: KeyPad
    private delayTimer: DelayTimer;
    private soundTimer: DelayTimer;

    private currentOpCode: number = 0;

    constructor(memory: Memory, graphicMem: Memory, keyPad: KeyPad, delayTimer: DelayTimer, soundTimer: DelayTimer){
        this.memory = memory;
        this.graphicMem = graphicMem;
        this.keyPad = keyPad;
        this.indexRegister = new Register(INDEX_REGISTER_SIZE);
        this.programCounter = new Register(PROGRAM_COUNTER_SIZE);
        this.programCounter.update(GENERAL_USE_SEGMENT[0]);
        this.stack = new Stack();
        this.delayTimer = delayTimer;
        this.soundTimer = soundTimer;
        for(let i = 0; i < REGISTER_COUNT; i++) this.registers.push(new Register());
    }

    executeCycle(): void {
        this.fetch();
        this.execute();
        this.delayTimer.tick();
        this.soundTimer.tick();
    }

    private fetch(): void {
        this.currentOpCode = this.memory.access(this.programCounter.getValue(), 2);
        this.programCounter.update(this.programCounter.getValue() + 2);
    }

    private execute() : void {
        switch(this.currentOpCode){
            case 0x00E0:
                this.graphicMem.clearAll();
                break;
            case 0x00EE:
                this.programCounter.update(this.stack.pop());
                break;
            default:
                this.execOneArgInstruction(this.currentOpCode);
        }
    }

    private execOneArgInstruction(opcode: number): boolean {
        switch(opcode & 0xF000){
            case 0x1000:
                // 1nnn, where nnn is address to jump to
                this.programCounter.update(opcode & 0x0FFF);
                break;
            case 0x2000:
                // 2nnn, where nnn is address of call to
                this.stack.push(this.programCounter.getValue());
                this.programCounter.update(opcode & 0x0FFF);
                break;
            case 0x3000:
                // 3xkk, x (register number), kk (8 bit value)
                {
                    const regIndex = (opcode & 0x0F00) >> 8;    
                    const value = opcode & 0x00FF;
                    if(this.registers[regIndex].getValue() === value) 
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            case 0x4000:
                // 4xkk, x (register number), kk (8 bit value)
                {
                    const regIndex = (opcode & 0x0F00) >> 8;
                    const value = opcode & 0x00FF;
                    if(this.registers[regIndex].getValue() != value) 
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            case 0x5000:
                {
                    const firstRegIndex = (opcode & 0x0F00) >> 8;
                    const secondRegIndex = (opcode & 0x00F0) >> 4;
                    if(this.registers[firstRegIndex].getValue() === this.registers[secondRegIndex].getValue())
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            case 0x6000:
                // 6xkk, x (register number), kk (8 bit value)
                {
                    const regIndex = (opcode & 0x0F00) >> 8;
                    const value = opcode & 0x00FF;
                    this.registers[regIndex].update(value);
                }
                break;
            case 0x7000:
                    {
                        const regIndex = (opcode & 0x0F00) >> 8;
                        const value = opcode & 0x00FF;
                        this.registers[regIndex].update(this.registers[regIndex].getValue() + value);
                    }
                break;
            case 0x8000:
                this.execRegisterArithmetic(this.currentOpCode);
                break;
            case 0x9000:
                if((opcode & 0x0001) != 0) break;
                {
                    const firstReg = (opcode & 0x0F00) >> 8;
                    const secondReg = (opcode & 0x00F0) >> 4;
                    if(this.registers[firstReg].getValue() != this.registers[secondReg].getValue())
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            case 0xA000:
                this.indexRegister.update(opcode & 0x0FFF);
                break;
            case 0xB000:
                {
                    const value = opcode & 0x0FFF;
                    this.programCounter.update(this.registers[0].getValue() + value);
                }
                break;
            case 0xC000:
                {
                    const randomByte = Math.round(Math.random() * 255);
                    const mask = opcode & 0x00FF;
                    const registerIndex = (opcode & 0x0F00) >> 8;
                    this.registers[registerIndex].update(randomByte & mask);
                }
                break;
            case 0xD000:
                this.renderSprite(opcode);
                break;
            case 0xE000:
                this.execKeyInstruction(opcode);
                break;
            case 0xF000:
                this.executeFTypeInstruction(opcode);
                break;
            default:
                return false;
        }
        return true;
    }

    private execRegisterArithmetic(opcode: number): void {
        const firstRegIndex = (opcode & 0x0F00) >> 8;
        const secondRegIndex = (opcode & 0x00F0) >> 4;
        switch(opcode & 0x000F){
            case 0x0000:
                this.registers[firstRegIndex].update(this.registers[secondRegIndex].getValue());
                break;
            case 0x0001:
                this.registers[firstRegIndex].update(
                    this.registers[firstRegIndex].getValue() | this.registers[secondRegIndex].getValue());
                break;
            case 0x0002:
                this.registers[firstRegIndex].update(
                    this.registers[firstRegIndex].getValue() & this.registers[secondRegIndex].getValue());
                break;
            case 0x0003:
                this.registers[firstRegIndex].update(
                    this.registers[firstRegIndex].getValue() ^ this.registers[secondRegIndex].getValue());
                break;
            case 0x0004:
                {
                    const value = this.registers[firstRegIndex].getValue() + this.registers[secondRegIndex].getValue();
                    this.registers[firstRegIndex].update(value);
                    if(value > 255) this.registers[FLAG_REGISTER_INDEX].update(1);
                    else this.registers[FLAG_REGISTER_INDEX].update(0);
                }
                break;
            case 0x0005:
                {
                    const value = this.registers[firstRegIndex].getValue() - this.registers[secondRegIndex].getValue();
                    if(value > 0) this.registers[FLAG_REGISTER_INDEX].update(1);
                    else this.registers[FLAG_REGISTER_INDEX].update(0); // reg[first] > reg[second]
                    this.registers[firstRegIndex].update(value);
                }
                break;
            case 0x0006:
                {
                    const value = this.registers[firstRegIndex].getValue();
                    if((value & 0x0001) === 1) this.registers[FLAG_REGISTER_INDEX].update(1);
                    else this.registers[FLAG_REGISTER_INDEX].update(0);
                    this.registers[firstRegIndex].update(value >> 1);
                }
                break;
            case 0x0007:
                {
                    const value = this.registers[secondRegIndex].getValue() - this.registers[firstRegIndex].getValue();
                    if(value > 0) this.registers[FLAG_REGISTER_INDEX].update(1);
                    else this.registers[FLAG_REGISTER_INDEX].update(0); // reg[second] > reg[first]
                    this.registers[firstRegIndex].update(value);
                }
                break;
            case 0x000E:
                {
                    const value = this.registers[firstRegIndex].getValue();
                    if((value & 0x8000) === 1) this.registers[FLAG_REGISTER_INDEX].update(1);
                    else this.registers[FLAG_REGISTER_INDEX].update(0);
                    this.registers[firstRegIndex].update(value << 1);
                }
                break;
            default:
                return;
        }
    }

    private  renderSprite(opcode: number): void {
        const byteCount = opcode & 0x000F;
        const firstRegIndex = (opcode & 0x0F00) >> 8;
        const secondRegIndex = (opcode & 0x00F0) >> 4;

        let x = this.registers[firstRegIndex].getValue() % DISPLAY_WIDTH;
        let y = this.registers[secondRegIndex].getValue() % DISPLAY_HEIGHT;

        this.registers[FLAG_REGISTER_INDEX].update(0);

        for(let i = 0; i < byteCount; i++){
            const memAddress = ((y + i) * DISPLAY_WIDTH / SIZE_BYTE) + Math.floor(x / SIZE_BYTE);
            const displayRow = this.graphicMem.accessSharedByte(memAddress, x % SIZE_BYTE);
            const spriteRow = this.memory.access(this.indexRegister.getValue() + i, 1);
            if(displayRow & spriteRow) this.registers[FLAG_REGISTER_INDEX].update(1);
            this.graphicMem.writeSharedByte(memAddress, x % SIZE_BYTE, displayRow ^ spriteRow);
        }
    }

    private execKeyInstruction(opcode: number){
        switch(opcode & 0x00FF){
            case 0x9E:
                {
                    const regIndex = (opcode & 0x0F00) >> 8;
                    if(this.keyPad.getKey(this.registers[regIndex].getValue()).pressed)
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            case 0xA1:
                {
                    const regIndex = (opcode & 0x0F00) >> 8;
                    if(!this.keyPad.getKey(this.registers[regIndex].getValue()).pressed)
                        this.programCounter.update(this.programCounter.getValue() + 2);
                }
                break;
            default:
                return;
        }
    }

    private executeFTypeInstruction(opcode: number): void {
        const regIndex = (opcode & 0x0F00) >> 8;
        switch(opcode & 0x00FF){
            case 0x0007:
                this.registers[regIndex].update(this.delayTimer.getValue());
                break;
            case 0x000A:
                {   
                    let keyValue = this.keyPad.getPressedKey();
                    if(keyValue === -1) this.programCounter.update(this.programCounter.getValue() - 2);
                    else this.registers[regIndex].update(keyValue);
                }
                break;
            case 0x0015:
                this.delayTimer.setValue(this.registers[regIndex].getValue());
                break;
            case 0x0018:
                this.soundTimer.setValue(this.registers[regIndex].getValue());
                break;
            case 0x001E:
                this.indexRegister.update(
                    this.indexRegister.getValue() + this.registers[regIndex].getValue());
                break;
            case 0x0029:
                {
                    const spriteAddress = CHARACTER_SEGMENT[0] + this.registers[regIndex].getValue() * KEY_STENCIL_SIZE;
                    this.indexRegister.update(spriteAddress);
                }
                break;
            case 0x0033:
                {
                    let value = this.registers[regIndex].getValue();
                    for(let i = 0; i < 3; i++){
                        const lessSignificantDigit = value % 10;
                        value = Math.floor(value / 10);
                        this.memory.writeBytes(this.indexRegister.getValue() + (2 - i), lessSignificantDigit);
                    }
                }
                break;
            case 0x0055:
                for(let i = 0; i <= regIndex; i++){
                    this.memory.writeBytes(this.indexRegister.getValue() + i, this.registers[i].getValue());
                }
                break;
            case 0x0065:
                for(let i = 0; i < regIndex; i++){
                    this.registers[i].update(this.memory.access(this.indexRegister.getValue() + i));
                }
                break;
            default:
                return;
        }
    }

    // ACCESSORS
    getRegisterValues(): number[]{
        const values: number[] = [];
        for(let i = 0; i < this.registers.length; i++){
            values.push(this.registers[i].getValue());
        }
        return values;
    }

    getStackValues(): number[]{
        return this.stack.getValues();
    }

    getStackPointer(): number {
        return this.stack.getStackPointer();
    }

    getProgramCounterValue(): number {
        return this.programCounter.getValue();
    }

    getCurrentOpCode(): number {
        return this.currentOpCode;
    }

    getNextOpCode(): number {
        return this.memory.access(this.programCounter.getValue(), 2);
    }

    getIndexRegisterValue(): number {
        return this.indexRegister.getValue();
    }
}