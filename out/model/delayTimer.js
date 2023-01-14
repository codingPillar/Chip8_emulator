import { Register } from "./register.js";
export class DelayTimer {
    constructor() {
        this.timer = new Register();
    }
    tick() {
        let currentValue = this.timer.getValue();
        if (currentValue === 0)
            return;
        this.timer.update(currentValue - 1);
    }
    setValue(time) {
        this.timer.update(time);
    }
    getValue() {
        return this.timer.getValue();
    }
}
