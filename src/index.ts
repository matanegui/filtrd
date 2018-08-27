//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_MEMORY_BANK: number = 0;
const DEFAULT_PALETTE_INDEX = 0;

//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $input: InputState;
let $palette_index: number = 0;

const state: {
    pc?: Entity & any,
    map?: Tilemap,
    ui?: (Entity & any)[],
    level_index?: number
} = {};


const init: (state: any) => void = () => {
    $palette_index = swap_palette(DEFAULT_PALETTE_INDEX);

    state.level_index = 59;
    state.pc = create_pc(32, 96);
    state.ui = [];

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
    state.map = create_tilemap(0, 0, map_x, map_y, tileset);

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
    $input = get_input();
    if (!pc.props.dead) {
        //PC movement
        const pc_movement_direction: Direction = is_down($input, Button.LEFT) ? Direction.LEFT : (is_down($input, Button.RIGHT) ? Direction.RIGHT : (is_down($input, Button.UP) ? Direction.UP : (is_down($input, Button.DOWN) ? Direction.DOWN : null)));
        pc.move(pc_movement_direction);

        // Palette switching
        if (is_pressed($input, Button.A)) {
            play_animation(state.pc.animation, PcAnimations.UsingPhone);
            $palette_index = switch_palette($palette_index);
        }

        if (is_pressed($input, Button.B)) {
            state.ui.push(create_textbox(20, 20, "EL DOTOR BISMAN\nPuso al pan al vino vino,\nsobre las cartas la mesa.\nY por eso lo mandaron a\nmatar."));
        }

    }
    // -------------------- LOGIC -------------------- 

    pc.update($dt, state);

    // -------------------- DRAW --------------------
    cls(0);

    //Take fucking remap logic outta here
    let remap: any = {};
    if ($palette_index === Palettes.Chill) {
        remap = {
            45: 66, 60: 82, 36: 38, 37: 39, 52: 54, 53: 55, 41: 64, 42: 65, 57: 80, 58: 81
        }
    }
    draw_map(state.map, (tile_id: number) => {
        //Water tiles become frozen
        const new_tile_id: number = remap[tile_id];
        return new_tile_id ? new_tile_id : tile_id;
    });
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
