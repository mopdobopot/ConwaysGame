/**
 * @Author Lomovtsev Pavel
 * Date: 13.12.13
 * Time: 14:53
 */
function Model(w, h) {

    function equalCells(c1, c2) {
        return c1.x == c2.x && c1.y == c2.y;
    }

    this.map = new Array(w);
    for (var i = 0; i < w; i++) {
        this.map[i] = new Array(h);
    }
    this.alive = [];

    this.makeAlive = function(x, y) {
        var start = new Date();
        if (this.map[x][y] == 1) {
            throw new Error("Cell (" + x + ", " + y + ") already alive");
        }
        this.map[x][y] = 1;
        this.alive.push({x: x, y: y});
        var end = new Date();
        console.log("Model.makeAlive: " + (end - start));
    };

    this.makeDead = function(x, y) {
        var start = new Date();
        if (this.map[x][y] == undefined) {
            throw new Error("Cell (" + x + ", " + y + ") already dead");
        }
        this.map[x][y] = undefined;
        var newAlive = [];
        for (var i = 0; i < this.alive.length; i++) {
            if (this.alive[i].x != x ||
                this.alive[i].y != y) {
                newAlive.push(this.alive[i]);
            }
        }
        this.alive = newAlive;
        var end = new Date();
        console.log("Model.makeDead: " + (end - start));
    };

    this.update = function(diff) {
        var start = new Date();
        var _thisref = this;
        diff.born.forEach(function(cell) {
            _thisref.alive.push(cell);
            _thisref.map[cell.x][cell.y] = 1;
        });
        diff.died.forEach(function(diedCell) {
            _thisref.map[diedCell.x][diedCell.y] = undefined;
        });
        var newAlive = [];
        this.alive.forEach(function(aliveCell) {
            var nowDead = false;
            diff.died.forEach(function(diedCell) {
                if (nowDead) return;
                if (equalCells(aliveCell, diedCell)) {
                    nowDead = true;
                }
            });
            if (!nowDead) {
                newAlive.push(aliveCell);
            }
        });
        this.alive = newAlive;
        var end = new Date();
        console.log("Model.update: " + (end - start));
    }
}