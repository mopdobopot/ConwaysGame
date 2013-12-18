/**
 * @Author Lomovtsev Pavel
 * Date: 13.12.13
 * Time: 17:21
 */
function Canvas(cellAmountX, cellAmountY, cellSize) {

    this.$canvas = $('#canvas');

    var canvas = this.$canvas[0],
        context = canvas.getContext('2d');

    canvas.width = cellAmountX * cellSize;
    canvas.height = cellAmountY * cellSize;
    context.strokeStyle = "#c0c0c0";

    this.drawMap = function(map) {
        for (var i = 0; i < cellAmountX; i++) {
            for (var j = 0; j < cellAmountY; j++) {
                if (map[i][j] == 1) {
                    this.drawAlive(i, j);
                }
                else {
                    this.drawDead(i, j);
                }
            }
        }
    };

    this.drawDiff = function(diff) {
        var _thisref = this;
        diff.born.forEach(function(cell) {
            _thisref.drawAlive(cell.x, cell.y);
        });
        diff.died.forEach(function(cell) {
            _thisref.drawDead(cell.x, cell.y);
        });
    };

    this.drawAlive = function(i, j) {
        fillRect(i, j, "#999");
    };

    this.drawDead = function(i, j) {
        fillRect(i, j, "#fff");
    };

    function fillRect(i, j, color) {
        var x = i * cellSize + 0.5,
            y = j * cellSize + 0.5;
        context.fillStyle = color;
        context.fillRect(x, y, cellSize, cellSize);
        context.strokeRect(x, y, cellSize, cellSize);
    }
}