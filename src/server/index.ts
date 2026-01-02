import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev
    },
});

const PORT = process.env.PORT || 3000;

// State
interface PlayerState {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    isPressed: boolean; // Generic action state
}

const players: Record<string, PlayerState> = {};

app.use(express.static(path.join(__dirname, "../../dist/client")));

io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Init player
    players[socket.id] = {
        id: socket.id,
        x: 50,
        y: 300,
        vx: 0,
        vy: 0,
        w: 32,
        h: 32,
        isPressed: false
    };

    // Send initial state
    socket.emit("currentPlayers", players);

    // Notify others
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("playerMovement", (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].vx = movementData.vx;
            players[socket.id].vy = movementData.vy;
            players[socket.id].isPressed = movementData.isPressed;

            socket.broadcast.emit("playerMoved", players[socket.id]);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("playerDisconnected", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
