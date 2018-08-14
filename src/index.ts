//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_MEMORY_BANK: number = 0;
const DEFAULT_PALETTE_INDEX = 0;

//  *GLOBALS    //
let t: number = 0;
let dt: number = 0;
let input: InputState;

const state: {
    pc?: Entity,
    map?: Tilemap,
    bank?: any,
    entities?: Entity[],
    palette_index?: number,
    level_index?: number,
    timers?: {
        pc_dead: number
    }
} = {};

const on_palette_change: (state: any) => void = (state) => {
    //Test particles enable-disabled
    state.entities
        .forEach(({ particles }) => {
            if (particles) {
                if (particles.system.id === 'boiling') {
                    particles.enabled = state.palette_index === Palettes.Roast ? true : false;
                } else if (particles.system.id === 'drops') {
                    particles.enabled = state.palette_index === Palettes.Dungeon ? true : false;
                }
            }
        });
}

const init: (state: any) => void = () => {
    state.bank = switch_bank(DEFAULT_MEMORY_BANK);
    state.level_index = 59;
    state.pc = create_pc(32, 96);
    state.timers = { pc_dead: 0 };
    state.entities = [];

    //Instantiate map
    state.map = create_tilemap(0, 0, state.level_index, state.bank.tileset);
    spawn_tilemap(state.map, state);
    //Test palette switch
    state.palette_index = DEFAULT_PALETTE_INDEX;
    on_palette_change(state);

    trace(words(0));

};

function TIC() {
    // -------------------- INIT -------------------- 
    if (t === 0) {
        init(state);
    }

    // -------------------- TIMER UPDATES --------------------

    const nt: number = time();
    dt = (nt - t) / 1000;
    t = nt;

    // -------------------- INPUT -------------------- 
    const { pc } = state;
    input = get_input();
    if (!pc.flags[EntityFlags.DEAD]) {
        //PC movement
        const pc_movement_direction: Direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
        move_pc(pc, pc_movement_direction);

        // Palette switching
        if (is_pressed(input, Button.A)) {
            play_animation(state.pc.animation, PcAnimations.UsingPhone);
            state.palette_index = switch_palette(state.palette_index);
            on_palette_change(state);
        }
    }

    // -------------------- LOGIC -------------------- 
    update_pc(pc, state, dt);
    if (pc.flags[EntityFlags.DEAD]) {
        // Reset level
        state.timers.pc_dead += dt;
        if (state.timers.pc_dead > 1.5) {
            state.timers.pc_dead = 0;
            state.palette_index = swap_palette(Palettes.Dungeon);
            on_palette_change(state);
            pc.flags[EntityFlags.DEAD] = false;
            state.pc = create_pc(32, 96);
        }
    }

    // -------------------- DRAW -------------------- 
    cls(0);

    let remap: any = {};
    if (state.palette_index === Palettes.Chill) {
        remap = {
            45: 66, 60: 82, 36: 38, 37: 39, 52: 54, 53: 55, 41: 64, 42: 65, 57: 80, 58: 81
        }
    }
    draw_map(state.map, (tile_id: number) => {
        //Water tiles become frozen
        const new_tile_id: number = remap[tile_id];
        return new_tile_id ? new_tile_id : tile_id;
    });

    draw_entity(pc, dt);

    //Particle test
    state.entities.forEach((entity: Entity) => {
        if (entity.particles) {
            draw_particle_emitter(entity, dt);
        }
    });

    print(`${PALETTES[state.palette_index].id.charAt(0).toUpperCase() + PALETTES[state.palette_index].id.substr(1)}`, 2, 130, 2);
}
