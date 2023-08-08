class BobailImplementation {
    constructor() {}

    copy2DArray(array2D) {
        return array2D.map((array) => [...array]);
    }

    generateChildren(state, maximizingPlayer) { //get all the children state of a state
        //              prendre en compte le premier coup (sans bobail) #TODO
        //              prendre en compte les victoires !!
        let playerID = maximizingPlayer ? 1 : 2;

        let childrenState = [];

        let bobailStateMove = this.getBobailNextMoves(state); //Tous les mouvements possible de bobail

        bobailStateMove.forEach(bobailMove => {
            let newPieceNextMoves = this.getPieceNextMoves(bobailMove, playerID);
            //ADD TO GLOBAL ARRAY ----------------------------------------------------------
            childrenState = childrenState.concat(newPieceNextMoves);
        });

        childrenState.sort((childA, childB) => {
            if (maximizingPlayer) return this.evaluateState(childB, true) - this.evaluateState(childA, true);

            return this.evaluateState(childA, true) - this.evaluateState(childB, true);
        });

        return childrenState;
    }

    getBobailNextMoves(state) {
        let newBobailStates = []; //3D array !

        const possibleMoves = [
            [1, 0], // Right
            [-1, 0], // Left
            [0, 1], // Down
            [1, 1], // Diagonal down-right
            [-1, 1], // Diagonal down-left
            [0, -1], // Up
            [1, -1], // Diagonal up-right
            [-1, -1] // Diagonal up-left
        ];

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 3) { //Find the bobail
                    for (const [dx, dy] of possibleMoves) {
                        const newState = this.moveBobail(x, y, x + dx, y + dy, this.copy2DArray(state));
                        if (newState) newBobailStates.push(newState);
                    }

                    return newBobailStates;
                }
            }

        }
    }

    moveBobail(x1, y1, x2, y2, grid) { //Move piece (simpler than bobail move function)
        if (!this.isCorrectDestinationBobail(x1, y1, x2, y2, grid)) return false;

        let origin = this.getGridValue(x1, y1, grid);

        grid[x1][y1] = 0; //void
        grid[x2][y2] = origin;

        return grid;
    }

    isCorrectDestinationBobail(x1, y1, x2, y2, grid) { //Check if the bobail movement is legal !
        if (this.getGridValue(x2, y2, grid) != 0) return false; //Cas simple

        let deltaX = Math.abs(x1 - x2);
        let deltaY = Math.abs(y1 - y2);

        if ((deltaX == 1 || deltaY == 1) && (deltaX <= 1 && deltaY <= 1)) return true;

        return false;
    }

    getPieceNextMoves(state, playerID) {
        const newPieceStates = []; // 3D array !

        const directions = [
            [1, 0], // Right
            [1, 1], // Diagonal down-right
            [1, -1], // Diagonal down-left
            [-1, 0], // Left
            [-1, 1], // Diagonal up-right
            [-1, -1], // Diagonal up-left
            [0, 1], // Down
            [0, -1] // Up
        ];

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] === playerID) {
                    for (const [dx, dy] of directions) {
                        const coord = this.getPieceDestinationByDirection(x, y, dx, dy, state);
                        if (coord) {
                            newPieceStates.push(this.movePiece(x, y, coord.x, coord.y, this.copy2DArray(state)));
                        }
                    }
                }
            }
        }

        return newPieceStates;
    }

    getPieceDestinationByDirection(x0, y0, dx, dy, grid) { //return (x destination ; y destination) or false
        if ((Math.abs(dx) == 1 && Math.abs(dy) == 1) || ((Math.abs(dx) == 1 && dy == 0) || (dx == 0 && Math.abs(dy) == 1))) { //Diago ou droit
            // console.log("Correct piece ? => x1 : " + x1 + " | y1 : " + y1 + " | x2 : " + x2 + " | y2 : " + y2);
            if (this.getGridValue(x0 + dx, y0 + dy, grid) != 0) return false; //Si obstacle est juste devant !!

            let cx = x0;
            let cy = y0;

            for (let i = 1; i <= 5; i++) {
                cx += dx;
                cy += dy;

                if (this.getGridValue(cx, cy, grid) != 0) { //Dés qu'on rencontre un obstacle on renvoie les coords d'avant
                    return { x: cx - dx, y: cy - dy };
                }
            }
        }

        return false;
    }

    movePiece(x1, y1, x2, y2, grid) { //Protection ???
        let origin = this.getGridValue(x1, y1, grid);

        grid[x1][y1] = 0; //void
        grid[x2][y2] = origin;

        return grid;
    }

    getGridValue(x, y, grid) {
        if (x < 0 || y < 0 || x >= grid.length || y > grid[0].length) return -1;
        return grid[x][y];
    }

    evaluateState(state, maximizingPlayer) {
        //Avancée du bobail                         ==> milieu : 0 ; coté-1 : +-2 ; win +-9999
        //Nombre de liberté du joueur ou de l'ordi  ==> +-0,1/liberté
        //Piece devant ou derriere le bobail        ==> +-0.2
        let evaluation = 0;

        evaluation += this.evaluateBobail(state, maximizingPlayer);
        evaluation += this.evaluatePiece(state) / 4;

        // console.log(evaluation);

        return evaluation;
    }

    evaluatePiece(state) {
        return this.evaluatePiecePosition(state);
    }

    evaluatePiecePosition(state) {
        let evaluationPiece = 0;

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 1 || state[x][y] == 2) {
                    switch (y) {
                        case 0:
                            evaluationPiece += 0.2;
                            break;
                        case 1:
                            evaluationPiece += 0.1;
                            break;
                        case 2:
                            evaluationPiece += 0;
                            break;
                        case 3:
                            evaluationPiece += -0.1;
                            break;
                        case 4:
                            evaluationPiece += -0.2;
                            break;
                    }
                }
            }
        }

        return evaluationPiece;
    }

    evaluateBobail(state, maximizingPlayer) {
        let evaluationBobail = 0;

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 3) { //Find the bobail
                    evaluationBobail += this.evaluateBobailNeighbours(x, y, state);
                    evaluationBobail += this.evaluateBobailPosition(y);
                    evaluationBobail += this.evaluateBobailStuck(x, y, state, maximizingPlayer);
                    break;
                }
            }
        }
        //console.log(evaluationBobail);

        return evaluationBobail;
    }

    evaluateBobailNeighbours(x, y, state) {
        let evaluationNeighbours = 0;

        if (this.getGridValue(x - 1, y + 1, state) != 0) evaluationNeighbours -= 0.5;
        if (this.getGridValue(x, y + 1, state) != 0) evaluationNeighbours -= 0.5;
        if (this.getGridValue(x + 1, y + 1, state) != 0) evaluationNeighbours -= 0.5;

        if (this.getGridValue(x - 1, y - 1, state) != 0) evaluationNeighbours += 0.5;
        if (this.getGridValue(x, y - 1, state) != 0) evaluationNeighbours += 0.5;
        if (this.getGridValue(x + 1, y - 1, state) != 0) evaluationNeighbours += 0.5;

        return Math.round(evaluationNeighbours * 10) / 10;
    }

    evaluateBobailPosition(y) {
        switch (y) {
            case 0:
                return -99999;
            case 1:
                return -8;
            case 2:
                return 0;
            case 3:
                return 8;
            case 4:
                return 99999;
        }
        return 0;
    }

    evaluateBobailStuck(x, y, state, maximizingPlayer) {
        const offsets = [
            [1, -1],
            [1, 0],
            [1, 1],
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, 1],
            [0, -1]
        ];

        let allNonZero = true;
        for (const [dx, dy] of offsets) {
            if (this.getGridValue(x + dx, y + dy, state) === 0) {
                allNonZero = false;
                break;
            }
        }

        if (allNonZero) {
            return maximizingPlayer ? -9999 : 9999;
        }

        return 0;
    }

    isGameOver(state) {
        let eva = this.evaluateState(state, true); //evaluate a postion of a player

        if (Math.abs(eva) > 9000) return true;
        return false;
    }
}