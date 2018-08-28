interface TextBoxData {
    w: number,
    h: number,
    text_color: number,
    border_color: number,
    background_color: number,
    life_time: number,
    speed: number,
    text: string,
    small_font: boolean
}

type Textbox = Entity & { box: TextBoxData };


const create_textbox: (x: number, y: number, w: number, text: string, small_font?: boolean) => Textbox = (x, y, w, text, small_font = true) => {

    const get_wrap_options: (text: string, w: number) => { h: number, wrapped_text: string } = (text, w) => {
        let words = text.split(' ');
        const char_width = small_font ? 4 : 6;
        const char_height = 7;
        const margin: number = 6;
        let line_count = 1;
        let line_width: number = 0;
        words = words.map((word: string) => {
            if (line_width + word.length * char_width > w - margin) {
                line_width = word.length * char_width + char_width;
                line_count += 1;
                return '\n' + word;
            } else {
                line_width += word.length * char_width + char_width;
                return word;
            }
        })
        return { h: line_count * char_height + margin, wrapped_text: words.join(' ') };
    }
    const wrap: { h: number, wrapped_text: string } = get_wrap_options(text, w);

    return {
        ...create_entity(x, y),
        box: {
            w,
            h: wrap.h,
            text_color: 2,
            border_color: 2,
            background_color: 0,
            life_time: 0,
            speed: 25,
            text: wrap.wrapped_text,
            small_font: small_font
        },
        draw: function () {
            const { box } = this;
            box.life_time = box.life_time + 0.017;
            rect(this.x, this.y, box.w, box.h, box.border_color);
            rect(this.x + 1, this.y + 1, box.w - 2, box.h - 2, box.background_color);
            line(this.x + 1, this.y + box.h, this.x + box.w - 1, this.y + box.h, box.background_color);
            line(this.x + box.w, this.y + 1, this.x + box.w, this.y + box.h, box.background_color);
            print(box.text.substring(0, Math.min(box.life_time * box.speed, box.text.length)), this.x + 4, this.y + 4, box.text_color, true, 1, small_font);
        }
    }
};