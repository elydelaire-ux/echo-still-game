import { Input } from "./Input";
import { Level } from "./Level";
import { Player } from "./entities/Player";
import { Recorder } from "./Recorder";
import { Echo } from "./entities/Echo";
import { Network } from "./Network";

export class Engine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isRunning: boolean = false;
    private lastTime: number = 0;

    private input: Input;
    private level: Level;
    private player: Player;
    private recorder: Recorder;
    private echo: Echo;
    private network: Network;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        this.input = new Input();
        this.level = new Level();
        this.player = new Player(50, 300, this.input, this.level);
        this.recorder = new Recorder();
        this.echo = new Echo(this.recorder);
        this.network = new Network();
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
        console.log("Engine started");
    }

    public stop() {
        this.isRunning = false;
    }

    private loop(timestamp: number) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Cap deltaTime to prevent huge jumps if tab is inactive
        const clampedDelta = Math.min(deltaTime, 0.1);

        this.update(clampedDelta);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    private update(dt: number) {
        this.player.update(dt);

        this.recorder.record(this.player.x, this.player.y, this.player.w, this.player.h);

        this.echo.update(dt);
        this.level.update(dt);
        this.level.checkMechanics(this.player, this.echo);

        // Network Sync
        this.network.sendUpdate({
            x: this.player.x,
            y: this.player.y,
            vx: this.player.vx,
            vy: this.player.vy,
            w: this.player.w,
            h: this.player.h,
            id: this.network.playerId,
            isPressed: false
        });
    }

    private render() {
        // Clear screen
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.level.draw(this.ctx);

        // Draw Remote Players
        this.ctx.fillStyle = '#0f0'; // Green for remote players
        this.network.otherPlayers.forEach(p => {
            this.ctx.fillRect(Math.round(p.x), Math.round(p.y), p.w, p.h);
        });

        // Draw Echo behind player or semi-transparent on top?
        this.echo.draw(this.ctx);
        this.player.draw(this.ctx);

        // UI / Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Inter, sans-serif';
        this.ctx.fillText("ECHO / STILL - Prototype", 10, 20);
        this.ctx.fillText("Arrows/WASD to Move", 10, 40);
        this.ctx.fillText(this.network.socket.connected ? "Online" : "Connecting...", 10, 60);
    }
}
