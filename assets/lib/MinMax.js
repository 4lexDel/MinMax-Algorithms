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

        this.nbNodeEvaluate = 0;
        this.nbPrunning = 0;
        this.pruningActive = true;

        // Table de transposition (un objet Map en JavaScript)
        this.transpositionTable = new Map();
    }

    execute(state, depth) {
        this.depthMax = depth;

        let result = this.minMax(state, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
        console.log('Nb node explore : ' + this.nbNodeEvaluate);
        console.log('Nb pruning : ' + this.nbPrunning);
        console.log('Final evaluation : ' + result.evaluation);
        console.log(result.state);
        return result;
    }

    minMax(state, depth, alpha, beta, maximizingPlayer) {
        // Recherche dans la table de transposition
        // const transpositionEntry = this.transpositionTable.get(state);
        // if (transpositionEntry && transpositionEntry.depth >= depth) {
        //     if (transpositionEntry.type === "exact") {
        //         return transpositionEntry.evaluation;
        //     }
        //     if (transpositionEntry.type === "lowerbound") {
        //         alpha = Math.max(alpha, transpositionEntry.evaluation);
        //     }
        //     if (transpositionEntry.type === "upperbound") {
        //         beta = Math.min(beta, transpositionEntry.evaluation);
        //     }
        //     if (alpha >= beta) {
        //         return transpositionEntry.evaluation;
        //     }
        // }

        if (depth === 0 || this.implementation.isGameOver(state)) {
            this.nbNodeEvaluate++;
            const evaluation = this.implementation.evaluateState(state);
            // Enregistrement de l'évaluation dans la table de transposition
            // this.transpositionTable.set(state, { evaluation, type: "exact", depth });
            return evaluation;
        }

        if (maximizingPlayer) {
            let maxEval = Number.NEGATIVE_INFINITY;
            let bestChild = null;

            const children = this.implementation.generateChildren(state, true);
            for (const childState of children) {
                const evalChild = this.minMax(childState, depth - 1, alpha, beta, false);
                if (evalChild > maxEval) {
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

            // Enregistrement de l'évaluation dans la table de transposition
            // this.transpositionTable.set(state, { evaluation: maxEval, type: "lowerbound", depth });
            return maxEval;
        } else {
            let minEval = Number.POSITIVE_INFINITY;
            let bestChild = null;

            const children = this.implementation.generateChildren(state, false);
            for (const childState of children) {
                const evalChild = this.minMax(childState, depth - 1, alpha, beta, true);
                if (evalChild < minEval) {
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

            // Enregistrement de l'évaluation dans la table de transposition
            // this.transpositionTable.set(state, { evaluation: minEval, type: "upperbound", depth });
            return minEval;
        }
    }

    pruningAction(depth) {
        this.nbPrunning++;
    }
}



/**
 * [TODO]
 * 
 * Ajouter une table d'etat pour sauvegarder les etats existents pour enlever les redondances
 */