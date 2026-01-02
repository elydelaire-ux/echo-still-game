import type { Rect } from "../Physics";

export abstract class Entity implements Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number = 0;
    vy: number = 0;

    color: string = '#fff';
    opacity: number = 1;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Abstract method to force implementation
    abstract update(dt: number): void;

    draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // Draw slightly rounded rect? For now plain rect
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
        ctx.globalAlpha = 1.0;
    }
}
