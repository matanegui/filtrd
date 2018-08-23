interface Textbox {
    x: number,
    y: number,
    w: number,
    h: number,
    text_color: number,
    border_color: number,
    background_color: number,
    life: number,
    speed: number,
    text: string
};

const create_textbox: (x: number, y: number, text: string) => Textbox = (x, y, text) => ({
    x, y, w: 160, h: 48, text_color: 2, border_color: 2, speed: 20, background_color: 0, life: 0, text
});

const draw_textbox: (box: Textbox) => void = (box) => {
    box.life = box.life + dt;
    rect(box.x, box.y, box.w, box.h, box.border_color);
    rect(box.x + 1, box.y + 1, box.w - 2, box.h - 2, box.background_color);
    line(box.x + 1, box.y + box.h, box.x + box.w - 1, box.y + box.h, box.background_color);
    line(box.x + box.w, box.y + 1, box.x + box.w, box.y + box.h, box.background_color);
    print(box.text.substring(0, Math.min(box.life * box.speed, box.text.length)), box.x + 4, box.y + 4, box.text_color);
    print(`${PALETTES[state.palette_index].id.charAt(0).toUpperCase() + PALETTES[state.palette_index].id.substr(1)}`, 2, 130, 2);
};