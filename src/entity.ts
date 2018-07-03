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
    box: { x: number, y: number, w: number, h: number };
}

interface Components {
    animation?: AnimationData;
    movement?: Movement
    collision?: Collision
}

interface Entity {
    x: number;
    y: number;
    //Components
    animation?: AnimationData;
    movement?: Movement
    collision?: Collision
}

const entity: (x: number, y: number, components: Components) => Entity = (x = 0, y = 0, components = {}) => ({
    x,
    y,
    ...components
});