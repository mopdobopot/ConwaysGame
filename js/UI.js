/**
 * @Author Lomovtsev Pavel
 * Date: 13.12.13
 * Time: 14:32
 */

/* Запрещаем вызов контекстного меню правой кнопкой мыши.
   Будем использовать её для удаления клеток.*/
$(document).bind('contextmenu', function(e) {
    return false;
});

$(document).ready(function() {

    var $window = $(window),
        cellSize = Config.cellSize,
        cellAmountX = $window.width() / cellSize | 0,
        cellAmountY = $window.height() / cellSize | 0,
        canvas = new Canvas(cellAmountX, cellAmountY, cellSize),
        model = new Model(cellAmountX, cellAmountY),
        algo = new Algo(),
        mouseIsDown = false,
        mouseCellX,
        mouseCellY,
        i, j;

    function initMouseHandler() {
        canvas.$canvas.mousedown(function(e) {
            mouseIsDown = true;
            clickHandler(e);
        });
        canvas.$canvas.mouseup(function(e) {
            mouseIsDown = false;
        });
        canvas.$canvas.mousemove(function(e) {
            updIndexes(e);
            if (i != mouseCellX || j != mouseCellY) {
                mouseCellX = i;
                mouseCellY = j;
                if (mouseIsDown) {
                    clickHandler(e);
                }
            }
        });
    }

    function clickHandler(e) {
        updIndexes(e);
        // Левой кнопкой создаём
        if (model.map[i][j] == undefined && e.which == 1) {
            model.makeAlive(i, j);
            canvas.drawAlive({x: i, y: j});
        }
        // Правой кнопкой удаляем
        if (model.map[i][j] == 1 && e.which == 3) {
            model.makeDead(i, j);
            canvas.drawDead({x: i, y: j});
        }
    }

    function updIndexes(e) {
        i = e.offsetX / cellSize | 0;
        j = e.offsetY / cellSize | 0;
    }

    function initEnterHandler() {
        $(document).keypress(function(e) {
            if (e.which == 13) {
                var diff = algo.calcDiff(model.map, model.alive);
                model.update(diff);
                canvas.drawDiff(diff);
                canvas.drawAllAlive(model.alive);
            }
        });
    }

    canvas.drawMap(model.map);
    initMouseHandler();
    initEnterHandler();

});