const TILE_SIZE: number = 8;

/* TILE */
interface Tile {
    id: number;
    flags: { [id: string]: boolean };
    box: { x, y, w, h }
}

const create_tile: (id: number, flags?: string[], box?: { x: number, y: number, w: number, h: number }) => Tile = (id, flags = [], box = { x: 0, y: 0, w: 0, h: 0 }) => ({
    id,
    box,
    flags: flags.reduce((accumulator: { [id: string]: boolean }, flag: string) => {
        accumulator[flag] = true;
        return accumulator;
    }, {})
});

/* TILESET */
interface Tileset {
    flags: string[][]
    spawners: ((id: number, x: number, y: number) => void)[][]
}

const create_tileset: () => Tileset = () => ({
    flags: [],
    spawners: []
});

const add_tile_flags: (tileset: Tileset, id: number, flags: string[]) => void = (tileset, id, flags) => {
    tileset.flags[id] = flags;
}

const add_tile_spawner: (tileset: Tileset, id: number, spawner: (id: number, x: number, y: number) => void) => void = (tileset, id, spawner) => {
    tileset.spawners[id] ? tileset.spawners[id].push(spawner) : tileset.spawners[id] = [spawner];
}

/* TILEMAP */

interface Tilemap {
    x: number;
    y: number;
    width: number;
    height: number;
    tileset: Tileset;
}

const create_tilemap: (x: number, y: number, width: number, height: number, tileset: Tileset) => Tilemap = (x, y, width, height, tileset) => ({
    x,
    y,
    width,
    height,
    tileset
});

const spawn_tilemap: (tilemap: Tilemap) => void = (tilemap) => {
    for (let i = 0; i < tilemap.width; i++) {
        for (let j = 0; j < tilemap.width; j++) {
            const tile_id = mget(i, j);
            const spawners = tilemap.tileset.spawners[tile_id];
            if (spawners) {
                const screen_x: number = i * TILE_SIZE;
                const screen_y: number = j * TILE_SIZE;
                spawners.forEach((spawner) => {
                    spawner(tile_id, screen_x, screen_y);
                })
            }
        }
    }
};

// Get tile at pixel coordinates
const get_tile: (tilemap: Tilemap, x: number, y: number) => any = (tilemap, x, y) => {
    const map_x: number = Math.floor((x - tilemap.x) / TILE_SIZE);
    const map_y: number = Math.floor((y - tilemap.y) / TILE_SIZE);
    const tile_id = mget(map_x, map_y);
    const flags = tilemap.tileset.flags[tile_id];
    return create_tile(tile_id, flags, { x: Math.floor((x - tilemap.x) / TILE_SIZE) * TILE_SIZE, y: Math.floor((y - tilemap.y) / TILE_SIZE) * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE })
}

const get_tiles_in_rect: (tilemap: Tilemap, x: number, y: number, w: number, h: number) => any[] = (tilemap, x, y, w, h) => {
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

const draw_map: (tilemap: Tilemap, remap: any) => void = (tilemap, remap) => {
    map(tilemap.x, tilemap.y, tilemap.width, tilemap.height, 0, 0, 14, 1, remap);
};