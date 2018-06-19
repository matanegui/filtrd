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

//  *GLOBALS    //
let t: number = 0;
let delta: number = 0;
let input: InputState;

const state: any = {};

//  *GAME LOOP //
const init: () => void = () => {

    const guy: any = entity(100, 50, {
        movement: { direction: null, speed: 60 },
        animation: create_animation('pc', 90, 2, 2)
    });

    const { animation } = guy;
    add_animation_state(animation, 'w_x', [258, 256, 260, 256]);
    add_animation_state(animation, 'w_down', [264, 262, 266, 262]);
    add_animation_state(animation, 'w_up', [270, 268, 288, 268]);
    add_animation_state(animation, 'u_phone', [290]);
    play_animation(animation, 'w_x');
    state.guy = guy;

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
    const guy = state.guy;
    update_animation(guy.animation, delta);

    //Update guys position
    guy.x = guy.x + (guy.movement.velocity_x * delta);
    guy.y = guy.y + (guy.movement.velocity_y * delta);

    //Draw
    cls(0);
    draw_map();
    //trace(get_tile(8, 8));

    draw_animation(guy.x, guy.y, guy.animation);

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}