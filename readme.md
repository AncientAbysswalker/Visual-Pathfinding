# Visual Pathfinding

## Working Demo

A working demo can be found live here:

https://ancientabysswalker.github.io/Visual-Pathfinding/

## Implementation Outline

A simple implementation and graphical representation of standard search algorithms on an HTML Canvas using TypeScript.

My implementation uses a 2D array of objects (class instances) to track the drawn map. The pathfinding then occurs on top of the map, taking into account the difficulty of the terrain, determining the optimal path based on the search algorithm chosen.

## Search algorithms

I decided to implement each search algorithm in a standardized fashion, with a common function to call that steps the search forward. This fucntion is called by the master Search class that also is repsonsible for interfacing with the canvas. This allows me to draw the traversal of the map in steps the work visually for humans, instead of just drawing everything instantly. This also makes it very easy to implement more algorithms moving forward, and hook them into the current master class.

## Tiles and Dynamic Tiling

I originally was working with very simple tiles while developing this program. At some point I decided I wanted to add some more aesthetics into the mix, and started by making the tiles look nicer, and then realized that I wanted the tiles to interact with each-other based on whether they are adjacent to more of the same type of tile - what I have called Dynamic Tiling. I recalled seeing similar functionality in some game creation softwares (RPG Maker XP) in the past, and this made me wonder how this might be implemented.

Looking at any given tile, the tile is potentially adjacent to up to eight (8) more similar tiles; in order to make a tile for each of these states, a total of 256 (2<sup>8</sup>) unique tiles. This is slightly ridiculous and would result in a "large" image (not really but thinking of the memory space involved in older games), which made me think about ways to optimize this slighly. By splitting the tile into quadrants each quadrant can be defined completely by three of the adjacency checks, which can be stored in the object for minimal storage to reduce time complexity at each draw.

![Splitting tile into quadrants](https://raw.githubusercontent.com/AncientAbysswalker/Visual-Pathfinding/master/md/fig1.png)

Splitting the tile into four (4) subtiles reduces the number of unique tiles to a total of 8 (2<sup>3</sup>) unique subtiles per quadrant, for a total of 32 unique subtiles overall - which is much more manageable. Doing this allows me to arrange a sprite sheet for each quadrant such that the locations of each unique subtile in the sprite sheet is simply the encoding the adjacency checks into the number representation for the three bits.

![Encoding tiles by adjacency](https://raw.githubusercontent.com/AncientAbysswalker/Visual-Pathfinding/master/md/fig2.png)

Finally, the sprite sheets for each of the quadrants can be combined into a single sprite sheet, with the row being correlated directly with the quadrant.

![Full spritesheet](https://raw.githubusercontent.com/AncientAbysswalker/Visual-Pathfinding/master/md/fig3.png)
