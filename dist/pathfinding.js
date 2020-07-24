// Rules Sidebar Elements
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
// Canvas Elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Map Selection Elements
const map0Btn = document.getElementById("map0img");
const map1Btn = document.getElementById("map1img");
const map2Btn = document.getElementById("map2img");
const mapBtns = [map0Btn, map1Btn, map2Btn];
// Game Mode Selection Elements
const spBtn = document.getElementById("sp-img");
const mpBtn = document.getElementById("mp-img");
// New Search Button
const newSearchBtn = document.getElementById("new-search-btn");
// Run Search Button
const runSearchBtn = document.getElementById("run-search-btn");
// Clear Search Button
const clearSearchBtn = document.getElementById("clear-search-btn");
// Tooltip Buttons
const ttStartBtn = document.getElementById("tt-start-btn");
const ttFinishBtn = document.getElementById("tt-finish-btn");
const ttBlockBtn = document.getElementById("tt-block-btn");
const ttRoadBtn = document.getElementById("tt-road-btn");
const ttForestBtn = document.getElementById("tt-forest-btn");
const error = document.getElementById("error");
// Reset Scores Button Elements
const resetSPBtn = document.getElementById("reset-sp-score-btn");
const resetMPBtn = document.getElementById("reset-mp-score-btn");
// Sprites
let s_start = new Image();
let s_finish = new Image();
let s_road = [new Image(), new Image(), new Image(), new Image()];
s_road[0].src = "img/s_road_ul.png";
s_road[1].src = "img/s_road_ur.png";
s_road[2].src = "img/s_road_dr.png";
s_road[3].src = "img/s_road_dl.png";
// let s_road2 = new Image();
// let s_road3 = new Image();
// let s_road4 = new Image();
s_start.src = "img/s_start.png";
s_finish.src = "img/s_finish.png";
let blankAdjacency = {
    U: false,
    UL: false,
    L: false,
    DL: false,
    D: false,
    DR: false,
    R: false,
    UR: false,
};
function isDynamicTile(o) {
    if (o !== null) {
        return o.hasOwnProperty("adjacent");
    }
    else {
        return false;
    }
}
function dirReverse(dir) {
    switch (dir) {
        case Dir.U:
            return Dir.D;
        case Dir.D:
            return Dir.U;
        case Dir.L:
            return Dir.R;
        case Dir.R:
            return Dir.L;
        case Dir.UL:
            return Dir.DR;
        case Dir.UR:
            return Dir.DL;
        case Dir.DL:
            return Dir.UR;
        case Dir.DR:
            return Dir.UL;
    }
}
class Block {
    constructor() {
        this.adjacent = Object.assign({}, blankAdjacency);
        this.subsprite = 0;
    }
}
class Road {
    constructor() {
        this.adjacent = Object.assign({}, blankAdjacency);
        this.difficulty = 1;
        this.subsprite = 0;
    }
}
class Forest {
    constructor() {
        this.adjacent = Object.assign({}, blankAdjacency);
        this.difficulty = 20;
        this.subsprite = 0;
    }
}
// let grid: GridObjects[][];
// grid = [];
// for (let i = 0; i < 8; i++) {
//   grid[i] = [];
//   for (let j = 0; j < 8; j++) {
//     grid[i][j] = null;
//   }
// }
// grid[1][1] = true;
// grid[5][5] = true;
// Dirality ENUM
var Dir;
(function (Dir) {
    Dir["U"] = "U";
    Dir["D"] = "D";
    Dir["L"] = "L";
    Dir["R"] = "R";
    Dir["UL"] = "UL";
    Dir["UR"] = "UR";
    Dir["DL"] = "DL";
    Dir["DR"] = "DR";
})(Dir || (Dir = {}));
// dynamic_tile_encode
let dynamic_tile_encode = [
    Dir.L,
    Dir.UL,
    Dir.U,
    Dir.UR,
    Dir.R,
    Dir.DR,
    Dir.D,
    Dir.DL,
];
// Convert directionality to vector
function dirToVect(dir) {
    switch (dir) {
        case Dir.U:
            return { x: 0, y: -1 };
        case Dir.D:
            return { x: 0, y: 1 };
        case Dir.L:
            return { x: -1, y: 0 };
        case Dir.R:
            return { x: 1, y: 0 };
        case Dir.UL:
            return { x: -1, y: -1 };
        case Dir.UR:
            return { x: 1, y: -1 };
        case Dir.DL:
            return { x: -1, y: 1 };
        case Dir.DR:
            return { x: 1, y: 1 };
    }
}
// Convert a pair of numbers into a point object
function toPoint(x, y) {
    return { x: x, y: y };
}
// Convert a stringified point into a point object
function stringToPoint(str) {
    return {
        x: +str.substring(str.lastIndexOf("x:") + 2, str.lastIndexOf(",")),
        y: +str.substring(str.lastIndexOf("y:") + 2, str.lastIndexOf("}")),
    };
}
// Convert a point object into a string
function ptToStr(p) {
    return `{x: ${p.x}, y: ${p.y}}`;
}
function addDimensioned(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}
function samePoint(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    return p1.x === p2.x && p1.y === p2.y;
}
// Return adjacent points in the 4 cardinal directions
function stdAdjacencies(p) {
    return [
        addDimensioned(p, dirToVect(Dir.U)),
        addDimensioned(p, dirToVect(Dir.D)),
        addDimensioned(p, dirToVect(Dir.L)),
        addDimensioned(p, dirToVect(Dir.R)),
    ];
}
function myIndexOf(arr, o) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].x == o.x && arr[i].y == o.y) {
            return i;
        }
    }
    return -1;
}
var Tooltip;
(function (Tooltip) {
    Tooltip[Tooltip["ERASE"] = 0] = "ERASE";
    Tooltip[Tooltip["BLOCK"] = 1] = "BLOCK";
    Tooltip[Tooltip["START"] = 2] = "START";
    Tooltip[Tooltip["FINISH"] = 3] = "FINISH";
    Tooltip[Tooltip["ROAD"] = 4] = "ROAD";
    Tooltip[Tooltip["FOREST"] = 5] = "FOREST";
})(Tooltip || (Tooltip = {}));
var Search;
(function (Search) {
    Search["DIJKSTRA"] = "Dijkstra";
    Search["ASTAR"] = "A*";
})(Search || (Search = {}));
let SearchMap = /** @class */ (() => {
    class SearchMap {
        // Constructor
        constructor() {
            this.traversed = [];
            this.final_path = [];
            this.pt_start = undefined;
            this.pt_finish = undefined;
            // Update and render variables
            this.cycle_step = 0;
            this.is_complete = false;
            this.start_search = false;
            this.genAdjacency();
            this.genGrid();
            // SearchMap.id++;
            // this.id = SearchMap.id;
            //this.pt_start = { x: 0, y: 0 };
            //this.pt_finish = { x: 5, y: 5 };
        }
        // Create new search map instance
        static newSearch() {
            console.log("new_S");
            if (!SearchMap.current) {
                SearchMap.current = new SearchMap();
                SearchMap.update();
            }
            else {
                SearchMap.current = new SearchMap();
            }
        }
        //
        runSearch() {
            if (this.pt_start && this.pt_finish) {
                // Reset drawn path
                this.clearSearch();
                // Start Search
                this.cycle_step = 0;
                this.start_search = true;
                this.current_search = SearchMap.chosenAlgo(this.pt_start, this.pt_finish);
            }
            else {
                showError("MISSING POINTS");
            }
        }
        clearSearch() {
            // Reset pathfinding
            this.traversed = [];
            this.final_path = [];
            this.is_complete = false;
            // Stop searching
            this.start_search = false;
        }
        static chosenAlgo(start, finish) {
            if (SearchMap.selected_search === Search.DIJKSTRA) {
                return new Dijkstra(ptToStr(start), ptToStr(finish));
            }
        }
        // Return if the point is within the canvas
        static withinCanvas(p) {
            return p.x >= 0 && p.y >= 0 && p.x < SearchMap.cols && p.y < SearchMap.rows;
        }
        // Create a new grid
        genGrid() {
            this.grid = [];
            for (let i = 0; i < SearchMap.cols; i++) {
                this.grid[i] = [];
                for (let j = 0; j < SearchMap.rows; j++) {
                    this.grid[i][j] = null;
                }
            }
        }
        // Create a new adjacency list
        genAdjacency() {
            this.adjacency_list = {};
            for (let i = 0; i < SearchMap.cols; i++) {
                for (let j = 0; j < SearchMap.rows; j++) {
                    let p = toPoint(i, j);
                    this.adjacency_list[ptToStr(p)] = [];
                    for (let p_adj of stdAdjacencies(p)) {
                        if (SearchMap.withinCanvas(p_adj)) {
                            this.adjacency_list[ptToStr(p)].push(p_adj);
                        }
                    }
                }
            }
        }
        difficulty(p) {
            let obj = this.getGrid(p);
            if (obj === null) {
                return 10;
            }
            else if (obj instanceof Road || obj instanceof Forest) {
                return obj.difficulty;
            }
        }
        setGrid(p, o) {
            this.grid[p.x][p.y] = o;
        }
        getGrid(p) {
            return this.grid[p.x][p.y];
        }
        getAdjacentObject(p, dir) {
            let d = dirToVect(dir);
            return this.grid[p.x + d.x][p.y + d.y];
        }
        // Make a point impassible
        closePoint(p) {
            // Set point to be solid
            // if (!(this.getGrid(p) instanceof Block)) {
            // this.setGrid(p, new Block());
            this.adjacency_list[ptToStr(p)] = [];
            // Remove entry from adjacency of adjacent points
            for (let p_adj of stdAdjacencies(p)) {
                if (SearchMap.withinCanvas(p_adj)) {
                    let a = this.adjacency_list[ptToStr(p_adj)];
                    if (myIndexOf(a, p) > -1) {
                        a.splice(myIndexOf(a, p), 1);
                    }
                }
            }
        }
        // }
        // Clear position of any object
        clearPosition(p) {
            let obj = this.getGrid(p);
            // If the position is not already clear
            if (obj !== null) {
                // Remove dynamic tiling around this position and clear this position
                this.clearDynamicTiling(p);
                this.setGrid(p, null);
                // Add entry from adjacency of adjacent points
                this.adjacency_list[ptToStr(p)] = [];
                for (let p_adj of stdAdjacencies(p)) {
                    if (SearchMap.withinCanvas(p_adj) &&
                        !(this.getGrid(p_adj) instanceof Block)) {
                        this.adjacency_list[ptToStr(p)].push(p_adj);
                        this.adjacency_list[ptToStr(p_adj)].push(p);
                    }
                }
            }
        }
        // Clear any adjacencies for dynamic tiles around point p
        clearDynamicTiling(p) {
            let obj = this.getGrid(p);
            // If the object at p is a dynamic tile, clear adjacent adjacencies
            if (isDynamicTile(obj)) {
                for (var _dir of Object.keys(Dir)) {
                    let dir = Dir[_dir];
                    let obj_adj = this.getAdjacentObject(p, dir);
                    // Clear adjacent adjacencies if same class
                    if (obj_adj !== null && obj.constructor === obj_adj.constructor) {
                        // @ts-ignore - Will always have property 'adjacent' given above logic
                        obj_adj.adjacent[dirReverse(dir)] = false;
                    }
                }
            }
        }
        // Place a new Road tile
        placeRoad(p) {
            // If the position is not already an instance of this class
            if (!(this.getGrid(p) instanceof Road)) {
                // Remove dynamic tiling around this position and clear this position
                this.clearPosition(p);
                let new_obj = new Road();
                // Create data for dynamic tiling
                for (var _dir of Object.keys(Dir)) {
                    let dir = Dir[_dir];
                    let p_adj = this.getAdjacentObject(p, dir);
                    // If there is an adjacent instance of this class, note this
                    if (p_adj instanceof Road) {
                        new_obj.adjacent[dir] = true;
                        p_adj.adjacent[dirReverse(dir)] = true;
                    }
                }
                // Set the position with the new instance
                this.setGrid(p, new_obj);
            }
        }
        // Place a new Forest tile
        placeForest(p) {
            // If the position is not already an instance of this class
            if (!(this.getGrid(p) instanceof Forest)) {
                // Remove dynamic tiling around this position and clear this position
                this.clearPosition(p);
                let new_obj = new Forest();
                // Create data for dynamic tiling
                for (var _dir of Object.keys(Dir)) {
                    let dir = Dir[_dir];
                    let p_adj = this.getAdjacentObject(p, dir);
                    // If there is an adjacent instance of this class, note this
                    if (p_adj instanceof Forest) {
                        new_obj.adjacent[dir] = true;
                        p_adj.adjacent[dirReverse(dir)] = true;
                    }
                }
                // Set the position with the new instance
                this.setGrid(p, new_obj);
            }
        }
        // Place a new Water tile
        placeWater(p) {
            // If the position is not already an instance of this class
            if (!(this.getGrid(p) instanceof Block)) {
                // Remove dynamic tiling around this position and clear this position
                this.clearPosition(p);
                this.closePoint(p);
                let new_obj = new Block();
                // Create data for dynamic tiling
                for (var _dir of Object.keys(Dir)) {
                    let dir = Dir[_dir];
                    let p_adj = this.getAdjacentObject(p, dir);
                    // If there is an adjacent instance of this class, note this
                    if (p_adj instanceof Block) {
                        new_obj.adjacent[dir] = true;
                        p_adj.adjacent[dirReverse(dir)] = true;
                    }
                }
                // Set the position with the new instance
                this.setGrid(p, new_obj);
            }
        }
        static update() {
            SearchMap.current.draw();
            requestAnimationFrame(SearchMap.update);
        }
        // Draw
        draw() {
            var _a;
            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawGrid();
            if (!this.is_complete && this.start_search) {
                this.cycle_step++;
                if (this.cycle_step % 10 === 0) {
                    this.is_complete = (_a = this.current_search) === null || _a === void 0 ? void 0 : _a.takeStep();
                    this.cycle_step = 0;
                }
            }
            this.drawSearch();
            this.drawTileStart();
            this.drawTileFinish();
            if (this.is_complete) {
                //this.drawPath();
                this.drawArrow();
            }
        }
        // Draw game_grid on canvas
        drawGrid() {
            for (let i = 0; i < SearchMap.cols; i++) {
                for (let j = 0; j < SearchMap.rows; j++) {
                    let obj = this.grid[i][j];
                    if (obj instanceof Block) {
                        this.drawTileSolidColor(toPoint(i, j), "#B6FDFF");
                    }
                    else if (obj instanceof Road) {
                        this.drawTileRoad(toPoint(i, j));
                    }
                    else if (obj instanceof Forest) {
                        this.drawTileSolidColor(toPoint(i, j), "#f0f");
                    }
                }
            }
        }
        drawSearch() {
            for (let p of this.traversed) {
                this.drawTileSolidColor(p, "#ffff00");
            }
        }
        drawPath() {
            for (let p of this.final_path) {
                this.drawTileSolidColor(p, "#f00");
            }
        }
        drawArrow() {
            let pt_arr = this.final_path;
            if (pt_arr.length > 1) {
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(pt_arr[0].x * 16 + 8, pt_arr[0].y * 16 + 8);
                for (var i = 1; i < pt_arr.length; i++) {
                    ctx.lineTo(pt_arr[i].x * 16 + 8, pt_arr[i].y * 16 + 8);
                    // this.canvas_arrow(
                    //   ctx,
                    //   pt_arr[i].x * 16 + 8,
                    //   pt_arr[i].y * 16 + 8,
                    //   pt_arr[i + 1].x * 16 + 8,
                    //   pt_arr[i + 1].y * 16 + 8
                    // );
                }
                ctx.stroke();
                ctx.closePath();
                let p1 = pt_arr[pt_arr.length - 1];
                let p2 = pt_arr[pt_arr.length - 2];
                let headlen = 8;
                ctx.beginPath();
                ctx.lineWidth = 4;
                var angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);
                ctx.moveTo(p1.x * 16 + 8, p1.y * 16 + 8);
                ctx.lineTo(p1.x * 16 + 8 - headlen * Math.cos(angle - Math.PI / 6), p1.y * 16 + 8 - headlen * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(p1.x * 16 + 8 - headlen * Math.cos(angle + Math.PI / 6), p1.y * 16 + 8 - headlen * Math.sin(angle + Math.PI / 6));
                ctx.lineTo(p1.x * 16 + 8, p1.y * 16 + 8);
                ctx.stroke();
                ctx.closePath();
            }
        }
        drawTileSolidColor(p, color) {
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.rect(SearchMap.tile_size * p.x, SearchMap.tile_size * p.y, SearchMap.tile_size, SearchMap.tile_size);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();
        }
        drawTileStart() {
            let p = this.pt_start;
            if (p) {
                ctx.drawImage(s_start, SearchMap.tile_size * p.x, SearchMap.tile_size * p.y);
            }
        }
        drawTileFinish() {
            let p = this.pt_finish;
            if (p) {
                ctx.drawImage(s_finish, SearchMap.tile_size * p.x, SearchMap.tile_size * p.y);
            }
        }
        // Draw a road tile
        drawTileRoad(p) {
            let obj = this.getGrid(p);
            // Draw the four sub-sprites making up the whole
            for (var i = 0; i < 4; i++) {
                // Shift values to align the subsprite in the whole
                let shift_subsprite_x = i % 3 !== 0 ? 8 : 0;
                let shift_subsprite_y = i >= 2 ? 8 : 0;
                // Draw subsprite
                ctx.drawImage(s_road[i], (SearchMap.tile_size / 2) *
                    (+obj.adjacent[dynamic_tile_encode[2 * i + 0]] +
                        2 * +obj.adjacent[dynamic_tile_encode[2 * i + 1]] +
                        4 * +obj.adjacent[dynamic_tile_encode[(2 * i + 2) % 8]]), // See git for explanation
                0, SearchMap.tile_size / 2, SearchMap.tile_size / 2, shift_subsprite_x + SearchMap.tile_size * p.x, shift_subsprite_y + SearchMap.tile_size * p.y, SearchMap.tile_size / 2, SearchMap.tile_size / 2);
            }
        }
    }
    SearchMap.tile_size = 16;
    SearchMap.cols = 100;
    SearchMap.rows = 50;
    // Search variables
    SearchMap.selected_search = Search.DIJKSTRA;
    // Tooltip
    SearchMap.tooltip = Tooltip.BLOCK;
    // To Remove
    SearchMap.id = 0;
    return SearchMap;
})();
class Dijkstra {
    constructor(start, finish) {
        this.distances = {};
        this.previous = {};
        this.smallest = null;
        this.path = []; // Path to return
        this.nodes = new PriorityQueue();
        this.start = start;
        this.finish = finish;
        //build up initial state
        for (let vertex in SearchMap.current.adjacency_list) {
            if (vertex === start) {
                this.distances[vertex] = 0;
                this.nodes.enqueue(vertex, 0);
            }
            else {
                this.distances[vertex] = Infinity;
                this.nodes.enqueue(vertex, Infinity);
            }
            this.previous[vertex] = null;
        }
    }
    takeStep() {
        // as long as there is something to visit
        if (this.nodes.values.length) {
            this.smallest = this.nodes.dequeue().val;
            // End searching if all remaining nodes are infinitely far from the start
            if (this.distances[this.smallest] === Infinity) {
                return true;
            }
            SearchMap.current.traversed.push(stringToPoint(this.smallest));
            if (this.smallest === this.finish) {
                //WE ARE DONE
                //BUILD U PATH TO RETURN AT END
                while (this.previous[this.smallest]) {
                    this.path.push(stringToPoint(this.smallest));
                    this.smallest = this.previous[this.smallest];
                }
                //break;
                SearchMap.current.final_path = this.path
                    .concat(stringToPoint(this.smallest))
                    .reverse();
                return true;
            }
            if (this.smallest || this.distances[this.smallest] !== Infinity) {
                for (let neighbor in SearchMap.current.adjacency_list[this.smallest]) {
                    //find neighboring node
                    let nextNode = SearchMap.current.adjacency_list[this.smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = this.distances[this.smallest] +
                        SearchMap.current.difficulty(nextNode); //.weight;
                    console.log(candidate);
                    let nextNeighbor = nextNode;
                    if (candidate < this.distances[ptToStr(nextNeighbor)]) {
                        //updating new smallest distance to neighbor
                        this.distances[ptToStr(nextNeighbor)] = candidate;
                        //updating previous - How we got to neighbor
                        this.previous[ptToStr(nextNeighbor)] = this.smallest;
                        //enqueue in priority queue with new priority
                        this.nodes.enqueue(ptToStr(nextNeighbor), candidate);
                    }
                }
                return false;
            }
        }
        else {
            SearchMap.current.final_path = this.path
                .concat(stringToPoint(this.smallest))
                .reverse();
            return true;
        }
    }
}
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        let newNode = new prioNode(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }
    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority)
                break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }
    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }
    sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;
            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if ((swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null)
                break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}
class prioNode {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}
SearchMap.newSearch();
console.log(Object.keys(Dir));
// SearchMap.current.closePoint({ x: 1, y: 0 });
// SearchMap.current.closePoint({ x: 1, y: 1 });
// SearchMap.current.closePoint({ x: 0, y: 3 });
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}
function clk(e) {
    if (!SearchMap.current.start_search) {
        let pos = getMousePos(canvas, e);
        let p = toPoint(Math.floor(pos.x / SearchMap.tile_size), Math.floor(pos.y / SearchMap.tile_size));
        //console.log(p);
        if (e.buttons == 1 || e.buttons == 3) {
            if (SearchMap.withinCanvas(p)) {
                if (SearchMap.tooltip === Tooltip.BLOCK)
                    SearchMap.current.placeWater(p);
                if (SearchMap.tooltip === Tooltip.ERASE)
                    SearchMap.current.clearPosition(p);
                if (SearchMap.tooltip === Tooltip.ROAD)
                    SearchMap.current.placeRoad(p);
                if (SearchMap.tooltip === Tooltip.FOREST)
                    SearchMap.current.placeForest(p);
                if (SearchMap.tooltip === Tooltip.START) {
                    SearchMap.current.pt_start = p;
                }
                if (SearchMap.tooltip === Tooltip.FINISH) {
                    SearchMap.current.pt_finish = p;
                }
            }
        }
        else if (e.buttons == 2) {
            SearchMap.current.clearPosition(p);
        }
    }
}
// Show input error message
function showError(message) {
    error.className = "error visible";
    error.innerText = message;
}
// Show success outline
function errorReset() {
    error.className = "error";
    error.innerText = "Error Message";
}
// Handle setting
canvas.addEventListener("mousemove", (e) => {
    clk(e);
});
// Handle setting
canvas.addEventListener("mousedown", (e) => {
    clk(e);
});
// Prevent context menu if right-clicking canvas
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
// Tooltip Buttons
ttStartBtn.addEventListener("click", () => {
    SearchMap.tooltip = Tooltip.START;
});
ttFinishBtn.addEventListener("click", () => {
    SearchMap.tooltip = Tooltip.FINISH;
});
ttBlockBtn.addEventListener("click", () => {
    SearchMap.tooltip = Tooltip.BLOCK;
});
ttRoadBtn.addEventListener("click", () => {
    SearchMap.tooltip = Tooltip.ROAD;
});
ttForestBtn.addEventListener("click", () => {
    SearchMap.tooltip = Tooltip.FOREST;
});
// New Search Button
newSearchBtn.addEventListener("click", () => {
    SearchMap.newSearch();
});
// Run Search Button
runSearchBtn.addEventListener("click", () => {
    SearchMap.current.runSearch();
    console.log(SearchMap.current.adjacency_list);
});
// Clear Search Button
clearSearchBtn.addEventListener("click", () => {
    SearchMap.current.clearSearch();
});
//# sourceMappingURL=pathfinding.js.map