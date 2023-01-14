import { Register } from "./register.js"

export class DelayTimer{
    private timer: Register;

    constructor(){
        this.timer = new Register();
    }

    tick(): void {
        let currentValue = this.timer.getValue();
        if(currentValue === 0) return;
        this.timer.update(currentValue - 1);
    }

    setValue(time: number): void {
        this.timer.update(time);
    }

    getValue(): number {
        return this.timer.getValue();
    }
}