import { VirtualJoystick } from "./VirtualJoystick";

export class Input {
    private keys: Set<string> = new Set();
    private joystick: VirtualJoystick;

    constructor() {
        window.addEventListener('keydown', (e) => this.keys.add(e.code));
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
        this.joystick = new VirtualJoystick();
    }

    public isDown(code: string): boolean {
        return this.keys.has(code);
    }

    // Common aliases for easy access
    // Supporting both Arrows and WASD
    public get left(): boolean { return this.isDown('ArrowLeft') || this.isDown('KeyA') || this.joystick.joyX < -0.3; }
    public get right(): boolean { return this.isDown('ArrowRight') || this.isDown('KeyD') || this.joystick.joyX > 0.3; }
    public get jump(): boolean { return this.isDown('Space') || this.isDown('ArrowUp') || this.isDown('KeyW') || this.joystick.jumpPressed; }
    public get action(): boolean { return this.isDown('KeyE') || this.isDown('KeyZ') || this.isDown('Enter') || this.joystick.actionPressed; }
}
