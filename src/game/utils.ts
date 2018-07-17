// Utils
const isPointInRect = (x, y, rx, ry, rw, rh) => {
    return x >= rx && x < rx + rw && y >= ry && y < ry + rh
}

const are_colliding: (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) => boolean = (ax, ay, aw, ah, bx, by, bw, bh) => {
    if (ax + aw < bx || ax > bx + bw) return false;
    if (ay + ah < by || ay > by + bh) return false;
    return true;
}