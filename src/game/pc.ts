const enum PcAnimations {
    WalkingSide = 'w_x',
    WalkingDown = 'w_d',
    WalkingUp = 'w_u',
    UsingPhone = 'u_ph',
    Drowning = 'drw'
};

type PC = Entity & { animation: AnimationData, sprite: Sprite, movement: Movement, collision: Collision };

const create_pc: (x: number, y: number) => Entity = (x, y) => {

    const animation = create_animation('pc', 90);
    add_animation_state(animation, PcAnimations.WalkingSide, [258, 256, 260, 256]);
    add_animation_state(animation, PcAnimations.WalkingDown, [264, 262, 266, 262]);
    add_animation_state(animation, PcAnimations.WalkingUp, [270, 268, 288, 268]);
    add_animation_state(animation, PcAnimations.UsingPhone, [290]);
    add_animation_state(animation, PcAnimations.Drowning, [292, 294, 296, 298, 300, 302, 0]);
    play_animation(animation, PcAnimations.WalkingSide);

    return {
        ...create_entity(x, y),
        sprite: create_sprite(265, { w: 2, h: 2 }),
        animation: animation,
        movement: { direction: null, speed: 50, moving: false },
        collision: { enabled: true, body_box: { x: 3, y: 1, w: 10, h: 15 }, stand_box: { x: 0, y: 6, w: 16, h: 10 } },
        props: {
            dead: false,
            dead_timer: 0
        },
        move: move,
        update: update,
        draw: function () { draw_sprite(this.x, this.y, this.sprite) },
    };
}

function move(dir: Direction): void {
    const { sprite, movement, animation } = this;
    //Set facing direction
    if (dir !== null) {
        movement.moving = true;
        movement.direction = dir;
        const { direction } = movement;

        //Set velocity
        movement.velocity_x = direction === Direction.LEFT ? -movement.speed : (direction === Direction.RIGHT ? movement.speed : 0);
        movement.velocity_y = direction === Direction.UP ? -movement.speed : (direction === Direction.DOWN ? movement.speed : 0);

        //Animate
        if (dir === Direction.LEFT) {
            sprite.flip = 1;
            play_animation(animation, PcAnimations.WalkingSide);
        } else if (dir === Direction.RIGHT) {
            sprite.flip = 0;
            play_animation(animation, PcAnimations.WalkingSide);
        } else if (dir === Direction.UP) {
            sprite.flip = 0;
            play_animation(animation, PcAnimations.WalkingUp);
        } else if (dir === Direction.DOWN) {
            sprite.flip = 0;
            play_animation(animation, PcAnimations.WalkingDown);
        }
    } else {
        movement.velocity_x = 0;
        movement.velocity_y = 0;
        movement.moving = false;
        stop_animation(animation, 1);
    }
};

function update(dt, state) {
    const { movement, animation, collision, props } = this;
    if (!props.dead) {
        //Update pcs position
        if (movement.moving) {
            //Calculate new poisition
            const mx = this.x + (movement.velocity_x * dt);
            const my = this.y + (movement.velocity_y * dt);
            // Check for tilemap collision
            const box = collision.body_box;
            const tiles: any[] = get_tiles_in_rect(state.map, mx + box.x, my + box.y, box.w, box.h);
            const is_colliding: boolean = tiles.some((tile: any) => {
                return tile.flags[TileFlags.SOLID]
            });
            if (!is_colliding) {
                this.x = mx;
                this.y = my;
            }
        }

        //Check drowning colission
        const box = collision.stand_box;
        const feet_tiles: any[] = get_tiles_in_rect(state.map, this.x + box.x, this.y + box.y, box.w, box.h);
        const is_drowning: boolean = feet_tiles.some((tile: any) => tile.flags[TileFlags.FREEZING] && state.palette_index !== Palettes.Chill);
        if (is_drowning) {
            // Kill PC
            props.dead = true;
            sfx(63, 48, 98);
            play_animation(this.animation, PcAnimations.Drowning, false);
        }

    } else {
        // Reset level
        props.dead_timer += $dt;
        if (props.dead_timer > 1.5) {
            $palette_index = swap_palette(Palettes.Dungeon);
            props.dead_timer = 0;
            props.dead = false;
            state.pc = create_pc(32, 96);
        }
    }

    update_animation(animation, dt);
    this.sprite.id = this.animation.frame;
}