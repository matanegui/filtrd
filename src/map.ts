const MAP_X: number = 0;
const MAP_Y: number = 0;
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 18;
const BASE_TILE_SIZE: number = 8;
const TILES: any = [];

//Build tiles map
//Flag strings: '[solid][freezing_walkable]'
for (let i = 2; i <= 15; i++) {
    TILES[i] = { id: i, flag_string: '10' };
    TILES[16 + i] = { id: 16 + i, flag_string: '10' };
}
    TILES[36] = { id: 36, flag_string: '01' };

const draw_map: (remap: any) => void = (remap) => {
    map(MAP_X, MAP_Y, MAP_WIDTH, MAP_HEIGHT, 0, 0, 0, 1, remap);
};

// Get tile at pixel coordinates
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
        flags.freezing_walkable = flag_string.charAt(1) === '1';
    }
    tile.flags = flags;
    tile.box = { x: Math.floor((x - MAP_X) / BASE_TILE_SIZE) * BASE_TILE_SIZE, y: Math.floor((x - MAP_X) / BASE_TILE_SIZE) * BASE_TILE_SIZE, w: 8, h: 8 };

    return tile;

}

const get_tiles_in_rect: (x: number, y: number, w: number, h: number) => any[] = (x, y, w, h) => {
    const tiles: any[] = [];
    const extra_x = w % BASE_TILE_SIZE + Math.floor(x) % BASE_TILE_SIZE;
    const extra_y = h % BASE_TILE_SIZE + Math.floor(y) % BASE_TILE_SIZE;
    const tiles_x = Math.floor(w / BASE_TILE_SIZE) + (extra_x > 0 ? (extra_x > BASE_TILE_SIZE ? 2 : 1) : 0);
    const tiles_y = Math.floor(h / BASE_TILE_SIZE) + (extra_y > 0 ? (extra_y > BASE_TILE_SIZE ? 2 : 1) : 0);
    for (let i = 0; i < tiles_x; i++) {
        for (let j = 0; j < tiles_y; j++) {
            const tile = get_tile(x + i * BASE_TILE_SIZE, y + j * BASE_TILE_SIZE);
            tiles.push(tile);
        }
    }
    return tiles;
}