class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    init() {
        this.resize();

        /*---------Game settings----------*/
        this.game = new Bobail();

        this.playerToPlay = 1;

        this.ai = new BobailAI(3);

        let gridTest = [
            [1, 3, 2, 0, 0],
            [1, 2, 2, 0, 2],
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 2],
            [0, 0, 0, 0, 1]
        ]

        console.log("EVA TEST : " + this.ai.evaluateState(gridTest, 2));

        /*--------------------------------*/

        this.initMap();

        this.initEvent();

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/

        this.playerToPlay = true;

        this.x1 = -1;
        this.y1 = -1;
        this.x2 = -1;
        this.y2 = -1;

        this.actionTime = 1;
    }

    initMap() {
        this.mapAction = new Tilemap(5, 5, this.canvas.width, this.canvas.height);
        let noAction = new TileSet(0, TileSet.FILL_RECT, 0);
        let source = new TileSet(1, "green", TileSet.FILL_RECT, 0.2);
        let destination = new TileSet(2, "red", TileSet.FILL_RECT, 0.2);

        this.mapAction.addTileSet(noAction);
        this.mapAction.addTileSet(source);
        this.mapAction.addTileSet(destination);


        this.mapPlayer = new Tilemap(5, 5, this.canvas.width, this.canvas.height);

        let voidTile = new TileSet(0, "rgb(240,240,240)");
        let firstPlayer = new TileSet(1, "red", TileSet.FILL_ELLIPSE);
        let secondPlayer = new TileSet(2, "orange", TileSet.FILL_ELLIPSE);
        let bobail = new TileSet(3, "blue", TileSet.FILL_ELLIPSE);

        this.mapPlayer.addTileSet(voidTile);
        this.mapPlayer.addTileSet(firstPlayer);
        this.mapPlayer.addTileSet(secondPlayer);
        this.mapPlayer.addTileSet(bobail);

        this.mapPlayer.grid = this.game.grid;
    }

    initEvent() {
        this.canvas.onmouseup = (e) => {
            this.mouseAction(e);
        }

        // this.canvas.addEventListener('touchend', (e) => {
        //     this.touchAction(e);
        // }, false);

        window.onresize = (e) => {
            this.resize();
            this.mapPlayer.resize(this.canvas.width, this.canvas.height); //DRY !!
            this.mapAction.resize(this.canvas.width, this.canvas.height); //DRY !!
        };
    }

    mouseAction(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        //let val = e.which == 1 ? 1 : 0;
        //this.map.setTileID(coord.x, coord.y, val);
        this.mapAction.resetGrid();

        if (this.playerToPlay == 1) {
            this.managePieceCoords(coord.x, coord.y);
        }
    }

    // touchAction(e) {
    //     let coord = TouchControl.getTouchPos(this.canvas, e);
    //     this.mapAction.resetGrid();
    //     this.mapAction.setTileID(coord.x, coord.y, 1);

    //     this.managePieceCoords(coord.x, coord.y);
    // }

    managePieceCoords(x, y) {
        let gridCoord = this.mapAction.getGridCoord(x, y);

        // console.log(gridCoord);

        let valSelected = this.getGridValue(gridCoord.x, gridCoord.y, this.mapPlayer.grid);

        if (this.actionTime == 1 && valSelected != 0 && valSelected != -1) {
            this.x1 = gridCoord.x;
            this.y1 = gridCoord.y;

            this.mapAction.setTileID(x, y, 1);

            this.actionTime = 2;
        } else {
            let valSelected = this.getGridValue(gridCoord.x, gridCoord.y, this.mapPlayer.grid);

            if (valSelected != 0) { //                          2ième case forcement vide !!
                this.mapAction.setTileID(x, y, 1);
                this.actionTime = 1;
            } else {
                this.x2 = gridCoord.x;
                this.y2 = gridCoord.y;

                this.mapAction.setTileID(x, y, 2);

                this.actionTime = 1;

                //MOVE------------------------------------------

                console.log("BOBAIL PLAYER : " + this.game.playerToPlay);
                let result = this.game.movePiece(this.x1, this.y1, this.x2, this.y2);
                console.log("move possible ? " + result);
                console.log("BOBAIL PLAYER : " + this.game.playerToPlay);

                if (result && this.game.playerToPlay == 2) { //Move effectué !
                    this.mapPlayer.grid = this.game.grid;
                    this.playerToPlay = 2; //si move possible alors on joue plus (nécessaire car programmation evenement)

                    let result = this.ai.getNextState(this.game.grid, 2);

                    this.game.grid = result;
                    this.game.switchPlayer();
                    this.game.playerToPlay = 1;

                    this.mapPlayer.grid = this.game.grid;

                    this.playerToPlay = 1;

                    //EFFET DE DELAI => Bobail puis piece... (style)
                }
            }
        }
    }

    getGridValue(x, y, grid) {
        if (x < 0 || x >= 5 || y < 0 || y >= 5) return -1;
        return grid[x][y];
    }

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(240,240,240)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.mapPlayer != null) this.mapPlayer.display(this.ctx);
        if (this.mapAction != null) this.mapAction.display(this.ctx);
    }

    setPlayerMap(newGrid, reverse = false) {
        this.mapPlayer.grid = newGrid;
        if (reverse) this.mapPlayer.reverseGrid();
    }
}