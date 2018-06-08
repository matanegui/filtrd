//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
// format: dark, primary, light, complement //
const PALETTES: any = {
    default: [[32, 29, 36], [103, 89, 122], [207, 232, 173], [230, 85, 125]],
    cold: [[2, 28, 39], [2, 128, 144], [240, 243, 189], [224, 202, 60]],
    heat: [[42, 3, 1], [145, 23, 31], [227, 192, 211], [245, 203, 92]],
    mellow: [[50, 48, 54], [181, 131, 141], [255, 205, 178], [255, 180, 162]]
};
const DEFAULT_PALETTE: string = 'default';
const ANIMATIONS: any = {};

//  *UTILS  //
const switch_palette: (current_palette: string) => string = (current_palette) => {
    const palette_ids: string[] = Object.keys(PALETTES);
    const current_palette_index = palette_ids.indexOf(current_palette);
    const new_palette_id = current_palette_index + 1 < palette_ids.length ? palette_ids[current_palette_index + 1] : palette_ids[0];
    swap_palette(new_palette_id);
    return new_palette_id;
}

const swap_palette: (id: string) => void = (id) => {
    const palette: number[][] = PALETTES[id];
    if (palette) {
        for (let i = 0; i < 4; i++) {
            const colors: number[] = palette[i];
            const color_address_offset = i * 3;
            poke(0x3FC0 + color_address_offset, colors[0]);
            poke(0x3FC0 + color_address_offset + 1, colors[1]);
            poke(0x3FC0 + color_address_offset + 2, colors[2]);
        }
    }
}

//  *ANIMATION  //
const create_animation: (id: string, speed: number, width: number, height: number) => Animation = (id, speed = 0, width = 1, height = 1) => {
    ANIMATIONS[id] = {};
    return {
        id,
        speed,
        width,
        height,
        playing: false,
        loop: false,
        frame_index: 0,
        timestamp: 0,
        frame: 0,
        state: null,
        effects: { scale: 1, flip: 0, rotate: 0 }
    }
};

const add_animation_state: (animation: Animation, state: string, frames: number[]) => void = (animation, state, frames) => {
    ANIMATIONS[animation.id][state] = frames;
};

const play_animation: (animation: Animation, state: string) => void = (animation, state) => {
    if (state in ANIMATIONS[animation.id]) {
        animation.playing = true;
        animation.state = state;
        animation.frame = ANIMATIONS[animation.id][animation.state][0];
    } else {
        trace(`Tried playing invalid state: ${state} in animation id: ${animation.id}`);
    }
};

const stop_animation: (animation: Animation, stop_frame?: number) => void = (animation, stop_frame) => {
    animation.playing = false;
    if (stop_frame) {
        const frame: number = ANIMATIONS[animation.id][animation.state][stop_frame];
        if (frame) {
            animation.timestamp = 0;
            animation.frame_index = 0;
            animation.frame = frame;
        } else {
            trace(`Tried to played invalid frame: ${frame} on animation stop.`);
        }
    }
};

const update_animation: (animation: Animation, dt: number) => void = (animation, dt) => {
    if (animation.playing) {
        const frames = ANIMATIONS[animation.id][animation.state];
        if (frames) {
            //Update  animation frame if needed
            if (animation.timestamp * 1000 < animation.speed) {
                animation.timestamp += dt;
            } else {
                animation.timestamp = 0;
                animation.frame_index = animation.frame_index < frames.length - 1 ? animation.frame_index + 1 : 0;
                animation.frame = frames[animation.frame_index];
            }
        } else {
            trace(`Tried updating invalid state: ${animation.state} in animation id: ${animation.id}`);
        }
    }
};

const draw_animation: (x: number, y: number, animation: Animation) => void = (x, y, animation) => {
    const frames: number[] = ANIMATIONS[animation.id][animation.state];
    if (frames) {
        const effects: AnimationEffects = animation.effects;
        spr(animation.frame, x, y, 0, effects.scale, effects.flip, effects.rotate, animation.width, animation.height);
    } else {
        trace(`Tried drawing invalid state: ${animation.state} in animation id: ${animation.id}`);
    }
};

//  *INPUT  //

const key_pressed: (id: number) => boolean = (id) => {
    return btnp(id, 30, 30);
}

const get_input: () => InputState = () => ({
    up: btn(0), down: btn(1), left: btn(2), right: btn(3), a: key_pressed(4), b: key_pressed(5), x: key_pressed(6), y: key_pressed(7)
});

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
    state.palette = 'default';
};

init();
function TIC() {
    const nt: number = time();
    delta = (nt - t) / 1000;
    t = nt;

    input = get_input();

    const guy = state.guy;
    const prev_guy_direction = guy.direction;
    //Input

    //Movement
    const moving: boolean = input.up || input.down || input.left || input.right;
    if (moving) {
        if (input.up) {
            guy.y--;
            guy.direction = 'up';
        }
        if (input.down) {
            guy.y++;
            guy.direction = 'down';
        }
        if (input.left) {
            guy.x--;
            guy.direction = 'left';
        }
        if (input.right) {
            guy.x++;
            guy.direction = 'right';
        }
    } else {
        guy.direction = 'none';
    }


    if (input.a) {
        state.palette = switch_palette(state.palette);
    }

    if (guy.direction !== prev_guy_direction) {
        switch (guy.direction) {
            case 'left':
                guy.animation.effects.flip = 1;
                play_animation(guy.animation, 'walking_x');
                break;
            case 'right':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, 'walking_x');
                break;
            case 'down':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, 'walking_down');
                break;
            case 'up':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, 'walking_up');
                break;
            default:
                stop_animation(guy.animation, 1);
                break;
        }
    }

    //Logic
    update_animation(guy.animation, delta);

    //Draw
    cls(0);
    map(0, 0, 32, 18, 0, 0);

    draw_animation(guy.x, guy.y, guy.animation);

    const word: string = `Palette: ${state.palette.charAt(0).toUpperCase() + state.palette.substr(1)}`;
    const word_width: number = word.length * 6;
    print(word, SCREEN_WIDTH / 2 - word_width / 2 - 1, 130, 2);
}