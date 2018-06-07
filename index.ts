//  *CONSTANTS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const ANIMATIONS: any = {};

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

const stop_animation: (animation: Animation) => void = (animation) => {
    animation.playing = false;
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

//  *ENTITY //
const entity: (x: number, y: number, components: any) => any = (x = 0, y = 0, components = {}) => ({
    x,
    y,
    ...components
});

//  *GLOBALS    //
let t: number = 0;
let delta: number = 0;

const state: any = {};

//  *GAME LOOP //
const init: () => void = () => {
    const guy: any = entity(100, 50, {
        direction: null,
        animation: create_animation('pc', 90, 2, 2)
    });
    add_animation_state(guy.animation, 'idle', [256]);
    add_animation_state(guy.animation, 'walking_x', [258, 256, 260, 256]);
    add_animation_state(guy.animation, 'walking_down', [264, 262, 266, 262]);
    add_animation_state(guy.animation, 'walking_up', [270, 268, 288, 268]);
    play_animation(guy.animation, 'idle');
    state.guy = guy;
};

init();
function TIC() {
    const nt: number = time();
    delta = (nt - t) / 1000;
    t = nt;

    const guy = state.guy;
    const prev_guy_direction = guy.direction;
    //Input
    if (btn(0)) {
        guy.direction = 'up';
        guy.y--;
    } if (btn(1)) {
        guy.direction = 'down';
        guy.y++;
    } if (btn(2)) {
        guy.direction = 'left';
        guy.x--;
    } if (btn(3)) {
        guy.direction = 'right';
        guy.x++;
    } else {
        //play_animation(guy.animation, "idle");
    }

    if (guy.direction !== prev_guy_direction) {
        switch (guy.direction) {
            case 'left':
                guy.animation.effects.flip = 1;
                play_animation(guy.animation, "walking_x");
                break;
            case 'right':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, "walking_x");
                break;
            case 'down':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, "walking_down");
                break;
            case 'up':
                guy.animation.effects.flip = 0;
                play_animation(guy.animation, "walking_up");
                break;
        }
    }

    //Logic
    update_animation(guy.animation, delta);

    //Draw
    cls(0);
    map(0, 0, 32, 18, 0, 0);

    draw_animation(guy.x, guy.y, guy.animation);

    const word: string = "Test";
    const word_width: number = word.length * 6;
    print(word, SCREEN_WIDTH / 2 - word_width / 2 - 1, 130, 15);
}