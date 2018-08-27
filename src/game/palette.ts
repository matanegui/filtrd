// format: dark, primary, light, complement //
const PALETTES: any = [
    { id: 'dungeon', data: [[32, 29, 36], [103, 89, 122], [207, 232, 173], [230, 85, 125]] }, //Dungeon
    { id: 'chill', data: [[2, 28, 39], [18, 57, 165], [214, 234, 241], [38, 173, 214]] },  // Roast
    { id: 'roast', data: [[42, 3, 1], [145, 23, 31], [245, 203, 92], [245, 63, 28]] },      // Chill
    { id: 'rust', data: [[20, 8, 14], [186, 18, 0], [225, 216, 159], [198, 165, 46]] },      // Rust
    { id: 'moss', data: [[25, 35, 26], [51, 103, 59], [216, 203, 199], [113, 179, 64]] }      // Moss
];

const enum Palettes {
    Dungeon,
    Chill,
    Roast
}

//  *PALETTE  //
const switch_palette: (current_palette_index: number) => number = (current_palette_index) => {
    const palette_ids: string[] = PALETTES.map(p => p.id);
    const new_palette_index = current_palette_index + 1 < palette_ids.length ? current_palette_index + 1 : 0;
    return swap_palette(new_palette_index);
}

const swap_palette: (index: number) => number = (index) => {
    const palette: number[][] = PALETTES[index].data;
    if (palette) {
        for (let i = 0; i < 4; i++) {
            const colors: number[] = palette[i];
            const color_address_offset = i * 3;
            poke(0x3FC0 + color_address_offset, colors[0]);
            poke(0x3FC0 + color_address_offset + 1, colors[1]);
            poke(0x3FC0 + color_address_offset + 2, colors[2]);
        }
    }
    return index;
}