const enum PcAnimations {
    WalkingSide = 'w_x',
    WalkingDown = 'w_d',
    WalkingUp = 'w_u',
    UsingPhone = 'u_ph',
    Drowning = 'drw'
};

const create_pc: (x: number, y: number) => Entity = (x, y) => {
    const pc: Entity = entity(x, y);

    pc.sprite = create_sprite(265, { w: 2, h: 2 });
    pc.animation = create_animation('pc', 90);
    pc.movement = { direction: null, speed: 60, moving: false };
    pc.collision = { enabled: true, body_box: { x: 3, y: 1, w: 10, h: 15 }, stand_box: { x: 0, y: 6, w: 16, h: 10 } };

    const { animation } = pc;
    add_animation_state(animation, PcAnimations.WalkingSide, [258, 256, 260, 256]);
    add_animation_state(animation, PcAnimations.WalkingDown, [264, 262, 266, 262]);
    add_animation_state(animation, PcAnimations.WalkingUp, [270, 268, 288, 268]);
    add_animation_state(animation, PcAnimations.UsingPhone, [290]);
    add_animation_state(animation, PcAnimations.Drowning, [292, 294, 296, 298, 300, 302, 0]);
    play_animation(animation, PcAnimations.WalkingSide);

    return pc;
}

const move_pc: (pc: Entity, dir: Direction) => void = (pc, dir) => {
    const { sprite, movement, animation } = pc;
    //Set facing direction
    if (dir !== null) {
        movement.moving = true;
        movement.direction = dir;
        movement.direction = is_down(input, Button.LEFT) ? Direction.LEFT : (is_down(input, Button.RIGHT) ? Direction.RIGHT : (is_down(input, Button.UP) ? Direction.UP : (is_down(input, Button.DOWN) ? Direction.DOWN : null)));
        const { direction } = movement;

        //Set velocity
        movement.velocity_x = is_down(input, Button.LEFT) ? -movement.speed : (is_down(input, Button.RIGHT) ? movement.speed : 0);
        movement.velocity_y = is_down(input, Button.UP) ? -movement.speed : (is_down(input, Button.DOWN) ? movement.speed : 0);

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

const update_pc: (pc: Entity, state: any, dt: number) => void = (pc, state, dt) => {
    const { movement, animation, collision, flags } = pc;
    if (!flags.dead) {
        //Update pcs position
        if (movement.moving) {
            //Calculate new poisition
            const mx = pc.x + (movement.velocity_x * dt);
            const my = pc.y + (movement.velocity_y * dt);
            // Check for tilemap collision
            const box = collision.body_box;
            const tiles: any[] = get_tiles_in_rect(state.map, mx + box.x, my + box.y, box.w, box.h);
            const is_colliding: boolean = tiles.some((tile: any) => {
                return tile.flags[TileFlags.SOLID]
            });
            if (!is_colliding) {
                pc.x = mx;
                pc.y = my;
            }
        }

        //Check drowning colission
        const box = collision.stand_box;
        const feet_tiles: any[] = get_tiles_in_rect(state.map, pc.x + box.x, pc.y + box.y, box.w, box.h);
        const is_drowning: boolean = feet_tiles.some((tile: any) => tile.flags[TileFlags.FREEZING_WALKABLE] && state.palette_index !== Palettes.Chill);
        if (is_drowning) {
            // Kill PC
            pc.flags.dead = true;
            sfx(63, 48, 98);
            play_animation(pc.animation, PcAnimations.Drowning, false);
        }
    }
    update_animation(animation, dt);
};