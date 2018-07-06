enum Direction { UP, DOWN, LEFT, RIGHT };

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

interface EntityFlags {
    dead: boolean;
}

interface Entity {
    x: number;
    y: number;
    sprite: Sprite;
    flags: EntityFlags;
    //Components
    animation?: AnimationData;
    movement?: Movement;
    collision?: Collision;
}

const create_entity_flags: () => EntityFlags = () => ({
    dead: false
})

const entity: (x: number, y: number) => Entity = (x = 0, y = 0) => ({
    x,
    y,
    flags: create_entity_flags(),
    sprite: create_sprite(0, {})
});

const draw_entity: (e: Entity) => void = (e) => {
    let { id, w, h, scale, flip, rotate, colorkey } = e.sprite;
    if (e.animation) {
        id = e.animation.frame;
    }
    spr(id, e.x, e.y, colorkey, scale, flip, rotate, w, h);
}