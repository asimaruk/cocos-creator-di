import CounterRepository from "./repository/CounterRepository";
import { injectable, provide, DEPS } from "./di/di";

const {ccclass} = cc._decorator;

@ccclass
@injectable
export default class CounterIncComponent extends cc.Component {

    constructor(
        private counterRepository: CounterRepository = provide(DEPS.CounterRepository),
    ) {
        super();
    }

    inc() {
        this.counterRepository.inc();
    }
}
