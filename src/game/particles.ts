enum Particles {
    Boiling,
    Drops
}

const boiling_life = 0.8;
const boiling_system: ParticleSystem = create_particle_system('boiling', boiling_life,
    (e: ParticleEmitter, dt: number) => {
        const area_x = 180;
        const area_y = 16;
        e.particles.push(create_particle(e.x + (Math.random() - 0.5) * area_x, e.y + (Math.random() - 0.5) * area_y));
        return e.particles;
    },
    (p: Particle, dt: number) => { },
    (p: Particle, dt: number) => {
        let pxs: any[] = [];
        pxs = p.life_timer < boiling_life * 0.25
            ? [[0, 0], [1, 0]]
            : p.life_timer < boiling_life * 0.5
                ? [[0, 0], [1, 1], [2, 1], [3, 0]]
                : p.life_timer < boiling_life * 0.75
                    ? [[0, 2], [1, 3], [2, 3], [3, 2], [0, 1], [3, 1], [1, 0], [2, 0]]
                    : [[0, 3], [3, 3], [0, 0], [3, 0]];
        pxs.forEach((px: any) => {
            pix(p.x + px[0], p.y - px[1], 2)
        });

    });

const drops_system: ParticleSystem = create_particle_system('drops', 0.5,
    (e: ParticleEmitter, dt: number) => {
        const area_x = 180;
        const area_y = 16;
        if (Math.random() < 0.5) {
            e.particles.push(create_particle(e.x + (Math.random() - 0.5) * area_x, e.y + (Math.random() - 0.5) * area_y));
        }
        return e.particles;
    },
    (p: Particle, dt: number) => {
        const speed = -5;
        p.x = p.x + (Math.random()) * speed * dt;
    },
    (p: Particle, dt: number) => {
        pix(p.x, p.y, 2);
    });

let PARTICLES: ParticleSystem[] = [];
PARTICLES[Particles.Boiling] = boiling_system;
PARTICLES[Particles.Drops] = drops_system;