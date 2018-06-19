const MAP_X: number = 0;
const MAP_Y: number = 0;
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 18;
const BASE_TILE_SIZE: number = 8;

const draw_map: () => void = () => {
    map(MAP_X, MAP_Y, MAP_WIDTH, MAP_HEIGHT, 0, 0);
};

const get_tile: (x: number, y: number) => number = (x, y) => {
    const map_x: number = Math.floor((x - MAP_X) / BASE_TILE_SIZE);
    const map_y: number = Math.floor((y - MAP_Y) / BASE_TILE_SIZE);
    return mget(map_x, map_y);
}