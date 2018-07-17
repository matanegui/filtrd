# Running
Requires:
- TIC-80 globally available through the `tic80` command
- [tic80-typescript](https://github.com/scambier/tic80-typescript) available through the `tsc80` command
- Typescript globally installed
- TSC80 custom settings for further optimization:

**tic80-typescript.js (compressAndLaunch function)**
```
...
mangle: {
    toplevel: true,
    properties: true,
    reserved: ['TIC']
}
...
```

# Notes

## Filters
All filter definitions so I can save them somewhere else:
```
    dungeon: [[32, 29, 36], [103, 89, 122], [207, 232, 173], [230, 85, 125]],
    chill: [[2, 28, 39], [2, 128, 144], [240, 243, 189], [224, 202, 60]],
    roast: [[42, 3, 1], [145, 23, 31], [227, 192, 211], [245, 203, 92]],
    mellow: [[181, 131, 141], [255, 205, 178], [50, 48, 54], [255, 180, 162]]
```

## Mechanics

## Ideas
- *Palette switching* can actually be the game's objective. Switch palettes to get game objects (props, enemies, player movement) differently.

# WIP
Collission when walking: jsut a funciton in the `map` that you give a rect to and returns a list of all tiles in that rect, check for collision on any of those