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