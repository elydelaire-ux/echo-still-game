import type { Rect } from "./Physics";
import { Button } from "./entities/Button";
import { Door } from "./entities/Door";
import { checkAABB } from "./Physics";
import type { Player } from "./entities/Player";
import type { Echo } from "./entities/Echo";
import { audio } from "./Audio";

export class Level {
    platforms: Rect[] = [];
    buttons: Button[] = [];
    doors: Door[] = [];

    constructor() {
        // Floor
        this.platforms.push({ x: 0, y: 400, w: 800, h: 50 });

        // Wall
        this.platforms.push({ x: 750, y: 300, w: 50, h: 100 });

        // Platforms
        this.platforms.push({ x: 200, y: 300, w: 150, h: 20 });
        this.platforms.push({ x: 450, y: 200, w: 150, h: 20 });

        // Puzzle: Button on top right opens door on bottom right
        // Button on platform
        this.buttons.push(new Button(500, 190, 1));

        // Door blocking exit
        this.doors.push(new Door(700, 300, 100, 1));
    }

    update(dt: number) {
        for (const door of this.doors) {
            door.update(dt);
        }
    }

    checkMechanics(player: Player, echo: Echo) {
        // Reset buttons but keep track of previous state
        for (const btn of this.buttons) {
            btn.wasPressed = btn.isPressed;
            btn.isPressed = false;
        }

        // Check collisions for buttons
        const activators: Rect[] = [player, echo];
        for (const activator of activators) {
            // Skip if echo is inactive/hidden
            if (activator.x < -100) continue;

            for (const btn of this.buttons) {
                if (checkAABB(activator, btn)) {
                    btn.isPressed = true;
                }
            }
        }

        // Play sound on activation
        for (const btn of this.buttons) {
            if (btn.isPressed && !btn.wasPressed) {
                audio.playSwitch();
            }
        }

        // Update doors based on buttons
        for (const door of this.doors) {
            const linkedBtn = this.buttons.find(b => b.linkId === door.linkId);
            if (linkedBtn) {
                door.isOpen = linkedBtn.isPressed;
            }
        }
    }

    getCollidables(): Rect[] {
        // Return platforms + closed doors
        return [...this.platforms, ...this.doors.filter(d => d.h > 10)];
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#444';
        for (const p of this.platforms) {
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }

        for (const btn of this.buttons) {
            btn.draw(ctx);
        }

        for (const door of this.doors) {
            door.draw(ctx);
        }
    }
}
