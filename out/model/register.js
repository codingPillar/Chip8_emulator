import { REGISTER_SIZE } from "../constants.js";
import { Memory } from "./memory.js";
export class Register {
    constructor(size = REGISTER_SIZE) {
        this.memory = new Memory(size);
    }
    getSize() {
        return this.memory.getSize();
    }
    getValue() {
        return this.memory.access(0, this.getSize());
    }
    update(value) {
        this.memory.writeBytes(0, value, this.getSize());
    }
}
