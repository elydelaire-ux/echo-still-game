export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function checkAABB(a: Rect, b: Rect): boolean {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Physics Constants
export const GRAVITY = 1500; // Pixels per second squared (High gravity for snappy feel)
export const JUMP_FORCE = -600;
export const MOVE_SPEED = 300;
export const MAX_FALL_SPEED = 800;
