//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_MEMORY_BANK: number = 0;
const DEFAULT_PALETTE_INDEX = 1;
const WORLD_LEVELS = 64;
//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $palette_index: number;
let $input_manager: InputManager;
const state: any = {};

const init: (state: any) => void = () => {

    //$palette_index = swap_palette(DEFAULT_PALETTE_INDEX);
    $input_manager = create_input_manager();

    state.level_index = 52;
    state.pc = create_pc(32, 96);
    state.ui = [];

    //Init input manager
    $input_manager.set_listener(state.pc);

    //Create map
    const tileset: Tileset = create_tileset();
    let tiles: number[] = [];
    const tiles_exclude: number[] = [32, 33, 48, 49];
    for (let i = 2; i <= 65; i++) {
        if (tiles_exclude.every((t: number) => t !== i)) {
            tiles.push(i);
        }
    }
    tiles = [...tiles, 80, 81];
    tileset.add_tiles_flag(TileFlags.SOLID, tiles);
    state.map = create_tilemap(0, 0, 90, 102, tileset);

};


function TIC() {
    // -------------------- INIT -------------------- 
    if ($t === 0) {
        init(state);
        music(1, 0, true);
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
    /*

print(`${PALETTES[$palette_index].id.charAt(0).toUpperCase() + PALETTES[$palette_index].id.substr(1)}`, 2, 130, 2);
*/
}
