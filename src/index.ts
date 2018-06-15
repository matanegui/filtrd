//  *ENUMS   //
enum Direction { UP, DOWN, LEFT, RIGHT };

//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_PALETTE: string = 'dungeon';

const handle_input: (input: InputState, state: any) => void = (input, state) => {
    const guy = state.guy;
    //Movement and animation
    const moving: boolean = is_down(input, 'UP') || is_down(input, 'DOWN') || is_down(input, 'LEFT') || is_down(input, 'RIGHT');
    if (moving) {
        guy.movement.velocity_x = is_down(input, 'LEFT') ? -guy.movement.speed : (is_down(input, 'RIGHT') ? guy.movement.speed : 0);
        guy.movement.velocity_y = is_down(input, 'UP') ? -guy.movement.speed : (is_down(input, 'DOWN') ? guy.movement.speed : 0);
        const direction_prev: Direction = guy.direction;
        guy.direction = is_down(input, 'LEFT') ? Direction.LEFT : (is_down(input, 'RIGHT') ? Direction.RIGHT : (is_down(input, 'UP') ? Direction.UP : (is_down(input, 'DOWN') ? Direction.DOWN : null)));
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
    } else {
        guy.movement.velocity_x = 0;
        guy.movement.velocity_y = 0;
        stop_animation(guy.animation, 1);
    }

    // Palette switching
    if (is_pressed(input, 'A')) {
        state.palette = switch_palette(state.palette);
        play_animation(guy.animation, 'using_phone');
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
        movement: { velocity_x: 0, velocity_y: 0, speed: 60 },
        animation: create_animation('pc', 90, 2, 2)
    });

    add_animation_state(guy.animation, 'walking_x', [258, 256, 260, 256]);
    add_animation_state(guy.animation, 'walking_down', [264, 262, 266, 262]);
    add_animation_state(guy.animation, 'walking_up', [270, 268, 288, 268]);
    add_animation_state(guy.animation, 'using_phone', [290]);
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

    //Update guys position
    guy.x = guy.x + (guy.movement.velocity_x * delta);
    guy.y = guy.y + (guy.movement.velocity_y * delta);

    //Draw
    cls(0);
    map(0, 0, 32, 18, 0, 0);

    draw_animation(guy.x, guy.y, guy.animation);

    const word: string = `${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    print(word, 2, 130, 2);
}