export interface Observer{
    run(): void;
}

export interface Observed{
    addObserver(observer: Observer): void;
    notify(): void;
}