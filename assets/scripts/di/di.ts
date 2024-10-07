import DefaultCounterRepository from "../repository/DefaultCounterRepository";
import CounterRepository from "../repository/CounterRepository";

export function injectable<T extends { new (...args: any[]): {} }>(target: T) {
    const original = target;

    const argumentless : any = function () {
        return new original();
    }

    // copy prototype so intanceof operator still works
    argumentless.prototype = original.prototype;

    // return new constructor (will override original)
    return argumentless;
}

export const DEPS = {
    CounterRepository: 'NumberRepository',
} as const;

type Dep = typeof DEPS[keyof typeof DEPS];
type Dependency<T = Dep> = T extends typeof DEPS.CounterRepository ? CounterRepository 
                         : never;

interface Provider<T = Dep> {
    provide(): Dependency<T>;
}

class SingletonProvider<T = Dep> implements Provider<T> {

    private instance: Dependency<T> | null = null;

    constructor(private factory: () => Dependency<T>) {}

    provide(): Dependency<T> {
        return this.instance ??= this.factory();
    }
}

const numberRepositoryProvider = new SingletonProvider<typeof DEPS.CounterRepository>(() => new DefaultCounterRepository());

export function provide(dep: Dep): Dependency<typeof dep> {
    if (dep === DEPS.CounterRepository) {
        return numberRepositoryProvider.provide();
    } else {
        throw new Error(`Unknown dependency ${dep}`);
    }
}