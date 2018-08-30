const DEFAULT_COLORKEY: number = 14;

interface Sprite {
    id: number;
    w: number;
    h: number;
    scale: number;
    flip: number;
    rotate: number;
    colorkey: number;
    visible: boolean;
}

interface SpriteArgs {
    w?: number;
    h?: number;
    scale?: number;
    flip?: number;
    rotate?: number;
    colorkey?: number
}

const create_sprite: (id: number, args?: SpriteArgs) => Sprite = (id, { w = 1, h = 1, scale = 1, flip = 0, rotate = 0, colorkey = DEFAULT_COLORKEY }) => {
    return { id, w, h, scale, flip, rotate, colorkey, visible: true };
}

const draw_sprite: (x: number, y: number, sprite: Sprite) => void = (x, y, sprite) => {
    let { id, w, h, scale, flip, rotate, colorkey } = sprite;
    spr(id, x, y, colorkey, scale, flip, rotate, w, h);
}