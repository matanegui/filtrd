const TILE_SIZE: number = 8;
const WORLD_LEVELS: number = 64;
const WORLD_WIDTH: number = 8;
const LEVEL_WIDTH: number = 30;
const LEVEL_HEIGHT: number = 17;
const MAP_Y_OFFSET: number = 8;

/* TILE */
interface Tile {
    id: number;
    flags: boolean[];
    box: { x, y, w, h }
}

const create_tile: (id: number, flags?: number[], box?: { x: number, y: number, w: number, h: number }) => Tile = (id, flags = [], box = { x: 0, y: 0, w: 0, h: 0 }) => ({
    id,
    box,
    flags: flags.reduce((accumulator: boolean[], flag: number) => {
        accumulator[flag] = true;
        return accumulator;
    }, [])
});

/* TILESET */
interface Tileset {
    flags: number[][]
    spawners: ((id: number, x: number, y: number) => Entity)[][]
}

const create_tileset: () => Tileset = () => ({
    flags: [],
    spawners: []
});

const add_tile_flags: (tileset: Tileset, id: number, flags: number[]) => void = (tileset, id, flags) => {
    tileset.flags[id] = flags;
}

const add_tile_spawner: (tileset: Tileset, id: number, spawner: (id: number, x: number, y: number) => Entity) => void = (tileset, id, spawner) => {
    tileset.spawners[id] ? tileset.spawners[id].push(spawner) : tileset.spawners[id] = [spawner];
}

/* TILEMAP */

interface Tilemap {
    x: number;
    y: number;
    map_x: number;
    map_y: number;
    width: number;
    height: number;
    tileset: Tileset;
}

const create_tilemap: (x: number, y: number, map_x: number, map_y: number, tileset: Tileset) => Tilemap = (x, y, map_x, map_y, tileset) => {
    return {
        x,
        y,
        map_x,
        map_y,
        width: LEVEL_WIDTH,
        height: LEVEL_HEIGHT,
        tileset
    }
};

const spawn_tilemap: (tilemap: Tilemap) => Entity[] = (tilemap) => {
    let entities: Entity[] = [];
    for (let i = tilemap.map_x; i < tilemap.map_x + LEVEL_WIDTH; i++) {
        for (let j = tilemap.map_y; j < tilemap.map_y + LEVEL_HEIGHT; j++) {
            const tile_id = mget(i, j);
            const spawners = tilemap.tileset.spawners[tile_id];
            if (spawners) {
                const screen_x: number = tilemap.x + (i - tilemap.map_x) * TILE_SIZE;
                const screen_y: number = tilemap.y + (j - tilemap.map_y) * TILE_SIZE;
                const spawn: Entity[] = spawners.map((spawner) => spawner(tile_id, screen_x, screen_y));
                entities = [...entities, ...spawn];
            }
        }
    }
    return entities;
};

// Get tile at pixel coordinates
const get_tile: (tilemap: Tilemap, x: number, y: number) => any = (tilemap, x, y) => {
    const map_x: number = tilemap.map_x + Math.floor((x - tilemap.x) / TILE_SIZE);
    const map_y: number = tilemap.map_y + Math.floor((y - tilemap.y) / TILE_SIZE);
    const tile_id = mget(map_x, map_y);
    const flags = tilemap.tileset.flags[tile_id];
    return create_tile(tile_id, flags, { x: Math.floor((x - tilemap.map_x) / TILE_SIZE) * TILE_SIZE, y: Math.floor((y - tilemap.map_y) / TILE_SIZE) * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE })
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
    map(tilemap.map_x, tilemap.map_y, tilemap.width, tilemap.height, tilemap.x, tilemap.y, 14, 1, remap);
};