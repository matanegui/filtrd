//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_PALETTE: string = 'dungeon';

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

const state: any = {};

//  *GAME LOOP //
const init: () => void = () => {

    const pc: Entity = entity(32, 96);

    pc.sprite = create_sprite(265, { w: 2, h: 2 });
    pc.animation = create_animation('pc', 90, 2, 2);
    pc.movement = { direction: null, speed: 60, moving: false };
    pc.collision = { enabled: true, box: { x: 3, y: 1, w: 10, h: 15 } };

    const { animation } = pc;
    add_animation_state(animation, 'w_x', [258, 256, 260, 256]);
    add_animation_state(animation, 'w_down', [264, 262, 266, 262]);
    add_animation_state(animation, 'w_up', [270, 268, 288, 268]);
    add_animation_state(animation, 'u_phone', [290]);
    play_animation(animation, 'w_x');
    state.pc = pc;

    //Load map
    state.map = create_tilemap(0, 0, 32, 18);
    for (let i = 2; i <= 15; i++) {
        add_tile_data(state.map, i, [TileFlags.SOLID]);
        add_tile_data(state.map, 16 + i, [TileFlags.SOLID]);
    }
    add_tile_data(state.map, 36, [TileFlags.FREEZING_WALKABLE]);

    //Test palette switch
    state.palette = DEFAULT_PALETTE;
};

const handle_input: (input: InputState, state: any) => void = (input, state) => {
    const pc = state.pc;
    const { sprite, animation, movement } = pc;
    //Movement and animation
    const moving: boolean = is_down(input, Button.UP) || is_down(input, Button.DOWN) || is_down(input, Button.LEFT) || is_down(input, Button.RIGHT);
    if (moving) {
        //Set facing direction
        movement.moving = true;
        const direction_prev: Direction = movement.direction;
        movement.direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
        const { direction } = movement;

        //Set velocity
        movement.velocity_x = is_down(input, Button.LEFT) ? -movement.speed : (is_down(input, Button.RIGHT) ? movement.speed : 0);
        movement.velocity_y = is_down(input, Button.UP) ? -movement.speed : (is_down(input, Button.DOWN) ? movement.speed : 0);

        //Animate
        if (direction === Direction.LEFT) {
            sprite.flip = 1;
            play_animation(animation, 'w_x');
        } else if (direction === Direction.RIGHT) {
            sprite.flip = 0;
            play_animation(animation, 'w_x');
        } else if (direction === Direction.UP) {
            sprite.flip = 0;
            play_animation(animation, 'w_up');
        } else if (direction === Direction.DOWN) {
            sprite.flip = 0;
            play_animation(animation, 'w_down');
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
        play_animation(animation, 'u_phone');
    }
};

function TIC() {
    if (t === 0) {
        init();
    }


    const nt: number = time();
    delta = (nt - t) / 1000;
    t = nt;

    // Input
    input = get_input();
    handle_input(input, state);

    //Logic
    const pc = state.pc;
    update_animation(pc.animation, delta);

    //Update pcs position
    if (pc.movement.moving) {
        //Calculate new poisition
        const mx = pc.x + (pc.movement.velocity_x * delta);
        const my = pc.y + (pc.movement.velocity_y * delta);
        // Check for tilemap collision
        const pc_box = pc.collision.box;
        const tiles: any[] = get_tiles_in_rect(state.map, mx + pc_box.x, my + pc_box.y, pc_box.w, pc_box.h);
        const is_colliding: boolean = tiles.some((tile: any) => {
            return tile.flags[TileFlags.SOLID] || (tile.flags[TileFlags.FREEZING_WALKABLE] && state.palette !== 'chill')
        });
        if (!is_colliding) {
            pc.x = mx;
            pc.y = my;
        }
    }

    //Draw
    cls(0);
    draw_map(state.map, (tile_id: number) => {
        //Water tiles become frozen
        if (state.palette === 'chill') {
            if ([36, 37, 52, 53].indexOf(tile_id) !== -1) {
                return tile_id + 2;
            }
        }
        return tile_id;
    });

    draw_entity(pc);

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}
