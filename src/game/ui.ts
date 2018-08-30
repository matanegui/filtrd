interface TextBoxData {
    w: number,
    h: number,
    text_color: number,
    border_color: number,
    background_color: number,
    life_time: number,
    speed: number,
    text: string,
    partial_text: string,
    small_font: boolean
}

type Textbox = Entity & InputListener & TextBoxData;


const create_textbox: (x: number, y: number, w: number, text: string, small_font?: boolean) => Textbox = (x, y, w, text, small_font = true) => {

    function on_input(input: InputState, state: any) {
        if (is_pressed(input, Button.A)) {
            if (this.partial_text.length < this.text.length) {
                this.partial_text = this.text;
            } else {
                state.ui = [];
                $input_manager.free_listener();
            }
        }
    }

    const get_wrap_options: (text: string, w: number) => { h: number, wrapped_text: string } = (text, w) => {
        let words = text.split(' ');
        const char_width = small_font ? 4 : 6;
        const char_height = 7;
        const horizontal_margin: number = 6;
        const vertical_margin: number = 6;
        let line_count = 1;
        let line_width: number = 0;
        words = words.map((word: string) => {
            if (line_width + word.length * char_width > w - horizontal_margin) {
                line_width = word.length * char_width + char_width;
                line_count += 1;
                return '\n' + word;
            } else {
                line_width += word.length * char_width + char_width;
                return word;
            }
        })
        return { h: line_count * char_height + vertical_margin, wrapped_text: words.join(' ') };
    }
    const wrap: { h: number, wrapped_text: string } = get_wrap_options(text, w);

    return {
        ...create_entity(x, y),
        w,
        h: wrap.h,
        text_color: 2,
        border_color: 2,
        background_color: 0,
        life_time: 0,
        speed: 25,
        text: wrap.wrapped_text,
        partial_text: '',
        small_font: small_font,
        on_input,
        update: function update(dt, state) {
            this.life_time = this.life_time + dt;
            if (this.partial_text.length < this.text.length) {
                this.partial_text = this.text.substring(0, Math.min(this.life_time * this.speed, this.text.length));
            }
        },
        draw: function () {
            rect(this.x, this.y, this.w, this.h, this.border_color);
            rect(this.x + 1, this.y + 1, this.w - 2, this.h - 2, this.background_color);
            line(this.x + 1, this.y + this.h, this.x + this.w - 1, this.y + this.h, this.background_color);
            line(this.x + this.w, this.y + 1, this.x + this.w, this.y + this.h, this.background_color);
            print(this.partial_text, this.x + 4, this.y + 4, this.text_color, true, 1, small_font);
        }
    }
};