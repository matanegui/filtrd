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
    flags: any;
    //Components
    sprite?: Sprite;
    animation?: AnimationData;
    movement?: Movement;
    collision?: Collision;
    particles?: ParticleSource;
}

const create_entity: (x: number, y: number) => Entity = (x = 0, y = 0) => ({
    x,
    y,
    flags: {}
});

const draw_entity: (e: Entity, dt: number) => void = (e, dt) => {
    if (e.sprite) {
        let { id, w, h, scale, flip, rotate, colorkey } = e.sprite;
        if (e.animation) {
            id = e.animation.frame;
        }
        spr(id, e.x, e.y, colorkey, scale, flip, rotate, w, h);
    }
    if (e.particles) {
        draw_particle_emitter(e, dt);
    }
}