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
const error = document.getElementById("error");
// Reset Scores Button Elements
const resetSPBtn = document.getElementById("reset-sp-score-btn");
const resetMPBtn = document.getElementById("reset-mp-score-btn");
// class Point {
//   x: number;
//   y: number;
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
//   toString(): string {
//     return `{${this.x},${this.y}}`;
//   }
// }
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
// Directionality ENUM
var Direction;
(function (Direction) {
    Direction[Direction["NONE"] = 0] = "NONE";
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
    Direction[Direction["RIGHT"] = 4] = "RIGHT";
})(Direction || (Direction = {}));
// Convert directionality to vector
function dirToVect(dir) {
    switch (dir) {
        case Direction.NONE:
            return { x: 0, y: 0 };
        case Direction.UP:
            return { x: 0, y: -1 };
        case Direction.DOWN:
            return { x: 0, y: 1 };
        case Direction.LEFT:
            return { x: -1, y: 0 };
        case Direction.RIGHT:
            return { x: 1, y: 0 };
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
function ptToString(p) {
    return `{x: ${p.x}, y: ${p.y}}`;
}
function movePoint(p1, p2) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
}
function samePoint(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    return p1.x === p2.x && p1.y === p2.y;
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
})(Tooltip || (Tooltip = {}));
let GameMap = /** @class */ (() => {
    class GameMap {
        constructor() {
            this.traversed = [];
            this.final_path = [];
            this.cycle_step = 0;
            this.is_complete = false;
            this.start_search = false;
            this.pt_start = undefined;
            this.pt_finish = undefined;
            this.genAdjacency(); //this.adjacencyList =
            this.genGrid(); //this.grid =
            GameMap.id++;
            this.id = GameMap.id;
            //UNNEEDED??
            this.traversed = [];
            this.final_path = [];
            this.cycle_step = 0;
            this.current_search;
            this.is_complete = false;
            this.start_search = false;
            this.pt_start = { x: 0, y: 0 };
            this.pt_finish = { x: 5, y: 5 };
        }
        static newSearch() {
            console.log("new_S");
            if (!GameMap.current) {
                GameMap.current = new GameMap();
                GameMap.update();
            }
            else {
                GameMap.current = new GameMap();
            }
        }
        runSearch() {
            if (this.pt_start && this.pt_finish) {
                // Reset drawn path
                this.clearSearch();
                // Start Search
                this.cycle_step = 0;
                this.start_search = true;
                this.searchDijkstra();
            }
            else {
                error.innerText = "MISSING POINTS";
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
        searchDijkstra() {
            this.current_search = new Dijkstra(ptToString(this.pt_start), ptToString(this.pt_finish));
            this.cycle_step = 0;
        }
        genGrid() {
            this.grid = [];
            for (let i = 0; i < 8; i++) {
                this.grid[i] = [];
                for (let j = 0; j < 8; j++) {
                    this.grid[i][j] = null;
                }
            }
            //return grid;
        }
        genAdjacency() {
            this.adjacencyList = {};
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.adjacencyList[ptToString(toPoint(i, j))] = [];
                    if (i > 0) {
                        this.adjacencyList[ptToString(toPoint(i, j))].push(toPoint(i - 1, j));
                    }
                    if (j > 0) {
                        this.adjacencyList[ptToString(toPoint(i, j))].push(toPoint(i, j - 1));
                    }
                    if (i < 8 - 1) {
                        this.adjacencyList[ptToString(toPoint(i, j))].push(toPoint(i + 1, j));
                    }
                    if (j < 8 - 1) {
                        this.adjacencyList[ptToString(toPoint(i, j))].push(toPoint(i, j + 1));
                    }
                }
            }
            //return adjacencyList;
        }
        closePoint(p) {
            this.grid[p.x][p.y] = false;
            this.adjacencyList[ptToString(p)] = [];
            if (p.x > 0) {
                let a = this.adjacencyList[ptToString(movePoint(p, dirToVect(Direction.LEFT)))];
                myIndexOf(a, p) > -1 ? a.splice(myIndexOf(a, p), 1) : false;
            }
            if (p.y > 0) {
                let a = this.adjacencyList[ptToString(movePoint(p, dirToVect(Direction.UP)))];
                myIndexOf(a, p) > -1 ? a.splice(myIndexOf(a, p), 1) : false;
            }
            if (p.x < 8 - 1) {
                let a = this.adjacencyList[ptToString(movePoint(p, dirToVect(Direction.RIGHT)))];
                myIndexOf(a, p) > -1 ? a.splice(myIndexOf(a, p), 1) : false;
            }
            if (p.y < 8 - 1) {
                let a = this.adjacencyList[ptToString(movePoint(p, dirToVect(Direction.DOWN)))];
                myIndexOf(a, p) > -1 ? a.splice(myIndexOf(a, p), 1) : false;
            }
        }
        static update() {
            GameMap.current.draw();
            requestAnimationFrame(GameMap.update);
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
            if (this.is_complete) {
                this.drawPath();
            }
        }
        // Draw game_grid on canvas
        drawGrid() {
            console.log("grid", this.id);
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    let obj = this.grid[i][j];
                    if (obj !== null) {
                        drawTile(toPoint(i, j), "#B6FDFF");
                    }
                    else if (samePoint(toPoint(i, j), this.pt_start)) {
                        drawTile(toPoint(i, j), "#f00");
                    }
                    else if (samePoint(toPoint(i, j), this.pt_finish)) {
                        drawTile(toPoint(i, j), "#0f0");
                    }
                }
            }
        }
        drawSearch() {
            console.log("search", this.id);
            for (let p of this.traversed) {
                drawTile(p, "#ff0");
            }
        }
        drawPath() {
            for (let p of this.final_path) {
                drawTile(p, "#f00");
            }
        }
    }
    GameMap.id = 0;
    GameMap.tile_size = 16;
    GameMap.tooltip = Tooltip.BLOCK;
    return GameMap;
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
        for (let vertex in GameMap.current.adjacencyList) {
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
            GameMap.current.traversed.push(stringToPoint(this.smallest));
            if (this.smallest === this.finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                while (this.previous[this.smallest]) {
                    this.path.push(stringToPoint(this.smallest));
                    this.smallest = this.previous[this.smallest];
                }
                //break;
                GameMap.current.final_path = this.path
                    .concat(stringToPoint(this.smallest))
                    .reverse();
                return true;
            }
            if (this.smallest || this.distances[this.smallest] !== Infinity) {
                for (let neighbor in GameMap.current.adjacencyList[this.smallest]) {
                    //find neighboring node
                    let nextNode = GameMap.current.adjacencyList[this.smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = this.distances[this.smallest] + 1; //nextNode.weight;
                    let nextNeighbor = nextNode;
                    if (candidate < this.distances[ptToString(nextNeighbor)]) {
                        //updating new smallest distance to neighbor
                        this.distances[ptToString(nextNeighbor)] = candidate;
                        //updating previous - How we got to neighbor
                        this.previous[ptToString(nextNeighbor)] = this.smallest;
                        //enqueue in priority queue with new priority
                        this.nodes.enqueue(ptToString(nextNeighbor), candidate);
                    }
                }
            }
            return false;
        }
        else {
            GameMap.current.final_path = this.path
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
// draw() {
//   // clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   this.drawScore();
//   this.drawGrid();
// }
// Draw score on canvas
// drawScore() {
//   ctx.beginPath();
//   ctx.rect(0, 0, canvas.width, Game.pixel_size * 5);
//   ctx.fillStyle = Colors.BLUE;
//   ctx.fill();
//   ctx.closePath();
//   ctx.fillStyle = Colors.WHITE;
//   ctx.font = "20px Arial";
//   if (!Game.isMP) {
//     // Draw Scoring
//     ctx.textAlign = "left";
//     ctx.fillText(`Score: ${this.p1_snake.score}`, 30, 30);
//     ctx.textAlign = "right";
//     ctx.fillText(
//       `High-Score: ${Game.highScores[Game.currentMap]}`,
//       canvas.width - 30,
//       30
//     );
//   } else {
//     // Draw p1 square
//     ctx.beginPath();
//     ctx.rect(16, 18, Game.pixel_size, Game.pixel_size);
//     ctx.fillStyle = Colors.PINK;
//     ctx.fill();
//     ctx.closePath();
//     // Draw p2 square
//     ctx.beginPath();
//     ctx.rect(canvas.width - 26, 18, Game.pixel_size, Game.pixel_size);
//     ctx.fillStyle = Colors.GREEN;
//     ctx.fill();
//     ctx.closePath();
//     // Draw Crown
//     if (Game.mpWins[0] > Game.mpWins[1]) {
//       ctx.drawImage(crown, 16, 13);
//     } else if (Game.mpWins[0] < Game.mpWins[1]) {
//       ctx.drawImage(crown, canvas.width - 26, 13);
//     }
//     // Draw Scoring
//     ctx.fillStyle = Colors.WHITE;
//     ctx.textAlign = "left";
//     ctx.fillText(`P1 Score: ${this.p1_snake.score}`, 30, 30);
//     ctx.textAlign = "center";
//     ctx.fillText(`${Game.mpWins[0]}:${Game.mpWins[1]}`, canvas.width / 2, 30);
//     ctx.textAlign = "right";
//     ctx.fillText(`P2 Score: ${this.p2_snake.score}`, canvas.width - 30, 30); //
//   }
// }
function drawTile(p, color) {
    ctx.beginPath();
    ctx.rect(GameMap.tile_size * p.x, GameMap.tile_size * p.y, GameMap.tile_size, GameMap.tile_size);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
GameMap.newSearch();
//GameMap.current.searchDijkstra();
GameMap.current.closePoint({ x: 1, y: 0 });
GameMap.current.closePoint({ x: 1, y: 1 });
GameMap.current.closePoint({ x: 0, y: 3 });
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}
// // Crown :)
// let crown = new Image();
// crown.src = "img/crown.png";
// // Directionality ENUM
// enum Direction {
//   NONE,
//   UP,
//   DOWN,
//   LEFT,
//   RIGHT,
// }
// // Flip directionality
// function opposingDirection(dir: Direction): Direction {
//   switch (dir) {
//     case Direction.NONE:
//       return Direction.NONE;
//     case Direction.UP:
//       return Direction.DOWN;
//     case Direction.DOWN:
//       return Direction.UP;
//     case Direction.LEFT:
//       return Direction.RIGHT;
//     case Direction.RIGHT:
//       return Direction.LEFT;
//   }
// }
// // Convert directionality to vector
// function dirToVect(dir: Direction): Vector {
//   switch (dir) {
//     case Direction.NONE:
//       return { x: 0, y: 0 };
//     case Direction.UP:
//       return { x: 0, y: -1 };
//     case Direction.DOWN:
//       return { x: 0, y: 1 };
//     case Direction.LEFT:
//       return { x: -1, y: 0 };
//     case Direction.RIGHT:
//       return { x: 1, y: 0 };
//   }
// }
// // Interfaces
// interface Dimensioned {
//   x: number;
//   y: number;
// }
// interface Point extends Dimensioned {}
// interface Vector extends Dimensioned {}
// // Convert a pair of numbers into a point object
// function toPoint(x: number, y: number): Point {
//   return { x: x, y: y };
// }
// // // Colors ENUM
// // enum Colors {
// //   PINK = "#ff95dd",
// //   GREEN = "#2ecc71",
// //   BLUE = "#0095dd",
// //   YELLOW = "#ffcc00",
// //   ORANGE = "#ff9900",
// //   RED = "#ff3300",
// //   MAGIC = "#660066",
// //   WHITE = "#fff",
// // }
// // // No idea what to call this. Probability for an associated item/event
// // type ProbSlice = { p: number; v: any };
// // // Weighted probability function. Ensure probs add to 100% or the largest prob will scale up to make it 100%
// // function weightedProb(...args: ProbSlice[]) {
// //   let p_rand = Math.random();
// //   let p_acc = 0;
// //   args = args.sort((a, b) => a.p - b.p);
// //   for (var i = 0; i < args.length - 1; i++) {
// //     p_acc += args[i].p;
// //     if (p_rand > 1 - p_acc) {
// //       return args[i].v;
// //     }
// //   }
// //   return args[args.length - 1].v;
// // }
// // Type describing objects that can exist in the grid
// type GridObjects = null | boolean;
// // Game control class object
// class Game {
//   // Render and update
//   private static force_frame = false;
//   private static readonly default_refresh_delay = 100;
//   private static refresh_delay = 100;
//   static readonly cols = 100;
//   static readonly rows = 50;
//   static readonly pixel_size = 10;
//   static readonly header_size = 50;
//   // Current game instance
//   static current: Game;
//   // Score and game-state variables
//   static paused = false;
//   static isMP = false;
//   static highScores = [0, 0, 0];
//   static mpWins = [0, 0];
//   static currentMap = 0;
//   // Instance variables
//   score: number;
//   // p1_snake: Snake;
//   // p2_snake?: Snake;
//   private grid: GridObjects[][];
//   // Create a new game
//   private constructor() {
//     this.score = 0;
//     this.grid = [];
//     this.createGrid();
//     // this.loadMap(Game.currentMap);
//   }
//   // Spawn a new game and set it to the class variable
//   static newGame() {
//     // Allow update to refresh canvas while paused
//     Game.force_frame = true;
//     // Set current game as new game
//     if (!Game.current) {
//       Game.current = new Game();
//       Game.current.update();
//     } else {
//       Game.current = new Game();
//       Game.resetGameSpeed();
//     }
//   }
//   // Start a single-player game
//   static startSPGame() {
//     Game.isMP = false;
//     Game.newGame();
//   }
//   // Start a two-player game
//   static startMPGame() {
//     Game.isMP = true;
//     Game.newGame();
//   }
//   // Create the grid at the game start
//   createGrid() {
//     for (let i = 0; i < Game.cols; i++) {
//       this.grid[i] = [];
//       for (let j = 0; j < Game.rows; j++) {
//         this.grid[i][j] = null;
//       }
//     }
//     this.grid[1][1] = true;
//     this.grid[5][5] = true;
//   }
//   // loadMap(index: number) {
//   //   //Load map
//   //   let load = mapDatas[index];
//   //   // Load walls
//   //   if (load.hasOwnProperty("walls")) {
//   //     for (let wall of load.walls) {
//   //       this.setObject(wall, new Wall());
//   //     }
//   //   }
//   //   // Load Snake 1
//   //   this.p1_snake = new Snake(0, load.sp1);
//   //   this.setObject(load.sp1, new SnakeSegment(0));
//   //   // Load Snake 2 and an additional pellet if 2 players
//   //   if (Game.isMP) {
//   //     this.p2_snake = new Snake(1, load.sp2);
//   //     this.setObject(load.sp2, new SnakeSegment(1));
//   //     this.genFoodPellet();
//   //   }
//   //   // Load main food pellet after walls defined
//   //   this.genFoodPellet();
//   // }
//   // Spawn a new food pellet in the current game
//   // genFoodPellet() {
//   //   let open_p: Point[] = [];
//   //   // Determine value of pellet
//   //   let value = weightedProb(
//   //     { p: 0.75, v: 5 },
//   //     { p: 0.2, v: 10 },
//   //     { p: 0.045, v: 25 },
//   //     { p: 0.005, v: 100 }
//   //   );
//   //   // Find open locations for the new pellet and spawn
//   //   for (let i = 0; i < Game.cols; i++) {
//   //     for (let j = 0; j < Game.rows; j++) {
//   //       if (this.getObject(toPoint(i, j)) === null) {
//   //         open_p.push(toPoint(i, j));
//   //       }
//   //     }
//   //   }
//   //   let new_p = open_p[Math.floor(Math.random() * open_p.length)];
//   //   this.setObject(new_p, new FoodPellet(value));
//   // }
//   // Get the object at a given coordinate
//   getObject(p: Dimensioned): GridObjects {
//     return this.grid[p.x][p.y];
//   }
//   // Set the object at a given coordinate
//   setObject(p: Dimensioned, o: GridObjects) {
//     this.grid[p.x][p.y] = o;
//   }
//   // Check if a coordinate is out of game bounds
//   static outOfBounds(p: Point) {
//     return p.x < 0 || p.y < 0 || p.x >= Game.cols || p.y >= Game.rows;
//   }
//   static increaseGameSpeed() {
//     if (Game.refresh_delay > 0) {
//       Game.refresh_delay *= 0.9;
//     }
//   }
//   static resetGameSpeed() {
//     Game.refresh_delay = Game.default_refresh_delay;
//   }
//   // Looped update of canvas drawing
//   update() {
//     // Draw everything
//     // if (!Game.paused || Game.force_frame) {
//     //   // Turn off override if needed and skip movement if so
//     //   if (Game.force_frame) {
//     //     Game.force_frame = false;
//     //   } else {
//     //     Game.current.p1_snake.move();
//     //     if (Game.current.p2_snake) {
//     //       Game.current.p2_snake.move();
//     //     }
//     //   }
//     //   // Game.current.draw();
//     // }
//     // if (Game.current.isGameOver()) {
//     //   Game.current.runGameOver();
//     // }
//     // Loop update with a timeout
//     setTimeout(
//       () => requestAnimationFrame(this.update.bind(this)),
//       Game.refresh_delay
//     );
//   }
//   static refreshScreen() {
//     Game.force_frame = true;
//   }
//   // isGameOver() {
//   //   return (
//   //     (!Game.isMP && this.p1_snake.disabled) ||
//   //     (Game.isMP &&
//   //       ((this.p1_snake.disabled && this.p2_snake.disabled) ||
//   //         (this.p1_snake.disabled &&
//   //           this.p2_snake.score > this.p1_snake.score) ||
//   //         (this.p2_snake.disabled &&
//   //           this.p2_snake.score < this.p1_snake.score)))
//   //   );
//   // }
//   // runGameOver() {
//   //   // If single-player, check if new high-score is achieved
//   //   if (!Game.isMP) {
//   //     if (Game.highScores[Game.currentMap] < this.p1_snake.score) {
//   //       Game.highScores[Game.currentMap] = this.p1_snake.score;
//   //       memSaveHighScores();
//   //     }
//   //     Game.startSPGame();
//   //     // If two-player, tally winner
//   //   } else {
//   //     if (this.p2_snake.score > this.p1_snake.score) {
//   //       Game.mpWins[1] += 1;
//   //       memSaveMPWins();
//   //     } else if (this.p2_snake.score < this.p1_snake.score) {
//   //       Game.mpWins[0] += 1;
//   //       memSaveMPWins();
//   //     }
//   //     Game.startMPGame();
//   //   }
//   // }
//   // // Draw everything
//   // draw() {
//   //   // clear canvas
//   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   //   this.drawScore();
//   //   this.drawGrid();
//   // }
//   // // Draw score on canvas
//   // drawScore() {
//   //   ctx.beginPath();
//   //   ctx.rect(0, 0, canvas.width, Game.pixel_size * 5);
//   //   ctx.fillStyle = Colors.BLUE;
//   //   ctx.fill();
//   //   ctx.closePath();
//   //   ctx.fillStyle = Colors.WHITE;
//   //   ctx.font = "20px Arial";
//   //   if (!Game.isMP) {
//   //     // Draw Scoring
//   //     ctx.textAlign = "left";
//   //     ctx.fillText(`Score: ${this.p1_snake.score}`, 30, 30);
//   //     ctx.textAlign = "right";
//   //     ctx.fillText(
//   //       `High-Score: ${Game.highScores[Game.currentMap]}`,
//   //       canvas.width - 30,
//   //       30
//   //     );
//   //   } else {
//   //     // Draw p1 square
//   //     ctx.beginPath();
//   //     ctx.rect(16, 18, Game.pixel_size, Game.pixel_size);
//   //     ctx.fillStyle = Colors.PINK;
//   //     ctx.fill();
//   //     ctx.closePath();
//   //     // Draw p2 square
//   //     ctx.beginPath();
//   //     ctx.rect(canvas.width - 26, 18, Game.pixel_size, Game.pixel_size);
//   //     ctx.fillStyle = Colors.GREEN;
//   //     ctx.fill();
//   //     ctx.closePath();
//   //     // Draw Crown
//   //     if (Game.mpWins[0] > Game.mpWins[1]) {
//   //       ctx.drawImage(crown, 16, 13);
//   //     } else if (Game.mpWins[0] < Game.mpWins[1]) {
//   //       ctx.drawImage(crown, canvas.width - 26, 13);
//   //     }
//   //     // Draw Scoring
//   //     ctx.fillStyle = Colors.WHITE;
//   //     ctx.textAlign = "left";
//   //     ctx.fillText(`P1 Score: ${this.p1_snake.score}`, 30, 30);
//   //     ctx.textAlign = "center";
//   //     ctx.fillText(`${Game.mpWins[0]}:${Game.mpWins[1]}`, canvas.width / 2, 30);
//   //     ctx.textAlign = "right";
//   //     ctx.fillText(`P2 Score: ${this.p2_snake.score}`, canvas.width - 30, 30); //
//   //   }
//   // }
//   // static drawTile(p: Point, color: string) {
//   //   ctx.beginPath();
//   //   ctx.rect(
//   //     Game.pixel_size * p.x,
//   //     Game.pixel_size * p.y + Game.header_size,
//   //     Game.pixel_size,
//   //     Game.pixel_size
//   //   );
//   //   ctx.fillStyle = color;
//   //   ctx.fill();
//   //   ctx.closePath();
//   // }
//   // // Draw game_grid on canvas
//   // drawGrid() {
//   //   for (let i = 0; i < Game.cols; i++) {
//   //     for (let j = 0; j < Game.rows; j++) {
//   //       let obj = this.getObject(toPoint(i, j));
//   //       if (obj !== null) {
//   //         if (obj instanceof SnakeSegment) {
//   //           Game.drawTile(toPoint(i, j), Snake.color[obj.id]);
//   //         } else if (obj instanceof FoodPellet) {
//   //           Game.drawTile(toPoint(i, j), FoodPellet.color[obj.value]);
//   //         } else if (obj instanceof Wall) {
//   //           Game.drawTile(toPoint(i, j), Colors.BLUE);
//   //         }
//   //       }
//   //     }
//   //   }
//   // }
//   // // Player 1 Snake Controls
//   // controlSnakes(this: Game, e: KeyboardEvent) {
//   //   if (e.key === "Up" || e.key === "ArrowUp") {
//   //     e.preventDefault();
//   //     this.p1_snake.setFacing(Direction.UP);
//   //   }
//   //   if (e.key === "Down" || e.key === "ArrowDown") {
//   //     e.preventDefault();
//   //     this.p1_snake.setFacing(Direction.DOWN);
//   //   }
//   //   if (e.key === "Left" || e.key === "ArrowLeft") {
//   //     e.preventDefault();
//   //     this.p1_snake.setFacing(Direction.LEFT);
//   //   }
//   //   if (e.key === "Right" || e.key === "ArrowRight") {
//   //     e.preventDefault();
//   //     this.p1_snake.setFacing(Direction.RIGHT);
//   //   }
//   //   if (this.p2_snake) {
//   //     if (e.key === "W" || e.key === "w") {
//   //       this.p2_snake.setFacing(Direction.UP);
//   //     }
//   //     if (e.key === "S" || e.key === "s") {
//   //       this.p2_snake.setFacing(Direction.DOWN);
//   //     }
//   //     if (e.key === "A" || e.key === "a") {
//   //       this.p2_snake.setFacing(Direction.LEFT);
//   //     }
//   //     if (e.key === "D" || e.key === "d") {
//   //       this.p2_snake.setFacing(Direction.RIGHT);
//   //     }
//   //   }
//   // }
// }
// // class Snake {
// //   head: Point;
// //   tail: Point;
// //   id: number;
// //   seg_to_gen: number;
// //   last_facing: Direction;
// //   current_facing: Direction;
// //   score: number;
// //   disabled: boolean;
// //   static color = [Colors.PINK, Colors.GREEN];
// //   constructor(id: number, p1: Point) {
// //     this.head = p1;
// //     this.tail = p1;
// //     this.id = id;
// //     this.seg_to_gen = 5;
// //     this.last_facing = Direction.NONE;
// //     this.current_facing = Direction.NONE;
// //     this.disabled = false;
// //     this.score = 0;
// //     //Game.current.setObject(this.head, new SnakeSegment());
// //   }
// //   move() {
// //     // Don't attempt to move if there is NONE facing or diabled!
// //     if (this.current_facing === Direction.NONE || this.disabled) return;
// //     // Get coords of location we intend to move into
// //     let next_location = addVect(this.head, dirToVect(this.current_facing));
// //     // Game end condition for out-of-bounds
// //     if (Game.outOfBounds(next_location)) {
// //       this.disabled = true;
// //       return;
// //     }
// //     // We know we are in bounds so we can get what is at the location
// //     let grid_object = Game.current.getObject(next_location);
// //     // Game end condition for hitting something deadly
// //     if (grid_object instanceof GameEndingObject) {
// //       this.disabled = true;
// //       return;
// //     }
// //     // Score condition for hitting a food
// //     if (grid_object instanceof FoodPellet) {
// //       if (grid_object.value === 100) {
// //         Game.resetGameSpeed();
// //       } else {
// //         Game.increaseGameSpeed();
// //       }
// //       this.score += grid_object.value;
// //       this.seg_to_gen += grid_object.value;
// //       Game.current.genFoodPellet();
// //     }
// //     // Move the snake forwards
// //     // @ts-ignore - object at Snake.head is ALWAYS a SnakeSegment
// //     Game.current.getObject(this.head).next_segment = this.current_facing;
// //     Game.current.setObject(next_location, new SnakeSegment(this.id));
// //     this.head = next_location;
// //     this.last_facing = this.current_facing;
// //     if (this.seg_to_gen > 0) {
// //       this.seg_to_gen--;
// //     } else {
// //       let old_tail = Game.current.getObject(this.tail);
// //       Game.current.setObject(this.tail, null);
// //       if (old_tail instanceof SnakeSegment) {
// //         this.tail = addVect(this.tail, dirToVect(old_tail.next_segment));
// //       }
// //     }
// //   }
// //   setFacing(dir: Direction) {
// //     if (dir !== opposingDirection(this.last_facing)) {
// //       this.current_facing = dir;
// //     }
// //   }
// // }
// // // Food pellet class
// // class FoodPellet {
// //   static color: { [key: number]: string } = {
// //     5: Colors.YELLOW,
// //     10: Colors.ORANGE,
// //     25: Colors.RED,
// //     100: Colors.MAGIC,
// //   };
// //   value: number;
// //   constructor(value = 5) {
// //     this.value = value;
// //   }
// // }
// // // Parent class for all objects with game-ending collision
// // class GameEndingObject {}
// // class Wall extends GameEndingObject {}
// // // Snake Segment Class
// // class SnakeSegment extends GameEndingObject {
// //   next_segment: Direction;
// //   id: number;
// //   constructor(id: number, next_segment: Direction = Direction.NONE) {
// //     super();
// //     this.next_segment = next_segment;
// //     this.id = id;
// //   }
// // }
// // // Load local storage ad start new game
// // memLoadMap();
// // memLoadHighScores();
// // memLoadMPWins();
// // memLoadGameMode();
// // Game.newGame();
// // function endGame() {
// //   Game.current.score = -1000;
// //   Game.current.p1_snake.disabled = true;
// // }
// // function addVect(...vectors: Dimensioned[]) {
// //   return vectors.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }));
// // }
// // // Load local storage for Map selection
// // function memLoadMap() {
// //   let _load = +localStorage.getItem("selectedMap");
// //   if (_load !== null) {
// //     Game.currentMap = _load;
// //     selectMapBtn(_load);
// //   }
// // }
// // // Update local storage for Map selection
// // function memSaveMap() {
// //   localStorage.setItem("selectedMap", Game.currentMap.toString());
// // }
// // // Load local storage for Map selection
// // function memLoadGameMode() {
// //   let _load = JSON.parse(localStorage.getItem("gameMode"));
// //   if (_load !== null) {
// //     Game.isMP = _load;
// //     if (_load) {
// //       selectMPBtn();
// //     } else {
// //       selectSPBtn();
// //     }
// //   }
// // }
// // // Update local storage for Map selection
// // function memSaveGameMode() {
// //   localStorage.setItem("gameMode", JSON.stringify(Game.isMP));
// // }
// // // Load local storage for high-scores
// // function memLoadHighScores() {
// //   let _load = JSON.parse(localStorage.getItem("highScores"));
// //   if (_load !== null) {
// //     Game.highScores = _load;
// //   }
// // }
// // // Update local storage for high-scores
// // function memSaveHighScores() {
// //   localStorage.setItem("highScores", JSON.stringify(Game.highScores));
// // }
// // // Reset local storage for high-scores
// // function memResetHighScores() {
// //   Game.highScores = [0, 0, 0];
// //   memSaveHighScores();
// //   Game.refreshScreen();
// // }
// // // Load local storage for multiplayer scores
// // function memLoadMPWins() {
// //   let _load = JSON.parse(localStorage.getItem("mpWins"));
// //   if (_load !== null) {
// //     Game.mpWins = _load;
// //   }
// // }
// // // Update local storage for multiplayer scores
// // function memSaveMPWins() {
// //   localStorage.setItem("mpWins", JSON.stringify(Game.mpWins));
// // }
// // // Reset local storage for multiplayer scores
// // function memResetMPWins() {
// //   Game.mpWins = [0, 0];
// //   memSaveMPWins();
// //   Game.refreshScreen();
// // }
// // // Keyboard event handlers for snake movement
// // document.addEventListener("keydown", (e) => {
// //   Game.current.controlSnakes(e);
// // });
// // // Toggle the CSS for the associated button and set the internal variable
// // function selectMapBtn(n: number) {
// //   for (let btn of mapBtns) {
// //     btn.classList.remove("selected");
// //   }
// //   mapBtns[n].classList.add("selected");
// //   Game.currentMap = n;
// // }
// // // Map selection event handlers
// // map0Btn.addEventListener("click", () => {
// //   selectMapBtn(0);
// //   memSaveMap();
// //   Game.newGame();
// // });
// // map1Btn.addEventListener("click", () => {
// //   selectMapBtn(1);
// //   memSaveMap();
// //   Game.newGame();
// // });
// // map2Btn.addEventListener("click", () => {
// //   selectMapBtn(2);
// //   memSaveMap();
// //   Game.newGame();
// // });
// // // Toggle the CSS for the associated button and set the internal variable
// // function selectSPBtn() {
// //   mpBtn.classList.remove("selected");
// //   spBtn.classList.add("selected");
// // }
// // function selectMPBtn() {
// //   spBtn.classList.remove("selected");
// //   mpBtn.classList.add("selected");
// // }
// // // Game mode selection event handlers
// // spBtn.addEventListener("click", () => {
// //   selectSPBtn();
// //   Game.startSPGame();
// //   memSaveGameMode();
// // });
// // mpBtn.addEventListener("click", () => {
// //   selectMPBtn();
// //   Game.startMPGame();
// //   memSaveGameMode();
// // });
canvas.addEventListener("mousemove", (e) => {
    if (e.buttons == 1 || e.buttons == 3) {
        let pos = getMousePos(canvas, e);
        let p = toPoint(Math.floor(pos.x / GameMap.tile_size), Math.floor(pos.y / GameMap.tile_size));
        if (GameMap.tooltip === Tooltip.BLOCK)
            GameMap.current.closePoint(p);
        if (GameMap.tooltip === Tooltip.START) {
            GameMap.current.pt_start = p;
        }
        if (GameMap.tooltip === Tooltip.FINISH) {
            GameMap.current.pt_finish = p;
        }
    }
});
// // // Reset Scores event handlers
// // resetSPBtn.addEventListener("click", () => {
// //   memResetHighScores();
// // });
// // resetMPBtn.addEventListener("click", () => {
// //   memResetMPWins();
// // });
// Tooltip Buttons
ttStartBtn.addEventListener("click", () => {
    GameMap.tooltip = Tooltip.START;
});
ttFinishBtn.addEventListener("click", () => {
    GameMap.tooltip = Tooltip.FINISH;
});
// New Search Button
newSearchBtn.addEventListener("click", () => {
    GameMap.newSearch();
});
// Run Search Button
runSearchBtn.addEventListener("click", () => {
    GameMap.current.runSearch();
});
// Clear Search Button
clearSearchBtn.addEventListener("click", () => {
    GameMap.current.clearSearch();
});
//# sourceMappingURL=pathfinding.js.map