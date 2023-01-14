export const SIZE_BYTE = 8;
export const DISPLAY_WIDTH = 64;
export const DISPLAY_HEIGHT = 32;
export const DISPLAY_CANVAS_WIDTH = 720;
export const DISPLAY_CANVAS_HEIGHT = DISPLAY_HEIGHT * DISPLAY_CANVAS_WIDTH / DISPLAY_WIDTH;
export const DISPLAY_CANVAS_ID = 'mainCanvas';
export const PAUSE_BTN_ID = 'pauseBtn';
export const CYCLE_BTN_ID = 'iterBtn';
export const CHIP_CANVAS_ID = 'chipCanvas';
export const CHIP_CANVAS_WIDTH = 600;
export const CHIP_CANVAS_HEIGHT = 400;
export const KEYPAD_CANVAS_ID = 'keyPadCanvas';
export const KEYPAD_CANVAS_SIZE = DISPLAY_CANVAS_HEIGHT;
export const KEYPAD_GRID_SIZE = 4;
export const KEYPAD_SQUARE_SIZE = KEYPAD_CANVAS_SIZE / KEYPAD_GRID_SIZE;
export const REGISTER_COUNT = 16;
export const REGISTER_SIZE = 1;
export const INDEX_REGISTER_SIZE = 2;
export const PROGRAM_COUNTER_SIZE = 2;
export const FLAG_REGISTER_INDEX = 15;
export const MEMORY_SIZE = 4096;
export const INTERPRETER_SEGMENT = [0x00, 0x1ff];
export const CHARACTER_SEGMENT = [0x050, 0x0A0];
export const GENERAL_USE_SEGMENT = [0x200, 0xFFF];
export const STACK_LEVEL_COUNT = 16;
export const KEY_COUNT = 16;
export const KEY_STENCIL_SIZE = 5;
export const KEY_STENCIL = [
    [0xF0, 0x90, 0x90, 0x90, 0xF0],
    [0x20, 0x60, 0x20, 0x20, 0x70],
    [0xF0, 0x10, 0xF0, 0x80, 0xF0],
    [0xF0, 0x10, 0xF0, 0x10, 0xF0],
    [0x90, 0x90, 0xF0, 0x10, 0x10],
    [0xF0, 0x80, 0xF0, 0x10, 0xF0],
    [0xF0, 0x80, 0xF0, 0x90, 0xF0],
    [0xF0, 0x10, 0x20, 0x40, 0x40],
    [0xF0, 0x90, 0xF0, 0x90, 0xF0],
    [0xF0, 0x90, 0xF0, 0x10, 0xF0],
    [0xF0, 0x90, 0xF0, 0x90, 0x90],
    [0xE0, 0x90, 0xE0, 0x90, 0xE0],
    [0xF0, 0x80, 0x80, 0x80, 0xF0],
    [0xE0, 0x90, 0x90, 0x90, 0xE0],
    [0xF0, 0x80, 0xF0, 0x80, 0xF0],
    [0xF0, 0x80, 0xF0, 0x80, 0x80] // F
];
export const KEY_NAMES = ['1', '2', '3', '4', 'q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];
export const KEY_VALUES_ORDER = [1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15];
