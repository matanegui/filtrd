declare interface ButtonState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
}

declare interface InputState {
    down: ButtonState;
    pressed: ButtonState;
}

const BUTTONS: string[] = ['up', 'down', 'left', 'right', 'a', 'b', 'x', 'y'];

const get_input: () => InputState = () => {
    const input_map = BUTTONS;
    const input_state: any = { down: {}, pressed: {} };
    input_map.forEach((id, index) => {
        input_state.down[id] = btn(index);
        input_state.pressed[id] = btnp(index, Infinity, 30)
    });
    return input_state as InputState;
};