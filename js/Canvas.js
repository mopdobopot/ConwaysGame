/**
 * @Author Lomovtsev Pavel
 * Date: 13.12.13
 * Time: 17:21
 */
function Canvas(cellAmountX, cellAmountY, cellSize) {

    this.$canvas = $('#canvas');

    var canvas = this.$canvas[0],
        context = canvas.getContext('2d'),
        ageColorStep = Config.ageColorStep;

    canvas.width = cellAmountX * cellSize;
    canvas.height = cellAmountY * cellSize;
    context.strokeStyle = "#c0c0c0";

    function getColor(age) {
        if (age == undefined || age < ageColorStep) {
            return "#9c0";
        }
        else if (age < 2 * ageColorStep) {
            return "#990";
        }
        else if (age < 3 * ageColorStep) {
            return "#660";
        }
        else {
            return "#330";
        }
    }

    this.drawMap = function(map) {
        var start = new Date();
        for (var i = 0; i < cellAmountX; i++) {
            for (var j = 0; j < cellAmountY; j++) {
                if (map[i][j] == 1) {
                    this.drawAlive({x: i, y: j});
                }
                else {
                    this.drawDead({x: i, y: j});
                }
            }
        }
        var end = new Date();
        console.log("Canvas.drawMap: " + (end - start));
    };

    this.drawDiff = function(diff) {
        var start = new Date();
        var _thisref = this;
        diff.born.forEach(function(cell) {
            _thisref.drawAlive(cell);
        });
        diff.died.forEach(function(cell) {
            _thisref.drawDead(cell);
        });
        var end = new Date();
        console.log("Canvas.drawDiff: " + (end - start));
    };

    this.drawAllAlive = function(alive) {
        var start = new Date();
        var _thisref = this;
        alive.forEach(function(cell) {
            _thisref.drawAlive(cell);
        });
        var end = new Date();
        console.log("Canvas.drawAllAlive: " + (end - start));
    };

    this.drawAlive = function(cell) {
        fillRect(cell.x, cell.y, getColor(cell.age));
    };

    this.drawDead = function(cell) {
        fillRect(cell.x, cell.y, "#fff");
    };

    function fillRect(i, j, color) {
        var x = i * cellSize + 0.5,
            y = j * cellSize + 0.5;
        context.fillStyle = color;
        context.fillRect(x, y, cellSize, cellSize);
        context.strokeRect(x, y, cellSize, cellSize);
    }
}