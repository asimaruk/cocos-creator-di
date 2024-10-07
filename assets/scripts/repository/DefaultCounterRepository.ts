import CounterRepository from "./CounterRepository";

export default class DefaultCounterRepository implements CounterRepository {

    private count: number = 0;
    private listeners: ((n: number) => void)[] = [];
    private incTimeout: number | undefined = undefined;

    constructor() {
        this.incTimeout = setTimeout(() => this.inc(), 3000);
    }

    getCount(): number {
        return this.count;
    }

    inc(): void {
        this.count += 1;
        this.listeners.forEach(listener => listener(this.count));
        clearTimeout(this.incTimeout);
        this.incTimeout = setTimeout(() => this.inc(), 3000);
    }
    
    on(listener: (n: number) => void) {
        this.listeners.push(listener);
    }

    off(listener: (n: number) => void) {
        const idx = this.listeners.indexOf(listener);
        if (idx < 0) {
            return;
        }
        this.listeners.splice(idx, 1);
    }
}