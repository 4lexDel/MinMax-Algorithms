class BobailAI {
    constructor(depth) { //      JOUEUR 2 MINIMISE // JOUEUR 1 MAXIMISE
        this.depth = depth;

        this.finalLevelCheck = 0;

        this.pruningActive = false;

        this.nbAVGChildrenTest = 2;

        this.nbCombination = 0;
        this.nbPrunning = 0;
    }

    copy2DArray(array2D) {
        return array2D.map((array) => [...array]);
    }

    getNextState(currentState, playerID) { //Point d'entré
        console.log("AI");

        // this.evaluateState(currentState);
        // console.log(currentState);

        // this.getChildrenState(currentState); //TEST : (normalement call par MinMax)

        let result = this.minValue(0, this.copy2DArray(currentState), undefined, undefined);

        console.log("DEPTH : " + this.depth);
        console.log("VAL : " + result.eva);
        console.log("NB NODE CHECK : " + this.nbCombination);
        console.log("NB PRUNNING : " + this.nbPrunning);

        console.log("grid final : ");
        console.log(result.state);

        return result.state;
    }

    getRandomNumber(min, max) {
        return min + Math.random() * (max - min);
    }

    maxValue(level, state, alpha, beta) { //methode récursive : base de l'algo MinMax
        let eva = this.evaluateState(state, 2); //evaluate a postion of a player 2

        if (Math.abs(eva) > 9000) return eva; //FIN DE LA BRANCHE

        if (level == this.depth) {
            return eva;
        }

        let v = undefined;
        let bestMove = undefined;

        let childrenState = this.getChildrenState(state, 1); //play as player 1

        if (childrenState.length == 0) {
            console.log("undefined from max (" + level + ")");
            console.log(state);
        }

        for (const key in childrenState) {
            const childState = childrenState[key];
            // console.log("p1 move prediction");
            // console.log(childState);

            let vChild = this.minValue(level + 1, childState, alpha, beta);

            if (vChild != undefined) {
                if (v == undefined || vChild >= v) {
                    v = vChild;
                    bestMove = childState;
                }
                if (beta != undefined && vChild >= beta && this.pruningActive) {
                    // console.log("current beta : " + beta | +"v : " + vChild);
                    this.nbPrunning++;
                    break;
                }
                if (alpha == undefined || vChild > alpha) alpha = vChild;
            }
        }
        if (level == 0) return { eva: v, state: bestMove };
        return v;
    }

    minValue(level, state, alpha, beta) {
        let eva = this.evaluateState(state, 1); //evaluate a postion of a player 1

        if (Math.abs(eva) > 9000) return eva; //FIN DE LA BRANCHE

        if (level == this.depth) {
            //let eva = this.evaluateState(state, 1); //evaluate a postion of a player 1
            return eva;
        }

        let v = undefined;
        let bestMove = undefined;

        let childrenState = this.getChildrenState(state, 2); //play as player 2

        if (childrenState.length == 0) {
            console.log("undefined from min (" + level + ")");
            console.log(state);
            console.log(eva);
            console.log("--");
            console.log(this.evaluateState(state, 1));
        }

        for (const key in childrenState) {
            const childState = childrenState[key];
            let vChild = this.maxValue(level + 1, childState, alpha, beta);

            if (vChild != undefined) {
                if (v == undefined || vChild <= v) {
                    v = vChild;
                    bestMove = childState;
                }
                if (alpha != undefined && vChild <= alpha && this.pruningActive) {
                    // console.log("current alpha : " + alpha + " | v : " + vChild);
                    this.nbPrunning++;
                    break;
                }
                if (beta == undefined || vChild < beta) beta = vChild;
            } else {
                console.log("undefined from min (" + level + ")");
                console.log(state);
            }
        }
        if (level == 0) return { eva: v, state: bestMove };
        return v;
    }

    getChildrenState(state, playerID) { //get all the children state of a state
        //              prendre en compte le premier coup (sans bobail) #TODO
        //              prendre en compte les victoires !!
        let childrenState = [];

        let bobailStateMove = this.getBobailNextMoves(state); //Tous les mouvements possible de bobail
        // console.log("Bobail move : ");
        // console.log(bobailStateMove);
        // console.log("------------------");

        bobailStateMove.forEach(bobailMove => {
            let newPieceNextMoves = this.getPieceNextMoves(bobailMove, playerID);
            //ADD TO GLOBAL ARRAY ----------------------------------------------------------
            childrenState = childrenState.concat(newPieceNextMoves);
        });

        // console.log(childrenState);
        this.nbCombination += childrenState.length;

        return childrenState;
    }

    getBobailNextMoves(state) {
        let newBobailStates = []; //3D array !

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 3) { //Find the bobail
                    let newState1 = this.moveBobail(x, y, x + 1, y, this.copy2DArray(state));
                    if (newState1) newBobailStates.push(newState1);

                    let newState2 = this.moveBobail(x, y, x - 1, y, this.copy2DArray(state));
                    if (newState2) newBobailStates.push(newState2);

                    let newState3 = this.moveBobail(x, y, x, y + 1, this.copy2DArray(state));
                    if (newState3) newBobailStates.push(newState3);

                    let newState5 = this.moveBobail(x, y, x + 1, y + 1, this.copy2DArray(state)); //8 positions possible du bobail
                    if (newState5) newBobailStates.push(newState5);

                    let newState7 = this.moveBobail(x, y, x - 1, y + 1, this.copy2DArray(state));
                    if (newState7) newBobailStates.push(newState7);

                    let newState4 = this.moveBobail(x, y, x, y - 1, this.copy2DArray(state)); //On copie // on test et si vrai alors on ajoute la modiff !
                    if (newState4) newBobailStates.push(newState4);

                    let newState6 = this.moveBobail(x, y, x + 1, y - 1, this.copy2DArray(state));
                    if (newState6) newBobailStates.push(newState6);

                    let newState8 = this.moveBobail(x, y, x - 1, y - 1, this.copy2DArray(state));
                    if (newState8) newBobailStates.push(newState8);

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
        let newPieceStates = []; //3D array !

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == playerID) { //Trouve les pieces à jouer
                    // console.log(`x1:${x} y1:${y} x2:${coordsPieceMove.x} y2:${coordsPieceMove.y}`);
                    let coord1 = this.getPieceDestinationByDirection(x, y, 1, 0, state); //destination potentiel
                    if (coord1) newPieceStates.push(this.movePiece(x, y, coord1.x, coord1.y, this.copy2DArray(state)));

                    let coord2 = this.getPieceDestinationByDirection(x, y, 1, 1, state);
                    if (coord2) newPieceStates.push(this.movePiece(x, y, coord2.x, coord2.y, this.copy2DArray(state)));

                    let coord3 = this.getPieceDestinationByDirection(x, y, 1, -1, state);
                    if (coord3) newPieceStates.push(this.movePiece(x, y, coord3.x, coord3.y, this.copy2DArray(state)));

                    let coord4 = this.getPieceDestinationByDirection(x, y, -1, 0, state); //destination potentiel
                    if (coord4) newPieceStates.push(this.movePiece(x, y, coord4.x, coord4.y, this.copy2DArray(state)));

                    let coord5 = this.getPieceDestinationByDirection(x, y, -1, 1, state);
                    if (coord5) newPieceStates.push(this.movePiece(x, y, coord5.x, coord5.y, this.copy2DArray(state)));

                    let coord6 = this.getPieceDestinationByDirection(x, y, -1, -1, state);
                    if (coord6) newPieceStates.push(this.movePiece(x, y, coord6.x, coord6.y, this.copy2DArray(state)));

                    let coord7 = this.getPieceDestinationByDirection(x, y, 0, 1, state);
                    if (coord7) newPieceStates.push(this.movePiece(x, y, coord7.x, coord7.y, this.copy2DArray(state)));

                    let coord8 = this.getPieceDestinationByDirection(x, y, 0, -1, state);
                    if (coord8) newPieceStates.push(this.movePiece(x, y, coord8.x, coord8.y, this.copy2DArray(state)));
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

    evaluateStateTest(state) {
        //about the bobail position

        return parseInt(this.getRandomNumber(-10, 10));
    }

    evaluateState(state, playerID) {
        //Avancée du bobail                         ==> milieu : 0 ; coté-1 : +-2 ; win +-9999
        //Nombre de liberté du joueur ou de l'ordi  ==> +-0,1/liberté
        //Piece devant ou derriere le bobail        ==> +-0.2
        let evaluation = 0;

        evaluation += this.evaluateBobail(state, playerID);
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

    evaluateBobail(state, playerID) {
        let evaluationBobail = 0;

        for (let x = 0; x < state.length; x++) {
            for (let y = 0; y < state[0].length; y++) {
                if (state[x][y] == 3) { //Find the bobail
                    evaluationBobail += this.evaluateBobailNeighbours(x, y, state);
                    evaluationBobail += this.evaluateBobailPosition(y);
                    evaluationBobail += this.evaluateBobailStuck(x, y, state, playerID);
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

    evaluateBobailStuck(x, y, state, playerID) {
        if (this.getGridValue(x + 1, y - 1, state) != 0 &&
            this.getGridValue(x + 1, y, state) != 0 &&
            this.getGridValue(x + 1, y + 1, state) != 0 &&
            this.getGridValue(x - 1, y - 1, state) != 0 &&
            this.getGridValue(x - 1, y, state) != 0 &&
            this.getGridValue(x - 1, y + 1, state) != 0 &&
            this.getGridValue(x, y + 1, state) != 0 &&
            this.getGridValue(x, y - 1, state) != 0) {
            if (playerID == 1) return 9999;
            else return -9999;
        }
        return 0;
    }
}

//TODO

/**Condition de victoire à détecter :
 * Adversaire bloquer ?????
 * Bobail dans le camps
 */