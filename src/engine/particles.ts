interface Particle {
    id: string;
    x: number;
    y: number;
    life_timer: number;
}

interface ParticleSystem {
    id: string;
    life: number;
    spawn: (emitter: Entity, dt: number) => Particle[];
    update: (particle: Particle, dt: number) => void;
    draw: (particle: Particle, dt: number) => void;
}

interface ParticleSource {
    id: string;
    particles: Particle[];
    system: ParticleSystem;
    emission_enabled: boolean;
    enabled: boolean;
}

const create_particle: (x: number, y: number) => Particle = (x, y) => ({
    x,
    y,
    id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
    life_timer: 0
});

const create_particle_system: (
    id: string,
    life: number,
    spawn: (emitter: Entity, dt: number) => Particle[],
    update: (emitter: Particle, dt: number) => void,
    draw: (particle: Particle, dt: number) => void
) => ParticleSystem = (id, life, spawn, update, draw) => ({
    id,
    life,
    spawn,
    update,
    draw
});

const create_particle_source: (
    id: string,
    system: ParticleSystem,
    emission_enabled?: boolean,
    enabled?: boolean
) => ParticleSource = (id, system, emission_enabled, enabled) => ({
    id,
    system,
    emission_enabled,
    enabled,
    particles: []
});

const create_particle_emitter: (
    x: number,
    y: number,
    source: ParticleSource,
    emission_enabled?: boolean,
    enabled?: boolean
) => Entity = (x, y, source, emission_enabled = true, enabled = true) => {
    const emitter: Entity = create_entity(x, y);
    emitter.particles = source;
    return emitter;
};

const draw_particle_emitter: (emitter: Entity, dt: number) => void = (emitter, dt) => {
    const { particles } = emitter;
    if (particles.enabled) {
        if (particles.emission_enabled) {
            particles.particles = particles.system.spawn(emitter, dt);
        }
        particles.particles.forEach((particle: any) => {
            if (particle.life_timer < particles.system.life) {
                particle.life_timer += dt;
                particles.system.update(particle, dt);
                particles.system.draw(particle, dt);
            } else {
                particles.particles = particles.particles.filter((p: any) => p.id !== particle.id);
            }
        })
    }
}