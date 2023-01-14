import { KEY_COUNT } from "../constants.js";
import { Key } from "./key.js";
export class KeyPad {
    constructor() {
        this.keys = new Map();
        this.initKeys();
    }
    initKeys() {
        for (let i = 0; i < KEY_COUNT; i++)
            this.keys.set(i, new Key(i));
    }
    pressKey(value) {
        this.keys.get(value).pressed = true;
    }
    releaseKey(value) {
        if (value) {
            this.keys.get(value).pressed = false;
            return;
        }
        for (const key of this.keys)
            key[1].pressed = false;
    }
    getKeyState() {
        const result = new Map();
        for (const elem of this.keys)
            result.set(elem[0], elem[1].pressed);
        return result;
    }
    getKey(value) {
        return this.keys.get(value);
    }
    getPressedKey() {
        for (const key of this.keys)
            if (key[1].pressed)
                return key[0];
        return -1;
    }
}
