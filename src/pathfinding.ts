// Rules Sidebar Elements
const rulesBtn = document.getElementById("rules-btn")! as HTMLButtonElement;
const closeBtn = document.getElementById("close-btn")! as HTMLButtonElement;
const rules = document.getElementById("rules")! as HTMLDivElement;

// Canvas Elements
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// New Search Button
const newSearchBtn = document.getElementById(
  "new-search-btn"
)! as HTMLButtonElement;

// Run Search Button
const runSearchBtn = document.getElementById(
  "run-search-btn"
)! as HTMLButtonElement;

// Clear Search Button
const clearSearchBtn = document.getElementById(
  "clear-search-btn"
)! as HTMLButtonElement;

// Tooltip Buttons
const ttStartBtn = document.getElementById(
  "tt-start-btn"
)! as HTMLButtonElement;
const ttFinishBtn = document.getElementById(
  "tt-finish-btn"
)! as HTMLButtonElement;
const ttWaterBtn = document.getElementById(
  "tt-block-btn"
)! as HTMLButtonElement;
const ttRoadBtn = document.getElementById("tt-road-btn")! as HTMLButtonElement;
const ttForestBtn = document.getElementById(
  "tt-forest-btn"
)! as HTMLButtonElement;
const ttEraserBtn = document.getElementById(
  "tt-eraser-btn"
)! as HTMLButtonElement;
const ttButtons = {
  start: ttStartBtn,
  finish: ttFinishBtn,
  water: ttWaterBtn,
  forest: ttForestBtn,
  road: ttRoadBtn,
  eraser: ttEraserBtn,
};

// Search drop down element
const searchDropDown = document.getElementById(
  "searchDropDown"
)! as HTMLSelectElement;

// Concat the path for sprite images
function spritePath(sprite_name: string) {
  return `img/${sprite_name}.png`;
}

// Create a new tile and set the source
function newTile(sprite_name: string) {
  let img = new Image();

  // Define source
  img.src = spritePath(sprite_name);

  // Return complete image
  return img;
}

// Define Sprites
let s_start = newTile("s_start");
let s_finish = newTile("s_finish");
let s_road = newTile("s_road");
let s_forest = newTile("s_forest");
let s_water = newTile("s_water");

// Allowable types to be placed into the grid
type GridObjects = null | Water | Road | Forest;

// Interface to extend when object has dynamic tiling
interface DynamicTiling {
  adjacent: TilingAdjacency;
}

// Object defining dynamic tiling data
interface TilingAdjacency {
  U: boolean;
  UL: boolean;
  L: boolean;
  DL: boolean;
  D: boolean;
  DR: boolean;
  R: boolean;
  UR: boolean;
}

// Blank object for dynamic tiling data
let blankTilingAdjacency: TilingAdjacency = {
  U: false,
  UL: false,
  L: false,
  DL: false,
  D: false,
  DR: false,
  R: false,
  UR: false,
};

// Returns whether the object at a position is a dynamic tile
function isDynamicTile(o: GridObjects) {
  if (o !== null) {
    return o.hasOwnProperty("adjacent");
  } else {
    return false;
  }
}

// Class implementing water tiles
class Water implements DynamicTiling {
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {}
}

// Class implementing road tiles
class Road implements DynamicTiling {
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {}
}

// Class implementing forest tiles
class Forest implements DynamicTiling {
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {}
}

// Directionality ENUM
enum Dir {
  U = "U",
  D = "D",
  L = "L",
  R = "R",
  UL = "UL",
  UR = "UR",
  DL = "DL",
  DR = "DR",
}

// Bitwise encode for dynamic tiling
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
function dirToVect(dir: Dir): Vector {
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

// Reverse a Dir to the opposite direction
function dirReverse(dir: Dir): Dir {
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

// Interfaces
interface Dimensioned {
  x: number;
  y: number;
}
interface Point extends Dimensioned {}
interface Vector extends Dimensioned {}

// Convert a pair of numbers into a point object
function toPoint(x: number, y: number): Point {
  return { x: x, y: y };
}

// Convert a stringified point into a point object
function strToPt(str: string): Point {
  return {
    x: +str.substring(str.lastIndexOf("x:") + 2, str.lastIndexOf(",")),
    y: +str.substring(str.lastIndexOf("y:") + 2, str.lastIndexOf("}")),
  };
}

// Convert a point object into a string
function ptToStr(p: Point) {
  return `{x: ${p.x}, y: ${p.y}}`;
}

// Sum two dimensioned objects
function addDimensioned(p1: Dimensioned, p2: Dimensioned): Dimensioned {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

// Calculate the euclidean distance between two points
function euclideanDistance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Calculate the manhattan distance between two points
function manhattanDistance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

// Determine if two points are identical
function samePoint(p1: Point, p2: Point) {
  if (!p1 || !p2) {
    return false;
  }
  return p1.x === p2.x && p1.y === p2.y;
}

// Return adjacent points in the 4 cardinal directions
function stdAdjacencies(p: Point) {
  return [
    addDimensioned(p, dirToVect(Dir.U)),
    addDimensioned(p, dirToVect(Dir.D)),
    addDimensioned(p, dirToVect(Dir.L)),
    addDimensioned(p, dirToVect(Dir.R)),
  ];
}

// indexOf function that handles Points
function indexOfPt(arr, o) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x == o.x && arr[i].y == o.y) {
      return i;
    }
  }
  return -1;
}

// Enum of available tooltips
enum Tooltip {
  ERASE,
  WATER,
  START,
  FINISH,
  ROAD,
  FOREST,
}

// Enum of available searches
enum Search {
  DIJKSTRA = "Dijkstra",
  ASTAR = "A*",
  GBFS = "Greedy Best-First",
}

// Fucntion to populate the list of available searches
function populateSearchList() {
  for (var search of Object.values(Search)) {
    var el = document.createElement("option");
    el.textContent = search;
    el.value = search;
    searchDropDown.appendChild(el);
  }
}

// Class that inplements search instances
class SearchMap {
  // Map parameters
  static current: SearchMap;
  grid: GridObjects[][];
  static tile_size = 16;
  static cols = 50;
  static rows = 25;

  // Difficulties
  static difficultyStandard = 5;
  static difficultyForest = 5;

  // Search variables
  static selected_search = Search.DIJKSTRA;
  current_search;
  adjacency_list: { [key: string]: Point[] };
  traversed: string[] = [];
  current_traverse: Point;
  final_path: Point[] = [];
  pt_start: Point = undefined;
  pt_finish: Point = undefined;

  // Update and render variables
  cycle_step = 0;
  is_complete = false;
  start_search = false;

  // Tooltip
  static tooltip = Tooltip.WATER;

  // Create new search map instance
  static newSearch() {
    if (!SearchMap.current) {
      SearchMap.current = new SearchMap();
      SearchMap.update();
    } else {
      SearchMap.current = new SearchMap();
    }
  }

  // Constructor
  private constructor() {
    this.genAdjacency();
    this.genGrid();
  }

  // Run current search instance based on selection
  runSearch() {
    if (this.pt_start && this.pt_finish) {
      // Reset drawn path
      this.clearSearch();

      // Start Search
      this.cycle_step = 0;
      this.start_search = true;

      this.current_search = SearchMap.chosenAlgo(this.pt_start, this.pt_finish);
    }
  }

  // Clear and reset current search
  clearSearch() {
    // Reset pathfinding
    this.traversed = [];
    this.current_traverse = undefined;
    this.final_path = [];
    this.is_complete = false;

    // Stop searching
    this.start_search = false;
  }

  // Instantiate search algorithm based on selection
  static chosenAlgo(start: Point, finish: Point) {
    if (SearchMap.selected_search === Search.DIJKSTRA) {
      return new Dijkstra(start, finish);
    } else if (SearchMap.selected_search === Search.ASTAR) {
      return new AStar(start, finish);
    } else if (SearchMap.selected_search === Search.GBFS) {
      return new GreedyBFS(start, finish);
    }
  }

  // Return if the point is within the canvas
  static withinCanvas(p: Point) {
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

  // Get the difficulty at a location
  difficulty(p: Point) {
    let obj = this.getGrid(p);

    if (obj === null) {
      return SearchMap.difficultyStandard;
    } else if (obj instanceof Road) {
      return 1;
    } else if (obj instanceof Forest) {
      return SearchMap.difficultyStandard + SearchMap.difficultyForest;
    }
  }

  // Set object at grid location
  private setGrid(p: Point, o: GridObjects) {
    this.grid[p.x][p.y] = o;
  }

  // Get object at grid location
  private getGrid(p: Point) {
    return this.grid[p.x][p.y];
  }

  // Get object at location adjacent to a point
  private getGridAdjacent(p: Point, dir: Dir) {
    let p_adj = addDimensioned(p, dirToVect(dir));
    if (!SearchMap.withinCanvas(p_adj)) return null;
    return this.getGrid(p_adj);
  }

  // Update internal state based on the current point being observed
  setCurrentSearchPosition(p: Point) {
    if (!this.traversed.includes(ptToStr(p))) {
      this.traversed.push(ptToStr(p));
    }
    this.current_traverse = p;
  }

  // Make a point impassible
  closePoint(p: Point) {
    // Set point to be solid
    this.adjacency_list[ptToStr(p)] = [];

    // Remove entry from adjacency of adjacent points
    for (let p_adj of stdAdjacencies(p)) {
      if (SearchMap.withinCanvas(p_adj)) {
        let a = this.adjacency_list[ptToStr(p_adj)];
        if (indexOfPt(a, p) > -1) {
          a.splice(indexOfPt(a, p), 1);
        }
      }
    }
  }
  // }

  // Clear position of any object
  clearPosition(p: Point) {
    let obj = this.getGrid(p);

    // If the position is not already clear
    if (obj !== null) {
      // Remove dynamic tiling around this position and clear this position
      this.clearDynamicTiling(p);
      this.setGrid(p, null);

      // Add entry from adjacency of adjacent points
      this.adjacency_list[ptToStr(p)] = [];
      for (let p_adj of stdAdjacencies(p)) {
        if (
          SearchMap.withinCanvas(p_adj) &&
          !(this.getGrid(p_adj) instanceof Water)
        ) {
          this.adjacency_list[ptToStr(p)].push(p_adj);
          this.adjacency_list[ptToStr(p_adj)].push(p);
        }
      }
    }
  }

  // Clear any adjacencies for dynamic tiles around point p
  clearDynamicTiling(p: Point) {
    let obj = this.getGrid(p);

    // If the object at p is a dynamic tile, clear adjacent adjacencies
    if (isDynamicTile(obj)) {
      for (var _dir of Object.keys(Dir)) {
        let dir = Dir[_dir];
        let obj_adj = this.getGridAdjacent(p, dir);

        // Clear adjacent adjacencies if same class
        if (obj_adj !== null && obj.constructor === obj_adj.constructor) {
          // @ts-ignore - Will always have property 'adjacent' given above logic
          obj_adj.adjacent[dirReverse(dir)] = false;
        }
      }
    }
  }

  // Place a new Road tile
  placeRoad(p: Point) {
    // If the position is not already an instance of this class
    if (!(this.getGrid(p) instanceof Road)) {
      // Remove dynamic tiling around this position and clear this position
      this.clearPosition(p);
      let new_obj = new Road();

      // Create data for dynamic tiling
      for (var _dir of Object.keys(Dir)) {
        let dir = Dir[_dir];
        let p_adj = this.getGridAdjacent(p, dir);

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
  placeForest(p: Point) {
    // If the position is not already an instance of this class
    if (!(this.getGrid(p) instanceof Forest)) {
      // Remove dynamic tiling around this position and clear this position
      this.clearPosition(p);
      let new_obj = new Forest();

      // Create data for dynamic tiling
      for (var _dir of Object.keys(Dir)) {
        let dir = Dir[_dir];
        let p_adj = this.getGridAdjacent(p, dir);

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
  placeWater(p: Point) {
    // If the position is not already an instance of this class
    if (!(this.getGrid(p) instanceof Water)) {
      // Remove dynamic tiling around this position and clear this position
      this.clearPosition(p);
      this.closePoint(p);
      let new_obj = new Water();

      // Create data for dynamic tiling
      for (var _dir of Object.keys(Dir)) {
        let dir = Dir[_dir];
        let p_adj = this.getGridAdjacent(p, dir);

        // If there is an adjacent instance of this class, note this
        if (p_adj instanceof Water) {
          new_obj.adjacent[dir] = true;
          p_adj.adjacent[dirReverse(dir)] = true;
        }
      }

      // Set the position with the new instance
      this.setGrid(p, new_obj);
    }
  }

  // Update canvas loop
  static update() {
    SearchMap.current.draw();

    requestAnimationFrame(SearchMap.update);
  }

  // Draw
  draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    this.drawGrid();
    if (!this.is_complete && this.start_search) {
      this.cycle_step++;
      if (this.cycle_step % 10 === 0) {
        this.is_complete = this.current_search?.takeStep();
        this.cycle_step = 0;
      }
    }

    // Draw the progressive search on top of the grid
    this.drawSearch();

    // Draw start/finish on top
    this.drawTileStart();
    this.drawTileFinish();

    // Draw any completed search on top
    if (this.is_complete) {
      this.drawShortestPath();
    }
  }

  // Draw game_grid on canvas
  drawGrid() {
    for (let i = 0; i < SearchMap.cols; i++) {
      for (let j = 0; j < SearchMap.rows; j++) {
        let obj = this.grid[i][j];
        if (obj instanceof Water) {
          this.drawTileWater(toPoint(i, j));
        } else if (obj instanceof Road) {
          this.drawTileRoad(toPoint(i, j));
        } else if (obj instanceof Forest) {
          this.drawTileForest(toPoint(i, j));
        }
      }
    }
  }

  // Draw currently traversed points on the map
  drawSearch() {
    for (let p of this.traversed) {
      this.drawTileSolidColor(strToPt(p), "#ffff00");
    }
    if (!this.is_complete && this.current_traverse) {
      this.drawTileSolidColor(this.current_traverse, "#000000");
    }
  }

  // Draw the shortest path as a red arrow
  drawShortestPath() {
    let pt_arr = this.final_path;
    if (pt_arr.length > 1) {
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(pt_arr[0].x * 16 + 8, pt_arr[0].y * 16 + 8);

      // Draw line segments
      for (var i = 1; i < pt_arr.length; i++) {
        ctx.lineTo(pt_arr[i].x * 16 + 8, pt_arr[i].y * 16 + 8);
      }
      ctx.stroke();
      ctx.closePath();
      let p1 = pt_arr[pt_arr.length - 1];
      let p2 = pt_arr[pt_arr.length - 2];

      // Draw arrow head
      ctx.save();
      ctx.beginPath();
      ctx.translate(16 * p1.x + 8, 16 * p1.y + 8);
      ctx.rotate(
        Math.atan((p2.y - p1.y) / (p2.x - p1.x)) +
          ((p1.x > p2.x ? 90 : -90) * Math.PI) / 180
      );
      ctx.moveTo(0, 0);
      ctx.lineTo(5, 10);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.restore();
      ctx.fill();
    }
  }

  // Draw a tile of solid color
  drawTileSolidColor(p: Point, color: string) {
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.rect(
      SearchMap.tile_size * p.x,
      SearchMap.tile_size * p.y,
      SearchMap.tile_size,
      SearchMap.tile_size
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  // Draw the start tile
  drawTileStart() {
    let p = this.pt_start;

    if (p) {
      ctx.drawImage(
        s_start,
        SearchMap.tile_size * p.x,
        SearchMap.tile_size * p.y
      );
    }
  }

  // Draw the finish tile
  drawTileFinish() {
    let p = this.pt_finish;

    if (p) {
      ctx.drawImage(
        s_finish,
        SearchMap.tile_size * p.x,
        SearchMap.tile_size * p.y
      );
    }
  }

  // Draw a road tile
  drawTileRoad(p: Point) {
    let obj = this.getGrid(p) as Road;

    // Draw the four sub-sprites making up the whole
    for (var i = 0; i < 4; i++) {
      // Shift values to align the subsprite in the whole
      let shift_subsprite_x = i % 3 !== 0 ? 8 : 0;
      let shift_subsprite_y = i >= 2 ? 8 : 0;

      // Draw subsprite
      ctx.drawImage(
        s_road,
        (SearchMap.tile_size / 2) *
          (+obj.adjacent[dynamic_tile_encode[2 * i + 0]] +
            2 * +obj.adjacent[dynamic_tile_encode[2 * i + 1]] +
            4 * +obj.adjacent[dynamic_tile_encode[(2 * i + 2) % 8]]), // See git for explanation
        (i * SearchMap.tile_size) / 2,
        SearchMap.tile_size / 2,
        SearchMap.tile_size / 2,
        shift_subsprite_x + SearchMap.tile_size * p.x,
        shift_subsprite_y + SearchMap.tile_size * p.y,
        SearchMap.tile_size / 2,
        SearchMap.tile_size / 2
      );
    }
  }

  // Draw a water tile
  drawTileWater(p: Point) {
    let obj = this.getGrid(p) as Water;

    // Draw the four sub-sprites making up the whole
    for (var i = 0; i < 4; i++) {
      // Shift values to align the subsprite in the whole
      let shift_subsprite_x = i % 3 !== 0 ? 8 : 0;
      let shift_subsprite_y = i >= 2 ? 8 : 0;

      // Draw subsprite
      ctx.drawImage(
        s_water,
        (SearchMap.tile_size / 2) *
          (+obj.adjacent[dynamic_tile_encode[2 * i + 0]] +
            2 * +obj.adjacent[dynamic_tile_encode[2 * i + 1]] +
            4 * +obj.adjacent[dynamic_tile_encode[(2 * i + 2) % 8]]), // See git for explanation
        (i * SearchMap.tile_size) / 2,
        SearchMap.tile_size / 2,
        SearchMap.tile_size / 2,
        shift_subsprite_x + SearchMap.tile_size * p.x,
        shift_subsprite_y + SearchMap.tile_size * p.y,
        SearchMap.tile_size / 2,
        SearchMap.tile_size / 2
      );
    }
  }

  // Draw a forest tile
  drawTileForest(p: Point) {
    let obj = this.getGrid(p) as Forest;

    // Draw the four sub-sprites making up the whole
    for (var i = 0; i < 4; i++) {
      // Shift values to align the subsprite in the whole
      let shift_subsprite_x = i % 3 !== 0 ? 8 : 0;
      let shift_subsprite_y = i >= 2 ? 4 : -8;

      // Draw subsprite
      ctx.drawImage(
        s_forest,
        (SearchMap.tile_size / 2) *
          (+obj.adjacent[dynamic_tile_encode[2 * i + 0]] +
            2 * +obj.adjacent[dynamic_tile_encode[2 * i + 1]] +
            4 * +obj.adjacent[dynamic_tile_encode[(2 * i + 2) % 8]]), // See git for explanation
        i * 12,
        SearchMap.tile_size / 2,
        12,
        shift_subsprite_x + SearchMap.tile_size * p.x,
        shift_subsprite_y + SearchMap.tile_size * p.y,
        SearchMap.tile_size / 2,
        12
      );
    }
  }
}

// Dijkstra search algorithm class
class Dijkstra {
  nodes: PriorityQueue;
  distances: { [key: string]: number } = {};
  previous: { [key: string]: null | string } = {};

  start: string;
  finish: string;
  smallest: string;

  path: Point[] = []; // Path to return

  // Constructor
  constructor(start: Point, finish: Point) {
    this.nodes = new PriorityQueue();
    this.start = ptToStr(start);
    this.finish = ptToStr(finish);

    //Build up initial state
    for (let p in SearchMap.current.adjacency_list) {
      if (p === this.start) {
        this.distances[p] = 0;
        this.nodes.enqueue(p, 0);
      } else {
        this.distances[p] = Infinity;
        this.nodes.enqueue(p, Infinity);
      }
      this.previous[p] = null;
    }
  }

  // Incrementally look at one more node to
  takeStep() {
    // As long as there is something to visit
    if (this.nodes.values.length) {
      this.smallest = this.nodes.dequeue().val;

      // End searching if all remaining nodes are infinitely far from the start
      if (this.distances[this.smallest] === Infinity) {
        return true;
      }

      // Push this step into the list of traversed points and check if we are finished
      SearchMap.current.setCurrentSearchPosition(strToPt(this.smallest));
      if (this.smallest === this.finish) {
        // Build up final path
        while (this.previous[this.smallest]) {
          this.path.push(strToPt(this.smallest));
          this.smallest = this.previous[this.smallest];
        }

        // Tell current search controller instance what the final path is and return that we are complete
        SearchMap.current.final_path = this.path
          .concat(strToPt(this.smallest))
          .reverse();
        return true;
      }

      // If we have a normal, not infinitely far node to look at
      if (this.smallest || this.distances[this.smallest] !== Infinity) {
        for (let neighbor in SearchMap.current.adjacency_list[this.smallest]) {
          // Get neighboring node
          let next_node =
            SearchMap.current.adjacency_list[this.smallest][neighbor];
          // Calculate new distance to neighboring node
          let candidate =
            this.distances[this.smallest] +
            SearchMap.current.difficulty(next_node);

          // If this distance candidate is better than what we are already storing;
          if (candidate < this.distances[ptToStr(next_node)]) {
            // Updating new smallest distance to neighbor
            this.distances[ptToStr(next_node)] = candidate;
            // Updating previous - How we got to neighbor
            this.previous[ptToStr(next_node)] = this.smallest;
            // Enqueue in priority queue with new priority
            this.nodes.enqueue(ptToStr(next_node), candidate);
          }
        }
        return false;
      }
    } else {
      // If nothing left to visit,
      SearchMap.current.final_path = this.path
        .concat(strToPt(this.smallest))
        .reverse();
      return true;
    }
  }
}

// A* search algorithm class
class AStar {
  nodes: PriorityQueue;
  arr_f: { [key: string]: number } = {}; // g+h
  arr_g: { [key: string]: number } = {}; // Distance
  arr_h: { [key: string]: number } = {}; // Heuristic
  previous: { [key: string]: null | string } = {};

  start: string;
  finish: string;
  smallest: string;

  path: Point[] = []; // Path to return

  // Constructor
  constructor(start: Point, finish: Point) {
    this.nodes = new PriorityQueue();
    this.start = ptToStr(start);
    this.finish = ptToStr(finish);

    //Build up initial state
    for (let p in SearchMap.current.adjacency_list) {
      if (p === this.start) {
        this.arr_g[p] = 0;
        this.arr_f[p] = 0;
        this.arr_h[p] = 0;
        this.nodes.enqueue(p, 0);
      } else {
        this.arr_g[p] = Infinity;
        this.arr_h[p] = manhattanDistance(strToPt(p), finish);
        this.arr_f[p] = Infinity;
        this.nodes.enqueue(p, Infinity);
      }
      this.previous[p] = null;
    }
  }

  // Incrementally look at one more node to
  takeStep() {
    // As long as there is something to visit
    if (this.nodes.values.length) {
      this.smallest = this.nodes.dequeue().val;

      // End searching if all remaining nodes are infinitely far from the start
      if (this.arr_g[this.smallest] === Infinity) {
        return true;
      }

      // Push this step into the list of traversed points and check if we are finished
      SearchMap.current.setCurrentSearchPosition(strToPt(this.smallest));
      if (this.smallest === this.finish) {
        // Build up final path
        while (this.previous[this.smallest]) {
          this.path.push(strToPt(this.smallest));
          this.smallest = this.previous[this.smallest];
        }

        // Tell current search controller instance what the final path is and return that we are complete
        SearchMap.current.final_path = this.path
          .concat(strToPt(this.smallest))
          .reverse();
        return true;
      }

      // If we have a normal, not infinitely far node to look at
      if (this.smallest || this.arr_g[this.smallest] !== Infinity) {
        for (let neighbor in SearchMap.current.adjacency_list[this.smallest]) {
          // Get neighboring node
          let next_node =
            SearchMap.current.adjacency_list[this.smallest][neighbor];
          // Calculate new distance to neighboring node
          let candidate_f =
            this.arr_g[this.smallest] +
            SearchMap.current.difficulty(next_node) +
            this.arr_h[ptToStr(next_node)];

          // If this distance candidate is better than what we are already storing;
          if (candidate_f < this.arr_f[ptToStr(next_node)]) {
            // Updating new smallest f to neighbor
            this.arr_f[ptToStr(next_node)] = candidate_f;
            // Updating new smallest g to neighbor
            this.arr_g[ptToStr(next_node)] =
              this.arr_g[this.smallest] +
              SearchMap.current.difficulty(next_node);

            // Updating previous - How we got to neighbor
            this.previous[ptToStr(next_node)] = this.smallest;
            // Enqueue in priority queue with new priority
            this.nodes.enqueue(ptToStr(next_node), candidate_f);
          }
        }
        return false;
      }
    } else {
      // If nothing left to visit,
      SearchMap.current.final_path = this.path
        .concat(strToPt(this.smallest))
        .reverse();
      return true;
    }
  }
}

// Greedy best-first search algorithm class
class GreedyBFS {
  nodes: PriorityQueue;
  arr_g: { [key: string]: number } = {}; // Distance
  arr_h: { [key: string]: number } = {}; // Heuristic
  previous: { [key: string]: null | string } = {};

  start: string;
  finish: string;
  smallest: string;

  path: Point[] = []; // Path to return

  // Constructor
  constructor(start: Point, finish: Point) {
    this.nodes = new PriorityQueue();
    this.start = ptToStr(start);
    this.finish = ptToStr(finish);

    //Build up initial state
    for (let p in SearchMap.current.adjacency_list) {
      if (p === this.start) {
        this.arr_g[p] = 0;
        //this.arr_f[p] = 0;
        this.arr_h[p] = 0;
        this.nodes.enqueue(p, 0);
      } else {
        this.arr_g[p] = Infinity;
        this.arr_h[p] = manhattanDistance(strToPt(p), finish);
        this.nodes.enqueue(p, Infinity);
      }
      this.previous[p] = null;
    }
  }

  // Incrementally look at one more node to
  takeStep() {
    // As long as there is something to visit
    if (this.nodes.values.length) {
      this.smallest = this.nodes.dequeue().val;

      // End searching if all remaining nodes are infinitely far from the start
      if (this.arr_g[this.smallest] === Infinity) {
        return true;
      }

      // Push this step into the list of traversed points and check if we are finished
      SearchMap.current.setCurrentSearchPosition(strToPt(this.smallest));
      if (this.smallest === this.finish) {
        // Build up final path
        while (this.previous[this.smallest]) {
          this.path.push(strToPt(this.smallest));
          this.smallest = this.previous[this.smallest];
        }

        // Tell current search controller instance what the final path is and return that we are complete
        SearchMap.current.final_path = this.path
          .concat(strToPt(this.smallest))
          .reverse();
        return true;
      }

      // If we have a normal, not infinitely far node to look at
      if (this.smallest || this.arr_g[this.smallest] !== Infinity) {
        for (let neighbor in SearchMap.current.adjacency_list[this.smallest]) {
          // Get neighboring node
          let next_node =
            SearchMap.current.adjacency_list[this.smallest][neighbor];
          // Calculate new distance to neighboring node
          let candidate_h = this.arr_h[ptToStr(next_node)];

          // If this distance candidate is better than what we are already storing;
          if (
            this.arr_g[this.smallest] +
              SearchMap.current.difficulty(next_node) <
            this.arr_g[ptToStr(next_node)]
          ) {
            // Updating new smallest g to neighbor
            this.arr_g[ptToStr(next_node)] =
              this.arr_g[this.smallest] +
              SearchMap.current.difficulty(next_node);

            // Updating previous - How we got to neighbor
            this.previous[ptToStr(next_node)] = this.smallest;
            // Enqueue in priority queue with new priority
            this.nodes.enqueue(ptToStr(next_node), candidate_h);
          }
        }
        return false;
      }
    } else {
      // If nothing left to visit,
      SearchMap.current.final_path = this.path
        .concat(strToPt(this.smallest))
        .reverse();
      return true;
    }
  }
}

// Binary heap implementation of Priority Queue for Searches
class PriorityQueue {
  values: PriorityNode[];

  // Constructor
  constructor() {
    this.values = [];
  }

  // Enqueue a new priority item
  enqueue(val: string, priority: number) {
    let newNode = new PriorityNode(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }

  // Move a new priority item to its correct position
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  // Dequeue a priority item and return it
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }

  // Move priority items to correct position after removing one
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
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

// A priority node containing the value of the item and its priority
class PriorityNode {
  val: string;
  priority: number;

  // Constructor
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}

// JS Main
SearchMap.newSearch();
populateSearchList();

// Get the current mouse position within the canvas
function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

// Register mouse actions for handling tooltips
function register_mouse_action(e: MouseEvent) {
  if (!SearchMap.current.start_search) {
    let pos = getMousePos(canvas, e);
    let p = toPoint(
      Math.floor(pos.x / SearchMap.tile_size),
      Math.floor(pos.y / SearchMap.tile_size)
    );

    // Left-click utilizes tooltip
    if (e.buttons == 1 || e.buttons == 3) {
      // Only register commands within canvas
      if (SearchMap.withinCanvas(p)) {
        switch (SearchMap.tooltip) {
          case Tooltip.WATER:
            SearchMap.current.placeWater(p);
            break;
          case Tooltip.ERASE:
            SearchMap.current.clearPosition(p);
            break;
          case Tooltip.FOREST:
            SearchMap.current.placeForest(p);
            break;
          case Tooltip.ROAD:
            SearchMap.current.placeRoad(p);
            break;
          case Tooltip.START:
            SearchMap.current.pt_start = p;
            break;
          case Tooltip.FINISH:
            SearchMap.current.pt_finish = p;
            break;
          default:
            break;
        }
      }
      // Eraser is bound to right-click
    } else if (e.buttons == 2) {
      SearchMap.current.clearPosition(p);
    }
  }
}

// Handle mouse actions based on moving mouse
canvas.addEventListener("mousemove", (e) => {
  register_mouse_action(e);
});

// Handle mouse actions based on clicking mouse
canvas.addEventListener("mousedown", (e) => {
  register_mouse_action(e);
});

// Prevent context menu if right-clicking canvas
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Toggle the CSS for the associated button and set the internal variable
function selectTTBtn(key: string) {
  for (let btn of Object.values(ttButtons)) {
    btn.classList.remove("selected");
  }
  ttButtons[key].classList.add("selected");
}

// Tooltip Buttons
ttStartBtn.addEventListener("click", () => {
  selectTTBtn("start");
  SearchMap.tooltip = Tooltip.START;
});
ttFinishBtn.addEventListener("click", () => {
  selectTTBtn("finish");
  SearchMap.tooltip = Tooltip.FINISH;
});
ttWaterBtn.addEventListener("click", () => {
  selectTTBtn("water");
  SearchMap.tooltip = Tooltip.WATER;
});
ttRoadBtn.addEventListener("click", () => {
  selectTTBtn("road");
  SearchMap.tooltip = Tooltip.ROAD;
});
ttForestBtn.addEventListener("click", () => {
  selectTTBtn("forest");
  SearchMap.tooltip = Tooltip.FOREST;
});
ttEraserBtn.addEventListener("click", () => {
  selectTTBtn("eraser");
  SearchMap.tooltip = Tooltip.ERASE;
});

// Select Search
searchDropDown.addEventListener("change", (e) => {
  SearchMap.selected_search = searchDropDown.value as Search;
});
// New Search Button
newSearchBtn.addEventListener("click", () => {
  SearchMap.newSearch();
});
// Run Search Button
runSearchBtn.addEventListener("click", () => {
  SearchMap.current.runSearch();
});
// Clear Search Button
clearSearchBtn.addEventListener("click", () => {
  SearchMap.current.clearSearch();
});

// Rules and close event handlers
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});
