import { io, Socket } from "socket.io-client";
import type { PlayerState } from "./NetworkTypes";

export class Network {
    public socket: Socket;
    public otherPlayers: Map<string, PlayerState> = new Map();
    public playerId: string = "";

    constructor() {
        // Auto-connect to window host (works for localhost and render)
        // For dev with separate ports (vite 5173, server 3000), we might need direct URL if not proxied.
        // But for production it works.
        // For dev: if location is 5173, assume server is 3000.
        const url = window.location.port === "5173" ? "http://localhost:3000" : window.location.origin;

        this.socket = io(url);

        this.socket.on("connect", () => {
            console.log("Connected to server:", this.socket.id);
            this.playerId = this.socket.id || "";
        });

        this.socket.on("currentPlayers", (players: Record<string, PlayerState>) => {
            this.otherPlayers.clear();
            Object.values(players).forEach(p => {
                if (p.id !== this.playerId) {
                    this.otherPlayers.set(p.id, p);
                }
            });
        });

        this.socket.on("newPlayer", (player: PlayerState) => {
            console.log("New player joined:", player.id);
            this.otherPlayers.set(player.id, player);
        });

        this.socket.on("playerMoved", (player: PlayerState) => {
            if (this.otherPlayers.has(player.id)) {
                // Update state (Interpolation could be added here)
                const p = this.otherPlayers.get(player.id)!;
                p.x = player.x;
                p.y = player.y;
                p.vx = player.vx;
                p.vy = player.vy;
                p.isPressed = player.isPressed;
            }
        });

        this.socket.on("playerDisconnected", (id: string) => {
            console.log("Player left:", id);
            this.otherPlayers.delete(id);
        });
    }

    public sendUpdate(state: Partial<PlayerState>) {
        if (this.socket.connected) {
            this.socket.emit("playerMovement", state);
        }
    }
}
