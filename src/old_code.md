OLD CODE
- Spawn particles from map

``` javascript
    //Set up spawners
    const drops_spawner = (tile_id, x, y) => create_particle_emitter(x, y, create_particle_source('drops', PARTICLES[Particles.Drops], true, true));
    const boiling_spawner = (tile_id, x, y) => create_particle_emitter(x, y, create_particle_source('bubbles', PARTICLES[Particles.Boiling], true, false));
    add_tile_spawner(tileset, 36, drops_spawner);
    add_tile_spawner(tileset, 37, drops_spawner);
    add_tile_spawner(tileset, 36, boiling_spawner);
    add_tile_spawner(tileset, 37, boiling_spawner);
    state.map = create_tilemap(0, 0, state.level_index, tileset);

    state.entities = spawn_tilemap(state.map);
```

On plaette change particle switch
``` javascript
const on_palette_change: (state: any) => void = (state) => {
    //Test particles enable-disabled
    /*
    state.entities
        .forEach(({ particles }) => {
            if (particles) {
                if (particles.system.id === 'boiling') {
                    particles.enabled = state.palette_index === Palettes.Roast ? true : false;
                } else if (particles.system.id === 'drops') {
                    particles.enabled = state.palette_index === Palettes.Dungeon ? true : false;
                }
            }
        });
        */
}
```