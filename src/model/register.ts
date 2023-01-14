import { REGISTER_SIZE } from "../constants.js";
import { Memory } from "./memory.js";

export class Register{
    private memory: Memory;

    constructor(size: number = REGISTER_SIZE){
        this.memory = new Memory(size);
    }

    getSize(): number {
        return this.memory.getSize();
    }

    getValue(): number {
        return this.memory.access(0, this.getSize());
    }

    update(value: number): void {
        this.memory.writeBytes(0, value, this.getSize());
    }
}