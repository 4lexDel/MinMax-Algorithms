class MorpionImplementation {
    constructor() {}
        /**
         * Exemple state :
         * 
         *  [0, 0, 2]
         *  [0, 1, 1]
         *  [1, 0, 2]
         * 
         *  0   =>  Void
         *  1   =>  Player 1
         *  2   =>  Player 2
         * 
         */

    // Fonction d'évaluation de l'état
    evaluateState(state) {
        // horizontal / vertical
        for (let i = 0; i < 3; i++) {
            if (state[0][i] == state[1][i] && state[0][i] == state[2][i] && state[0][i] != 0) {
                if (state[0][i] == 1) {
                    return 1
                } else if (state[0][i] == 2) {
                    return -1;
                }
            }

            if (state[i][0] == state[i][1] && state[i][0] == state[i][2] && state[i][0] != 0) {
                if (state[i][0] == 1) {
                    return 1
                } else if (state[i][0] == 2) {
                    return -1;
                }
            }
        }

        if (state[0][0] == state[1][1] && state[0][0] == state[2][2] && state[1][1] != 0) {
            if (state[1][1] == 1) {
                return 1
            } else if (state[1][1] == 2) {
                return -1;
            }
        }

        if (state[0][2] == state[1][1] && state[0][2] == state[2][0] && state[1][1] != 0) {
            if (state[1][1] == 1) {
                return 1
            } else if (state[1][1] == 2) {
                return -1;
            }
        }

        return 0;
    }

    // Fonction pour générer les états enfants à partir d'un état donné
    generateChildren(state, maximizingPlayer) {
        function copy2DArray(array2D) {
            return array2D.map((array) => [...array]);
        }

        let children = [];

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 0) {
                    let childState = copy2DArray(state);

                    childState[x][y] = maximizingPlayer ? 1 : 2;

                    children.push(childState);
                }
            }
        }

        return children;
    }

    isGameOver(state) {
        if (this.evaluateState(state) != 0) return true;

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}