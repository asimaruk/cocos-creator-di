import DefaultCounterRepository from "../repository/DefaultCounterRepository";
import CounterRepository from "../repository/CounterRepository";

type DefaultValuesMap = Record<number, () => any>;
const defaultValuesStorage: Record<string, DefaultValuesMap> = {};

export function injectable<T extends { new (...args: any[]): {} }>(target: T) {
    return class extends target {
        constructor(...params: any[]) {
            const defaults = defaultValuesStorage[target.name];
            const paramsLength = Math.max(params.length, ...(defaults ? Object.keys(defaults).map(k => parseInt(k) + 1) : [0]));
            const defaultedParams = Array.from({ length: paramsLength}).map((v, i) => params[i] || defaults[i]());
            super(...defaultedParams);
        }
    };
}

export function inject(dep: Dep) {
    return function (target: any, methodName: string | undefined, parameterIndex: number) {
        if (methodName === undefined) {
            const defaults = defaultValuesStorage[target.name] || {};
            defaults[parameterIndex] = () => provide(dep);
            defaultValuesStorage[target.name] = defaults;
        }
    };
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