import { Entity } from "./Entity";
import { Input } from "../Input";
import { Level } from "../Level";
import { checkAABB, GRAVITY, JUMP_FORCE, MOVE_SPEED, MAX_FALL_SPEED, type Rect } from "../Physics";
import { audio } from "../Audio";

export class Player extends Entity {
    private input: Input;
    private level: Level;
    private onGround: boolean = false;

    constructor(x: number, y: number, input: Input, level: Level) {
        super(x, y, 32, 32);
        this.input = input;
        this.level = level;
        this.color = '#fff';
    }

    update(dt: number) {
        // Horizontal Movement
        if (this.input.left) {
            this.vx = -MOVE_SPEED;
        } else if (this.input.right) {
            this.vx = MOVE_SPEED;
        } else {
            this.vx = 0;
        }

        // Apply Horizontal Velocity
        this.x += this.vx * dt;
        this.handleCollisions(true);

        // Vertical Movement (Gravity)
        this.vy += GRAVITY * dt;
        if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;

        // Jump
        if (this.onGround && this.input.jump) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
            audio.playJump();
        }

        // Apply Vertical Velocity
        this.y += this.vy * dt;
        this.onGround = false; // Assume in air until collision proves otherwise
        this.handleCollisions(false);

        // Simple bounds check
        if (this.y > 600) {
            this.respawn();
        }
    }

    private respawn() {
        this.x = 50;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
    }

    private handleCollisions(horizontal: boolean) {
        const collidables = this.level.getCollidables();
        for (const wall of collidables) {
            if (checkAABB(this, wall)) {
                if (horizontal) {
                    if (this.vx > 0) {
                        this.x = wall.x - this.w;
                    } else if (this.vx < 0) {
                        this.x = wall.x + wall.w;
                    }
                    this.vx = 0;
                } else {
                    if (this.vy > 0) { // Falling
                        this.y = wall.y - this.h;
                        this.onGround = true;
                        this.vy = 0;
                    } else if (this.vy < 0) { // Jumping up
                        this.y = wall.y + wall.h;
                        this.vy = 0;
                    }
                }
            }
        }
    }
}
