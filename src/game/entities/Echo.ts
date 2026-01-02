import { Entity } from "./Entity";
import { Recorder } from "../Recorder";

export class Echo extends Entity {
    private recorder: Recorder;
    private delay: number = 3.0; // Seconds

    constructor(recorder: Recorder) {
        super(0, 0, 32, 32);
        this.recorder = recorder;
        this.color = 'rgba(255, 255, 255, 0.4)'; // Ghostly
    }

    update(_dt: number) {
        const snapshot = this.recorder.getSnapshotAt(this.delay);
        if (snapshot) {
            this.x = snapshot.x;
            this.y = snapshot.y;
            this.w = snapshot.w;
            this.h = snapshot.h;
        } else {
            // Hide if no history
            this.x = -9999;
            this.y = -9999;
        }
    }

    setDelay(seconds: number) {
        this.delay = seconds;
    }
}
