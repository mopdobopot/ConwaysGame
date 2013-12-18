/**
 * Created by NCS-USER on 10.12.13.
 */
$(document).ready(function() {

    // Запрещаем вызов контекстного меню
    $(document).bind("contextmenu", function(e) {
        return false;
    });

    /* Интерфейс */
    var $window = $(window),
        $canvas = $('#canvas'),
        canvas = $canvas[0],
        context = canvas.getContext('2d'),
        cellSize = 15,
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
                        addAlive(i, j);
                        drawAlive(i, j);
                    }
                    if (map[i][j] == 1 && !mouseIsCreatingCells) {
                        removeAlive(i, j);
                        drawDead(i, j);
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

        drawAlive = function(i, j) {
            fillRect(i, j, "#999");
        },

        drawDead = function(i, j) {
            fillRect(i, j, "#fff");
        },

        fillRect = function(i, j, color) {
            context.fillStyle = color;
            context.fillRect(i * cellSize + 0.5, j * cellSize + 0.5, cellSize, cellSize);
            context.strokeRect(i * cellSize + 0.5, j * cellSize + 0.5, cellSize, cellSize);
        },

        addAlive = function(x, y) {
            map[x][y] = 1;
            oldAlive.push({x: x, y: y});
        },

        removeAlive = function(x, y) {
            map[x][y] = undefined;
            for (var i = 0; i < oldAlive.length; i++) {
                if (oldAlive[i] != undefined && oldAlive[i].x == x && oldAlive[i].y == y) {
                    oldAlive[i] = undefined;
                }
            }
        },

        initEnterHandler = function() {
            $(document).keypress(function(e) {
                if (e.which == 13) {
                    redraw();
                }
            });
        },

    /* Вычисления */
        map = [],
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

        initMap = function() {
            map = [];
            for (var i = 0; i < cellAmountX; i++) {
                map[i] = new Array(cellAmountY);
            }
        },

        initNeighborhood = function() {
            neighborhood = [];
            for (var i = 0; i < cellAmountX; i++) {
                neighborhood[i] = new Array(cellAmountY);
            }
        },

        redraw = function() {
            calcWhoIsAlive();
            updateStructures();
            drawMap();
        },

        calcWhoIsAlive = function() {
            var start = new Date();
            var neighborAmount,
                x, y;
            initNeighborhood();
            oldAlive.forEach(function(cell) {
                if (cell != undefined) {
                    neighborAmount = 0;
                    windRose.forEach(function(offset) {
                        x = cell.x + offset.x;
                        y = cell.y + offset.y;
                        if (map[x][y] == 1) {
                            neighborAmount++;
                        }
                        else {
                            incNeighborhood(x, y);
                            if (neighborhood[x][y] == 3) {
                                newAlive.push({x: x, y: y});
                            }
                        }
                    });
                    if (neighborAmount > 1 && neighborAmount < 4) {
                        newAlive.push({x: cell.x, y: cell.y});
                    }
                }
            });
            var end = new Date();
            console.log('calcWhoIsAlive: ' + (end - start));
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
            var start = new Date();
            updateMap();
            updateAliveArrays();
            var end = new Date();
            console.log('updateStructures: ' + (end - start));
        },

        updateMap = function() {
            initMap();
            newAlive.forEach(function(cell) {
                map[cell.x][cell.y] = 1;
            });
        },

        updateAliveArrays = function() {
            oldAlive = newAlive;
            newAlive = [];
        },

        drawMap = function() {
            var start = new Date();
            for (var i = 0; i < cellAmountX; i++) {
                for (var j = 0; j < cellAmountY; j++) {
                    if (map[i][j] == 1) {
                        drawAlive(i, j);
                    }
                    else {
                        drawDead(i, j);
                    }
                }
            }
            var end = new Date();
            console.log('drawMap: ' + (end - start));
        };

    /* Тело программы */
    initCanvas();
    initMouseHandler();
    initEnterHandler();
    redraw();
});
