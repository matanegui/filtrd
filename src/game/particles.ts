const bubble_system: ParticleSystem = create_particle_system('bubbles', 0.8,
    (emitter: ParticleEmitter, dt: number) => {
        const spawn_rand = Math.random();
        const area_x = 160;
        const area_y = 16;
        if (spawn_rand < 0.9) {
            emitter.particles.push(create_particle(emitter.x + (Math.random() - 0.5) * area_x, emitter.y + (Math.random() - 0.5) * area_y));
        }
        return emitter.particles;
    },
    (particle: Particle, dt: number) => {
        const speed = 10;
        const x_rand = Math.random();
        //particle.x = x_rand < 0.05 ? particle.x + dt * speed : (x_rand < 0.14 ? particle.x - dt * speed : particle.x);
        particle.y = Math.random() < 0.5 ? particle.y - dt * speed : particle.y;
    },
    (particle: Particle, dt: number) => {
        circb(particle.x, particle.y, 2, 2);
        pix(particle.x + 1, particle.y - 1, 2);
    });

const PARTICLES: { [name: string]: ParticleSystem } = {
    'bubbles': bubble_system
}