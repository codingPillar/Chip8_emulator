import { KEY_COUNT } from "../constants.js";
import { Key } from "./key.js";

export class KeyPad{
    private keys: Map<number, Key>;

    constructor(){
        this.keys = new Map();
        this.initKeys();
    }
    
    private initKeys(): void {
        for(let i = 0; i < KEY_COUNT; i++) this.keys.set(i, new Key(i));
    }

    pressKey(value: number): void {
        this.keys.get(value)!.pressed = true;
    }

    releaseKey(value: number | undefined): void {
        if(value){
            this.keys.get(value)!.pressed = false;
            return;
        }
        for(const key of this.keys)
            key[1].pressed = false;      
    }

    getKeyState(): Map<number, boolean> {
        const result = new Map<number, boolean>();
        for(const elem of this.keys)
            result.set(elem[0], elem[1].pressed);
        return result;
    }

    getKey(value: number): Key{
        return this.keys.get(value)!;
    }

    getPressedKey(): number {
        for(const key of this.keys) if(key[1].pressed) return key[0];
        return -1;
    }
}