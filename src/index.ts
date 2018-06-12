//  *ENUMS   //
enum Direction { UP, DOWN, LEFT, RIGHT };

//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_PALETTE: string = 'dungeon';

const handle_input: (input: InputState, state: any) => void = (input, state) => {
    const guy = state.guy;

    //Movement and animation
    const moving: boolean = input.down.up || input.down.down || input.down.left || input.down.right;
    if (moving) {
        const x: number = guy.x;
        const y: number = guy.y;
        guy.x = input.down.left ? x - 1 : (input.down.right ? x + 1 : x);
        guy.y = input.down.up ? y - 1 : (input.down.down ? y + 1 : y);

        const direction_prev: Direction = guy.direction;
        guy.direction = input.down.left ? Direction.LEFT : (input.down.right ? Direction.RIGHT : (input.down.up ? Direction.UP : (input.down.down ? Direction.DOWN : null)));
        if (guy.direction !== direction_prev) {
            switch (guy.direction) {
                case Direction.LEFT:
                    guy.animation.effects.flip = 1;
                    play_animation(guy.animation, 'walking_x');
                    break;
                case Direction.RIGHT:
                    guy.animation.effects.flip = 0;
                    play_animation(guy.animation, 'walking_x');
                    break;
                case Direction.UP:
                    guy.animation.effects.flip = 0;
                    play_animation(guy.animation, 'walking_up');
                    break;
                case Direction.DOWN:
                    guy.animation.effects.flip = 0;
                    play_animation(guy.animation, 'walking_down');
                    break;
            }
        }
    } else {
        stop_animation(guy.animation, 1);
    }

    // Palette switching
    if (input.pressed.a) {
        state.palette = switch_palette(state.palette);
    }
};


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
        direction: null,
        animation: create_animation('pc', 90, 2, 2)
    });
    add_animation_state(guy.animation, 'walking_x', [258, 256, 260, 256]);
    add_animation_state(guy.animation, 'walking_down', [264, 262, 266, 262]);
    add_animation_state(guy.animation, 'walking_up', [270, 268, 288, 268]);
    play_animation(guy.animation, 'walking_x');
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

    //Draw
    cls(0);
    map(0, 0, 32, 18, 0, 0);

    draw_animation(guy.x, guy.y, guy.animation);

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}