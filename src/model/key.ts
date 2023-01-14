export class Key{
    public pressed: boolean;
    private value: number;

    constructor(value: number){
        this.value = value;
        this.pressed = false;
    }

    getValue(): number {
        return this.value;
    }
}