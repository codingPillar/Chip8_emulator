import { SIZE_BYTE } from "../constants.js";
// data in assumed to be organized in little-endian (less significant bytes in lower addresses)
export class Memory {
    constructor(size) {
        this.size = size;
        this.buffer = new ArrayBuffer(size);
        this.byteView = new Uint8Array(this.buffer);
    }
    // big-endian
    access(offset, byteCount = 1) {
        let result = 0;
        for (let i = 0; i < byteCount; i++) {
            result += (this.byteView[offset + i] << ((byteCount - 1 - i) * 8));
        }
        return result;
    }
    writeBytes(offset, value, byteCount = 1) {
        for (let i = 0; i < byteCount; i++)
            this.byteView[offset + i] = value >> ((byteCount - 1 - i) * 8);
    }
    // COULD PROBABLY USE OTHER TYPE OF VIEW TO ACCESS DIRECT BIT AND MODIFY;
    accessSharedByte(byteIndex, offset) {
        const highWeight = this.access(byteIndex, 1);
        const lowWeight = this.access(byteIndex + 1, 1);
        return (highWeight << offset) | (lowWeight >> (SIZE_BYTE - offset));
    }
    writeSharedByte(byteIndex, offset, value) {
        for (let i = 0; i < SIZE_BYTE; i++) {
            this.writeBit(byteIndex, offset, ((value >> (SIZE_BYTE - 1 - i)) & 0x01) != 0);
            offset++;
            if (offset < SIZE_BYTE)
                continue;
            offset = 0;
            byteIndex++;
        }
    }
    writeBit(byteIndex, offset, bit) {
        let byte = this.access(byteIndex, 1);
        const mask = 1 << (SIZE_BYTE - 1 - offset);
        byte |= mask;
        if (!bit)
            byte ^= mask;
        this.writeBytes(byteIndex, byte, 1);
    }
    // little-endian;
    accessL(offset, byteCount = 1) {
        let result = 0;
        for (let i = 0; i < byteCount; i++) {
            result += (this.byteView[offset + i] << (i * 8));
        }
        return result;
    }
    writeBytesL(offset, value, byteCount = 1) {
        for (let i = 0; i < byteCount; i++)
            this.byteView[offset + i] = value >> (i * 8);
    }
    getSize() {
        return this.size;
    }
    clearAll() {
        for (let i = 0; i < this.size; i++)
            this.byteView[i] = 0;
    }
    print(startAddress, count, rowSize) {
        let currentLine = '';
        for (let i = 0; i < count; i++) {
            currentLine += (i % rowSize === 0) ? this.byteView[startAddress + i] : `, ${this.byteView[startAddress + i]}`;
            if (i % rowSize === rowSize - 1) {
                console.log(currentLine);
                currentLine = '';
            }
        }
    }
}
