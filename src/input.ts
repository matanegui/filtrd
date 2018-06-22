declare interface InputState {
    down: string;
    pressed: string;
}
enum Button { UP, DOWN, LEFT, RIGHT, A, B, X, Y };

const BUTTONS: number[] = [Button.UP, Button.DOWN, Button.LEFT, Button.RIGHT, Button.A, Button.B, Button.X, Button.Y];

const get_input: () => InputState = () => {
    const input_map = BUTTONS;
    const replaceAt: (original: string, index: number, replacement: string) => string = (original, index, replacement) => {
        return original.substr(0, index) + replacement + original.substr(index + replacement.length);
    };
    const input_state: any = { down: '00000000', pressed: '00000000' };
    input_map.forEach((id, index) => {
        input_state.down = replaceAt(input_state.down, index, btn(index) ? '1' : '0');
        input_state.pressed = replaceAt(input_state.pressed, index, btnp(index, Infinity, 30) ? '1' : '0');
    });
    return input_state as InputState;
};

const is_down: (input: InputState, id: number) => boolean = (input, id) => {
    const key_index: number = BUTTONS.indexOf(id);
    return (key_index !== -1) && input.down.charAt(key_index) === '1';
};

const is_pressed: (input: InputState, id: number) => boolean = (input, id) => {
    const key_index: number = BUTTONS.indexOf(id);
    return (key_index !== -1) && input.pressed.charAt(key_index) === '1';
};

//Handle input function
enum Direction { UP, DOWN, LEFT, RIGHT };

const handle_input: (input: InputState, state: any) => void = (input, state) => {
    const guy = state.guy;
    const { animation, movement } = guy;
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
            animation.effects.flip = 1;
            play_animation(animation, 'w_x');
        } else if (direction === Direction.RIGHT) {
            animation.effects.flip = 0;
            play_animation(animation, 'w_x');
        } else if (direction === Direction.UP) {
            animation.effects.flip = 0;
            play_animation(animation, 'w_up');
        } else if (direction === Direction.DOWN) {
            animation.effects.flip = 0;
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