/**
 * Class MinMax : 
 * - Implémente les différentes fonctions relatives à l'algorithme MinMax
 */
class MinMax {
    // Interface for the implementation object
    static MinMaxInterface = new Interface("MinMax", "evaluateState", "generateChildren", "isGameOver");

    /**
     * @abstract Objet possédant la définition des 3 méthodes nécessaire pour implémenter l'algorithme MinMax
     * @param {method} evaluateStateFunc
     * @param {method} generateChildrenFunc 
     * @param {method} isGameOverFunc 
     */
    constructor(implementation) {
        Interface.checkImplements(implementation, MinMax.MinMaxInterface);
        this.implementation = implementation;

        // this.dataTest = [10, 11, 9, 12, 14, 15, 13, 14, 5, 2, 4, 1, 3, 22, 20, 21]
        // this.indexDataTest = 0;

        this.nbNodeEvaluate = 0;
        this.nbPrunning = 0;

        this.pruningActive = true;
    }

    execute(state, depth) {
        this.depthMax = depth;

        let result = this.minMax(state, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true);
        console.log('Nb node explore : ' + this.nbNodeEvaluate);
        console.log('Nb pruning : ' + this.nbPrunning);
        console.log('Final evaluation : ' + result.evaluation);
        console.log(result.state);
        return result;
    }

    minMax(state, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || this.implementation.isGameOver(state)) {
            // console.log("------------" + depth + "-------------");
            // console.log(this.evaluate(state));
            // console.log(state);
            // console.log("-------------------------");
            this.nbNodeEvaluate++;
            return this.implementation.evaluateState(state);
        }

        if (maximizingPlayer) {
            let maxEval = Number.NEGATIVE_INFINITY;
            let bestChild = null;

            const children = this.implementation.generateChildren(state, true);
            for (const childState of children) {
                const evalChild = this.minMax(childState, depth - 1, alpha, beta, false);
                if (evalChild >= maxEval) {
                    maxEval = evalChild;
                    bestChild = childState;
                }
                alpha = Math.max(alpha, evalChild);
                if (evalChild > beta && this.pruningActive) { // beta < alpha
                    this.pruningAction(depth);
                    break; // Élagage alpha
                }
            }
            if (depth == this.depthMax) return { evaluation: maxEval, state: bestChild };
            return maxEval;
        } else {
            let minEval = Number.POSITIVE_INFINITY;
            let bestChild = null;

            const children = this.implementation.generateChildren(state, false);
            for (const childState of children) {
                const evalChild = this.minMax(childState, depth - 1, alpha, beta, true);
                if (evalChild <= minEval) {
                    minEval = evalChild;
                    bestChild = childState;
                }
                beta = Math.min(beta, evalChild);
                if (evalChild < alpha && this.pruningActive) { // beta < alpha
                    this.pruningAction(depth);
                    break; // Élagage beta
                }
            }
            if (depth == this.depthMax) return { evaluation: minEval, state: bestChild };
            return minEval;
        }
    }

    pruningAction(depth) {
        // this.indexDataTest += 2 ** depth - 1;
        this.nbPrunning++;
    }
}


/**
 * [TODO]
 * 
 * Ajouter une table d'etat pour sauvegarder les etats existents pour enlever les redondances
 */