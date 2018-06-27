//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_PALETTE: string = 'dungeon';

//  *ENTITY //
const entity: (x: number, y: number, components: any) => any = (x = 0, y = 0, components = {}) => ({
    x,
    y,
    ...components
});

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

    const pc: any = entity(100, 50, {
        movement: { direction: null, speed: 60, moving: false },
        collision: { enabled: true, box: { x: 3, y: 1, w: 10, h: 14 } },
        animation: create_animation('pc', 90, 2, 2)
    });

    const { animation } = pc;
    add_animation_state(animation, 'w_x', [258, 256, 260, 256]);
    add_animation_state(animation, 'w_down', [264, 262, 266, 262]);
    add_animation_state(animation, 'w_up', [270, 268, 288, 268]);
    add_animation_state(animation, 'u_phone', [290]);
    play_animation(animation, 'w_x');
    state.pc = pc;

    //Test palette switch
    state.palette = DEFAULT_PALETTE;
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
        const tiles: any[] = get_tiles_in_rect(mx + pc_box.x, my + pc_box.y, pc_box.w, pc_box.h);
        const is_colliding: boolean = tiles.some((tile: any) => tile.flags.solid);
        if (!is_colliding) {
            pc.x = mx;
            pc.y = my;
        }
    }

    //Draw
    cls(0);
    draw_map();

    draw_animation(pc.x, pc.y, pc.animation);

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}
