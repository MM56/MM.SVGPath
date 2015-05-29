# MM.SVGPath

MM.SVGPath provides utils functions for manipulating a SVG path.

## API

### Static methods

#### `MM.SVGPath.parse(pathStr)`

Parse a path string and returns an array with objects that contain a command letter and the parameters that come with.

#### `MM.SVGPath.getAngleFromDistanceRatio(path, ratio)`

Returns the angle for a point that follows the `path`. That point is defined by the parameter `ratio` that depends on the path total length (the distance).

### Constructor

#### `MM.SVGPath(pathStr)`

Creates a SVGPath instance from a path string. It automatically parses the string and store the commands.

### Methods

#### `cloneCommands(commandsToBeCloned)`

Clones commands that are passed in parameters

#### `scale(scaleXRatio, scaleYRatio, scaleOrigin)`

Scales a path by calculating the new coordinates of each command. The `scaleOrigin` parameter is used as the pivot point for the scale transformation.

#### `toString()`

Returns the commands as a string. It is used for reinjecting it into the path `d` attribute.


## Browser support

It has been tested on latest browsers and IE >= 9.

## Improvements

* Create utils for [pixi.js](http://www.pixijs.com/), canvas...