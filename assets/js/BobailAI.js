class BobailAI {
    constructor() { //      JOUEUR 2 MINIMISE // JOUEUR 1 MAXIMISE
        let implementation = new BobailImplementation();

        this.algo = new MinMax(implementation);
    }

    getNextState(state) {
        //return state;
        return this.algo.execute(state, 4).state;
    }
}