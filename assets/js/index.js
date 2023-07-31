// state = [
//     [0, 0, 0],
//     [0, 2, 0],
//     [0, 0, 0],
// ]

let implementation = new MorpionImplementation();


algo = new MinMax(implementation);
// let result = algo.execute(state);

// console.log(result.state);
// console.log(evaluate(state));

// console.log(generateChildren(state).length);
function getNextMove(state) {
    return algo.execute(state, 100).state;
}