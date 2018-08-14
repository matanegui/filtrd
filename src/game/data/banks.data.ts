enum TileFlags {
    SOLID = 'solid',
    FREEZING_WALKABLE = 'freezing_walkable'
};

const BANKS = [];

/////   0   /////
const tileset: Tileset = create_tileset();

for (let i = 2; i <= 15; i++) {
    add_tile_flags(tileset, i, [TileFlags.SOLID]);
    add_tile_flags(tileset, 16 + i, [TileFlags.SOLID]);
}

for (let i = 40; i <= 43; i++) {
    add_tile_flags(tileset, i, [TileFlags.SOLID]);
    add_tile_flags(tileset, 16 + i, [TileFlags.SOLID]);
}
add_tile_flags(tileset, 36, [TileFlags.FREEZING_WALKABLE]);
//Set up spawners

const drops_spawner = (tile_id, x, y) => create_particle_emitter(x, y, create_particle_source('drops', PARTICLES[Particles.Drops], true, true));
const boiling_spawner = (tile_id, x, y) => create_particle_emitter(x, y, create_particle_source('bubbles', PARTICLES[Particles.Boiling], true, false));
add_tile_spawner(tileset, 36, drops_spawner);
add_tile_spawner(tileset, 37, drops_spawner);
add_tile_spawner(tileset, 36, boiling_spawner);
add_tile_spawner(tileset, 37, boiling_spawner);

BANKS[0] = create_bank(0, tileset);
