const enum Palettes {
    Dungeon,
    Chill,
    Roast
}

// format: dark, primary, light, complement //
const PALETTES: any = [
    { id: 'dungeon', data: [[32, 29, 36], [103, 89, 122], [207, 232, 173], [230, 85, 125]] }, //Dungeon
    { id: 'chill', data: [[2, 28, 39], [18, 57, 165], [214, 234, 241], [38, 173, 214]] },  // Roast
    { id: 'roast', data: [[42, 3, 1], [145, 23, 31], [245, 203, 92], [245, 63, 28]] }      // Chill
];

//  *PALETTE  //
const switch_palette: (current_palette_index: number) => number = (current_palette_index) => {
    const palette_ids: string[] = Object.keys(PALETTES);
    const new_palette_id = current_palette_index + 1 < palette_ids.length ? current_palette_index + 1 : 0;
    return swap_palette(new_palette_id);
}

const swap_palette: (id: number) => number = (id) => {
    const palette: number[][] = PALETTES[id].data;
    if (palette) {
        for (let i = 0; i < 4; i++) {
            const colors: number[] = palette[i];
            const color_address_offset = i * 3;
            poke(0x3FC0 + color_address_offset, colors[0]);
            poke(0x3FC0 + color_address_offset + 1, colors[1]);
            poke(0x3FC0 + color_address_offset + 2, colors[2]);
        }
    }
    return id;
}