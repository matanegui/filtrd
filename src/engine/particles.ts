interface Particle {
    id: string;
    x: number;
    y: number;
    life_timer: number;
}

interface ParticleSystem {
    id: string;
    life: number;
    spawn: (system: any, dt: number) => Particle[];
    update: (particle: Particle, dt: number) => void;
    draw: (particle: Particle, dt: number) => void;
}

interface ParticleEmitter {
    x: number;
    y: number;
    id: string;
    particles: Particle[];
    system: ParticleSystem;
    enabled: boolean;
}
const create_particle: (x: number, y: number) => Particle = (x, y) => ({
    x,
    y,
    id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
    life_timer: 0
});

const create_particle_system: (id: string, life: number, spawn: (emitter: ParticleEmitter, dt: number) => Particle[], update: (particle: Particle, dt: number) => void, draw: (particle: Particle, dt: number) => void) => ParticleSystem = (id, life, spawn, update, draw) => ({
    id,
    life,
    spawn,
    update,
    draw
});

const create_particle_emitter: (x: number, y: number, system: ParticleSystem, enabled?: boolean) => ParticleEmitter = (x, y, system, enabled = true) => ({
    x,
    y,
    id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
    particles: [],
    system,
    enabled
});

const draw_particle_emitter: (emitter: ParticleEmitter, dt: number) => void = (emitter, dt) => {
    if (emitter.enabled) {
        emitter.particles = emitter.system.spawn(emitter, dt);
    }
    emitter.particles.forEach((particle: any) => {
        if (particle.life_timer < emitter.system.life) {
            particle.life_timer += dt;
            emitter.system.update(particle, dt);
            emitter.system.draw(particle, dt);
        } else {
            emitter.particles = emitter.particles.filter((p: any) => p.id !== particle.id);
        }
    })
}