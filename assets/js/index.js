// state = [
//     [0, 0, 0],
//     [0, 2, 0],
//     [0, 0, 0],
// ]

let implementation = new Puissance4Implementation();


algo = new MinMax(implementation);
// let result = algo.execute(state);

// console.log(result.state);
// console.log(evaluate(state));

// console.log(generateChildren(state).length);
function getNextMove(state) {
    console.log(implementation.evaluateState(state));
    console.log(implementation.generateChildren(state, false));
    // return state;
    return algo.execute(state, 7).state;
}