declare interface AnimationEffects {
    scale: number;
    flip: number;
    rotate: number;
}

declare interface Animation {
    id: string;
    speed: number;
    width: number;
    height: number;
    playing: boolean;
    loop: boolean;
    frame_index: number;
    timestamp: number;
    frame: number;
    state: string;
    effects: AnimationEffects
}

const ANIMATIONS: any = {};

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