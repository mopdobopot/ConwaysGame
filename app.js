/**
 * Created by NCS-USER on 10.12.13.
 */
$(document).ready(function() {

    // Запрещаем вызов контекстного меню.
    // Это позволяет выделять клетки обеими кнопками мыши.
    $(document).bind("contextmenu", function(e) {
        return false;
    });

    /* Рисование */
    var $window = $(window),
        $canvas = $('#field'),
        canvas = $canvas[0],
        context = canvas.getContext('2d'),
        cellSize = 25,
        cellAmountX = $window.width() / cellSize | 0,
        cellAmountY = $window.height() / cellSize | 0,
        canvasHeight = cellAmountY * cellSize,
        canvasWidth = cellAmountX * cellSize,
        mouseIsDown = false,
        mouseCellX,
        mouseCellY,
        mouseIsCreatingCells = true,

        initCanvas = function() {
            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            context.strokeStyle = "#c0c0c0";
            for (var i = 0; i < cellAmountX; i++) {
                for (var j = 0; j < cellAmountY; j++) {
                    context.strokeRect(i * cellSize + 0.5, j * cellSize + 0.5, cellSize, cellSize);
                }
            }
        },

        initMap = function() {
            for (var i = 0; i < cellAmountX; i++) {
                map[i] = [cellAmountY];
            }
        },

        initMouseHandler = function() {
            var i, j,
                updCoordinates = function(e) {
                    i = e.offsetX / cellSize | 0;
                    j = e.offsetY / cellSize | 0;
                },
                clickHandler = function(e) {
                    updCoordinates(e);
                    if (map[i][j] == undefined && mouseIsCreatingCells) {
                        map[i][j] = 1;
                        fillRect(i, j, "#999");
                    }
                    if (map[i][j] == 1 && !mouseIsCreatingCells) {
                        map[i][j] = undefined;
                        fillRect(i, j, "#fff");
                    }
                };

            $canvas.mousedown(function(e) {
                mouseIsDown = true;
                updCoordinates(e);
                mouseIsCreatingCells = (map[i][j] == undefined);
                clickHandler(e);
            });
            $canvas.mouseup(function(e) {
                mouseIsDown = false;
            });
            $canvas.mousemove(function(e) {
                updCoordinates(e);
                if (i != mouseCellX || j != mouseCellY) {
                    mouseCellX = i;
                    mouseCellY = j;
                    if (mouseIsDown) {
                        clickHandler(e);
                    }
                }
            });
        },

        fillRect = function(i, j, color) {
            context.fillStyle = color;
            context.fillRect(i * cellSize + 0.5, j * cellSize + 0.5, cellSize, cellSize);
            context.strokeRect(i * cellSize + 0.5, j * cellSize + 0.5, cellSize, cellSize);
        };

    /* Вычисления */
    var map = [[]],
        neighborhood = [[]],
        oldAlive = [],
        newAlive = [],
        windRose = [
            {x: 0 , y: -1},
            {x: -1, y: -1},
            {x: -1, y: 0 },
            {x: -1, y: 1 },
            {x: 0 , y: 1 },
            {x: 1 , y: 1 },
            {x: 1 , y: 0 },
            {x: 1 , y: -1}
        ],

        redraw = function() {
            calcWhoIsAlive();
            updateStructures();

        },

        calcWhoIsAlive = function() {
            var neighborAmount,
                x, y;
            neighborhood = [[]];
            oldAlive.forEach(function(cell) {
                neighborAmount = 0;
                windRose.forEach(function(offset) {
                    x = cell.x + offset.x;
                    y = cell.y + offset.y;
                    if (map[x][y] == 1) {
                        neighborAmount++;
                    }
                    incNeighborhood(x, y);
                    if (neighborhood[x][y] == 3) {
                        newAlive.push({x: x, y: y});
                    }
                });
                if (neighborAmount > 1 && neighborAmount < 4) {
                    newAlive.push({x: cell.x, y: cell.y});
                }
            });
        },

        incNeighborhood = function(x, y) {
            if (neighborhood[x][y] == undefined) {
                neighborhood[x][y] = 0;
            }
            else {
                neighborhood[x][y]++;
            }
        },

        updateStructures = function() {
            updateMap();
            updateAliveArrays();
        },

        updateMap = function() {
            map = [[]];
            newAlive.forEach(function(cell) {
                map[cell.x][cell.y] = 1;
            });
        },

        updateAliveArrays = function() {
            oldAlive = newAlive;
            newAlive = [];
        };

    /* Тело программы */
    initCanvas();
    initMap();
    initMouseHandler();
});
