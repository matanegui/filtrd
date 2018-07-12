//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
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
let delta: number = 0;
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

const init: () => void = () => {
    state.timers = { pc_dead: 0 };
    state.particles = [];
    state.pc = create_pc(32, 96);

    //Load map
    state.map = create_tilemap(0, 0, 32, 18);
    for (let i = 2; i <= 15; i++) {
        add_tile_data(state.map, i, [TileFlags.SOLID]);
        add_tile_data(state.map, 16 + i, [TileFlags.SOLID]);
    }
    add_tile_data(state.map, 36, [TileFlags.FREEZING_WALKABLE]);

    //Test palette switch
    state.palette = DEFAULT_PALETTE;

    //Test particles
    state.particles.push(create_particle_emitter(120, 50, PARTICLES.boiling, true, false));
};

function TIC() {

    /* -------------------- INIT -------------------- */
    if (t === 0) {
        init();
    }

    /* -------------------- TIMER UPDATES -------------------- */

    const nt: number = time();
    delta = (nt - t) / 1000;
    t = nt;

    /* -------------------- INPUT -------------------- */
    const pc = state.pc;
    const { sprite, movement, animation, collision, flags } = pc;

    input = get_input();
    if (!flags.dead) {
        //Movement and animation
        const moving: boolean = is_down(input, Button.UP) || is_down(input, Button.DOWN) || is_down(input, Button.LEFT) || is_down(input, Button.RIGHT);
        if (moving) {
            //Set facing direction
            movement.moving = true;
            movement.direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
            const { direction } = movement;

            //Set velocity
            movement.velocity_x = is_down(input, Button.LEFT) ? -movement.speed : (is_down(input, Button.RIGHT) ? movement.speed : 0);
            movement.velocity_y = is_down(input, Button.UP) ? -movement.speed : (is_down(input, Button.DOWN) ? movement.speed : 0);

            //Animate
            if (direction === Direction.LEFT) {
                sprite.flip = 1;
                play_animation(animation, PcAnimations.WalkingSide);
            } else if (direction === Direction.RIGHT) {
                sprite.flip = 0;
                play_animation(animation, PcAnimations.WalkingSide);
            } else if (direction === Direction.UP) {
                sprite.flip = 0;
                play_animation(animation, PcAnimations.WalkingUp);
            } else if (direction === Direction.DOWN) {
                sprite.flip = 0;
                play_animation(animation, PcAnimations.WalkingDown);
            }
        } else {
            movement.velocity_x = 0;
            movement.velocity_y = 0;
            movement.moving = false;
            stop_animation(animation, 1);
        }

        // Palette switching
        if (is_pressed(input, Button.A)) {
            state.palette = switch_palette(state.palette);
            play_animation(animation, PcAnimations.UsingPhone);
            //Test particles enable-disabled
            state.particles
                .filter((emitter: any) => emitter.system.id === 'boiling')
                .forEach((emitter: any) => {
                    emitter.enabled = state.palette === Palettes.Roast ? true : false;
                });
        }
    }

    /* -------------------- LOGIC -------------------- */
    if (!flags.dead) {
        //Update pcs position
        if (movement.moving) {
            //Calculate new poisition
            const mx = pc.x + (movement.velocity_x * delta);
            const my = pc.y + (movement.velocity_y * delta);
            // Check for tilemap collision
            const box = collision.body_box;
            const tiles: any[] = get_tiles_in_rect(state.map, mx + box.x, my + box.y, box.w, box.h);
            const is_colliding: boolean = tiles.some((tile: any) => {
                return tile.flags[TileFlags.SOLID] || (tile.flags[TileFlags.FREEZING_WALKABLE] && state.palette !== Palettes.Chill)
            });
            if (!is_colliding) {
                pc.x = mx;
                pc.y = my;
            }
        }

        //Check drowning colission
        const box = collision.stand_box;
        const feet_tiles: any[] = get_tiles_in_rect(state.map, pc.x + box.x, pc.y + box.y, box.w, box.h);
        const is_drowning: boolean = feet_tiles.some((tile: any) => tile.flags[TileFlags.FREEZING_WALKABLE] && state.palette !== Palettes.Chill);
        if (is_drowning) {
            // Kill PC
            pc.flags.dead = true;
            sfx(63, 48, 98);
            play_animation(pc.animation, PcAnimations.Drowning, false);
        }
    } else {
        // Reset level
        state.timers.pc_dead += delta;
        if (state.timers.pc_dead > 1.7) {
            state.timers.pc_dead = 0;
            state.palette = swap_palette(Palettes.Dungeon);
            pc.flags.dead = false;
            state.pc = create_pc(32, 96);
        }
    }

    update_animation(animation, delta);


    /* -------------------- DRAW -------------------- */
    cls(0);
    draw_map(state.map, (tile_id: number) => {
        //Water tiles become frozen
        if (state.palette === Palettes.Chill) {
            if ([36, 37, 52, 53].indexOf(tile_id) !== -1) {
                return tile_id + 2;
            }
        }
        return tile_id;
    });

    draw_entity(pc);

    //Particle test
    state.particles.forEach((emitter: ParticleEmitter) => {
        draw_particle_emitter(emitter, delta);
    });

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}
