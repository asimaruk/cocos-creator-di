export default interface CounterRepository {
    getCount(): number;
    inc();
    on(listener: (n: number) => void);
    off(listener: (n: number) => void);
}