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
    //Movement and animation
    const moving: boolean = is_down(input, Button.UP) || is_down(input, Button.DOWN) || is_down(input, Button.LEFT) || is_down(input, Button.RIGHT);
    if (moving) {
        guy.movement.velocity_x = is_down(input, Button.LEFT) ? -guy.movement.speed : (is_down(input, Button.RIGHT) ? guy.movement.speed : 0);
        guy.movement.velocity_y = is_down(input, Button.UP) ? -guy.movement.speed : (is_down(input, Button.DOWN) ? guy.movement.speed : 0);
        const direction_prev: Direction = guy.movement.direction;
        guy.movement.direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
        switch (guy.movement.direction) {
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
    if (is_pressed(input, Button.A)) {
        state.palette = switch_palette(state.palette);
        play_animation(guy.animation, 'using_phone');
    }
};