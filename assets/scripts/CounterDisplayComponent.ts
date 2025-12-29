import { DEPS, inject, injectable } from "./di/di";
import CounterRepository from "./repository/CounterRepository";

const {
    ccclass, 
    property, 
    requireComponent,
} = cc._decorator;

@ccclass
@injectable
@requireComponent(cc.Label)
export default class CounterDisplayComponent extends cc.Component {

    private label: cc.Label = null!;

    constructor(
        @inject(DEPS.CounterRepository) private counterRepository: CounterRepository,
    ) {
        super();
    }

    onLoad() {
        this.label = this.getComponent(cc.Label);
        this.counterRepository.on(this.onCounter);
    }

    protected onDestroy(): void {
        this.counterRepository.off(this.onCounter);
    }

    private onCounter = (n: number) => {
        this.label.string = `Count ${n}`;
    }
}
