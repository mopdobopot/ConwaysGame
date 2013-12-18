/**
 * @Author Lomovtsev Pavel
 * Date: 13.12.13
 * Time: 14:36
 */
function Algo() {

    /* neighborhood[x][y] содержит количество живых на данный момент соседей у клетки (x, y),
       если сама клетка (x, y) мертва */
    var neighborhood = [],
        maybeBorn = [],
        born = [],
        died = [],
        neighborAmount,
        x, y,
        windRose = [
            {x: 0 , y: -1},
            {x: -1, y: -1},
            {x: -1, y: 0 },
            {x: -1, y: 1 },
            {x: 0 , y: 1 },
            {x: 1 , y: 1 },
            {x: 1 , y: 0 },
            {x: 1 , y: -1}
        ];

    function initStructures(w, h) {
        initNeighborhood(w, h);
        maybeBorn = [];
        born = [];
        died = [];
    }

    function initNeighborhood(w, h) {
        neighborhood = new Array(w);
        for (var i = 0; i < w; i++) {
            neighborhood[i] = new Array(h);
        }
    }

    function incNeighborhood(x, y) {
        if (neighborhood[x][y] == undefined) {
            neighborhood[x][y] = 1;
        }
        else {
            neighborhood[x][y]++;
        }
    }

    function applyOffset(cell, offset, map) {
        x = cell.x + offset.x;
        if (x < 0) {
            x = map.length - 1;
        }
        if (x > map.length - 1) {
            x = 0;
        }
        y = cell.y + offset.y;
        if (y < 0) {
            y = map[0].length - 1;
        }
        if (y > map[0].length - 1) {
            y = 0;
        }
    }

    this.calcDiff = function(map, alive) {
        initStructures(map.length, map[0].length);
        alive.forEach(function(cell) {
            if (cell == undefined) return;
            neighborAmount = 0;
            windRose.forEach(function(offset) {
                applyOffset(cell, offset, map);
                if (map[x][y] == 1) {
                    neighborAmount++;
                }
                else {
                    incNeighborhood(x, y);
                    if (neighborhood[x][y] == 3) {
                        maybeBorn.push({x: x, y: y});
                    }
                }
            });
            if (neighborAmount < 2 || neighborAmount > 3) {
                died.push(cell);
            }
        });
        maybeBorn.forEach(function(cell) {
            if (neighborhood[cell.x][cell.y] == 3) {
                born.push(cell);
            }
        });
        return {born: born, died: died};
    }
}