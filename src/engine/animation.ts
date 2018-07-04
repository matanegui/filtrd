declare interface AnimationData {
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
}

const ANIMATIONS: any = {};

//  *ANIMATION  //
const create_animation: (id: string, speed: number, width: number, height: number) => AnimationData = (id, speed = 0, width = 1, height = 1) => {
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
        state: null
    }
};

const add_animation_state: (animation: AnimationData, state: string, frames: number[]) => void = (animation, state, frames) => {
    ANIMATIONS[animation.id][state] = frames;
};

const play_animation: (animation: AnimationData, state: string) => void = (animation, state) => {
    if (state in ANIMATIONS[animation.id]) {
        const state_changed: boolean = animation.state !== state;
        animation.playing = true;
        if (state_changed) {
            animation.state = state;
            animation.frame = ANIMATIONS[animation.id][animation.state][0];
        }
    }
};

const stop_animation: (animation: AnimationData, stop_frame?: number) => void = (animation, stop_frame) => {
    animation.playing = false;
    if (stop_frame) {
        const frames: number[] = ANIMATIONS[animation.id][animation.state];
        const frame: number = frames[stop_frame] || frames[0];
        if (frame) {
            animation.timestamp = 0;
            animation.frame_index = 0;
            animation.frame = frame;
        }
    }
};

const update_animation: (animation: AnimationData, dt: number) => void = (animation, dt) => {
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
        }
    }
};