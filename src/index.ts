//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const MEMORY_BANK: number = 0;
const DEFAULT_PALETTE: Palettes = Palettes.Dungeon;

// Utils
const isPointInRect = (x, y, rx, ry, rw, rh) => {
    return x >= rx && x < rx + rw && y >= ry && y < ry + rh
}

const are_colliding: (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) => boolean = (ax, ay, aw, ah, bx, by, bw, bh) => {
    if (ax + aw < bx || ax > bx + bw) return false;
    if (ay + ah < by || ay > by + bh) return false;
    return true;
}

//  *GLOBALS    //
let t: number = 0;
let dt: number = 0;
let input: InputState;

const state: {
    map?: any,
    pc?: Entity,
    particles?: ParticleEmitter[],
    palette?: string,
    timers?: {
        pc_dead: number
    }
} = {};

const on_palette_change: (state: any) => void = (state) => {
    //Test particles enable-disabled
    state.particles
        .forEach((emitter: any) => {
            if (emitter.system.id === 'boiling') {
                emitter.enabled = state.palette === Palettes.Roast ? true : false;
            } else if (emitter.system.id === 'drops') {
                emitter.enabled = state.palette === Palettes.Dungeon ? true : false;
            }
        });
}

const init: (state: any) => void = () => {
    state.timers = { pc_dead: 0 };
    state.particles = [];
    state.pc = create_pc(32, 96);

    //Load map
    state.map = create_tilemap(0, 0, 32, 18);
    for (let i = 2; i <= 15; i++) {
        add_tile_data(state.map, i, [TileFlags.SOLID]);
        add_tile_data(state.map, 16 + i, [TileFlags.SOLID]);
    }
    for (let i = 40; i <= 43; i++) {
        add_tile_data(state.map, i, [TileFlags.SOLID]);
        add_tile_data(state.map, 16 + i, [TileFlags.SOLID]);
    }
    add_tile_data(state.map, 36, [TileFlags.FREEZING_WALKABLE]);

    //Test palette switch
    state.palette = DEFAULT_PALETTE;
    on_palette_change(state);

    //Test particles
    state.particles.push(create_particle_emitter(120, 50, PARTICLES.boiling, true, false));
    state.particles.push(create_particle_emitter(120, 50, PARTICLES.drops, true, true));
};

function TIC() {

    /* -------------------- INIT -------------------- */
    if (t === 0) {
        init(state);
    }

    /* -------------------- TIMER UPDATES -------------------- */

    const nt: number = time();
    dt = (nt - t) / 1000;
    t = nt;

    const { pc } = state;

    /* -------------------- INPUT -------------------- */
    input = get_input();
    if (!pc.flags.dead) {
        //PC movement
        const pc_movement_direction: Direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
        move_pc(pc, pc_movement_direction);

        // Palette switching
        if (is_pressed(input, Button.A)) {
            play_animation(state.pc.animation, PcAnimations.UsingPhone);
            state.palette = switch_palette(state.palette);
            on_palette_change(state);
        }
    }

    /* -------------------- LOGIC -------------------- */
    update_pc(pc, state, dt);
    if (pc.flags.dead) {
        // Reset level
        state.timers.pc_dead += dt;
        if (state.timers.pc_dead > 1.7) {
            state.timers.pc_dead = 0;
            state.palette = swap_palette(Palettes.Dungeon);
            on_palette_change(state);
            pc.flags.dead = false;
            state.pc = create_pc(32, 96);
        }
    }

    /* -------------------- DRAW -------------------- */
    cls(0);
    draw_map(state.map, (tile_id: number) => {
        //Water tiles become frozen
        if (state.palette === Palettes.Chill) {
            if ([36, 37, 52, 53].indexOf(tile_id) !== -1) {
                return tile_id + 2;
            }
            if ([41, 42, 57, 58].indexOf(tile_id) !== -1) {
                return tile_id + 23;
            }
        }
        return tile_id;
    });

    draw_entity(pc);

    //Particle test
    state.particles.forEach((emitter: ParticleEmitter) => {
        draw_particle_emitter(emitter, dt);
    });

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}
