enum Direction { UP, DOWN, LEFT, RIGHT };
enum EntityFlags {
    DEAD,
    PARTICLE_EMIT_ON_DISABLED,
    PARTICLE_DISABLED
}

interface Movement {
    direction: Direction;
    speed: number;
    moving: boolean;
    velocity_x?: number;
    velocity_y?: number;
}

interface Collision {
    enabled: boolean;
    body_box: { x: number, y: number, w: number, h: number };
    stand_box?: { x: number, y: number, w: number, h: number };
}

interface Components {
    animation?: AnimationData;
    movement?: Movement
    collision?: Collision
}

interface Entity {
    x: number;
    y: number;
    props: any;
    //Components
    update: (delta: number, state?: any) => void,
    draw: () => void
}

const create_entity: (x: number, y: number) => Entity = (x = 0, y = 0) => ({
    x,
    y,
    props: {},
    update: function (dt, state) { },
    draw: function () { },
});