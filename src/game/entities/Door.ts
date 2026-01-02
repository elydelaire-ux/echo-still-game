import { Entity } from "./Entity";

export class Door extends Entity {
    public isOpen: boolean = false;
    public linkId: number;
    private initialH: number;

    constructor(x: number, y: number, h: number, linkId: number) {
        super(x, y, 20, h);
        this.initialH = h;
        this.linkId = linkId;
        this.color = '#fff';
    }

    update(dt: number) {
        if (this.isOpen) {
            if (this.h > 0) this.h -= 200 * dt;
            if (this.h < 0) this.h = 0;
        } else {
            if (this.h < this.initialH) this.h += 200 * dt;
            if (this.h > this.initialH) this.h = this.initialH;
        }
    }
}
