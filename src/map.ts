const MAP_X: number = 0;
const MAP_Y: number = 0;
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 18;
const BASE_TILE_SIZE: number = 8;
const TILE_PROPERTIES: any = [];

//Build tileset-property map
//Property strings: '[solid]'
for (let i = 1; i <= 12; i++) {
    TILE_PROPERTIES[i] = '1';
    TILE_PROPERTIES[16 + i] = '1';
}

const draw_map: () => void = () => {
    map(MAP_X, MAP_Y, MAP_WIDTH, MAP_HEIGHT, 0, 0);
};

const get_tile_properties: (x: number, y: number) => any = (x, y) => {
    const map_x: number = Math.floor((x - MAP_X) / BASE_TILE_SIZE);
    const map_y: number = Math.floor((y - MAP_Y) / BASE_TILE_SIZE);
    const tile_number = mget(map_x, map_y);
    const properties: any = {
        solid: false
    }
    const prop_string = TILE_PROPERTIES[tile_number];
    if (prop_string) {
        properties.solid = prop_string.charAt(0) === '1';
    }
    return properties;
}