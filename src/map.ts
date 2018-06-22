const MAP_X: number = 0;
const MAP_Y: number = 0;
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 18;
const BASE_TILE_SIZE: number = 8;
const TILES: any = [];

//Build tiles map
//Flag strings: '[solid]'
for (let i = 1; i <= 12; i++) {
    const tile: any = {
        id: i,
        flag_string: '1'
    }
    TILES[i] = tile;
    TILES[16 + i] = tile;
}

const draw_map: () => void = () => {
    map(MAP_X, MAP_Y, MAP_WIDTH, MAP_HEIGHT, 0, 0);
};

const get_tile: (x: number, y: number) => any = (x, y) => {
    const map_x: number = Math.floor((x - MAP_X) / BASE_TILE_SIZE);
    const map_y: number = Math.floor((y - MAP_Y) / BASE_TILE_SIZE);
    const tile_number = mget(map_x, map_y);
    const flags: any = {
        solid: false
    }
    const tile = TILES[tile_number] || {};
    const flag_string = tile.flag_string;
    if (flag_string) {
        flags.solid = flag_string.charAt(0) === '1';
    }
    tile.flags = flags;
    return tile;
}