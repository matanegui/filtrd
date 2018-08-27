interface TextboxData {
    w: number,
    h: number,
    text_color: number,
    border_color: number,
    background_color: number,
    life_time: number,
    speed: number,
    text: string
}

type Textbox = Entity & TextboxData;

const create_textbox: (x: number, y: number, text: string) => Textbox = (x, y, text) => ({
    ...create_entity(x, y),
    draw: function () {
        this.life_time = this.life_time + 0.017;
        rect(this.x, this.y, this.w, this.h, this.border_color);
        rect(this.x + 1, this.y + 1, this.w - 2, this.h - 2, this.background_color);
        line(this.x + 1, this.y + this.h, this.x + this.w - 1, this.y + this.h, this.background_color);
        line(this.x + this.w, this.y + 1, this.x + this.w, this.y + this.h, this.background_color);
        print(this.text.substring(0, Math.min(this.life_time * this.speed, this.text.length)), this.x + 4, this.y + 4, this.text_color);
    },
    w: 160,
    h: 48,
    text_color: 2,
    border_color: 2,
    background_color: 0,
    life_time: 0,
    speed: 20,
    text
});