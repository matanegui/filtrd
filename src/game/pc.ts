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
    pc.collision = { enabled: true, body_box: { x: 3, y: 1, w: 10, h: 15 }, stand_box: { x: 0, y: 4, w: 16, h: 12 } };

    const { animation } = pc;
    add_animation_state(animation, PcAnimations.WalkingSide, [258, 256, 260, 256]);
    add_animation_state(animation, PcAnimations.WalkingDown, [264, 262, 266, 262]);
    add_animation_state(animation, PcAnimations.WalkingUp, [270, 268, 288, 268]);
    add_animation_state(animation, PcAnimations.UsingPhone, [290]);
    add_animation_state(animation, PcAnimations.Drowning, [292, 294, 296, 298, 300, 302, 0]);
    play_animation(animation, PcAnimations.WalkingSide);

    return pc;
}