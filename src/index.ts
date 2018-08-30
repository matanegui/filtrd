//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_MEMORY_BANK: number = 0;
const DEFAULT_PALETTE_INDEX = 0;

//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $palette_index: number = 0;
let $input_manager: InputManager;
const state: any = {};


const init: (state: any) => void = () => {

    $palette_index = swap_palette(DEFAULT_PALETTE_INDEX);
    $input_manager = create_input_manager();

    state.level_index = 59;
    state.pc = create_pc(32, 96);
    state.ui = [];

    //Init input manager
    $input_manager.set_listener(state.pc);

    //Create map
    const tileset: Tileset = create_tileset();
    for (let i = 2; i <= 15; i++) {
        add_tile_flags(tileset, i, [TileFlags.SOLID]);
        add_tile_flags(tileset, 16 + i, [TileFlags.SOLID]);
    }
    for (let i = 40; i <= 43; i++) {
        add_tile_flags(tileset, i, [TileFlags.SOLID]);
        add_tile_flags(tileset, 16 + i, [TileFlags.SOLID]);
    }
    add_tile_flags(tileset, 36, [TileFlags.FREEZING]);
    const map_x = ((WORLD_LEVELS % state.level_index) - 2) * LEVEL_WIDTH;
    const map_y = ((Math.ceil(state.level_index / WORLD_WIDTH) - 1) * LEVEL_HEIGHT);

    //Take fucking remap logic outta here
    let tile_remap: any = {};
    if ($palette_index === Palettes.Chill) {
        tile_remap = {
            45: 66, 60: 82, 36: 38, 37: 39, 52: 54, 53: 55, 41: 64, 42: 65, 57: 80, 58: 81
        }
    }
    const remap: (tile_id: number) => number = (tile_id) => {
        //Water tiles become frozen
        const new_tile_id: number = remap[tile_id];
        return new_tile_id ? new_tile_id : tile_id;
    }

    state.map = create_tilemap(0, 0, map_x, map_y, tileset, remap);

};


function TIC() {
    // -------------------- INIT -------------------- 
    if ($t === 0) {
        init(state);
    }

    // -------------------- TIMER UPDATES --------------------

    const nt: number = time();
    $dt = (nt - $t) / 1000;
    $t = nt;

    // -------------------- INPUT -------------------- 
    const { pc } = state;
    const input: InputState = get_input();
    $input_manager.on_input(input, state);

    // -------------------- LOGIC -------------------- 

    [
        state.pc,
        ...state.ui
    ].forEach((e: Entity) => e.update($dt, state));

    // -------------------- DRAW --------------------
    cls(0);

    state.map.draw();
    //Draw entities
    insertion_sort(
        [
            pc,
        ],
        (a: Entity, b: Entity) => { return a.y > b.y })
        .forEach((e: Entity) => {
            e.draw();
        });

    //Draw UI
    state.ui.forEach((e: any) => {
        e.draw();
    });

    print(`${PALETTES[$palette_index].id.charAt(0).toUpperCase() + PALETTES[$palette_index].id.substr(1)}`, 2, 130, 2);
}
