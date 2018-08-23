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

const handle_input: (input, state) => void = (input, state) => {
    context
}