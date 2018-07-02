const TILE_SIZE: number = 8;
const TILES: any = [];

const create_tilemap: (x: number, y:number, width: number, height:number) => any = (x,y,width,height) => ({
        x,
        y,
        width,
        height,
        tiles: []
});

const add_tile: (tilemap:any, id: number, flag_string: string) => void =  (tilemap, id, flag_string) => {
    tilemap.tiles[id] = {id, flag_string};
}

// Get tile at pixel coordinates
const get_tile: (tilemap: any, x: number, y: number) => any = (tilemap, x, y) => {
    const map_x: number = Math.floor((x - tilemap.x) / TILE_SIZE);
    const map_y: number = Math.floor((y - tilemap.y) / TILE_SIZE);
    const tile_number = mget(map_x, map_y);
    const flags: any = {
        solid: false
    }
    const tile = tilemap.tiles[tile_number] || {};
    const flag_string = tile.flag_string;
    if (flag_string) {
        flags.solid = flag_string.charAt(0) === '1';
        flags.freezing_walkable = flag_string.charAt(1) === '1';
    }
    tile.flags = flags;
    tile.box = { x: Math.floor((x - tilemap.x) / TILE_SIZE) * TILE_SIZE, y: Math.floor((y - tilemap.y) / TILE_SIZE) * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE };

    return tile;

}

const get_tiles_in_rect: (tilemap: any, x: number, y: number, w: number, h: number) => any[] = (tilemap, x, y, w, h) => {
    const tiles: any[] = [];
    const extra_x = w % TILE_SIZE + Math.floor(x) % TILE_SIZE;
    const extra_y = h % TILE_SIZE + Math.floor(y) % TILE_SIZE;
    const tiles_x = Math.floor(w / TILE_SIZE) + (extra_x > 0 ? (extra_x > TILE_SIZE ? 2 : 1) : 0);
    const tiles_y = Math.floor(h / TILE_SIZE) + (extra_y > 0 ? (extra_y > TILE_SIZE ? 2 : 1) : 0);
    for (let i = 0; i < tiles_x; i++) {
        for (let j = 0; j < tiles_y; j++) {
            const tile = get_tile(tilemap, x + i * TILE_SIZE, y + j * TILE_SIZE);
            tiles.push(tile);
        }
    }
    return tiles;
}

const draw_map: (tilemap:any, remap: any) => void = (tilemap, remap) => {
    map(tilemap.x, tilemap.y, tilemap.width, tilemap.height, 0, 0, 0, 1, remap);
};