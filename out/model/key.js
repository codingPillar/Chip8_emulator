export class Key {
    constructor(value) {
        this.value = value;
        this.pressed = false;
    }
    getValue() {
        return this.value;
    }
}
