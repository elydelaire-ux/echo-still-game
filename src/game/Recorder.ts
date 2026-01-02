export interface Snapshot {
    x: number;
    y: number;
    w: number;
    h: number;
    // Add more state here later (animation frame, action flags)
}

export class Recorder {
    private buffer: Snapshot[] = [];
    private maxCapacity: number = 600; // 10 seconds at 60fps

    public record(x: number, y: number, w: number, h: number) {
        this.buffer.push({ x, y, w, h });
        if (this.buffer.length > this.maxCapacity) {
            this.buffer.shift();
        }
    }

    public getSnapshotAt(delaySeconds: number): Snapshot | null {
        // Assuming 60 updates per second roughly
        const framesBack = Math.round(delaySeconds * 60);
        const index = this.buffer.length - 1 - framesBack;

        if (index >= 0 && index < this.buffer.length) {
            return this.buffer[index];
        }
        return null; // Not enough history yet or delay too long
    }

    public get currentFrameCount(): number {
        return this.buffer.length;
    }
}
