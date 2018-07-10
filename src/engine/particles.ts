const create_particles: (x: number, y: number, type: string, on_death: () => void) => any = (x, y, type, on_death) => {
    return {
        x,
        y,
        type,
        on_death,
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
        step_timer: 0,
        step: 0.1,
        life_timer: 0,
        life: 2
    }
}

const draw_particles: (system: any, dt: number) => void = (system, dt) => {
    if (system.life_timer < system.life) {
        //Update
        system.step_timer += dt;
        if (system.step_timer > system.step) {
            system.step_timer = 0;
            const rand = Math.random();
            system.x = rand < 0.15 ? system.x + 1 : (rand < 0.7 ? system.x : system.x - 1);
            system.y = rand < 0.7 ? system.y - 1 : system.y;
        }
        //Draw
        circb(system.x, system.y, 2, 2);
        pix(system.x + 1, system.y - 1, 2);
        system.life_timer += dt;
    } else {
        system.on_death();
    }
}