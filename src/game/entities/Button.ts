import { Entity } from "./Entity";

export class Button extends Entity {
    public isPressed: boolean = false;
    public wasPressed: boolean = false;
    public linkId: number;

    constructor(x: number, y: number, linkId: number) {
        super(x, y + 10, 40, 10); // Flat on the ground (assuming passed y is platform y)
        this.linkId = linkId;
        this.color = '#888';
    }

    update(dt: number) {
        // Logic handled by Level
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Accent color #0FF (Cyan)
        ctx.fillStyle = this.isPressed ? '#0FF' : '#555';
        ctx.fillRect(Math.round(this.x), Math.round(this.y + (this.isPressed ? 5 : 0)), this.w, this.isPressed ? 5 : 10);

        // Glow effect if pressed
        if (this.isPressed) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0FF';
            ctx.fillRect(Math.round(this.x), Math.round(this.y + 5), this.w, 5);
            ctx.shadowBlur = 0;
        }
    }
}
