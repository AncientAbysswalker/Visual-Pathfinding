// Rules Sidebar Elements
const rulesBtn = document.getElementById("rules-btn")! as HTMLButtonElement;
const closeBtn = document.getElementById("close-btn")! as HTMLButtonElement;
const rules = document.getElementById("rules")! as HTMLDivElement;

// Canvas Elements
const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Map Selection Elements
const map0Btn = document.getElementById("map0img")! as HTMLImageElement;
const map1Btn = document.getElementById("map1img")! as HTMLImageElement;
const map2Btn = document.getElementById("map2img")! as HTMLImageElement;
const mapBtns = [map0Btn, map1Btn, map2Btn];

// Game Mode Selection Elements
const spBtn = document.getElementById("sp-img")! as HTMLImageElement;
const mpBtn = document.getElementById("mp-img")! as HTMLImageElement;

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
const ttBlockBtn = document.getElementById(
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
  water: ttBlockBtn,
  forest: ttForestBtn,
  road: ttRoadBtn,
  eraser: ttEraserBtn,
};

// Search drop down element
const searchDropDown = document.getElementById(
  "searchDropDown"
)! as HTMLSelectElement;

// Difficulty Sliders
const sliderForest = document.getElementById("myRange")! as HTMLInputElement;
const sliderRoad = document.getElementById("myRange2")! as HTMLInputElement;

const error = document.getElementById("error")! as HTMLElement;

// Reset Scores Button Elements
const resetSPBtn = document.getElementById(
  "reset-sp-score-btn"
)! as HTMLButtonElement;
const resetMPBtn = document.getElementById(
  "reset-mp-score-btn"
)! as HTMLButtonElement;

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

type GridObjects = null | boolean | Block | Road | Forest;

interface HasSpriteSheet {
  subsprite: number;
}

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

//
function isDynamicTile(o: GridObjects) {
  if (o !== null) {
    return o.hasOwnProperty("adjacent");
  } else {
    return false;
  }
}

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

class Block implements HasSpriteSheet, DynamicTiling {
  subsprite: number;
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {
    this.subsprite = 0;
  }
}

class Road implements HasSpriteSheet, DynamicTiling {
  subsprite: number;
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {
    this.subsprite = 0;
  }
}

class Forest implements HasSpriteSheet, DynamicTiling {
  subsprite: number;
  adjacent: TilingAdjacency = { ...blankTilingAdjacency };

  constructor() {
    this.subsprite = 0;
  }
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
function stringToPoint(str: string): Point {
  return {
    x: +str.substring(str.lastIndexOf("x:") + 2, str.lastIndexOf(",")),
    y: +str.substring(str.lastIndexOf("y:") + 2, str.lastIndexOf("}")),
  };
}

// Convert a point object into a string
function ptToStr(p: Point) {
  return `{x: ${p.x}, y: ${p.y}}`;
}

function addDimensioned(p1: Dimensioned, p2: Dimensioned): Dimensioned {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

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

function myIndexOf(arr, o) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x == o.x && arr[i].y == o.y) {
      return i;
    }
  }
  return -1;
}

enum Tooltip {
  ERASE,
  BLOCK,
  START,
  FINISH,
  ROAD,
  FOREST,
}

enum Search {
  DIJKSTRA = "Dijkstra",
  ASTAR = "A*",
  GBFS = "Greedy BFS",
}

//searchDropDown
function populateSearchList() {
  for (var search of Object.values(Search)) {
    var el = document.createElement("option");
    el.textContent = search;
    el.value = search;
    searchDropDown.appendChild(el);
  }
}

class SearchMap {
  // Map parameters
  static current: SearchMap;
  grid: GridObjects[][];
  static tile_size = 16;
  static cols = 100;
  static rows = 50;

  // Difficulties
  static difficultyStandard = 6;
  static difficultyForest = 6;

  // Search variables
  static selected_search = Search.DIJKSTRA;
  current_search;
  adjacency_list: { [key: string]: Point[] };
  traversed: Point[] = [];
  final_path: Point[] = [];
  pt_start: Point = undefined;
  pt_finish: Point = undefined;

  // Update and render variables
  cycle_step = 0;
  is_complete = false;
  start_search = false;

  // Tooltip
  static tooltip = Tooltip.BLOCK;

  // To Remove
  static id = 0;
  id: number;

  // Create new search map instance
  static newSearch() {
    console.log("new_S");
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
    // SearchMap.id++;
    // this.id = SearchMap.id;

    //this.pt_start = { x: 0, y: 0 };
    //this.pt_finish = { x: 5, y: 5 };
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
    } else {
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

  static chosenAlgo(start: Point, finish: Point) {
    if (SearchMap.selected_search === Search.DIJKSTRA) {
      return new Dijkstra(ptToStr(start), ptToStr(finish));
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

  private setGrid(p: Point, o: GridObjects) {
    this.grid[p.x][p.y] = o;
  }

  private getGrid(p: Point) {
    return this.grid[p.x][p.y];
  }

  private getGridAdjacent(p: Point, dir: Dir) {
    let p_adj = addDimensioned(p, dirToVect(dir));
    if (!SearchMap.withinCanvas(p_adj)) return null;
    return this.getGrid(p_adj);
  }

  // Make a point impassible
  closePoint(p: Point) {
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
          !(this.getGrid(p_adj) instanceof Block)
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
    if (!(this.getGrid(p) instanceof Block)) {
      // Remove dynamic tiling around this position and clear this position
      this.clearPosition(p);
      this.closePoint(p);
      let new_obj = new Block();

      // Create data for dynamic tiling
      for (var _dir of Object.keys(Dir)) {
        let dir = Dir[_dir];
        let p_adj = this.getGridAdjacent(p, dir);

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
        if (obj instanceof Block) {
          this.drawTileSolidColor(toPoint(i, j), "#B6FDFF");
        } else if (obj instanceof Road) {
          this.drawTileRoad(toPoint(i, j));
        } else if (obj instanceof Forest) {
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

  draw222Path() {
    for (let p of this.final_path) {
      this.drawTileSolidColor(p, "#f00");
    }
  }

  drawShortestPath() {
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
      ctx.lineTo(
        p1.x * 16 + 8 - headlen * Math.cos(angle - Math.PI / 6),
        p1.y * 16 + 8 - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        p1.x * 16 + 8 - headlen * Math.cos(angle + Math.PI / 6),
        p1.y * 16 + 8 - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.lineTo(p1.x * 16 + 8, p1.y * 16 + 8);
      ctx.stroke();
      ctx.closePath();
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
}

class Dijkstra {
  nodes: PriorityQueue;
  distances: { [key: string]: number } = {};
  previous: { [key: string]: null | string } = {};

  start: string;
  finish: string;
  smallest = null;

  path: Point[] = []; // Path to return

  constructor(start: string, finish: string) {
    this.nodes = new PriorityQueue();
    this.start = start;
    this.finish = finish;

    //build up initial state
    for (let vertex in SearchMap.current.adjacency_list) {
      if (vertex === start) {
        this.distances[vertex] = 0;
        this.nodes.enqueue(vertex, 0);
      } else {
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
          let nextNode =
            SearchMap.current.adjacency_list[this.smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate =
            this.distances[this.smallest] +
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
    } else {
      SearchMap.current.final_path = this.path
        .concat(stringToPoint(this.smallest))
        .reverse();
      return true;
    }
  }
}

class PriorityQueue {
  values: priorityNode[];

  constructor() {
    this.values = [];
  }
  enqueue(val: string, priority: number) {
    let newNode = new priorityNode(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
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

class priorityNode {
  val: Point;
  priority: number;

  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}

// JS Main
SearchMap.newSearch();
populateSearchList();

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function clk(e: MouseEvent) {
  if (!SearchMap.current.start_search) {
    let pos = getMousePos(canvas, e);
    let p = toPoint(
      Math.floor(pos.x / SearchMap.tile_size),
      Math.floor(pos.y / SearchMap.tile_size)
    );
    //console.log(p);
    if (e.buttons == 1 || e.buttons == 3) {
      if (SearchMap.withinCanvas(p)) {
        if (SearchMap.tooltip === Tooltip.BLOCK)
          SearchMap.current.placeWater(p);
        if (SearchMap.tooltip === Tooltip.ERASE)
          SearchMap.current.clearPosition(p);
        if (SearchMap.tooltip === Tooltip.ROAD) SearchMap.current.placeRoad(p);
        if (SearchMap.tooltip === Tooltip.FOREST)
          SearchMap.current.placeForest(p);
        if (SearchMap.tooltip === Tooltip.START) {
          SearchMap.current.pt_start = p;
        }
        if (SearchMap.tooltip === Tooltip.FINISH) {
          SearchMap.current.pt_finish = p;
        }
      }
    } else if (e.buttons == 2) {
      SearchMap.current.clearPosition(p);
    }
  }
}

// Show input error message
function showError(message: string) {
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

// Toggle the CSS for the associated button and set the internal variable
function selectMapBtn(key: string) {
  for (let btn of Object.values(ttButtons)) {
    btn.classList.remove("selected");
  }
  ttButtons[key].classList.add("selected");
}

// Tooltip Buttons
ttStartBtn.addEventListener("click", () => {
  selectMapBtn("start");
  SearchMap.tooltip = Tooltip.START;
});
ttFinishBtn.addEventListener("click", () => {
  selectMapBtn("finish");
  SearchMap.tooltip = Tooltip.FINISH;
});
ttBlockBtn.addEventListener("click", () => {
  selectMapBtn("water");
  SearchMap.tooltip = Tooltip.BLOCK;
});
ttRoadBtn.addEventListener("click", () => {
  selectMapBtn("road");
  SearchMap.tooltip = Tooltip.ROAD;
});
ttForestBtn.addEventListener("click", () => {
  selectMapBtn("forest");
  SearchMap.tooltip = Tooltip.FOREST;
});
ttEraserBtn.addEventListener("click", () => {
  selectMapBtn("eraser");
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
  console.log(SearchMap.current.adjacency_list);
});
// Clear Search Button
clearSearchBtn.addEventListener("click", () => {
  SearchMap.current.clearSearch();
});

// Difficulty Sliders
sliderRoad.addEventListener("change", (e) => {
  SearchMap.difficultyStandard = +sliderRoad.value;
});
sliderForest.addEventListener("change", (e) => {
  SearchMap.difficultyForest = +sliderForest.value;
});
