import { PROGRAM_COUNTER_SIZE, STACK_LEVEL_COUNT } from "../constants.js";
import { Memory } from "./memory.js";
export class Stack {
    // THIS STACK IS USED FOR STORING RETURN ADDRESSES, SO EACH LEVEL MUST BE SAME SIZE AS PROGRAM_COUNTER
    constructor(size = STACK_LEVEL_COUNT) {
        this.size = size;
        this.memory = new Memory(this.size * PROGRAM_COUNTER_SIZE);
        this.index = 0;
    }
    push(value) {
        this.memory.writeBytes(this.index * PROGRAM_COUNTER_SIZE, value, PROGRAM_COUNTER_SIZE);
        this.index++;
    }
    pop() {
        // this will probably crash the program
        if (this.index === 0)
            return 0;
        this.index--;
        return this.memory.access(this.index * PROGRAM_COUNTER_SIZE, PROGRAM_COUNTER_SIZE);
    }
    getStackPointer() {
        return this.index;
    }
    getValues() {
        const values = [];
        for (let i = 0; i < STACK_LEVEL_COUNT; i++) {
            values.push(this.memory.access(i * PROGRAM_COUNTER_SIZE, PROGRAM_COUNTER_SIZE));
        }
        return values;
    }
}
