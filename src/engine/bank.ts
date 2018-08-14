interface Bank {
    id: number,
    tileset: Tileset
}

const create_bank: (id: number, tileset: Tileset) => Bank = (id, tileset) => ({
    id,
    tileset
});

const switch_bank: (id: number) => any = (id) => {
    sync(0, id);
    return BANKS[id];
}