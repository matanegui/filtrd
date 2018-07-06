// format: dark, primary, light, complement //
const PALETTES: any = {
    dungeon: [[32, 29, 36], [103, 89, 122], [207, 232, 173], [230, 85, 125]],
    chill: [[2, 28, 39], [18, 57, 165], [214, 234, 241], [2, 128, 144]],
    roast: [[42, 3, 1], [145, 23, 31], [245, 203, 92], [245, 63, 28]]
};

//  *PALETTE  //
const switch_palette: (current_palette: string) => string = (current_palette) => {
    const palette_ids: string[] = Object.keys(PALETTES);
    const current_palette_index = palette_ids.indexOf(current_palette);
    const new_palette_id = current_palette_index + 1 < palette_ids.length ? palette_ids[current_palette_index + 1] : palette_ids[0];
    return swap_palette(new_palette_id);
}

const swap_palette: (id: string) => string = (id) => {
    const palette: number[][] = PALETTES[id];
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