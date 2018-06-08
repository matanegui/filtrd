declare interface InputState {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
}

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